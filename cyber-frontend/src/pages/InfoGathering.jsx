import { useState } from "react";
import API from "../api/axios";

const InfoGathering = () => {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!domain) return alert("Enter a domain");

    try {
      setLoading(true);

      const res = await API.post("/info", {
        domain: domain,
      });

      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error scanning domain: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Domain Information Gathering
      </h2>

      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (example.com)..."
        className="w-full p-2 bg-gray-700 text-white rounded"
      />

      <button
        onClick={handleScan}
        disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>

      {result && (
        <pre className="bg-gray-900 p-4 rounded text-green-400 overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default InfoGathering;
