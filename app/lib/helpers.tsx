import { cn } from "@/lib/utils";

// TypeBadge

const TYPE_BADGE_MAP: Record<string, { label: string; cls: string }> = {
  "text-to-image": {
    label: "Text → Image",
    cls: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  "image-to-image": {
    label: "Image → Image",
    cls: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  "text-to-video": {
    label: "Text → Video",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "image-to-video": {
    label: "Image → Video",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
};

// Pill badge that maps an AI model type string to a coloured label.
export function TypeBadge({ type }: { type: string }) {
  const { label, cls } = TYPE_BADGE_MAP[type] ?? {
    label: type,
    cls: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  };
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        cls,
      )}
    >
      {label}
    </span>
  );
}

// ActiveDot

// Animated dot + label indicating whether a model is active or inactive.
export function ActiveDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center justify-end gap-1.5">
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          active
            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"
            : "bg-zinc-600",
        )}
      />
      <span
        className={cn(
          "text-xs font-medium",
          active ? "text-emerald-400" : "text-zinc-500",
        )}
      >
        {active ? "Active" : "Inactive"}
      </span>
    </span>
  );
}
