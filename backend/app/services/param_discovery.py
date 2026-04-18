from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup


def discover_parameters(url):
    params = set()

    try:
        # 🔹 Extract from URL
        parsed = urlparse(url)
        query_params = parse_qs(parsed.query)

        for p in query_params:
            params.add(p)

        # 🔹 Extract from HTML forms
        res = requests.get(url, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")

        for form in soup.find_all("form"):
            for input_tag in form.find_all("input"):
                name = input_tag.get("name")
                if name:
                    params.add(name)

    except Exception as e:
        print("Param discovery error:", e)

    return list(params)