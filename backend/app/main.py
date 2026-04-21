from urllib.parse import urlparse
from bson import ObjectId
from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests


# Controllers
from app.controllers.scan_controller import (
    add_endpoints,
    add_vulnerability,
    create_target,
    update_endpoint_status,
    update_progress,
    update_status,
    CANCEL_FLAGS,
    stop_target,
)

# DB
from app.db.mongo import targets_collection

# Routes
from app.routes import analyze, info, report

# Services
from app.services.crawler import discover_endpoints
from app.services.form_parser import extract_forms
from app.services.param_discovery import discover_parameters
from app.services.ai_explainer import explain_vulnerability
from app.services.report_generator import generate_report

# Tools
from app.tools.nmap_scanner import run_nmap
from app.tools.sqlmap_runner import run_sqlmap

# Workers
from app.workers.form_scanner import scan_form
from app.workers.header_scanner import scan_headers
from app.workers.open_redirect import scan_open_redirect
from app.workers.param_scanner import scan_params
from app.workers.sqli_scanner import scan_sqli
from app.workers.validator import validate_vulnerability
from app.workers.xss_scanner import scan_xss
from app.workers.fuzzer import fuzz_parameters

# Utils
from app.utils.helpers import normalize_url


# 🚀 INIT APP
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 📦 REQUEST MODEL
class ScanRequest(BaseModel):
    url: str


# 📡 ROUTES
app.include_router(analyze.router, prefix="/analyze")
app.include_router(info.router, prefix="/info")
app.include_router(report.router, prefix="/api/report", tags=["Report"])


# 🚀 MAIN SCAN PIPELINE
def run_scan_pipeline(target_id, url):
    update_status(target_id, "scanning")

    try:
        # 🔹 1. Discover endpoints
        endpoints = set(discover_endpoints(url))
        endpoints.add(url)
        endpoints = sorted(endpoints)

        add_endpoints(target_id, endpoints)

        total = max(len(endpoints), 1)

        # 🔹 2. Nmap scan (domain level)
        try:
            domain = urlparse(url).netloc
            nmap_results = run_nmap(domain)

            for vuln in nmap_results:
                severity = vuln.get("severity", "Low")
                
                # 🔥 FIX: Only ask AI if it's a serious vulnerability
                if vuln.get("type") and severity in ["Medium", "High", "Critical"]:
                    explanation = explain_vulnerability(vuln)
                    vuln["ai_explanation"] = explanation
                else:
                    vuln["ai_explanation"] = "Explanation skipped for Low severity to speed up scan."
                    
                add_vulnerability(target_id, url, vuln)

        except Exception as e:
            print("Nmap error:", e)

        # 🔹 3. Scan each endpoint
        for i, ep in enumerate(endpoints):
            if CANCEL_FLAGS.get(target_id) == True:
                print(f"[-] Scan stopped by user for: {target_id}")
                update_status(target_id, "stopped")
                return # Exit the pipeline immediately
            
            print(f"[+] Scanning: {ep}")
            update_endpoint_status(target_id, ep, "scanning")

            all_vulns = []

            # 🔥 3.1 Parameter Discovery + Scan
            params = discover_parameters(ep)
            all_vulns.extend(scan_params(ep, params))

            # 🔥 3.2 Fuzzing (hidden params)
            all_vulns.extend(fuzz_parameters(ep))

            # 🔥 3.3 Core Scanners
            all_vulns.extend(scan_sqli(ep))
            all_vulns.extend(scan_xss(ep))
            all_vulns.extend(scan_headers(ep))
            all_vulns.extend(scan_open_redirect(ep))

            # 🔥 3.4 Form scanning
            try:
                forms = extract_forms(ep)
                for form in forms:
                    all_vulns.extend(scan_form(form))
            except Exception as e:
                print("Form error:", e)

            # 🔥 3.5 sqlmap (real tool)
            try:
                all_vulns.extend(run_sqlmap(ep))
            except Exception as e:
                print("SQLMap error:", e)

            # 🔹 4. Deduplicate + Validate
            seen = set()

            for vuln in all_vulns:
                fingerprint = (
                    vuln.get("type"),
                    vuln.get("param"),
                    vuln.get("payload"),
                    vuln.get("message"),
                )

                if fingerprint in seen:
                    continue
                    
                seen.add(fingerprint)

                is_valid = validate_vulnerability(vuln, vuln.get("response", ""))

                if is_valid or vuln.get("type"):
                    severity = vuln.get("severity", "Low")
                    
                    # 🔥 FIX: Only ask AI for Medium, High, or Critical
                    if severity in ["Medium", "High", "Critical"]:
                        explanation = explain_vulnerability(vuln)
                        vuln["ai_explanation"] = explanation
                        print("AI Explanation generated for:", vuln.get("type"))
                    else:
                        vuln["ai_explanation"] = "Explanation skipped for Low severity to speed up scan."

                    if is_valid:
                        add_vulnerability(target_id, ep, vuln)

            # 🔹 5. Update progress
            update_endpoint_status(target_id, ep, "completed")
            progress = int(((i + 1) / total) * 100)
            update_progress(target_id, progress)

        # 🔥 Generate AI Report
        target_data = targets_collection.find_one({"_id": ObjectId(target_id)})

        report = generate_report(target_data)

        # 🔥 Save report
        targets_collection.update_one(
            {"_id": ObjectId(target_id)},
            {"$set": {"report": report}}
        )

        # 🔹 DONE
        update_status(target_id, "completed")

    except Exception as e:
        print("Pipeline error:", e)
        update_status(target_id, "failed")


# 🚀 START SCAN
@app.post("/scan")
def start_scan(data: ScanRequest, background_tasks: BackgroundTasks):
    url = normalize_url(data.url.strip())

    target_id = create_target(url)

    background_tasks.add_task(run_scan_pipeline, target_id, url)

    return {
        "message": "Scan started",
        "target_id": target_id
    }

@app.get("/scans")
def get_all_scans():
    scans = list(targets_collection.find().sort("_id", -1))

    for scan in scans:
        scan["_id"] = str(scan["_id"])

    return scans


# 📊 GET STATUS
@app.get("/scan/{target_id}")
def get_scan_status(target_id: str):
    target = targets_collection.find_one({"_id": ObjectId(target_id)})

    if not target:
        return {"error": "Not found"}

    return {
        "status": target["status"],
        "progress": target.get("progress", 0),
        "endpoints": target.get("endpoints", []),
        "report": target.get("report", "") 
    }

@app.post("/scan/{target_id}/stop")
def stop_scan_endpoint(target_id: str):
    stop_target(target_id)
    return {"message": "Scan stopping..."}

@app.get("/stats")
def get_stats():
    scans = list(targets_collection.find())

    total_scans = len(scans)
    high = medium = low = 0

    for scan in scans:
        for ep in scan.get("endpoints", []):
            for v in ep.get("vulnerabilities", []):
                if v.get("severity") in ["High", "Critical"]:
                    high += 1
                elif v.get("severity") == "Medium":
                    medium += 1
                elif v.get("severity") == "Low":
                    low += 1

    return {
        "total_scans": total_scans,
        "high": high,
        "medium": medium,
        "low": low
    }


@app.post("/info")
def info_gathering(data: ScanRequest):
    url = data.url

    try:
        parsed = urlparse(url)
        domain = parsed.netloc

        res = requests.get(url, timeout=5)

        return {
            "domain": domain,
            "status_code": res.status_code,
            "headers": dict(res.headers),
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/test-ai")
def test_ai():
    return {
        "result": explain_vulnerability({
            "type": "SQL Injection",
            "severity": "High"
        })
    }

# 🏠 ROOT
@app.get("/")
def root():
    return {"message": "CyberVision API Running 🚀"}
