const Navbar = () => {
  return (
    <div className="h-14 bg-[#121821] border-b border-[#1F2937] flex items-center justify-between px-4">
      <h1 className="text-sm text-gray-400">
        AI-Powered Vulnerability Scanner
      </h1>

      <div className="text-xs text-gray-500">
        Status: <span className="text-[#00FF9F]">Active</span>
      </div>
    </div>
  );
};

export default Navbar;
