import requests


XSS_PAYLOAD = "<script>alert(1)</script>"
SQLI_PAYLOAD = "' OR '1'='1"
SQL_ERRORS = [
    "sql syntax",
    "mysql",
    "syntax error",
    "unclosed quotation",
    "query failed"
]


def scan_form(form):
    vulnerabilities = []
    injectable_fields = [
        input_field["name"]
        for input_field in form["inputs"]
        if input_field["name"] and input_field.get("type") not in {"submit", "button", "reset", "file"}
    ]

    try:
        for field_name in injectable_fields:
            xss_data = {name: XSS_PAYLOAD if name == field_name else "test" for name in injectable_fields}
            if form["method"] == "post":
                res = requests.post(form["action"], data=xss_data, timeout=5)
            else:
                res = requests.get(form["action"], params=xss_data, timeout=5)

            if XSS_PAYLOAD in res.text:
                vulnerabilities.append({
                    "type": "XSS (Form)",
                    "severity": "High",
                    "message": f"Reflected XSS in form field: {field_name}",
                    "param": field_name,
                    "payload": XSS_PAYLOAD,
                    "response": res.text
                })

            sqli_data = {name: SQLI_PAYLOAD if name == field_name else "test" for name in injectable_fields}
            if form["method"] == "post":
                res = requests.post(form["action"], data=sqli_data, timeout=5)
            else:
                res = requests.get(form["action"], params=sqli_data, timeout=5)

            if any(err in res.text.lower() for err in SQL_ERRORS):
                vulnerabilities.append({
                    "type": "SQL Injection (Form)",
                    "severity": "High",
                    "message": f"SQLi indicators detected in form field: {field_name}",
                    "param": field_name,
                    "payload": SQLI_PAYLOAD,
                    "response": res.text
                })

    except Exception as e:
        print("Form scan error:", e)

    return vulnerabilities
