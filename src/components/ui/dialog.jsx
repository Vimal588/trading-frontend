import React, { createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogContext = createContext(null);

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className, children }) {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-base-border2 bg-base-panel p-6 shadow-2xl animate-in",
          className
        )}
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 text-muted hover:text-slate-200"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold text-slate-100", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted mt-1", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
