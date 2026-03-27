import React from "react";
import { type Column } from "@/components/shared/CustomTable";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2, Layers, CheckCircle2, XCircle } from "lucide-react";
import { type Template } from "./TemplateDialog";
import { cn } from "@/lib/utils";

export function useTemplateColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
}): Column<Template>[] {
  return [
    {
      key: "title",
      header: "Template Title",
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-zinc-100 text-sm font-semibold">
            {row.title}
          </span>
          <span className="text-zinc-500 text-[10px] truncate max-w-[250px]">
            {row.description || "No description provided."}
          </span>
        </div>
      ),
    },
    {
      key: "blockStack",
      header: "Block Stack",
      cell: (row) => {
        const stack = row.blockStack || [];
        if (stack.length === 0)
          return (
            <span className="text-zinc-600 text-[10px] italic">Empty</span>
          );

        return (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[300px] py-1">
            {stack.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-medium transition-all group shrink-0 shadow-sm",
                  "bg-zinc-900/60 border-zinc-800 text-zinc-400 group-hover:border-zinc-700 hover:bg-zinc-800",
                )}
              >
                <div className="size-4 flex items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">
                  {item.order}
                </div>
                <span className="text-zinc-300">
                  {typeof item.blockId === "object" && item.blockId !== null
                    ? (item.blockId as any).name
                    : "Unknown Block"}
                </span>
                {i < stack.length - 1 && (
                  <div className="w-px h-3 bg-zinc-700/50" />
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      key: "isActive",
      header: "Status",
      width: "80px",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center">
          {row.isActive ? (
            <CheckCircle2 className="size-4 text-emerald-500/80" />
          ) : (
            <XCircle className="size-4 text-zinc-600" />
          )}
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-500 text-xs font-mono opacity-80">
          {row.updatedAt ? formatDate(row.updatedAt) : "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cell: (row) => (
        <span className="text-zinc-500 text-xs opacity-70">
          {row.createdAt ? formatDate(row.createdAt) : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "100px",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit Template"
            className="p-2 text-zinc-500 hover:text-indigo-400 cursor-pointer hover:bg-indigo-500/10 rounded-xl transition-all"
          >
            <Edit className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            title="Delete Template"
            className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
