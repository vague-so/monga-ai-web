import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

const stats = [
  {
    name: "Total Spend",
    value: "$1,245.82",
    change: "+12.5%",
    color: "indigo",
  },
  { name: "Average Cost", value: "$0.32", change: "-2.1%", color: "emerald" },
  { name: "Active Providers", value: "3", change: "0", color: "amber" },
  { name: "Total Jobs", value: "4,120", change: "+45", color: "rose" },
];

const providerSpend = [
  { name: "fal.ai", spend: 742.5, color: "bg-indigo-500", icon: "✨" },
  { name: "Replicate", spend: 320.15, color: "bg-purple-500", icon: "💎" },
  { name: "GMI Cloud", spend: 183.17, color: "bg-emerald-500", icon: "⚡" },
];

export default function CostTrackerPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100 font-heading">
            Cost Analysis
          </h2>
          <p className="text-sm text-zinc-500">
            Real-time spend tracking and resource utilization metrics.
          </p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 shadow-inner">
          {["7D", "30D", "90D", "All"].map((p) => (
            <button
              key={p}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                p === "30D"
                  ? "bg-zinc-800 text-zinc-100 shadow-md border border-zinc-700/50"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative glass p-6 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all border-zinc-800/50"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {stat.name}
              </span>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-black text-zinc-100 tracking-tighter">
                  {stat.value}
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1",
                    stat.change.startsWith("+")
                      ? "text-emerald-500 bg-emerald-500/10"
                      : "text-rose-500 bg-rose-500/10",
                  )}
                >
                  {stat.change.startsWith("+") ? (
                    <ChevronUp className="size-2.5" />
                  ) : (
                    <ChevronDown className="size-2.5" />
                  )}
                  {stat.change.replace("+", "").replace("-", "")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Provider Breakdown Card */}
        <div className="lg:col-span-1 glass p-8 rounded-3xl space-y-8 border-zinc-800/50">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-200">
              Provider Breakdown
            </h3>
            <p className="text-xs text-zinc-500">
              Distribution of total spend per infrastructure partner.
            </p>
          </div>

          <div className="space-y-6">
            {providerSpend.map((prov) => {
              const percentage = (prov.spend / 1245.82) * 100;
              return (
                <div key={prov.name} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <span className="text-sm">{prov.icon}</span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">
                        {prov.name}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-zinc-100">
                      ${prov.spend.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50 p-px">
                    <div
                      className={`h-full ${prov.color} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,0,0,0.3)] shadow-${prov.color}/20`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-800/50">
            <Button
              variant="ghost"
              className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-widest"
            >
              View Detailed Split
            </Button>
          </div>
        </div>

        {/* Dynamic Spend Trend Chart Placeholder */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden border-zinc-800/50">
          <div className="space-y-1 relative z-10">
            <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-tight">
              Daily Spend Trend
            </h3>
            <p className="text-xs text-zinc-500">
              Showing historical data for the past 30 days.
            </p>
          </div>

          <div className="mt-12 h-[260px] w-full relative flex items-end justify-between gap-1 group">
            <div className="absolute inset-0 border-b border-zinc-800/50 z-0" />
            <div className="absolute inset-x-0 bottom-[25%] border-b border-zinc-800/20 z-0" />
            <div className="absolute inset-x-0 bottom-[50%] border-b border-zinc-800/20 z-0" />
            <div className="absolute inset-x-0 bottom-[75%] border-b border-zinc-800/20 z-0" />

            {[
              12, 45, 32, 60, 48, 25, 35, 82, 55, 42, 38, 50, 65, 75, 45, 30,
              42, 95, 60, 48, 55, 42, 68, 72, 58, 45, 32, 60, 48, 25,
            ].map((val, i) => (
              <div
                key={i}
                className="w-full relative z-10 bg-linear-to-t from-indigo-500/20 to-indigo-500/80 rounded-t-sm hover:from-white/30 hover:to-white/90 transition-all cursor-help"
                style={{ height: `${val}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-black rounded opacity-0 group-hover:block transition-all shadow-xl pointer-events-none hidden">
                  ${(val * 0.45).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Mar 01</span>
            <span>Mar 15</span>
            <span>Mar 30</span>
          </div>
        </div>
      </div>
    </div>
  );
}
