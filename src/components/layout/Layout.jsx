import React, { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatBotWidget from "../ChatBotWidget";
import {
  X,
  Home,
  Briefcase,
  Star,
  Activity,
  Wallet,
  CreditCard,
  ArrowDownToLine,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const titles = {
  "/": "Dashboard & Markets",
  "/dashboard": "Dashboard & Markets",
  "/portfolio": "Portfolio Holdings",
  "/watchlist": "Market Watchlist",
  "/activity": "Order & Trade History",
  "/wallet": "Wallet & Top-Up",
  "/payment-details": "Bank & Payout Details",
  "/withdrawal": "Withdrawal Requests",
  "/profile": "Account & Security",
};

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/payment-details", label: "Bank Details", icon: CreditCard },
  { to: "/withdrawal", label: "Withdrawal", icon: ArrowDownToLine },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Dynamic title based on pathname
  let title = titles[location.pathname] || "Apex Trading Platform";
  if (location.pathname.startsWith("/market/")) {
    title = "Market Detail & Trading";
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base-bg font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-base-panel border-r border-base-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg text-slate-100 tracking-tight">
                  Apex Trading
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:text-slate-100 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium border border-transparent transition-all",
                        isActive
                          ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                          : "text-muted hover:text-slate-100 hover:bg-base-panel2"
                      )
                    }
                  >
                    <item.icon size={19} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="text-xs text-muted text-center pt-4 border-t border-base-border">
              Secure Trading &middot; Real-time APIs
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ChatBotWidget />
    </div>
  );
}
