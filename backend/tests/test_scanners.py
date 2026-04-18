import unittest
from unittest.mock import Mock, patch

from app.workers.form_scanner import scan_form
from app.workers.open_redirect import scan_open_redirect
from app.workers.sqli_scanner import scan_sqli
from app.workers.xss_scanner import scan_xss


class ScannerWorkerTests(unittest.TestCase):
    @patch("app.workers.sqli_scanner.requests.get")
    def test_sqli_scanner_uses_discovered_param_names(self, mock_get):
        mock_get.return_value = Mock(text="You have an SQL syntax error near mysql")

        vulnerabilities = scan_sqli("https://example.com/items", params=["user_id"])

        self.assertTrue(vulnerabilities)
        _, kwargs = mock_get.call_args
        self.assertEqual(kwargs["params"]["user_id"], "' OR 1=1--")

    @patch("app.workers.xss_scanner.requests.get")
    def test_xss_scanner_uses_discovered_param_names(self, mock_get):
        mock_get.return_value = Mock(text="<img src=x onerror=alert(1)>")

        vulnerabilities = scan_xss("https://example.com/search", params=["term"])

        self.assertTrue(vulnerabilities)
        _, kwargs = mock_get.call_args
        self.assertEqual(kwargs["params"]["term"], "<img src=x onerror=alert(1)>")

    @patch("app.workers.open_redirect.requests.get")
    def test_open_redirect_scanner_checks_redirect_like_params(self, mock_get):
        mock_get.return_value = Mock(headers={"Location": "https://evil.com"})

        vulnerabilities = scan_open_redirect("https://example.com/login", params=["next"])

        self.assertEqual(len(vulnerabilities), 1)
        _, kwargs = mock_get.call_args
        self.assertEqual(kwargs["params"]["next"], "https://evil.com")

    @patch("app.workers.form_scanner.requests.post")
    def test_form_scanner_checks_xss_and_sqli(self, mock_post):
        mock_post.side_effect = [
            Mock(text="<script>alert(1)</script>"),
            Mock(text="You have an SQL syntax error"),
        ]

        vulnerabilities = scan_form(
            {
                "action": "https://example.com/login",
                "method": "post",
                "inputs": [{"name": "username", "type": "text"}],
            }
        )

        self.assertEqual({v["type"] for v in vulnerabilities}, {"XSS (Form)", "SQL Injection (Form)"})


if __name__ == "__main__":
    unittest.main()
