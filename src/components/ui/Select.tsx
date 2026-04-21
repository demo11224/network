import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
}

interface SelectProps<V extends string> {
  value: V;
  onChange: (v: V) => void;
  options: SelectOption<V>[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export function Select<V extends string>({
  value,
  onChange,
  options,
  placeholder = "请选择",
  className,
  size = "md",
}: SelectProps<V>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const heightCls = size === "sm" ? "h-8 text-[13px]" : "h-10 text-sm";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700 shadow-sm transition",
          "hover:border-brand-300 hover:text-brand-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
          heightCls
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {current?.icon}
          <span className="truncate">{current?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180 text-brand-600"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute right-0 z-40 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-elev"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.icon}
                    <span>{opt.label}</span>
                    {opt.hint && (
                      <span className="text-xs text-slate-400">
                        {opt.hint}
                      </span>
                    )}
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
