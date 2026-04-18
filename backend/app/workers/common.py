from urllib.parse import parse_qsl, urlsplit, urlunsplit


DEFAULT_DISCOVERED_PARAMS = ("id", "q")
REDIRECT_PARAMS = (
    "redirect",
    "url",
    "next",
    "return",
    "target",
    "dest",
    "destination",
)


def resolve_candidate_params(url, params=None, fallback=None):
    if params:
        return list(dict.fromkeys(p for p in params if p))

    query_params = [key for key, _ in parse_qsl(urlsplit(url).query, keep_blank_values=True) if key]
    if query_params:
        return list(dict.fromkeys(query_params))

    if fallback:
        return list(dict.fromkeys(fallback))

    return list(DEFAULT_DISCOVERED_PARAMS)


def build_request_target(url, overrides=None):
    split = urlsplit(url)
    base_params = dict(parse_qsl(split.query, keep_blank_values=True))

    if overrides:
        base_params.update(overrides)

    clean_url = urlunsplit((split.scheme, split.netloc, split.path, "", split.fragment))
    return clean_url, base_params
