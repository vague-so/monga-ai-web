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
import { XIcon, CheckIcon, PlusCircle, Trash2 } from "lucide-react";
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
    api_path: "",
    parameters: {},
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

  interface ParamProp {
    _id: string;
    key: string;
    value: string;
  }
  interface ParamRow {
    _id: string;
    name: string;
    propsList: ParamProp[];
  }
  const [paramsList, setParamsList] = useState<ParamRow[]>([]);

  useEffect(() => {
    if (open) {
      if (model) {
        setFormData({ ...model, config: model.config || {} });
        const pObj = model.config?.parameters || {};
        setParamsList(
          Object.entries(pObj).map(
            ([paramName, paramConfig]: [string, any]) => {
              const mergedConfig = {
                ...paramConfig,
                required: paramConfig?.required ?? false,
              };
              return {
                _id: Math.random().toString(36).substring(7),
                name: paramName,
                propsList: Object.entries(mergedConfig).map(([k, v]) => ({
                  _id: Math.random().toString(36).substring(7),
                  key: k,
                  value: typeof v === "object" ? JSON.stringify(v) : String(v),
                })),
              };
            },
          ),
        );
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
        setParamsList([]);
      }
    }
  }, [open, model]);

  // Sync paramsList to formData.config.parameters
  useEffect(() => {
    const parameters: Record<string, any> = {};
    paramsList.forEach((param) => {
      if (!param.name.trim()) return;
      const propsObj: Record<string, any> = {};
      param.propsList.forEach((prop) => {
        if (!prop.key.trim()) return;
        let val: any = prop.value;
        if (val === "true") val = true;
        else if (val === "false") val = false;
        else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val);
        propsObj[prop.key] = val;
      });

      // Ensure strict backend validation properties exist
      if (typeof propsObj.required !== "boolean") {
        propsObj.required = false;
      }

      parameters[param.name] = propsObj;
    });

    setFormData((prev) => ({
      ...prev,
      config: { ...(prev.config || {}), parameters },
    }));
  }, [paramsList]);

  const addParameter = () => {
    setParamsList((prev) => [
      ...prev,
      {
        _id: Math.random().toString(36).substring(7),
        name: `param_${prev.length + 1}`,
        propsList: [
          {
            _id: Math.random().toString(36).substring(7),
            key: "type",
            value: "text",
          },
          {
            _id: Math.random().toString(36).substring(7),
            key: "label",
            value: "Label",
          },
          {
            _id: Math.random().toString(36).substring(7),
            key: "required",
            value: "false",
          },
        ],
      },
    ]);
  };

  const updateParamName = (index: number, name: string) => {
    setParamsList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name };
      return copy;
    });
  };

  const removeParam = (index: number) => {
    setParamsList((prev) => prev.filter((_, i) => i !== index));
  };

  const addProp = (paramIndex: number) => {
    setParamsList((prev) => {
      const copy = [...prev];
      copy[paramIndex] = {
        ...copy[paramIndex],
        propsList: [
          ...copy[paramIndex].propsList,
          {
            _id: Math.random().toString(36).substring(7),
            key: "new_key",
            value: "",
          },
        ],
      };
      return copy;
    });
  };

  const updateProp = (
    paramIndex: number,
    propIndex: number,
    field: keyof ParamProp,
    value: string,
  ) => {
    setParamsList((prev) => {
      const copy = [...prev];
      const propsCopy = [...copy[paramIndex].propsList];
      propsCopy[propIndex] = { ...propsCopy[propIndex], [field]: value };
      copy[paramIndex] = { ...copy[paramIndex], propsList: propsCopy };
      return copy;
    });
  };

  const removeProp = (paramIndex: number, propIndex: number) => {
    setParamsList((prev) => {
      const copy = [...prev];
      copy[paramIndex] = {
        ...copy[paramIndex],
        propsList: copy[paramIndex].propsList.filter((_, i) => i !== propIndex),
      };
      return copy;
    });
  };

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

          {/* Config Setup */}
          <div className="flex flex-col col-span-2 gap-4 pt-4 border-t border-zinc-800/50 mt-2">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
              Model Configuration
            </h3>

            {/* API Path */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                API Path
              </label>
              <input
                type="text"
                value={formData.config?.api_path || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    config: { ...prev.config, api_path: e.target.value },
                  }))
                }
                placeholder="e.g. fal-ai/birefnet"
                className={cn(
                  "h-11 rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 font-mono",
                  "focus:border-indigo-500/60 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10",
                )}
              />
            </div>

            {/* Dynamic Parameters Header */}
            <div className="flex items-center justify-between mt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Parameters
                </label>
                <p className="text-zinc-500 text-xs">
                  Define fields needed by the model.
                </p>
              </div>
              <Button
                type="button"
                onClick={addParameter}
                size="sm"
                className="h-8 bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-zinc-100 px-3 rounded-lg border border-zinc-700/50"
              >
                <PlusCircle className="size-4 mr-1.5 text-indigo-400" />
                Add Param
              </Button>
            </div>

            {/* Parameters List */}
            <div className="flex flex-col gap-3">
              {paramsList.length === 0 && (
                <div className="text-center py-6 border border-dashed border-zinc-800/60 rounded-xl bg-zinc-900/20">
                  <p className="text-zinc-500 text-sm">
                    No parameters defined.
                  </p>
                </div>
              )}
              {paramsList.map((param, index) => (
                <div
                  key={param._id}
                  className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 group/param relative"
                >
                  <div className="flex items-center gap-3 pr-8">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                      Parameter Name
                    </label>
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParamName(index, e.target.value)}
                      placeholder="e.g. image_url"
                      className="flex-1 h-8 bg-transparent border-b border-zinc-700/50 text-indigo-300 font-mono text-sm outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeParam(index)}
                    className="absolute top-3 cursor-pointer right-3 p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div className="flex flex-col gap-2 mt-2">
                    {param.propsList.map((prop, propIndex) => (
                      <div key={prop._id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={prop.key}
                          onChange={(e) =>
                            updateProp(index, propIndex, "key", e.target.value)
                          }
                          placeholder="Property (e.g. type)"
                          disabled={prop.key === "required"}
                          className={cn(
                            "w-1/3 h-8 rounded border border-zinc-700/50 bg-zinc-950/50 px-2 text-xs text-zinc-300 font-mono outline-none focus:border-indigo-500/60",
                            prop.key === "required" &&
                              "opacity-60 cursor-not-allowed bg-zinc-900/50 border-zinc-800",
                          )}
                        />
                        <span className="text-zinc-600">:</span>
                        {prop.key === "required" ? (
                          <Select
                            value={prop.value}
                            onValueChange={(v) =>
                              updateProp(index, propIndex, "value", v)
                            }
                          >
                            <SelectTrigger className="flex-1 h-8 rounded border border-zinc-700/50 bg-zinc-950/50 px-2 text-xs text-zinc-100 outline-none focus:border-indigo-500/60">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                              <SelectItem value="true">true</SelectItem>
                              <SelectItem value="false">false</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <input
                            type="text"
                            value={prop.value}
                            onChange={(e) =>
                              updateProp(
                                index,
                                propIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder='Value (e.g. "text", true, 42)'
                            className="flex-1 h-8 rounded border border-zinc-700/50 bg-zinc-950/50 px-2 text-xs text-zinc-100 outline-none focus:border-indigo-500/60"
                          />
                        )}
                        <div className="w-5 flex justify-center">
                          {prop.key !== "required" && (
                            <button
                              type="button"
                              onClick={() => removeProp(index, propIndex)}
                              className="p-1 text-zinc-600 cursor-pointer hover:text-rose-400 opacity-0 group-hover/param:opacity-100 transition-opacity"
                            >
                              <XIcon className="size-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addProp(index)}
                      variant="ghost"
                      className="h-7 self-start text-xs cursor-pointer text-zinc-500 hover:text-indigo-400 mt-1 pl-0"
                    >
                      + Add Property
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
