import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value !== undefined ? value : internal;
  const setActive = onValueChange || setInternal;
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-base-border2 bg-base-panel2 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
        isActive
          ? "bg-white text-black"
          : "text-muted hover:text-slate-200",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
}
