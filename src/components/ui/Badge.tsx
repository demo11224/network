import React from "react";
import { cn } from "@/lib/cn";

type Tone = "slate" | "brand" | "green" | "amber" | "red" | "sky";

export function Badge({
  className,
  tone = "slate",
  children,
}: {
  className?: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const toneMap: Record<Tone, string> = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[11px] font-medium",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
