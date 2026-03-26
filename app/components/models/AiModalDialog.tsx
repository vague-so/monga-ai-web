"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface AIModelBase {
  id?: string;
  providerId: string;
  modelId: string;
  displayName: string;
  type: string;
  costPerRun: number;
  isActive: boolean;
  config: Record<string, any>;
}

export interface AIModel extends AIModelBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: AIModelBase;
  onSave: (data: AIModelBase) => Promise<void> | void;
}

export function ModelDialog({
  open,
  onOpenChange,
  model,
  onSave,
}: ModelDialogProps) {
  const isEdit = !!model?.id;
  const [loading, setLoading] = useState(false);
  const defaultConfig = {
    api_path: "fal-ai/birefnet",
    parameters: {
      image_url: { type: "text", label: "Upload Image", required: true },
      mask_only: {
        type: "boolean",
        label: "Get Mask Only",
        default: false,
        required: false,
      },
    },
  };
  const [formData, setFormData] = useState<AIModelBase>({
    providerId: "",
    modelId: "",
    displayName: "",
    type: "text-to-image",
    costPerRun: 0,
    isActive: true,
    config: defaultConfig,
  });
  const [configText, setConfigText] = useState("");

  useEffect(() => {
    if (open) {
      if (model) {
        setFormData({ ...model, config: model.config || {} });
        setConfigText(JSON.stringify(model.config || {}, null, 2));
      } else {
        setFormData({
          providerId: "",
          modelId: "",
          displayName: "",
          type: "text-to-image",
          costPerRun: 0,
          isActive: true,
          config: defaultConfig,
        });
        setConfigText(JSON.stringify(defaultConfig, null, 2));
      }
    }
  }, [open, model]);

  const handleChange = (field: keyof AIModelBase, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-zinc-800 bg-[#0a0a0b] text-zinc-100 rounded-2xl max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/80">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
            {isEdit ? "Update AI Model" : "Create AI Model"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-5 py-2">
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              placeholder="e.g. GPT-4o"
              className={cn(
                "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
              )}
            />
          </div>

          {/* Model ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Model ID
            </label>
            <input
              type="text"
              value={formData.modelId}
              onChange={(e) => handleChange("modelId", e.target.value)}
              placeholder="e.g. gpt-4o"
              disabled={isEdit}
              className={cn(
                "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            />
          </div>

          {/* Provider */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Provider
            </label>
            <Select
              value={formData.providerId}
              onValueChange={(v) => handleChange("providerId", v)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border-zinc-700/50 bg-zinc-900/50 text-zinc-100 focus:ring-indigo-500/30">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="fal">Fal.ai</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="stability">Stability</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
                <SelectItem value="replicate">Replicate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Model Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(v) => handleChange("type", v)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border-zinc-700/50 bg-zinc-900/50 text-zinc-100 focus:ring-indigo-500/30">
                <SelectValue placeholder="Select Model Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="text-to-image">Text → Image</SelectItem>
                <SelectItem value="image-to-image">Image → Image</SelectItem>
                <SelectItem value="text-to-video">Text → Video</SelectItem>
                <SelectItem value="image-to-video">Image → Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cost Per Run */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Cost Per Run (cr)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.costPerRun}
              onChange={(e) =>
                handleChange("costPerRun", parseFloat(e.target.value))
              }
              placeholder="0.00"
              className={cn(
                "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
              )}
            />
          </div>

          {/* Active Status */}
          <label className="flex col-span-2 items-center gap-3 cursor-pointer pt-2 group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border border-zinc-600 bg-zinc-900/50 rounded-md peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center group-hover:border-indigo-400">
                <CheckIcon
                  className="size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  strokeWidth={3}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
              Model is Active
            </span>
          </label>

          {/* Config (JSON) */}
          <div className="flex flex-col col-span-2 gap-1.5 pt-2 border-t border-zinc-800/50 mt-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-2">
              Config (JSON)
            </label>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              onBlur={() => {
                try {
                  handleChange("config", JSON.parse(configText));
                } catch (e) {
                  // ignore
                }
              }}
              rows={6}
              className={cn(
                "rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 font-mono",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
              )}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t border-zinc-800/50">
          <DialogClose asChild>
            <Button
              variant="ghost"
              disabled={loading}
              className="px-6 rounded-xl hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-semibold tracking-wide transition-all active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Saving...</span>
            ) : isEdit ? (
              "Update Model"
            ) : (
              "Create Model"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
