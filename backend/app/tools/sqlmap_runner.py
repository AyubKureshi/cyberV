import subprocess
import json
import os

SQLMAP_PATH = "sqlmap/sqlmap.py"  # adjust if needed


def run_sqlmap(url):
    vulnerabilities = []

    try:
        cmd = [
            "python",
            SQLMAP_PATH,
            "-u", url,
            "--batch",
            "--level=2",
            "--risk=1",
            "--output-dir=sqlmap_output"
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        output = result.stdout.lower()

        # 🔥 Detection
        if "is vulnerable" in output or "parameter" in output:
            vulnerabilities.append({
                "type": "SQL Injection (sqlmap)",
                "severity": "Critical",
                "message": "sqlmap detected SQL Injection",
                "tool": "sqlmap"
            })

    except Exception as e:
        print("sqlmap error:", e)

    return vulnerabilities