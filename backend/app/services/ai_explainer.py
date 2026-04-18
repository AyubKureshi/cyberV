import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load local environment variables from .env
load_dotenv()

# 🔑 Configure API
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("Gemini API key not found. Set GEMINI_API_KEY or GOOGLE_API_KEY in backend/.env or your environment.")

genai.configure(api_key=api_key)

# gemini-1.5-flash is extremely fast, cost-effective, and highly capable for JSON tasks
raw_model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Ensure correct model prefix mapping
if raw_model_name.startswith("models/") or raw_model_name.startswith("tunedModels/"):
    MODEL_NAME = raw_model_name
else:
    MODEL_NAME = f"models/{raw_model_name}"

# Initialize the model
model = genai.GenerativeModel(MODEL_NAME)


def explain_vulnerability(vuln):
    try:
        prompt = f"""
        Explain this vulnerability:
        Type: {vuln.get('type', 'Unknown')}
        Severity: {vuln.get('severity', 'Unknown')}
        
        Provide the explanation, the potential impact, and a recommended fix.
        """

        # Enforce strict JSON output using GenerationConfig
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )

        # The response.text is now guaranteed to be a valid JSON string (no markdown ticks)
        # We can safely parse it into a Python dictionary if needed, or return the string
        return response.text

    except Exception as e:
        print(f"Gemini error: {e}")
        return None