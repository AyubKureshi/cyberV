import importlib
import sys
import types
import unittest
from unittest.mock import patch


fake_mongo = types.ModuleType("app.db.mongo")
fake_mongo.targets_collection = object()
sys.modules["app.db.mongo"] = fake_mongo

main = importlib.import_module("app.main")


class ScanPipelineTests(unittest.TestCase):
    @patch("app.main.update_progress")
    @patch("app.main.update_endpoint_status")
    @patch("app.main.add_vulnerability")
    @patch("app.main.validate_vulnerability", return_value=True)
    @patch("app.main.run_sqlmap", return_value=[{"type": "SQL Injection (sqlmap)", "severity": "Critical", "tool": "sqlmap"}])
    @patch("app.main.scan_form", return_value=[{"type": "XSS (Form)", "severity": "High", "payload": "<script>alert(1)</script>", "response": "<script>alert(1)</script>"}])
    @patch("app.main.extract_forms", return_value=[{"action": "https://example.com/search", "method": "get", "inputs": [{"name": "term", "type": "text"}]}])
    @patch("app.main.scan_open_redirect", return_value=[{"type": "Open Redirect", "severity": "Medium"}])
    @patch("app.main.scan_headers", return_value=[{"type": "Clickjacking", "severity": "Medium"}])
    @patch("app.main.scan_xss", return_value=[{"type": "XSS", "severity": "High", "payload": "<script>alert(1)</script>", "response": "<script>alert(1)</script>"}])
    @patch("app.main.scan_sqli", return_value=[{"type": "SQL Injection", "severity": "High", "response": "mysql syntax error"}])
    @patch("app.main.scan_params", return_value=[{"type": "XSS (Param)", "severity": "High", "payload": "<script>alert(1)</script>", "response": "<script>alert(1)</script>"}])
    @patch("app.main.discover_parameters", return_value=["term"])
    @patch("app.main.run_nmap", return_value=[{"type": "Open Ports", "severity": "Info"}])
    @patch("app.main.add_endpoints")
    @patch("app.main.discover_endpoints", return_value=["https://example.com/search"])
    @patch("app.main.update_status")
    def test_pipeline_scans_each_endpoint_and_marks_completion(
        self,
        update_status,
        discover_endpoints,
        add_endpoints,
        run_nmap,
        discover_parameters,
        scan_params,
        scan_sqli,
        scan_xss,
        scan_headers,
        scan_open_redirect,
        extract_forms,
        scan_form,
        run_sqlmap,
        validate_vulnerability,
        add_vulnerability,
        update_endpoint_status,
        update_progress,
    ):
        main.run_scan_pipeline("target-1", "https://example.com")

        add_endpoints.assert_called_once()
        discover_parameters.assert_any_call("https://example.com")
        discover_parameters.assert_any_call("https://example.com/search")
        scan_sqli.assert_any_call("https://example.com/search", ["term"])
        scan_xss.assert_any_call("https://example.com/search", ["term"])
        scan_open_redirect.assert_any_call("https://example.com/search", ["term"])
        self.assertGreaterEqual(add_vulnerability.call_count, 2)
        update_endpoint_status.assert_any_call("target-1", "https://example.com", "scanning")
        update_endpoint_status.assert_any_call("target-1", "https://example.com/search", "completed")
        update_progress.assert_called()
        self.assertEqual(update_status.call_args_list[0].args, ("target-1", "scanning"))
        self.assertEqual(update_status.call_args_list[-1].args, ("target-1", "completed"))


if __name__ == "__main__":
    unittest.main()
