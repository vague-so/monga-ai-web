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
import { PlusCircle, Trash2, Settings2, Box, Layers } from "lucide-react";

export interface TemplateBase {
  id?: string;
  title: string;
  description: string;
  isActive?: boolean;
  blockStack: {
    blockId: any;
    order: number;
    inputMapping: Record<string, any>;
  }[];
}

export interface Template extends TemplateBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template;
  onSave: (data: TemplateBase) => Promise<void> | void;
}

export function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateDialogProps) {
  const isEdit = !!template?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TemplateBase>({
    title: "",
    description: "",
    isActive: true,
    blockStack: [],
  });

  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch("/api/block");
        const json = (await res.json()) as any;
        setBlocks(json?.data?.blocks || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlocks();
  }, []);

  useEffect(() => {
    if (open) {
      if (template) {
        setFormData({
          ...template,
          blockStack: template.blockStack.map((item: any) => ({
            blockId: item.blockId?.id || item.blockId,
            order: item.order,
            inputMapping: item.inputMapping || {},
          })),
        });
      } else {
        setFormData({
          title: "",
          description: "",
          isActive: true,
          blockStack: [],
        });
      }
    }
  }, [open, template]);

  const handleChange = (field: keyof TemplateBase, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBlock = () => {
    setFormData((prev) => ({
      ...prev,
      blockStack: [
        ...prev.blockStack,
        {
          blockId: "",
          order: prev.blockStack.length + 1,
          inputMapping: {},
        },
      ],
    }));
  };

  const handleRemoveBlock = (index: number) => {
    setFormData((prev) => {
      const newStack = [...prev.blockStack];
      newStack.splice(index, 1);
      // Re-order
      return {
        ...prev,
        blockStack: newStack.map((item, i) => ({ ...item, order: i + 1 })),
      };
    });
  };

  const handleStackChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newStack = [...prev.blockStack];
      newStack[index] = { ...newStack[index], [field]: value };
      if (field === "blockId") {
        newStack[index].inputMapping = {};
      }

      return { ...prev, blockStack: newStack };
    });
  };

  const handleMappingChange = (blockIndex: number, key: string, value: any) => {
    setFormData((prev) => {
      const newStack = [...prev.blockStack];
      const newMapping = { ...newStack[blockIndex].inputMapping };
      if (value === undefined || value === "") {
        delete newMapping[key];
      } else {
        newMapping[key] = value;
      }
      newStack[blockIndex].inputMapping = newMapping;
      return { ...prev, blockStack: newStack };
    });
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
      <DialogContent className="border border-zinc-800 bg-[#0a0a0b] text-zinc-100 rounded-3xl max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-black/80">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-zinc-200 to-zinc-500 flex items-center gap-2">
            <Layers className="size-6 text-indigo-500" />
            {isEdit ? "Update Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
          <div className="flex flex-col gap-8">
            {/* Header info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  Template Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Pro BG Remover"
                  className={cn(
                    "h-11 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                    "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                  )}
                />
              </div>
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe what this template does..."
                  className={cn(
                    "h-16 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600",
                    "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                  )}
                />
              </div>
            </div>

            {/* Block Stack Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <Box className="size-4 text-indigo-400" />
                    Block Stack
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Define the execution steps for this template.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBlock}
                  className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs gap-1.5 px-3 h-8 text-indigo-400 border-indigo-500/20"
                >
                  <PlusCircle className="size-3.5" />
                  Add Step
                </Button>
              </div>

              {formData.blockStack.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-800/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3 bg-zinc-900/10">
                  <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <Layers className="size-6 text-zinc-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-400">
                      No blocks added yet
                    </p>
                    <p className="text-xs text-zinc-600">
                      Templates need at least one block to be functional.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {formData.blockStack.map((item, index) => {
                    const selectedBlock = blocks.find(
                      (b) => b.id === item.blockId,
                    );
                    const parameters =
                      selectedBlock?.modelId?.config?.parameters || {};

                    return (
                      <div
                        key={index}
                        className="flex relative flex-col gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/50 transition-all shadow-lg shadow-black/20"
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveBlock(index)}
                          className="absolute cursor-pointer -right-2 -top-2 size-7 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-xl"
                        >
                          <Trash2 className="size-3.5" />
                        </button>

                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="size-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-400">
                              {index + 1}
                            </div>
                            <div className="flex-1 w-px bg-linear-to-b from-zinc-700 to-transparent min-h-[20px]" />
                          </div>

                          <div className="flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                Select Block
                              </label>
                              <Select
                                value={item.blockId}
                                onValueChange={(v) =>
                                  handleStackChange(index, "blockId", v)
                                }
                              >
                                <SelectTrigger className="h-11 w-full rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 text-sm focus:ring-4 focus:ring-indigo-500/10">
                                  <SelectValue placeholder="Choose a block..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                  {blocks.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>
                                      <div className="flex flex-col gap-0.5 py-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-sm">
                                            {b.name}
                                          </span>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500 font-mono uppercase tracking-tighter">
                                            {b.type}
                                          </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-600 italic truncate max-w-[200px]">
                                          {b.modelId?.displayName ||
                                            "Native Model"}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="w-full md:w-24 flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                Order
                              </label>
                              <input
                                type="number"
                                value={item.order}
                                onChange={(e) =>
                                  handleStackChange(
                                    index,
                                    "order",
                                    Number(e.target.value),
                                  )
                                }
                                className="h-11 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 transition-all focus:bg-zinc-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Rendering Block Parameters */}
                        {item.blockId && Object.keys(parameters).length > 0 && (
                          <div className="mt-2 ml-12 p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/40 space-y-4">
                            <div className="flex items-center gap-2 border-b border-zinc-800/50 pb-2 mb-2">
                              <Settings2 className="size-3.5 text-zinc-500" />
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Input Mapping / Config
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                              {Object.entries(parameters).map(
                                ([key, param]: [string, any]) => (
                                  <div
                                    key={key}
                                    className="flex flex-col gap-1.5"
                                  >
                                    <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                                      <span>{param.label || key}</span>
                                      <span className="text-[9px] text-zinc-600 font-mono">
                                        {param.type}
                                      </span>
                                    </label>

                                    {param.type === "boolean" ? (
                                      <Select
                                        value={
                                          item.inputMapping[key] !== undefined
                                            ? String(item.inputMapping[key])
                                            : ""
                                        }
                                        onValueChange={(v) =>
                                          handleMappingChange(
                                            index,
                                            key,
                                            v === "true"
                                              ? true
                                              : v === "false"
                                                ? false
                                                : undefined,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-9 w-full rounded-lg border-zinc-800 bg-zinc-950/40 text-xs text-zinc-300">
                                          <SelectValue placeholder="Default" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                          <SelectItem value="none">
                                            Default
                                          </SelectItem>
                                          <SelectItem value="true">
                                            True
                                          </SelectItem>
                                          <SelectItem value="false">
                                            False
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <div className="relative">
                                        <input
                                          type="text"
                                          value={item.inputMapping[key] ?? ""}
                                          onChange={(e) =>
                                            handleMappingChange(
                                              index,
                                              key,
                                              e.target.value,
                                            )
                                          }
                                          placeholder="Value or mapping..."
                                          className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 text-xs text-zinc-300 outline-none focus:border-indigo-500/40 transition-all"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {!item.blockId && (
                          <div className="mt-2 ml-12 p-8 rounded-xl border border-dashed border-zinc-800/50 bg-zinc-900/10 flex items-center justify-center">
                            <span className="text-xs text-zinc-600 italic">
                              Select a block to configure its parameters
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-zinc-800/50 bg-zinc-900/20 backdrop-blur-xl flex items-center justify-end gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              disabled={loading}
              className="px-6 rounded-xl hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={
              loading || !formData.title || formData.blockStack.length === 0
            }
            className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-bold min-w-[140px] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : isEdit ? (
              "Update Template"
            ) : (
              "Create Template"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
