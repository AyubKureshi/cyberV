import requests

from app.workers.common import build_request_target, resolve_candidate_params

SQLI_PAYLOADS = ["' OR '1'='1", "'--", "' OR 1=1--"]

SQL_ERRORS = [
    "sql syntax",
    "mysql",
    "syntax error",
    "unclosed quotation",
    "query failed"
]


def scan_sqli(url, params=None):
    vulnerabilities = []
    candidate_params = resolve_candidate_params(url, params, fallback=("id",))

    for param in candidate_params:
        for payload in SQLI_PAYLOADS:
            try:
                target_url, query = build_request_target(url, {param: payload})
                response = requests.get(target_url, params=query, timeout=5)

                if any(err in response.text.lower() for err in SQL_ERRORS):
                    vulnerabilities.append({
                        "type": "SQL Injection",
                        "severity": "High",
                        "message": f"SQL error detected in parameter: {param}",
                        "param": param,
                        "payload": payload,
                        "response": response.text
                    })

            except requests.Timeout:
                print(f"SQLi scan timeout for {url}")
            except requests.ConnectionError:
                print(f"SQLi scan connection error for {url}")
            except Exception as e:
                print(f"SQLi error: {e}")

    return vulnerabilities
