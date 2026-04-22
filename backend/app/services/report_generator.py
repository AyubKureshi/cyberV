import os
import time
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def generate_report(scan_data):
    try:
        prompt = f"""You are a cybersecurity expert.
Generate a professional vulnerability scan report based on:
{scan_data}
Include: 1. Executive Summary 2. Vulnerability Overview 3. Severity Breakdown 4. Detailed Findings 5. Recommendations"""

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return response.text if response.text else "No report generated"
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower() or "rate" in str(e).lower():
                    if attempt < 2:
                        time.sleep(15 * (attempt + 1))
                        continue
                raise e

    except Exception as e:
        print("Report AI error:", e)
        return "Failed to generate report"