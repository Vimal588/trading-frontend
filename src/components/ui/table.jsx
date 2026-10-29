import React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className={cn("w-full text-sm border-collapse", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-base-border last:border-0 hover:bg-base-panel2/60 transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "text-left text-xs font-medium text-muted uppercase tracking-wide py-3 px-4",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return <td className={cn("py-3.5 px-4 align-middle", className)} {...props} />;
}
