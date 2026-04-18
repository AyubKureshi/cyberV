import subprocess


def run_nmap(domain):
    results = []

    try:
        cmd = ["nmap", "-F", domain]
        result = subprocess.run(cmd, capture_output=True, text=True)

        output = result.stdout.lower()

        if "open" in output:
            results.append({
                "type": "Open Ports",
                "severity": "Info",
                "message": "Open ports detected",
                "details": output,
                "tool": "nmap"
            })

    except Exception as e:
        print("nmap error:", e)

    return results