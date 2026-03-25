import { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import {
  DollarIcon,
  UploadIcon,
  MaximizeIcon,
  SparklesIcon,
  LoaderIcon,
  DownloadIcon,
  LinkIcon,
  PlayIcon,
} from "../../components/icons";

const providers = [
  { id: "fal", name: "fal.ai", models: ["Kling", "Veo 3", "Flux 2 Pro"] },
  {
    id: "replicate",
    name: "Replicate",
    models: ["Luma Dream Machine", "Stable Video Diffusion"],
  },
  { id: "gmi", name: "GMI Cloud", models: ["Kling 1.5", "Runway Gen-3"] },
];

export default function GeneratePage() {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [selectedModel, setSelectedModel] = useState(providers[0].models[0]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "queued" | "processing" | "completed" | "failed"
  >("idle");
  const [resultVideo, setResultVideo] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setStatus("queued");

    // Simulate generation process
    setTimeout(() => {
      setStatus("processing");
      setTimeout(() => {
        setStatus("completed");
        setResultVideo(
          "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        );
        setIsGenerating(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Pane */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              Model Configuration
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">
                  Provider
                </label>
                <select
                  className="w-full bg-zinc-900 border cursor-pointer border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={selectedProvider.id}
                  onChange={(e) => {
                    const p = providers.find((p) => p.id === e.target.value)!;
                    setSelectedProvider(p);
                    setSelectedModel(p.models[0]);
                  }}
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id} className="cursor-pointer">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">
                  Model
                </label>
                <select
                  className="w-full bg-zinc-900 border cursor-pointer border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {selectedProvider.models.map((m) => (
                    <option key={m} value={m} className="cursor-pointer">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 flex justify-between">
                  Advanced Overrides (JSON)
                  <span className="text-[10px] text-zinc-600">Optional</span>
                </label>
                <textarea
                  className="w-full h-32 bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder='{ "guidance_scale": 7.5 }'
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <DollarIcon className="size-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Estimated Cost
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  $0.15 - $0.45
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt & Result Pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Generation Prompt
              </label>
              <textarea
                className="w-full h-40 bg-zinc-900/30 border border-zinc-800 rounded-2xl px-5 py-4 text-lg placeholder:text-zinc-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all resize-none leading-relaxed"
                placeholder="Describe the video you want to generate in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <UploadIcon className="size-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <MaximizeIcon className="size-4 mr-2" />
                  Aspect Ratio
                </Button>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className={cn(
                  "rounded-full px-8 bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all font-bold tracking-wide",
                  isGenerating && "opacity-80",
                )}
              >
                {isGenerating ? (
                  <>
                    <LoaderIcon className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result Display / Status */}
          <div className="glass rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center relative border-indigo-500/10">
            {status === "idle" && (
              <div className="text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto opacity-50">
                  <PlayIcon className="size-8 text-zinc-500" />
                </div>
                <div>
                  <h3 className="text-zinc-300 font-medium">
                    Ready to Visualize
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Enter a prompt and click generate to start your video job.
                  </p>
                </div>
              </div>
            )}

            {(status === "queued" || status === "processing") && (
              <div className="text-center space-y-6 animate-pulse">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                      {status === "queued" ? "Queued" : "Loading"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-zinc-200 font-medium">
                    {status === "queued"
                      ? "Waiting in line..."
                      : "Your video is being brewed"}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    This typically takes 30-60 seconds depending on the model.
                  </p>
                </div>
              </div>
            )}

            {status === "completed" && resultVideo && (
              <div className="w-full h-full flex flex-col group animate-in fade-in duration-700">
                <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                  <video
                    src={resultVideo}
                    className="max-h-full max-w-full"
                    controls
                    autoPlay
                    loop
                  />

                  <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      className="bg-white/10 backdrop-blur-md border-white/10 text-white rounded-full"
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      className="bg-white/10 backdrop-blur-md border-white/10 text-white rounded-full"
                    >
                      <LinkIcon className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900/50 flex items-center justify-between border-t border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="text-xs">
                      <span className="text-zinc-500 block">Status</span>
                      <span className="text-emerald-400 font-medium">
                        Success
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-500 block">Duration</span>
                      <span className="text-zinc-300">12.4s</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-500 block">Model</span>
                      <span className="text-zinc-300">{selectedModel}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setStatus("idle")}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    Clear Result
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
