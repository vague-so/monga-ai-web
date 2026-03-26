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

export interface BlockBase {
  id?: string;
  name: string;
  type: string;
  modelId: string;
  inputSchema: Record<string, any>;
  defaults: Record<string, any>;
}

export interface Block extends BlockBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface BlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: BlockBase;
  onSave: (data: BlockBase) => Promise<void> | void;
}

export function BlockDialog({
  open,
  onOpenChange,
  model,
  onSave,
}: BlockDialogProps) {
  const isEdit = !!model?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlockBase>({
    name: "",
    type: "text-to-image",
    modelId: "",
    inputSchema: {
        prompt: "text",
        aspect_ratio: "enum",
        num_inference_steps: "number"
    },
    defaults: {
        prompt: "A futuristic city in Pakistan with neon lights",
        aspect_ratio: "16:9",
        num_inference_steps: 4
    }
  });

  const [models, setModels] = useState<any[]>([]);
  const [schemaText, setSchemaText] = useState("");
  const [defaultsText, setDefaultsText] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/model"); // assuming relative fetch works or the previous absolute one
        const json = await res.json() as any;
        setModels(json?.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    if (open) {
      if (model) {
        setFormData({
            ...model,
            inputSchema: model.inputSchema || {},
            defaults: model.defaults || {}
        });
        setSchemaText(JSON.stringify(model.inputSchema || {}, null, 2));
        setDefaultsText(JSON.stringify(model.defaults || {}, null, 2));
      } else {
        const defaultSchema = {
            prompt: "text",
            aspect_ratio: "enum",
            num_inference_steps: "number"
        };
        const defaultDefaults = {
            prompt: "A futuristic city in Pakistan with neon lights",
            aspect_ratio: "16:9",
            num_inference_steps: 4
        };
        setFormData({
          name: "",
          type: "text-to-image",
          modelId: "",
          inputSchema: defaultSchema,
          defaults: defaultDefaults,
        });
        setSchemaText(JSON.stringify(defaultSchema, null, 2));
        setDefaultsText(JSON.stringify(defaultDefaults, null, 2));
      }
    }
  }, [open, model]);

  const handleChange = (field: keyof BlockBase, value: any) => {
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
      <DialogContent className="border border-zinc-800 bg-[#0a0a0b] text-zinc-100 rounded-2xl max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/80">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
            {isEdit ? "Update Block" : "Create Block"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Block Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Block Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Creative Image Generator"
              className={cn(
                "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
              )}
            />
          </div>

          {/* Model ID - Select from API */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Underlying Model
            </label>
            <Select
              value={formData.modelId}
              onValueChange={(v) => handleChange("modelId", v)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border-zinc-700/50 bg-zinc-900/50 text-zinc-100 focus:ring-indigo-500/30">
                <SelectValue placeholder="Select Underlying Model" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.displayName || m.name || m.model || m.id}
                  </SelectItem>
                ))}
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

          {/* Input Schema */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Input Schema (JSON)
            </label>
            <textarea
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              onBlur={() => {
                try {
                  handleChange("inputSchema", JSON.parse(schemaText));
                } catch (e) {
                  // ignore
                }
              }}
              rows={4}
              className={cn(
                "rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 font-mono",
                "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
              )}
            />
          </div>

          {/* Defaults */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Defaults (JSON)
            </label>
            <textarea
              value={defaultsText}
              onChange={(e) => setDefaultsText(e.target.value)}
              onBlur={() => {
                try {
                  handleChange("defaults", JSON.parse(defaultsText));
                } catch (e) {
                  // ignore
                }
              }}
              rows={4}
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
              "Update Block"
            ) : (
              "Create Block"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
