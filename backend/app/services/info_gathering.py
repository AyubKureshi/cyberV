import socket


def gather_info(domain: str):
    result = {}

    try:
        ip = socket.gethostbyname(domain)
        result["ip"] = ip
    except:
        result["ip"] = "Unable to resolve"

    return result