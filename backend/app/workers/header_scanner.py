import requests

def scan_headers(url):
    vulnerabilities = []

    try:
        response = requests.get(url, timeout=5)
        headers = response.headers

        if "X-Frame-Options" not in headers:
            vulnerabilities.append({
                "type": "Clickjacking",
                "severity": "Medium",
                "message": "Missing X-Frame-Options header"
            })

        if "Content-Security-Policy" not in headers:
            vulnerabilities.append({
                "type": "XSS Protection Missing",
                "severity": "Medium",
                "message": "Missing CSP header"
            })

    except requests.Timeout:
        print(f"Header scan timeout for {url}")
    except requests.ConnectionError:
        print(f"Header scan connection error for {url}")
    except Exception as e:
        print(f"Header scan error: {e}")

    return vulnerabilities