import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, Wallet, Shield, LogOut, User, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/State/Auth/Action";
import { searchCoin } from "@/State/Coin/Actions";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function getInitials(fullName) {
  if (!fullName) return "U";
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header({ onMenuClick, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.wallet);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await dispatch(searchCoin(searchQuery.trim()));
        setSearchResults(res?.coins?.slice(0, 6) || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  // Click outside listener for search results dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCoin = (coinId) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    navigate(`/market/${coinId}`);
  };

  return (
    <header className="h-16 border-b border-base-border bg-base-bg/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl text-muted hover:text-slate-100 hover:bg-base-panel2 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-100 truncate">
          {title}
        </h1>
      </div>

      {/* Live Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block relative" ref={searchRef}>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            placeholder="Search crypto by name or symbol..."
            value={searchQuery}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            className="w-full h-10 rounded-xl border border-base-border2 bg-base-panel2/90 pl-10 pr-9 text-sm text-slate-200 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
          />
          {searching && (
            <Loader2
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin"
            />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-base-panel border border-base-border2 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50">
            <div className="p-2 divide-y divide-base-border/50">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin.id)}
                  className="flex items-center gap-3 p-2.5 hover:bg-base-panel2 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={coin.thumb || coin.large}
                    alt={coin.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-slate-200 text-sm block truncate">
                      {coin.name}
                    </span>
                    <span className="text-xs text-muted uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                  {coin.market_cap_rank && (
                    <span className="text-[11px] text-muted px-1.5 py-0.5 rounded bg-base-panel2 border border-base-border2">
                      #{coin.market_cap_rank}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right controls: Wallet balance + User Avatar */}
      <div className="flex items-center gap-3">
        {wallet && (
          <button
            onClick={() => navigate("/wallet")}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-accent/25 bg-accent/10 hover:bg-accent/20 transition-all text-xs font-semibold text-accent"
          >
            <Wallet size={14} />
            <span>{formatCurrency(wallet.balance ?? 0)}</span>
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="shrink-0 flex items-center gap-2 p-1 rounded-xl hover:bg-base-panel2 transition-colors">
              <Avatar className="h-9 w-9 border border-base-border2">
                <AvatarFallback className="bg-accent/20 text-accent font-semibold text-xs">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="p-3 border-b border-base-border">
              <p className="font-semibold text-sm text-slate-100 truncate">
                {user?.fullName || "Trading User"}
              </p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
              {user?.role === "ROLE_ADMIN" && (
                <div className="mt-2 flex items-center gap-1 text-[11px] text-accent font-medium">
                  <Shield size={12} /> Administrator
                </div>
              )}
            </div>

            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User size={15} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/wallet")}>
              <Wallet size={15} className="mr-2" /> Wallet & Deposit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
              className="text-rose-400 focus:text-rose-400 focus:bg-rose-500/10"
            >
              <LogOut size={15} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
