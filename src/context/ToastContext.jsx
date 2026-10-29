import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-2 text-sm ${
              t.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
                : t.type === "error"
                ? "bg-rose-950/90 border-rose-500/30 text-rose-200"
                : "bg-base-panel/95 border-base-border2 text-slate-200"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : t.type === "error" ? (
                <AlertCircle size={18} className="text-rose-400" />
              ) : (
                <Info size={18} className="text-accent" />
              )}
            </div>
            <div className="flex-1 font-medium leading-snug">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
