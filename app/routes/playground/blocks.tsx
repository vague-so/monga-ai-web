import React, { useState } from "react";
import { useRevalidator } from "react-router";
import { CustomTable, type Column } from "../../components/shared/CustomTable";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
  BlockDialog,
  type Block,
  type BlockBase,
} from "@/components/blocks/BlockDialog";
import { useBlockColumns } from "@/components/blocks/coloums";
import type { Route } from "./+types/blocks";

// Types

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface LoaderData {
  blocks: Block[];
  pagination: PaginationMeta;
  error?: string;
}

// Server-side Loader

export async function loader(): Promise<LoaderData> {
  try {
    const res = await fetch("http://localhost:5173/api/block");
    if (!res.ok) {
      return {
        blocks: [],
        pagination: { page: 1, limit: 20, totalPages: 1, totalResults: 0 },
        error: `API error: ${res.status}`,
      };
    }
    const json = (await res.json()) as any;
    console.log(json);
    const blocks: Block[] = json?.data?.blocks ?? [];
    console.log(blocks);
    const pagination: PaginationMeta = json?.data?.pagination ?? {
      page: 1,
      limit: 20,
      totalPages: 1,
      totalResults: blocks.length,
    };
    return { blocks, pagination };
  } catch {
    return {
      blocks: [],
      pagination: { page: 1, limit: 20, totalPages: 1, totalResults: 0 },
      error: "Failed to reach blocks API.",
    };
  }
}

export default function BlocksPage({ loaderData }: Route.ComponentProps) {
  const { blocks, pagination, error } = loaderData as LoaderData;
  const revalidator = useRevalidator();

  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);

  const blockColumns = useBlockColumns({
    onEdit: (model) => {
      setSelectedBlock(model);
      setBlockDialogOpen(true);
    },
    onDelete: (model) => {
      setBlockToDelete(model);
      setConfirmOpen(true);
    },
  });

  //  Handlers

  const handleSaveModel = async (formData: BlockBase) => {
    try {
      const res = await fetch("http://localhost:5173/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      revalidator.revalidate();
    } catch (error) {
      console.error("Error saving model:", error);
    }
  };

  const handleUpdateModel = async (formData: BlockBase) => {
    if (!formData.id) return;
    try {
      const res = await fetch(
        `http://localhost:5173/api/block/${formData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      revalidator.revalidate();
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  const handleDeleteModel = async () => {
    if (!blockToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:5173/api/block/${blockToDelete.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      revalidator.revalidate();
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  return (
    <div className="p-8 container mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl mb-8 border-indigo-500/5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100">AI blocks</h2>
          <p className="text-sm text-zinc-500">
            Browse and manage available AI blocks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 bg-zinc-800/60 border border-zinc-700/40 rounded-full px-3 py-1">
            {pagination.totalResults} model
            {pagination.totalResults !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={() => {
              setSelectedBlock(null);
              setBlockDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg hover:shadow-indigo-500/20"
          >
            <PlusCircle className="size-4" />
            Add Block
          </Button>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {!error && (
        <CustomTable
          data={blocks}
          columns={blockColumns}
          searchable
          searchPlaceholder="Search blocks by name, ID, or provider..."
          defaultPageSize={20}
        />
      )}

      <BlockDialog
        open={isBlockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        model={selectedBlock || undefined}
        onSave={selectedBlock ? handleUpdateModel : handleSaveModel}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Block"
        description={`Are you sure you want to delete ${blockToDelete?.name || "this block"}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteModel}
      />
    </div>
  );
}
