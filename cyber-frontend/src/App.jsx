import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";

function App() {
  return (
    <div className="flex h-screen bg-[#0B0F14] text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4">
          {/* TEMP: show analyzer */}
          <Analyzer />
        </main>
      </div>
    </div>
  );
}

export default App;
