import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

# 1. Global Cache and Time Tracker
_explanation_cache = {}
_last_api_call_time = 0.0  # Tracks when the last API request was made

def explain_vulnerability(vuln, max_retries=3):
    global _last_api_call_time
    
    vuln_type = vuln.get('type')
    vuln_severity = vuln.get('severity')
    
    # 2. Check Cache First (Instant return, no API call)
    cache_key = f"{vuln_type}_{vuln_severity}"
    if cache_key in _explanation_cache:
        print(f"⚡ Using cached AI explanation for: {vuln_type}")
        return _explanation_cache[cache_key]

    prompt = f"""
Explain this cybersecurity vulnerability:

Type: {vuln_type}
Severity: {vuln_severity}

Give:
- Explanation
- Impact
- Fix

Keep it very short and simple.
"""

    # 3. Retry loop
    for attempt in range(max_retries):
        try:
            # 🔥 THE FIX: Force a minimum of 4.1 seconds between API calls
            # This ensures we never exceed the 15 Requests Per Minute free tier limit
            time_since_last_call = time.time() - _last_api_call_time
            if time_since_last_call < 4.1:
                sleep_time = 4.1 - time_since_last_call
                print(f"⏳ Speed limit! Waiting {sleep_time:.1f}s before asking AI...")
                time.sleep(sleep_time)
            
            print(f"🤖 Fetching AI explanation for: {vuln_type}...")
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            # Update the time tracker right after a successful call
            _last_api_call_time = time.time()
            
            explanation = response.text if response.text else "No response"
            
            # Save to cache
            _explanation_cache[cache_key] = explanation
            
            return explanation
            
        except Exception as e:
            error_msg = str(e)
            
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                wait_time = 5 ** attempt  # Wait 1s, 5s, 25s
                print(f"⚠️ Rate limit hit. Backing off for {wait_time} seconds...")
                
                # Update time tracker so it doesn't immediately fire again after sleeping
                _last_api_call_time = time.time() + wait_time 
                time.sleep(wait_time)
                continue
                
            elif "403" in error_msg or "PERMISSION_DENIED" in error_msg:
                print("🚨 ERROR: Your API key is invalid or leaked.")
                return "AI Error: Invalid API Key."
                
            else:
                print("🔥 Gemini ERROR:", e)
                return f"AI Error: {error_msg}"

    return "AI Error: Could not fetch explanation due to server rate limits."