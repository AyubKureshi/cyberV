import { useEffect, useState } from "react";
import API from "../api/axios";

const ScanHistory = ({ onSelect }) => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await API.get("/scans");
      setScans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#121821] border border-[#1F2937] p-4 rounded w-80">
      <p className="text-sm mb-3 text-gray-400">Scan History</p>

      <div className="space-y-2 max-h-100 overflow-y-auto">
        {scans.map((scan) => (
          <div
            key={scan._id}
            onClick={() => onSelect(scan)}
            className="p-2 border border-[#1F2937] rounded cursor-pointer hover:border-[#00FF9F]"
          >
            <p className="text-xs text-gray-300 truncate">{scan.url}</p>

            <p className="text-[10px] text-gray-500">{scan.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;
