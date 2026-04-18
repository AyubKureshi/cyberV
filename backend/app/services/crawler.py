import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def discover_endpoints(base_url: str):
    endpoints = set()
    endpoints.add(base_url)

    try:
        response = requests.get(base_url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        # 🔹 Extract links
        for tag in soup.find_all("a"):
            href = tag.get("href")

            if href:
                full_url = urljoin(base_url, href)
                endpoints.add(full_url)

        # 🔹 Extract forms (important for XSS/SQLi)
        for form in soup.find_all("form"):
            action = form.get("action")

            if action:
                full_url = urljoin(base_url, action)
                endpoints.add(full_url)

    except requests.Timeout:
        print(f"Crawler timeout for {base_url}")
    except requests.ConnectionError:
        print(f"Crawler connection error for {base_url}")
    except Exception as e:
        print(f"Crawler error: {e}")

    return list(endpoints)