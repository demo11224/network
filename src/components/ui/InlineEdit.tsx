import React, { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/cn";

interface InlineEditProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function InlineEdit({
  value,
  onChange,
  className,
  inputClassName,
  placeholder,
  label,
  disabled,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, value]);

  const commit = () => {
    setEditing(false);
    const v = draft.trim();
    if (v && v !== value) onChange(v);
  };

  if (editing && !disabled) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        placeholder={placeholder}
        aria-label={label}
        className={cn(
          "w-full rounded-md border border-brand-300 bg-white px-1.5 py-0.5 text-sm text-slate-900 shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none",
          inputClassName
        )}
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setEditing(true)}
      className={cn(
        "group inline-flex max-w-full items-center gap-1 rounded-md px-1 py-0.5 text-left text-sm text-slate-800 transition",
        "hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      title="点击直接修改"
    >
      <span className="truncate">{value || placeholder}</span>
      <Pencil className="h-3 w-3 shrink-0 text-slate-300 transition group-hover:text-brand-500" />
    </button>
  );
}
