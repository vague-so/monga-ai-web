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
  modelId: any;
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
    defaults: {},
  });

  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/model");
        const json = (await res.json()) as any;
        setModels(json?.data?.models || []);
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
          modelId: model.modelId?.id || model.modelId,
          defaults: model.defaults || {},
        });
      } else {
        setFormData({
          name: "",
          type: "text-to-image",
          modelId: "",
          defaults: {},
        });
      }
    }
  }, [open, model]);

  const handleDefaultChange = (key: string, value: any) => {
    setFormData((prev) => {
      const newDefaults = { ...prev.defaults };
      if (value === undefined) {
        delete newDefaults[key];
      } else {
        newDefaults[key] = value;
      }
      return { ...prev, defaults: newDefaults };
    });
  };

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

  const selectedModelData = models.find((m) => m.id === formData.modelId);
  const selectedModelConfig = selectedModelData?.config;

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

          {/* Dynamic Model Parameters */}
          {selectedModelConfig && selectedModelConfig.parameters && Object.keys(selectedModelConfig.parameters).length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800/50 mt-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Configure Default Parameters
              </h3>
              {Object.entries(selectedModelConfig.parameters).map(([key, param]: [string, any]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">
                    {param.label || key} <span className="text-zinc-500 text-xs ml-2 uppercase opacity-80">({param.type})</span>
                  </label>
                  {param.type === "boolean" ? (
                    <Select
                      value={formData.defaults[key] !== undefined ? String(formData.defaults[key]) : "unset"}
                      onValueChange={(v) => {
                        if (v === "unset") handleDefaultChange(key, undefined);
                        else handleDefaultChange(key, v === "true");
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl border-zinc-700/50 bg-zinc-900/50 text-zinc-100 focus:ring-indigo-500/30">
                        <SelectValue placeholder="Not Set" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                        <SelectItem value="unset">Not Set (Default)</SelectItem>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : param.type === "number" ? (
                    <input
                      type="number"
                      value={formData.defaults[key] ?? ""}
                      onChange={(e) => handleDefaultChange(key, e.target.value === "" ? undefined : Number(e.target.value))}
                      placeholder={`e.g. ${param.default ?? ""}`}
                      className={cn(
                        "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                        "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.defaults[key] ?? ""}
                      onChange={(e) => handleDefaultChange(key, e.target.value === "" ? undefined : e.target.value)}
                      placeholder={`e.g. ${param.default ?? ""}`}
                      className={cn(
                        "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                        "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
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
