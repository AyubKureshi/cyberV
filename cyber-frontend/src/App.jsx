import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";
import InfoGathering from "./pages/InfoGathering";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-80">
        <Navbar />

        <main className="px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/info" element={<InfoGathering />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
