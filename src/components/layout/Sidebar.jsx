import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/State/Auth/Action";
import {
  Home,
  Briefcase,
  Star,
  Activity,
  Wallet,
  CreditCard,
  ArrowDownToLine,
  UserRound,
  LogOut,
  TrendingUp,
  ChevronsLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Sidebar({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-base-border bg-base-panel transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-base-border">
        <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
          <TrendingUp size={20} className="text-black stroke-[2.5]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-100 tracking-tight text-base leading-tight">
              Apex Trading
            </span>
            {isAdmin && (
              <span className="flex items-center gap-1 text-[10px] text-accent font-semibold uppercase tracking-wider">
                <ShieldCheck size={11} /> Admin Mode
              </span>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 border border-transparent",
                isActive
                  ? "bg-accent/15 text-accent border-accent/30 shadow-sm"
                  : "text-muted hover:text-slate-100 hover:bg-base-panel2"
              )
            }
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-base-border space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-slate-100 hover:bg-base-panel2 transition-colors"
        >
          <ChevronsLeft
            size={18}
            className={cn(
              "shrink-0 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
