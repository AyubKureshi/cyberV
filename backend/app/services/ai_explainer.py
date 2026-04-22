import os
import time
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def explain_vulnerability(vuln):
    try:
        prompt = f"""Explain this cybersecurity vulnerability:
Type: {vuln.get('type')}
Severity: {vuln.get('severity')}
Give: Explanation, Impact, Fix. Keep it very short."""

        # Add retry with backoff for rate limits
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return response.text if response.text else "No response"
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower() or "rate" in str(e).lower():
                    if attempt < 2:
                        time.sleep(10 * (attempt + 1))  # 10s, 20s backoff
                        continue
                raise e

    except Exception as e:
        print("🔥 Gemini ERROR:", e)
        return f"AI Error: {str(e)}"