import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import { getUserWatchlist, toggleWatchlist } from "@/State/Watchlist/Action";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { items, loading } = useSelector((state) => state.watchlist);

  useEffect(() => {
    dispatch(getUserWatchlist()).catch(() => {});
  }, [dispatch]);

  const handleRemove = async (coin) => {
    try {
      await dispatch(toggleWatchlist(coin.id));
      toast.info(`Removed ${coin.name} from watchlist`);
    } catch (err) {
      toast.error("Failed to remove coin from watchlist");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Star size={20} className="text-accent fill-accent" /> Tracked Coins
          </h2>
          <p className="text-xs text-muted mt-1">
            Your customized list of high-priority cryptocurrency pairs.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/")}
          variant="outline"
          className="text-xs font-semibold gap-1.5"
        >
          <span>Browse Markets</span>
          <ArrowUpRight size={14} />
        </Button>
      </div>

      <Card className="overflow-hidden border-base-border">
        <CardContent className="p-0">
          {loading && (!items || items.length === 0) && (
            <div className="text-center text-muted py-16">
              Loading your watchlist...
            </div>
          )}

          {!loading && (!items || items.length === 0) && (
            <div className="text-center py-16 px-4">
              <Star size={36} className="text-muted/40 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-200 mb-1">
                Your watchlist is currently empty
              </p>
              <p className="text-xs text-muted max-w-sm mx-auto mb-5">
                Explore live crypto markets and click the bookmark button on any coin to pin it here.
              </p>
              <Button
                size="sm"
                onClick={() => navigate("/")}
                className="font-semibold"
              >
                Go to Markets
              </Button>
            </div>
          )}

          {items && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>24H Volume</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>24H Change</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => {
                  const change = c.price_change_percentage_24h ?? 0;
                  const isPositive = change >= 0;

                  return (
                    <TableRow
                      key={c.id}
                      className="hover:bg-base-panel2 transition-colors cursor-pointer"
                      onClick={() => navigate(`/market/${c.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="h-8 w-8 rounded-full shadow-sm"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-base-panel2 flex items-center justify-center font-bold text-xs uppercase text-slate-300">
                              {c.symbol?.[0] || "C"}
                            </div>
                          )}
                          <span className="font-semibold text-slate-200">
                            {c.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted font-mono uppercase text-xs">
                        {c.symbol}
                      </TableCell>

                      <TableCell className="text-muted text-sm">
                        {formatCompact(c.total_volume)}
                      </TableCell>

                      <TableCell className="text-muted text-sm">
                        {formatCompact(c.market_cap)}
                      </TableCell>

                      <TableCell
                        className={`text-sm font-semibold ${
                          isPositive ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {change.toFixed(2)}%
                      </TableCell>

                      <TableCell className="text-right font-bold text-slate-100 text-sm">
                        {c.current_price < 1
                          ? `$${c.current_price?.toFixed(6) ?? "0.00"}`
                          : formatCurrency(c.current_price)}
                      </TableCell>

                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/market/${c.id}`)}
                            className="h-8 px-2.5 text-xs font-semibold"
                          >
                            Trade
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(c)}
                            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
