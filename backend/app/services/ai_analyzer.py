import requests

def analyze_website(url: str):
    issues = []
    recommendations = []

    # 🔐 Check HTTPS
    if not url.startswith("https"):
        issues.append("Website is not using HTTPS")
        recommendations.append("Enable HTTPS for secure communication")

    # 🌐 Try request
    try:
        response = requests.get(url, timeout=5)

        headers = response.headers

        # Security headers check
        if "X-Frame-Options" not in headers:
            issues.append("Missing X-Frame-Options header")
            recommendations.append("Add X-Frame-Options to prevent clickjacking")

        if "Content-Security-Policy" not in headers:
            issues.append("Missing Content Security Policy")
            recommendations.append("Implement CSP to prevent XSS attacks")

    except requests.Timeout:
        issues.append("Website request timed out")
        recommendations.append("Check if the server is responding slowly")
    except requests.ConnectionError:
        issues.append("Website unreachable")
        recommendations.append("Ensure the server is running and accessible")
    except Exception as e:
        issues.append(f"Error analyzing website: {str(e)}")
        recommendations.append("Check the website URL and try again")

    # 🧠 Risk Calculation
    if len(issues) >= 3:
        risk = "High"
    elif len(issues) == 2:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "risk": risk,
        "summary": f"Detected {len(issues)} security issues.",
        "issues": issues,
        "recommendations": recommendations,
    }