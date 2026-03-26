import React, { useState } from "react";
import { useRevalidator } from "react-router";
import type { Route } from "./+types/models";
import { CustomTable, type Column } from "../../components/shared/CustomTable";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dialogs
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
  ModelDialog,
  type AIModelBase,
  type AIModel,
} from "@/components/models/AiModalDialog";
import { useModelColumns } from "@/components/models/columns";

// Types

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface LoaderData {
  models: AIModel[];
  pagination: PaginationMeta;
  error?: string;
}

// Server-side Loader

export async function loader(): Promise<LoaderData> {
  try {
    const res = await fetch("http://localhost:5173/api/model");
    if (!res.ok) {
      return {
        models: [],
        pagination: { page: 1, limit: 20, totalPages: 1, totalResults: 0 },
        error: `API error: ${res.status}`,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (await res.json()) as any;
    const models: AIModel[] = json?.data?.data ?? [];
    const pagination: PaginationMeta = json?.data?.pagination ?? {
      page: 1,
      limit: 20,
      totalPages: 1,
      totalResults: 0,
    };
    return { models, pagination };
  } catch {
    return {
      models: [],
      pagination: { page: 1, limit: 20, totalPages: 1, totalResults: 0 },
      error: "Failed to reach models API.",
    };
  }
}

// Page Component

export default function ModelsPage({ loaderData }: Route.ComponentProps) {
  const { models, pagination, error } = loaderData as LoaderData;
  const revalidator = useRevalidator();

  // Track dialog open states and selected items mapping
  const [isModelDialogOpen, setModelDialogOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null);

  const modelColumns = useModelColumns({
    onEdit: (model) => {
      setSelectedModel(model);
      setModelDialogOpen(true);
    },
    onDelete: (model) => {
      setModelToDelete(model);
      setConfirmOpen(true);
    },
  });

  //  Handlers

  const handleSaveModel = async (formData: AIModelBase) => {
    try {
      const res = await fetch("http://localhost:5173/api/model", {
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

  const handleUpdateModel = async (formData: AIModelBase) => {
    if (!formData.id) return;
    try {
      const res = await fetch(`http://localhost:5173/api/model/${formData.id}`, {
        method: "PATCH",
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
      console.error("Error updating model:", error);
    }
  };

  const handleDeleteModel = async () => {
    if (!modelToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:5173/api/model/${modelToDelete.id}`,
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

  //  Render

  return (
    <div className="p-8 container mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl mb-8 border-indigo-500/5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-100">AI Models</h2>
          <p className="text-sm text-zinc-500">
            Browse and manage available AI models.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 bg-zinc-800/60 border border-zinc-700/40 rounded-full px-3 py-1">
            {pagination.totalResults} model
            {pagination.totalResults !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={() => {
              setSelectedModel(null);
              setModelDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg hover:shadow-indigo-500/20"
          >
            <PlusCircle className="size-4" />
            Add Model
          </Button>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Custom Table */}
      {!error && (
        <CustomTable
          data={models}
          columns={modelColumns}
          searchable
          searchPlaceholder="Search models by name, ID, or provider..."
          defaultPageSize={20}
        />
      )}

      {/* Add / Edit Dialog */}
      <ModelDialog
        open={isModelDialogOpen}
        onOpenChange={setModelDialogOpen}
        model={selectedModel || undefined}
        onSave={selectedModel ? handleUpdateModel : handleSaveModel}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Model"
        description={`Are you sure you want to delete ${modelToDelete?.displayName || "this model"}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteModel}
      />
    </div>
  );
}
