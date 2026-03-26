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
        <span className="text-zinc-100 text-sm font-semibold">
          {row.name}
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
        <span className="text-zinc-400 text-xs font-mono bg-zinc-800/60 px-2 py-0.5 rounded">
          {row.modelId}
        </span>
      ),
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
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
