from google import genai

# 🔥 Initialize client
client = genai.Client(api_key="AIzaSyAsQWl43WyVaG5AlgKGBSIXCS7VYRy3ZT0")


def explain_vulnerability(vuln):
    try:
        prompt = f"""
Explain this cybersecurity vulnerability:

Type: {vuln.get('type')}
Severity: {vuln.get('severity')}

Give:
- Explanation
- Impact
- Fix

Keep it very short and simple.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text if response.text else "No response"

    except Exception as e:
        print("🔥 Gemini ERROR:", e)
        return f"AI Error: {str(e)}"