import {
  Activity,
  LayoutDashboard,
  Radar,
  Search,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    to: "/",
    label: "Dashboard",
    description: "Executive overview",
    icon: LayoutDashboard,
  },
  {
    to: "/analyzer",
    label: "Analyzer",
    description: "Assess site exposure",
    icon: Search,
  },
  {
    to: "/info",
    label: "Info Gathering",
    description: "Enrich target intel",
    icon: Radar,
  },
];

const Sidebar = () => {
  return (
    <aside className="border-b border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <div className="flex h-full flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-emerald-400/20 via-cyan-400/10 to-transparent p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                Platform
              </p>
              <h2 className="text-xl font-semibold text-white">CyberVision</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Security operations workspace for visibility, triage, and response
            readiness.
          </p>
        </div>

        <nav className="space-y-3">
          {navigationItems.map(({ to, label, description, icon: Icon }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <div
                  className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 transition ${
                    isActive
                      ? "border-emerald-400/30 bg-emerald-400/12 text-white shadow-lg shadow-emerald-950/25"
                      : "border-white/8 bg-white/3 text-slate-300 hover:border-white/15 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3 ${
                      isActive
                        ? "bg-emerald-300/15 text-emerald-200"
                        : "bg-slate-800 text-slate-400 group-hover:text-slate-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-3 text-slate-200">
            <Activity className="h-5 w-5 text-cyan-300" />
            <h3 className="font-medium">Operations Health</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span>Coverage</span>
              <span className="font-semibold text-white">97.2%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[97.2%] rounded-full bg-linear-to-r from-emerald-400 to-cyan-400" />
            </div>
            <p className="text-slate-400">
              Primary sensors and workflows are within expected thresholds.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
