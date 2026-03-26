import { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { DownloadIcon, ChevronRightIcon } from "../../components/icons";

const mockGenerations = [
  { id: "1", timestamp: "2026-03-25 14:20", provider: "fal.ai", model: "Kling", prompt: "A cinematic drone shot of a misty mountain range during sunrise...", status: "completed", cost: 0.25, duration: 18.2 },
  { id: "2", timestamp: "2026-03-25 15:05", provider: "Replicate", model: "Luma Dream Machine", prompt: "A close-up of a cyberpunk eye reflecting a neon city nightscape...", status: "completed", cost: 0.15, duration: 12.5 },
  { id: "3", timestamp: "2026-03-25 16:12", provider: "GMI Cloud", model: "Kling 1.5", prompt: "Steaming hot coffee being poured into a mug in a cozy afternoon scene...", status: "processing", cost: 0.35, duration: 0 },
  { id: "4", timestamp: "2026-03-25 17:45", provider: "fal.ai", model: "Veo 3", prompt: "A futuristic hovercar speeding through a desert canyon...", status: "failed", cost: 0.05, duration: 2.1 },
  { id: "5", timestamp: "2026-03-25 18:22", provider: "fal.ai", model: "Flux 2 Pro", prompt: "Abstract liquid gold swirling in slow motion with lens flares...", status: "completed", cost: 0.45, duration: 15.0 },
];

export default function GenerationsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl mb-8 border-indigo-500/5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100">Generation History</h2>
          <p className="text-sm text-zinc-500">View and analyze all past AI video generations.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
            {["all", "completed", "failed"].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                  filter === t ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="rounded-lg bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200">
            <DownloadIcon className="size-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Provider / Model</th>
                <th className="px-6 py-4">Prompt</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right">Duration</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {mockGenerations.filter(g => filter === "all" || g.status === filter).map((gen) => (
                <tr key={gen.id} className="group hover:bg-zinc-800/20 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-zinc-100 text-sm font-medium">{gen.timestamp.split(' ')[1]}</span>
                    <span className="text-zinc-500 text-[10px] block font-mono">{gen.timestamp.split(' ')[0]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-zinc-300 text-sm font-semibold">{gen.provider}</span>
                    <span className="text-zinc-500 text-[11px] block">{gen.model}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-400 text-sm line-clamp-2 max-w-md leading-relaxed">
                      {gen.prompt}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      gen.status === "completed" && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                      gen.status === "failed" && "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                      gen.status === "processing" && "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    )}>
                      {gen.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-mono text-zinc-300">
                    ${gen.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-zinc-400 font-mono">
                    {gen.duration > 0 ? `${gen.duration}s` : "--"}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-zinc-600 group-hover:text-indigo-400 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing {mockGenerations.length} total generations</span>
          <div className="flex gap-1.5 items-center">
            <Button variant="ghost" size="xs" disabled className="text-zinc-600 disabled:opacity-30">Previous</Button>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-200 border border-zinc-700 font-bold">1</span>
            </div>
            <Button variant="ghost" size="xs" disabled className="text-zinc-600 disabled:opacity-30">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
