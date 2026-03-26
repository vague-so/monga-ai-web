import React from "react";
import { type Column } from "@/components/shared/CustomTable";
import { TypeBadge, ActiveDot } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { type AIModel } from "@/components/models/AiModalDialog";

export function useModelColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (model: AIModel) => void;
  onDelete: (model: AIModel) => void;
}): Column<AIModel>[] {
  return [
    {
      key: "displayName",
      header: "Display Name",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-100 text-sm font-semibold">
          {row.displayName}
        </span>
      ),
    },
    {
      key: "modelId",
      header: "Model ID",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-400 text-xs font-mono bg-zinc-800/60 px-2 py-0.5 rounded">
          {row.modelId}
        </span>
      ),
    },
    {
      key: "providerId",
      header: "Provider",
      sortable: true,
      filter: {
        label: "Provider",
        options: [
          { label: "OpenAI", value: "openai" },
          { label: "Anthropic", value: "anthropic" },
          { label: "Google", value: "google" },
          { label: "Stability", value: "stability" },
          { label: "Meta", value: "meta" },
          { label: "Replicate", value: "replicate" },
        ],
      },
      cell: (row) => (
        <span className="text-zinc-300 text-sm font-medium capitalize">
          {row.providerId}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      align: "center",
      filter: {
        label: "Type",
        options: [
          { label: "Text to Image", value: "text-to-image" },
          { label: "Image to Image", value: "image-to-image" },
          { label: "Text to Video", value: "text-to-video" },
          { label: "Image to Video", value: "image-to-video" },
        ],
      },
      cell: (row) => <TypeBadge type={row.type} />,
    },
    {
      key: "config",
      header: "API Path",
      sortable: false,
      cell: (row) => (
        <span className="text-zinc-500 text-xs font-mono bg-zinc-800/40 px-2 py-0.5 rounded truncate max-w-[150px] inline-block">
          {row.config?.api_path || "{...}"}
        </span>
      ),
    },
    {
      key: "costPerRun",
      header: "Cost / Run",
      sortable: true,
      align: "right",
      cell: (row) => (
        <span className="text-sm font-mono">
          <span className="text-indigo-300 font-semibold">
            {row.costPerRun}
          </span>
          <span className="text-zinc-500 text-[11px] ml-1">cr</span>
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      align: "right",
      filter: {
        label: "Status",
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
      cell: (row) => <ActiveDot active={row.isActive} />,
    },
    {
      key: "createdAt",
      header: "Added",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-500 text-xs">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "80px",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2  transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit Model"
            className="p-1.5 text-zinc-500 hover:text-indigo-400 cursor-pointer hover:bg-zinc-800/80 rounded-lg transition-all"
          >
            <Edit className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            title="Delete Model"
            className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
