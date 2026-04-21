import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import { jsPDF } from "jspdf";
import { useAppContext } from "../context/AppContext";
import SeverityChart from "../components/SeverityChart";
import ScanHistory from "../components/ScanHistory";
import ReportViewer from "../components/ReportViewer";

const Analyzer = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const progressRef = useRef(null);
  const inputRef = useRef(null);

  const location = useLocation();

  const {
    targetId,
    setTargetId,
    progress,
    setProgress,
    status,
    setStatus,
    result,
    setResult,
  } = useAppContext();

  // 🚀 START SCAN
  const handleScan = async () => {
    if (!url) return;

    try {
      setIsScanning(true);
      setProgress(0);
      setStatus("starting");
      setResult(null);

      const res = await API.post("/scan", { url });
      setTargetId(res.data.target_id);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  // 🛑 STOP SCAN
  const handleStop = async () => {
    setIsScanning(false);
    setStatus("stopped");

    // Tell the backend to kill the process
    if (targetId) {
      try {
        await API.post(`/scan/${targetId}/stop`);
      } catch (err) {
        console.error("Error stopping scan:", err);
      }
    }
  };

  // ⌨️ ENTER KEY
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleScan();
  };

  const handleSelectScan = (scan) => {
    setResult(scan);
    setStatus(scan.status);
    setProgress(scan.progress || 100);
  };

  const handleDownloadPDF = () => {
    if (!result?.report) return;

    // Create a new PDF document
    const doc = new jsPDF();

    // Set up standard margins and fonts
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxTextWidth = pageWidth - margin * 2;

    // 1. Add Header / Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 200, 150); // A cyan-like color to match your theme
    doc.text("CyberVision Security Report", margin, 20);

    // 2. Add Timestamp
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, margin, 28);

    // 3. Add Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 32, pageWidth - margin, 32);

    // 4. Add the actual AI Report Content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for readability

    // This splits the long text into an array of lines that fit within the PDF width
    const splitReportText = doc.splitTextToSize(result.report, maxTextWidth);

    // Print the text starting at Y = 40
    doc.text(splitReportText, margin, 40);

    // 5. Trigger the download
    doc.save("Scan_Report.pdf");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (location.state?.url) {
      setUrl(location.state.url);
    }
  }, [location.state]);

  // 🔄 POLLING
  useEffect(() => {
    if (!targetId || !isScanning) return;

    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/scan/${targetId}`);

        setProgress(res.data.progress);
        setStatus(res.data.status);
        setResult(res.data);

        if (res.data.status === "completed") {
          setIsScanning(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [targetId, isScanning, setProgress, setResult, setStatus]);

  // 📌 STICKY LOGIC (based on progress position)
  useEffect(() => {
    const handleScroll = () => {
      if (!progressRef.current) return;

      const rect = progressRef.current.getBoundingClientRect();

      // when progress bar goes out of view → stick
      setIsSticky(rect.top <= 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
      case "Critical":
        return "text-red-400";
      case "Medium":
        return "text-orange-400";
      case "Low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex gap-4">
      {/* LEFT - HISTORY */}
      <ScanHistory onSelect={handleSelectScan} />

      {/* RIGHT - MAIN */}
      <div className="flex-1 space-y-6">
        {/* 🔹 INPUT SECTION */}
        <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md shadow-sm">
          <h2 className="text-sm mb-3 text-gray-400">Target URL</h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://target.com"
              value={url}
              ref={inputRef}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#0B0F14] border border-[#1F2937] p-2 rounded outline-none focus:border-[#00FF9F] focus:ring-1 focus:ring-[#00FF9F]/30"
            />

            {!isScanning ? (
              <button
                onClick={handleScan}
                className="bg-[#00FF9F] text-black px-4 rounded text-sm hover:opacity-80 transition cursor-pointer"
              >
                Scan
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="bg-red-500 text-white px-4 rounded text-sm hover:bg-red-600 transition cursor-pointer"
              >
                Stop
              </button>
            )}
          </div>

          {/* 🔹 PROGRESS (NORMAL POSITION) */}
          {isScanning && !isSticky && (
            <div ref={progressRef} className="mt-4">
              <ProgressBar progress={progress} status={status} />
            </div>
          )}
        </div>

        {/* 🔹 STICKY PROGRESS */}
        {isScanning && isSticky && (
          <div className="fixed top-14 left-64 right-0 z-50 bg-[#0B0F14] px-4 py-2 border-b border-[#1F2937]">
            <ProgressBar progress={progress} status={status} />
          </div>
        )}

        {/* 🔹 RISK SUMMARY */}
        {result && result.endpoints && (
          <RiskSummary endpoints={result.endpoints} />
        )}

        {result && result.endpoints && (
          <div className="flex gap-4">
            <SeverityChart endpoints={result.endpoints} />
          </div>
        )}

        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#121821] border border-[#1F2937] p-2 rounded text-sm"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="text"
            placeholder="Search vulnerability..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#121821] border border-[#1F2937] p-2 rounded text-sm"
          />
        </div>

        {/* 🔹 RESULTS */}
        {result && result.endpoints && (
          <div className="space-y-4">
            <h2 className="text-sm text-gray-400 tracking-wide uppercase">
              Scan Results
            </h2>

            {result.endpoints.map((ep, i) => (
              <div
                key={i}
                className="bg-[#121821] border border-[#1F2937] p-4 rounded-md hover:border-[#00FF9F] hover:shadow-[0_0_6px_#00FF9F20] transition-all duration-200"
              >
                <p className="text-xs text-gray-400 mb-2">{ep.url}</p>

                {ep.vulnerabilities.length === 0 ? (
                  <p className="text-green-400 text-sm">No vulnerabilities</p>
                ) : (
                  ep.vulnerabilities
                    .filter((v) => {
                      if (filter !== "All" && v.severity !== filter)
                        return false;

                      if (
                        search &&
                        !v.type.toLowerCase().includes(search.toLowerCase())
                      )
                        return false;

                      return true;
                    })
                    .map((v, j) => (
                      <div
                        key={j}
                        className="border-t border-[#1F2937] pt-2 mt-2"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-sm">{v.type}</p>

                          <span
                            className={`text-xs font-semibold ${getSeverityColor(v.severity)}`}
                          >
                            {v.severity}
                          </span>
                          <p className="text-xs text-gray-500">{ep.status}</p>
                        </div>

                        {v.ai_explanation && (
                          <p className="text-xs text-gray-400 mt-1 whitespace-pre-line">
                            {v.ai_explanation}
                          </p>
                        )}
                      </div>
                    ))
                )}
              </div>
            ))}
          </div>
        )}

        {/* 🔹 AI REPORT SECTION */}
        {result?.report && (
          <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md mt-6 flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-400 uppercase tracking-wide">
                AI Security Report
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                A detailed AI-generated breakdown of the scan results.
              </p>
            </div>

            <button
              onClick={() => setIsReportOpen(true)}
              className="bg-[#00FF9F] text-black px-4 py-2 rounded text-sm hover:opacity-80 transition font-semibold flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View AI Report
            </button>
          </div>
        )}
      </div>

      {/* 🔹 REPORT VIEWER MODAL */}
      {isReportOpen && result?.report && (
        <ReportViewer
          reportContent={result.report}
          onClose={() => setIsReportOpen(false)}
          onDownload={handleDownloadPDF}
        />
      )}
    </div>
  );
};

// 🔹 REUSABLE PROGRESS COMPONENT
const ProgressBar = ({ progress, status }) => {
  return (
    <div>
      <div className="w-full bg-[#1F2937] h-2 rounded">
        <div
          className="bg-[#00FF9F] h-2 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs mt-1 text-gray-400">
        {status} — {progress}%
      </p>
    </div>
  );
};

const RiskSummary = ({ endpoints }) => {
  let high = 0,
    medium = 0,
    low = 0;

  endpoints.forEach((ep) => {
    ep.vulnerabilities.forEach((v) => {
      if (v.severity === "High" || v.severity === "Critical") high++;
      else if (v.severity === "Medium") medium++;
      else if (v.severity === "Low") low++;
    });
  });

  return (
    <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md shadow-sm flex gap-6 text-sm">
      <div>
        <p className="text-red-400 font-semibold">{high}</p>
        <p className="text-gray-400">High</p>
      </div>

      <div>
        <p className="text-orange-400 font-semibold">{medium}</p>
        <p className="text-gray-400">Medium</p>
      </div>

      <div>
        <p className="text-blue-400 font-semibold">{low}</p>
        <p className="text-gray-400">Low</p>
      </div>
    </div>
  );
};

export default Analyzer;
