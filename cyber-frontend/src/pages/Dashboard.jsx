import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await API.get("/stats");
      const scansRes = await API.get("/scans");

      setStats(statsRes.data);
      setScans(scansRes.data.slice(0, 5)); // latest 5
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            AI-powered web application vulnerability scanner
          </p>
        </div>

        <button
          onClick={() => navigate("/analyzer")}
          className="bg-[#00FF9F] text-black px-4 py-2 rounded text-sm hover:opacity-90 transition"
        >
          Start Scan
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Scans" value={stats.total_scans} />
          <StatCard title="High" value={stats.high} color="text-red-400" />
          <StatCard
            title="Medium"
            value={stats.medium}
            color="text-orange-400"
          />
          <StatCard title="Low" value={stats.low} color="text-blue-400" />
        </div>
      )}

      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
          Recent Scans
        </h2>

        <div className="space-y-2">
          {scans.map((scan) => (
            <div
              key={scan._id}
              className="flex justify-between text-sm border-b border-[#1F2937] pb-2"
            >
              <span className="text-gray-300 truncate">{scan.url}</span>

              <span className="text-gray-500 text-xs">{scan.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 WHAT THIS PROJECT DOES */}
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
          Overview
        </h2>

        <p className="text-sm text-gray-300 leading-relaxed">
          This system performs automated security analysis of web applications
          by combining crawling, parameter discovery, fuzzing, and vulnerability
          detection techniques. It identifies common web vulnerabilities such as
          SQL Injection, Cross-Site Scripting (XSS), insecure headers, and open
          redirects.
        </p>
      </div>

      {/* 🔹 HOW IT WORKS */}
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
          Scan Pipeline
        </h2>

        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Target URL input</li>
          <li>• Endpoint discovery (crawler)</li>
          <li>• Parameter discovery</li>
          <li>• Fuzzing & payload injection</li>
          <li>• Vulnerability scanning (SQLi, XSS, headers, redirects)</li>
          <li>• AI-based explanation generation</li>
          <li>• Results stored in database</li>
        </ul>
      </div>

      {/* 🔹 SCANNING MODULES */}
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
          Scanning Modules
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <Module name="SQL Injection Scanner" />
          <Module name="XSS Scanner" />
          <Module name="Header Analyzer" />
          <Module name="Open Redirect Scanner" />
          <Module name="Form Scanner" />
          <Module name="Parameter Discovery" />
          <Module name="Fuzzer Engine" />
          <Module name="Nmap Integration" />
          <Module name="SQLMap Integration" />
        </div>
      </div>

      {/* 🔹 AI SECTION */}
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
          AI Assistance
        </h2>

        <p className="text-sm text-gray-300">
          Detected vulnerabilities are analyzed using AI to generate
          human-readable explanations, including impact and remediation steps.
          This helps users understand security issues without deep technical
          expertise.
        </p>
      </div>

      {/* 🔹 SYSTEM STATUS */}
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">System Status</p>
          <p className="text-sm text-[#00FF9F]">Operational</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Database</p>
          <p className="text-sm text-[#00FF9F]">Connected</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Scanner Engine</p>
          <p className="text-sm text-[#00FF9F]">Active</p>
        </div>
      </div>
    </div>
  );
};

// 🔹 SMALL COMPONENT
const Module = ({ name }) => {
  return (
    <div className="border border-[#1F2937] p-2 rounded text-gray-300 hover:border-[#00FF9F] transition">
      {name}
    </div>
  );
};

const StatCard = ({ title, value, color = "text-[#00FF9F]" }) => {
  return (
    <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
};

export default Dashboard;
