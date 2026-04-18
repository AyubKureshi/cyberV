def validate_vulnerability(vuln, response_text=None):
    vtype = vuln["type"]

    if "SQL Injection" in vtype:
        keywords = ["sql", "syntax", "mysql", "query failed"]
        if vuln.get("tool") == "sqlmap":
            return True
        if response_text and any(k in response_text.lower() for k in keywords):
            return True

    if "XSS" in vtype:
        if response_text and vuln.get("payload") in response_text:
            return True

    if vtype in ["Clickjacking", "XSS Protection Missing", "Open Ports"]:
        return True

    if vtype == "Open Redirect":
        return True

    return False
