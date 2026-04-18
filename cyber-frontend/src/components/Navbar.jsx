import { Bell, Search, Shield, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-300">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-[0.24em]">
              Mission Control
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              CyberVision Command Center
            </h1>
            <p className="text-sm text-slate-400">
              Unified security posture, analysis workflow, and intelligence
              visibility.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-lg shadow-slate-950/20">
            <Search className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-400">
              Search assets, reports, incidents
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              <Sparkles className="h-4 w-4" />
              AI monitoring active
            </div>

            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
