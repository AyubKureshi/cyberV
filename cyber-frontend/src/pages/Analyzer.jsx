import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAppContext } from "../context/AppContext";

const Analyzer = () => {
  const [url, setUrl] = useState("");

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

  // 🚀 Start Scan
  const handleScan = async () => {
    try {
      const res = await API.post("/scan", { url });

      setTargetId(res.data.target_id);
      setStatus("starting");
      setProgress(0);
      setResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Polling for real-time updates
  useEffect(() => {
    if (!targetId) return;

    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/scan/${targetId}`);

        setProgress(res.data.progress);
        setStatus(res.data.status);
        setResult(res.data);

        if (res.data.status === "completed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [targetId]);

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Website Scanner</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="https://example.com"
          className="flex-1 p-3 rounded bg-gray-800"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={handleScan} className="bg-green-500 px-4 py-2 rounded">
          Scan
        </button>
      </div>

      {/* Progress */}
      {targetId && (
        <div className="bg-gray-800 p-4 rounded">
          <p>Status: {status}</p>

          <div className="w-full bg-gray-700 h-3 rounded mt-2">
            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm mt-1">{progress}%</p>
        </div>
      )}

      {/* Results */}
      {result && result.endpoints && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scan Results</h2>

          {result.endpoints.map((ep, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded">
              <p className="font-semibold">{ep.url}</p>

              {ep.vulnerabilities.length === 0 ? (
                <p className="text-green-400">No vulnerabilities</p>
              ) : (
                ep.vulnerabilities.map((v, j) => (
                  <div key={j} className="text-red-400">
                    {v.ai_explanation && (
                      <div className="mt-2 text-sm text-gray-300 whitespace-pre-line">
                        🧠 {v.ai_explanation}
                      </div>
                    )}
                    ⚠ {v.type} ({v.severity})
                    {v.ai_explanation && (
                      <div className="mt-2 text-sm text-gray-300 whitespace-pre-line">
                        🧠 {v.ai_explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analyzer;
