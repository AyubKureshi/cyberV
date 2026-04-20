from google import genai

client = genai.Client(api_key="AIzaSyAsQWl43WyVaG5AlgKGBSIXCS7VYRy3ZT0")


def generate_report(scan_data):
    try:
        prompt = f"""
You are a cybersecurity expert.

Generate a professional vulnerability scan report based on the following data:

{scan_data}

Include:

1. Executive Summary
2. Vulnerability Overview
3. Severity Breakdown
4. Detailed Findings
5. Recommendations

Keep it structured and professional.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text if response.text else "No report generated"

    except Exception as e:
        print("Report AI error:", e)
        return "Failed to generate report"