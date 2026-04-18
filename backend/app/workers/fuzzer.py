import requests

WORDLIST_PATH = "app/wordlists/params.txt"


def load_wordlist():
    with open(WORDLIST_PATH, "r") as f:
        return [line.strip() for line in f.readlines()]


def fuzz_parameters(url):
    vulnerabilities = []

    params_list = load_wordlist()

    for param in params_list:
        try:
            test_value = "cybertest123"

            res = requests.get(url, params={param: test_value}, timeout=5)

            # 🔥 Detection logic (basic but effective)
            if test_value in res.text:
                vulnerabilities.append({
                    "type": "Parameter Discovery",
                    "severity": "Info",
                    "param": param,
                    "message": f"Parameter '{param}' is reflected"
                })

            # 🔥 Error-based detection
            if "error" in res.text.lower():
                vulnerabilities.append({
                    "type": "Potential Vulnerability (Fuzz)",
                    "severity": "Medium",
                    "param": param,
                    "message": f"Error triggered with param '{param}'"
                })

        except Exception as e:
            print("Fuzz error:", e)

    return vulnerabilities