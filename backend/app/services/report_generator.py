import os
from google import genai

# Fetch API key from environment variables instead of hardcoding
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

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