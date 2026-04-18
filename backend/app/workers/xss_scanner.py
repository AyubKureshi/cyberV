import requests
import urllib.parse

from app.workers.common import build_request_target, resolve_candidate_params

XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><script>alert(1)</script>",
    "<img src=x onerror=alert(1)>"
]


def scan_xss(url, params=None):
    vulnerabilities = []
    candidate_params = resolve_candidate_params(url, params, fallback=("q", "search"))

    for param in candidate_params:
        for payload in XSS_PAYLOADS:
            try:
                encoded_payload = urllib.parse.quote(payload)
                target_url, query = build_request_target(url, {param: payload})
                response = requests.get(target_url, params=query, timeout=5)

                if payload in response.text or encoded_payload in response.text:
                    vulnerabilities.append({
                        "type": "XSS",
                        "severity": "High",
                        "message": f"Reflected XSS detected in parameter: {param}",
                        "param": param,
                        "payload": payload,
                        "response": response.text
                    })

            except requests.Timeout:
                print(f"XSS scan timeout for {url}")
            except requests.ConnectionError:
                print(f"XSS scan connection error for {url}")
            except Exception as e:
                print(f"XSS error: {e}")

    return vulnerabilities
