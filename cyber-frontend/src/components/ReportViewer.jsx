import React from "react";

const ReportViewer = ({ reportContent, onClose, onDownload }) => {
  if (!reportContent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 w-3/4 max-w-4xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">
            AI-Generated Scan Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold text-xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Report Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-gray-300">
          {/* We will later format this with Markdown, for now it's just pre-formatted text */}
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {reportContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow-lg shadow-cyan-500/30 transition flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
