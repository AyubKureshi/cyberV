def normalize_url(url: str) -> str:
    if url.startswith(("http://", "https://")):
        return url

    return f"https://{url}"
