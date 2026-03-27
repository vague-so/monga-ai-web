import React, { useState } from "react";
import { useRevalidator } from "react-router";
import { CustomTable, type Column } from "../../components/shared/CustomTable";
import { PlusCircle, Layers, Settings2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
  TemplateDialog,
  type Template,
  type TemplateBase,
} from "@/components/templates/TemplateDialog";
import { useTemplateColumns } from "@/components/templates/columns";
import type { Route } from "./+types/templates";

// Types

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface LoaderData {
  templates: Template[];
  pagination: PaginationMeta;
  error?: string;
}

// Server-side Loader

export async function loader(): Promise<LoaderData> {
  try {
    const res = await fetch("http://localhost:5173/api/template");
    if (!res.ok) {
      return {
        templates: [],
        pagination: { page: 1, limit: 10, totalPages: 1, totalResults: 0 },
        error: `API error: ${res.status}`,
      };
    }
    const json = (await res.json()) as any;
    console.log("Template JSON:", json);
    const templates: Template[] = json?.data?.templates ?? [];
    const pagination: PaginationMeta = json?.data?.pagination ?? {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: templates.length,
    };
    return { templates, pagination };
  } catch (err) {
    console.error("Loader fetch error:", err);
    return {
      templates: [],
      pagination: { page: 1, limit: 10, totalPages: 1, totalResults: 0 },
      error: "Failed to reach templates API.",
    };
  }
}

export default function TemplatesPage({ loaderData }: Route.ComponentProps) {
  const { templates, pagination, error } = loaderData as LoaderData;
  const revalidator = useRevalidator();

  const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null,
  );

  const templateColumns = useTemplateColumns({
    onEdit: (temp) => {
      setSelectedTemplate(temp);
      setTemplateDialogOpen(true);
    },
    onDelete: (temp) => {
      setTemplateToDelete(temp);
      setConfirmOpen(true);
    },
  });

  // Handlers

  const handleSaveTemplate = async (formData: TemplateBase) => {
    try {
      const res = await fetch("/api/template", {
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
      console.error("Error saving template:", error);
    }
  };

  const handleUpdateTemplate = async (formData: TemplateBase) => {
    if (!formData.id) return;
    try {
      const res = await fetch(`/api/template/${formData.id}`, {
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
      console.error("Error updating template:", error);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    try {
      const res = await fetch(`/api/template/${templateToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      revalidator.revalidate();
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  return (
    <div className="p-8 container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl mb-8 border-indigo-500/10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 -mt-12 -mr-12 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors duration-500" />

        <div className="flex items-start gap-5 relative">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Layers className="size-8 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              AI Templates
            </h2>
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              Design and manage reusable AI execution workflows by staking
              multiple blocks together.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="hidden lg:flex flex-col items-end px-4 border-r border-zinc-800">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Total Templates
            </span>
            <span className="text-xl font-mono text-indigo-400 font-bold">
              {pagination.totalResults}
            </span>
          </div>
          <Button
            onClick={() => {
              setSelectedTemplate(null);
              setTemplateDialogOpen(true);
            }}
            className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white gap-2 px-6 rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all active:scale-95 font-bold"
          >
            <PlusCircle className="size-5" />
            Create Template
          </Button>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm flex items-center gap-3">
          <Info className="size-5" />
          <span>⚠ {error}</span>
        </div>
      )}

      {/* Main Table Content */}
      <div className="glass rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        {!error && (
          <CustomTable
            data={templates}
            columns={templateColumns}
            searchable
            searchPlaceholder="Search templates by title or description..."
            defaultPageSize={10}
          />
        )}
      </div>

      {/* Dialogs */}
      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        template={selectedTemplate || undefined}
        onSave={selectedTemplate ? handleUpdateTemplate : handleSaveTemplate}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Template"
        description={`This will permanently delete the template "${templateToDelete?.title}". All associated step configurations will be lost. This cannot be undone.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Template"
        onConfirm={handleDeleteTemplate}
      />
    </div>
  );
}
