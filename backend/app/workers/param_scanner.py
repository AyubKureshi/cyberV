import requests

from app.workers.common import build_request_target

XSS_PAYLOAD = "<script>alert(1)</script>"
SQLI_PAYLOAD = "' OR 1=1--"


def scan_params(url, params):
    vulnerabilities = []

    for param in params:
        try:
            target_url, query = build_request_target(url, {param: XSS_PAYLOAD})
            res = requests.get(target_url, params=query, timeout=5)

            if XSS_PAYLOAD in res.text:
                vulnerabilities.append({
                    "type": "XSS (Param)",
                    "severity": "High",
                    "param": param,
                    "payload": XSS_PAYLOAD,
                    "message": f"XSS in parameter: {param}",
                    "response": res.text
                })

            target_url, query = build_request_target(url, {param: SQLI_PAYLOAD})
            res = requests.get(target_url, params=query, timeout=5)

            if "sql" in res.text.lower() or "syntax" in res.text.lower():
                vulnerabilities.append({
                    "type": "SQL Injection (Param)",
                    "severity": "High",
                    "param": param,
                    "payload": SQLI_PAYLOAD,
                    "message": f"SQLi in parameter: {param}",
                    "response": res.text
                })

        except Exception as e:
            print("Param scan error:", e)

    return vulnerabilities
