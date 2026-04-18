import Card from "../components/Card";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Radar,
  Shield,
  TimerReset,
} from "lucide-react";

const overviewMetrics = [
  {
    title: "Active Assessments",
    value: "128",
    change: "+12% vs last week",
    accent: "from-cyan-400/30 to-cyan-400/5",
    icon: Radar,
  },
  {
    title: "Critical Findings",
    value: "09",
    change: "-3 resolved today",
    accent: "from-rose-400/30 to-rose-400/5",
    icon: AlertTriangle,
  },
  {
    title: "Protected Assets",
    value: "94%",
    change: "+6% hardening coverage",
    accent: "from-emerald-400/30 to-emerald-400/5",
    icon: Shield,
  },
  {
    title: "Avg. Response Time",
    value: "18m",
    change: "-5m from prior cycle",
    accent: "from-amber-300/30 to-amber-300/5",
    icon: TimerReset,
  },
];

const threatDistribution = [
  { label: "Critical", value: 18, width: "18%", tone: "bg-rose-400" },
  { label: "High", value: 27, width: "27%", tone: "bg-orange-400" },
  { label: "Medium", value: 32, width: "32%", tone: "bg-amber-300" },
  { label: "Low", value: 23, width: "23%", tone: "bg-emerald-400" },
];

const activityFeed = [
  {
    title: "Public-facing portal rescanned",
    detail: "Analyzer completed SSL and header verification for app.cyber.local",
    time: "4 min ago",
    status: "Secure",
  },
  {
    title: "New subdomain intelligence added",
    detail: "Info Gathering discovered 6 newly indexed hosts for the target scope",
    time: "19 min ago",
    status: "Review",
  },
  {
    title: "Threat posture score improved",
    detail: "Remediation workflow closed 3 medium-risk items across production assets",
    time: "1 hr ago",
    status: "Resolved",
  },
];

const analystQueue = [
  { team: "Tier 1 Triage", open: 14, sla: "Healthy" },
  { team: "AppSec Review", open: 6, sla: "At risk" },
  { team: "Incident Response", open: 2, sla: "Healthy" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-cyan-950/60">
          <div className="relative space-y-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-24 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
                  <Activity className="h-3.5 w-3.5" />
                  Live Security Overview
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Professional visibility into your cybersecurity operations.
                  </h2>
                  <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    Track active assessments, uncover risk hotspots, and keep
                    response teams aligned from a single command dashboard.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-88">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Posture Score
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">92</p>
                  <p className="mt-2 text-sm text-emerald-300">
                    Strong protection across monitored assets
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Coverage
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">41</p>
                  <p className="mt-2 text-sm text-cyan-300">
                    Internet-facing assets currently monitored
                  </p>
                </div>
              </div>
            </div>

            <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewMetrics.map(({ title, value, change, accent, icon: Icon }) => (
                <div
                  key={title}
                  className={`rounded-2xl border border-white/10 bg-linear-to-br ${accent} p-px`}
                >
                  <div className="rounded-2xl bg-slate-950/90 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{title}</p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                          {value}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-300">{change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Security Posture">
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="font-medium text-white">Environment stable</p>
                  <p className="text-sm text-emerald-100/80">
                    No active critical outage indicators detected.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {threatDistribution.map(({ label, value, width, tone }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-medium text-white">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${tone}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-200">
                <Globe className="h-4 w-4 text-cyan-300" />
                Exposure trend
              </div>
              <p className="text-sm leading-6 text-slate-400">
                External attack surface is concentrated in three customer-facing
                systems. Prioritize certificate hygiene and header hardening on
                those assets this cycle.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {activityFeed.map(({ title, detail, time, status }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium text-white">{title}</p>
                  <p className="text-sm leading-6 text-slate-400">{detail}</p>
                </div>
                <div className="min-w-fit space-y-2">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                    {status}
                  </span>
                  <p className="text-right text-xs text-slate-500">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6">
          <Card title="Analyst Queue">
            <div className="space-y-3">
              {analystQueue.map(({ team, open, sla }) => (
                <div
                  key={team}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-white">{team}</p>
                    <p className="text-sm text-slate-400">{open} open items</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      sla === "Healthy"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-300/10 text-amber-200"
                    }`}
                  >
                    {sla}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Priority Actions">
            <div className="space-y-4">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <div>
                  <p className="font-medium text-white">Run deep scan</p>
                  <p className="text-sm text-slate-400">
                    Launch a fresh analysis for a high-value target.
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-cyan-300" />
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-left transition hover:bg-white/6"
              >
                <div>
                  <p className="font-medium text-white">Review intel feed</p>
                  <p className="text-sm text-slate-400">
                    Validate new domains and update target scope.
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-cyan-300" />
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
