import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-accent/15 text-accent border border-accent/30",
  up: "bg-up/15 text-up border border-up/30",
  down: "bg-down/15 text-down border border-down/30",
  outline: "border border-base-border2 text-slate-300",
  orange: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
