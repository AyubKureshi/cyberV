import { Link, useLocation } from "react-router-dom";
import { Shield, Search, BarChart3 } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <BarChart3 size={18} /> },
    { name: "Analyzer", path: "/analyzer", icon: <Search size={18} /> },
    { name: "Info Gathering", path: "/info", icon: <Shield size={18} /> },
  ];

  return (
    <div className="w-64 bg-[#121821] border-r border-[#1F2937] flex flex-col">
      {/* Logo */}
      <div className="p-4 text-lg font-bold text-[#00FF9F] border-b border-[#1F2937]">
        CyberVision
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
              location.pathname === item.path
                ? "bg-[#1F2937]"
                : "hover:bg-[#1F2937]"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
