import React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm active:translate-y-[1px]",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:translate-y-[1px]",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-5 text-base rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...rest}
    />
  )
);
Button.displayName = "Button";
