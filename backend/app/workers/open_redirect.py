import requests

from app.workers.common import REDIRECT_PARAMS, build_request_target, resolve_candidate_params


def scan_open_redirect(url, params=None):
    vulnerabilities = []
    candidate_params = resolve_candidate_params(url, params, fallback=REDIRECT_PARAMS)

    try:
        for param in candidate_params:
            target_url, query = build_request_target(url, {param: "https://evil.com"})
            response = requests.get(target_url, params=query, allow_redirects=False, timeout=5)

            if "Location" in response.headers and "evil.com" in response.headers["Location"]:
                vulnerabilities.append({
                    "type": "Open Redirect",
                    "severity": "Medium",
                    "message": f"Open redirect detected in parameter: {param}",
                    "param": param
                })

    except requests.Timeout:
        print(f"Open redirect scan timeout for {url}")
    except requests.ConnectionError:
        print(f"Open redirect scan connection error for {url}")
    except Exception as e:
        print(f"Open redirect scan error: {e}")

    return vulnerabilities
