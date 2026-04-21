import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

export const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl border border-slate-200/80 bg-white shadow-soft",
        className
      )}
      {...rest}
    />
  )
);
Card.displayName = "Card";

export function CardHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-4 pb-3",
        className
      )}
      {...rest}
    />
  );
}

export function CardBody({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-4", className)} {...rest} />;
}

export function CardFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3",
        className
      )}
      {...rest}
    />
  );
}
