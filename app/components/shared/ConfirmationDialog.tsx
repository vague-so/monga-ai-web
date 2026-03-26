"use client";

import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon, CheckIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;

  onConfirm: () => void | Promise<void>;

  confirmClassName?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  children?: ReactNode;
  isDestructive?: boolean;
}

export default function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmClassName,
  open,
  onOpenChange,
  children,
  isDestructive = true,
}: ConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent className="border border-zinc-800 bg-[#0a0a0b] text-zinc-100 rounded-2xl max-w-sm shadow-2xl shadow-black/80 p-0 overflow-hidden sm:max-w-[425px]">
        {/* Top Glow Accent */}
        <div 
          className={cn(
            "h-1 w-full absolute top-0 left-0",
            isDestructive ? "bg-linear-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0" : "bg-linear-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0"
          )} 
        />
        
        <div className="p-6">
          <DialogHeader className="space-y-4">
            <div className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800/80 mb-2 shadow-inner",
              isDestructive ? "text-rose-400" : "text-indigo-400"
            )}>
              <AlertCircle className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-100">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-zinc-400 leading-relaxed font-medium">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>

          {children && (
            <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              {children}
            </div>
          )}
        </div>

        <DialogFooter className="bg-zinc-900/30 border-t border-zinc-800/50 p-4 sm:flex-row gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto flex-1 rounded-xl h-11 border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-100 text-zinc-300 bg-transparent transition-all"
            >
              {cancelLabel}
            </Button>
          </DialogClose>

          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto flex-1 rounded-xl h-11 shadow-lg font-semibold tracking-wide transition-all active:scale-95 gap-2",
              isDestructive 
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20",
              confirmClassName
            )}
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                {confirmLabel}
                {!loading && <CheckIcon className="w-4 h-4 ml-1 opacity-80" />}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
