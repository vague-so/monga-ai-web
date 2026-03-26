import React from "react";
import { type Column } from "@/components/shared/CustomTable";
import { TypeBadge } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { type Block } from "@/components/blocks/BlockDialog";

export function useBlockColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (model: Block) => void;
  onDelete: (model: Block) => void;
}): Column<Block>[] {
  return [
    {
      key: "name",
      header: "Block Name",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-100 text-sm font-semibold">{row.name}</span>
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
          { label: "Text to Text", value: "text-to-text" },
        ],
      },
      cell: (row) => <TypeBadge type={row.type} />,
    },
    {
      key: "modelId",
      header: "Underlying Model ID",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-400 text-xs font-mono bg-zinc-800/60 px-2 py-0.5 rounded truncate max-w-[200px] inline-block">
          {row.modelId?.displayName || row.modelId?.id || row.modelId || "-"}
        </span>
      ),
    },
    {
      key: "defaults",
      header: "Defaults",
      sortable: false,
      cell: (row) => {
        const keys = Object.keys(row.defaults || {});
        if (keys.length === 0) return <span className="text-zinc-500 text-xs">-</span>;
        
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {Object.entries(row.defaults).map(([k, v]) => (
              <span key={k} className="text-[10px] bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 px-1.5 py-0.5 rounded flex items-center gap-1 truncate max-w-[150px]">
                <span className="text-zinc-500">{k}:</span>
                <span className="font-mono text-indigo-300">{String(v)}</span>
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Added",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-500 text-xs">
          {row.createdAt ? formatDate(row.createdAt) : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "80px",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit Block"
            className="p-1.5 text-zinc-500 hover:text-indigo-400 cursor-pointer hover:bg-zinc-800/80 rounded-lg transition-all"
          >
            <Edit className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            title="Delete Block"
            className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
