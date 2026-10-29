import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-base-border2 bg-base-panel2 px-3 text-sm text-slate-200 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
