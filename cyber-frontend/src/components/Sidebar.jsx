import { Shield, Search, BarChart3 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#121821] border-r border-[#1F2937] flex flex-col">
      {/* Logo */}
      <div className="p-4 text-lg font-bold text-[#00FF9F] border-b border-[#1F2937]">
        CyberVision
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-2">
        <div className="flex items-center gap-2 p-2 rounded hover:bg-[#1F2937] cursor-pointer">
          <BarChart3 size={18} />
          Dashboard
        </div>

        <div className="flex items-center gap-2 p-2 rounded bg-[#1F2937] cursor-pointer">
          <Search size={18} />
          Analyzer
        </div>

        <div className="flex items-center gap-2 p-2 rounded hover:bg-[#1F2937] cursor-pointer">
          <Shield size={18} />
          Info Gathering
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
