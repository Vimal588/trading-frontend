import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-accent text-black hover:bg-accent-soft font-semibold",
  outline:
    "border border-base-border2 bg-transparent text-slate-200 hover:bg-base-panel2",
  ghost: "bg-transparent text-slate-300 hover:bg-base-panel2",
  destructive: "bg-down/90 text-white hover:bg-down",
  subtle: "bg-base-panel2 text-slate-200 hover:bg-base-border2",
};

const sizes = {
  default: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
  icon: "h-9 w-9",
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
