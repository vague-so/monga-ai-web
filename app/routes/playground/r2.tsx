import { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { MenuIcon as SearchIcon, PieIcon as PieChart, PlayIcon as Play, MoreIcon as MoreVertical } from "../../components/icons";

const mockFiles = [
  { id: "f1", name: "mountain_sunrise.mp4", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400", size: "2.4 MB", date: "2026-03-25", url: "#" },
  { id: "f2", name: "cyber_eye_closeup.mp4", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400", size: "1.8 MB", date: "2026-03-25", url: "#" },
  { id: "f3", name: "liquid_gold_vortex.mp4", thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400", size: "3.2 MB", date: "2026-03-24", url: "#" },
  { id: "f4", name: "hovercar_race_desert.mp4", thumbnail: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400", size: "4.5 MB", date: "2026-03-24", url: "#" },
  { id: "f5", name: "steaming_coffee_pour.mp4", thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400", size: "1.2 MB", date: "2026-03-23", url: "#" },
  { id: "f6", name: "urban_rain_night.mp4", thumbnail: "https://images.unsplash.com/photo-1511316695145-4992006ffddb?auto=format&fit=crop&q=80&w=400", size: "2.1 MB", date: "2026-03-23", url: "#" },
  { id: "f7", name: "ocean_waves_droneshot.mp4", thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&q=80&w=400", size: "5.8 MB", date: "2026-03-22", url: "#" },
  { id: "f8", name: "forest_fairies_fantasy.mp4", thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400", size: "3.7 MB", date: "2026-03-22", url: "#" },
];

export default function R2BrowserPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFiles = mockFiles.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100 font-heading">R2 Object Browser</h2>
          <p className="text-sm text-zinc-500">Preview and manage files stored in the Monga R2 bucket.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search files..."
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="rounded-xl bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200">
            <PieChart className="size-4 mr-2" />
            Storage Stats
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="group relative glass rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="aspect-video relative bg-zinc-950">
              <img 
                src={file.thumbnail} 
                alt={file.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/20 backdrop-blur-[2px]">
                <button className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50 transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="size-6 fill-current" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{file.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-500">{file.size}</span>
                  <span className="text-[11px] text-zinc-400">{file.date}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="xs" className="flex-1 bg-zinc-800/50 text-[10px] font-bold tracking-widest uppercase border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-100 transition-all">
                  Copy URL
                </Button>
                <Button variant="outline" size="xs" className="flex-1 bg-zinc-800/50 text-[10px] font-bold tracking-widest uppercase border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-100 transition-all">
                  Download
                </Button>
              </div>
            </div>
            
            <button className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/5 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      
      {filteredFiles.length === 0 && (
        <div className="py-24 text-center glass rounded-3xl animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 opacity-50">
            <SearchIcon className="size-8 text-zinc-600" />
          </div>
          <h3 className="text-zinc-400 font-medium">No results found</h3>
          <p className="text-zinc-600 text-sm mt-1">Try adjusting your search terms to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
