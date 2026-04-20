import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAppContext } from "../context/AppContext";

const InfoGathering = () => {
 const { infoData, setInfoData, infoUrl, setInfoUrl } = useAppContext();
  const navigate = useNavigate();

  const handleFetch = async () => {
    try {
      const res = await API.post("/info", { url: infoUrl });
      setInfoData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md">
        <h2 className="text-sm text-gray-400 mb-2 uppercase">Info Gathering</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://target.com"
            value={infoUrl}
            onChange={(e) => setInfoUrl(e.target.value)}
            className="flex-1 bg-[#0B0F14] border border-[#1F2937] p-2 rounded outline-none"
          />

          <button
            onClick={handleFetch}
            className="bg-[#00FF9F] text-black px-4 rounded text-sm"
          >
            Fetch
          </button>
        </div>
      </div>

      {infoData && (
        <div className="bg-[#121821] border border-[#1F2937] p-4 rounded-md text-sm space-y-2">
          <p>
            <b>Domain:</b> {infoData.domain}
          </p>
          <p>
            <b>Status:</b> {infoData.status_code}
          </p>

          <div>
            <p className="text-gray-400">Headers:</p>
            <pre className="text-xs bg-[#0B0F14] p-2 rounded overflow-auto">
              {JSON.stringify(infoData.headers, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {infoData && (
        <button
          onClick={() => navigate("/analyzer", { state: { infoUrl } })}
          className="bg-[#00FF9F] text-black px-4 py-2 rounded text-sm hover:opacity-90 transition"
        >
          Start Scan
        </button>
      )}
    </div>
  );
};

export default InfoGathering;
