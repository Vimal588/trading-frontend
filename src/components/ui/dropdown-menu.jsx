import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }) {
  const { open, setOpen } = useContext(DropdownContext);
  return React.cloneElement(children, {
    onClick: () => setOpen(!open),
  });
}

export function DropdownMenuContent({ className, align = "end", children }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[180px] rounded-xl border border-base-border2 bg-base-panel p-1.5 shadow-2xl",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, children, ...props }) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-base-panel2 hover:text-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1.5 h-px bg-base-border" />;
}
