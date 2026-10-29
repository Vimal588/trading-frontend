import React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, children }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-panel2 border border-base-border2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ className, children }) {
  return (
    <span className={cn("text-xs font-semibold text-slate-200", className)}>
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt }) {
  if (!src) return null;
  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}
