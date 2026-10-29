import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import MarketChart from "@/components/MarketChart";
import { getCoinList, getTop50Coins, getTrendingCoins } from "@/State/Coin/Actions";
import { formatCompact, formatCurrency, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { coinList, top50, trending, loading } = useSelector((state) => state.coin);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  // Fetch paginated market list
  useEffect(() => {
    if (filter === "all" || filter === "gainers" || filter === "losers") {
      dispatch(getCoinList(page));
    }
  }, [dispatch, page, filter]);

  // Fetch top 50
  useEffect(() => {
    if (filter === "top50") {
      dispatch(getTop50Coins());
    }
  }, [dispatch, filter]);

  // Fetch trending
  useEffect(() => {
    if (filter === "trending") {
      dispatch(getTrendingCoins());
    }
  }, [dispatch, filter]);

  const baseList = useMemo(() => {
    if (filter === "top50") return top50 || [];
    if (filter === "trending") {
      // CoinGecko trending returns { coins: [ { item: {...} } ] }
      if (Array.isArray(trending)) return trending;
      if (trending?.coins) {
        return trending.coins.map((c) => ({
          id: c.item?.id,
          name: c.item?.name,
          symbol: c.item?.symbol,
          image: c.item?.large || c.item?.thumb,
          current_price: c.item?.data?.price ?? 0,
          total_volume: c.item?.data?.total_volume ?? 0,
          market_cap: c.item?.data?.market_cap ?? 0,
          price_change_percentage_24h:
            c.item?.data?.price_change_percentage_24h?.usd ?? 0,
        }));
      }
      return [];
    }
    return coinList || [];
  }, [filter, top50, trending, coinList]);

  const filtered = useMemo(() => {
    if (!baseList) return [];
    if (filter === "gainers") {
      return [...baseList]
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .filter((c) => (c.price_change_percentage_24h || 0) > 0);
    }
    if (filter === "losers") {
      return [...baseList]
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .filter((c) => (c.price_change_percentage_24h || 0) < 0);
    }
    return baseList;
  }, [baseList, filter]);

  // Keep a selected coin for preview chart
  useEffect(() => {
    if (filtered.length > 0 && (!selected || !filtered.find((c) => c.id === selected.id))) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const handleRowClick = (coin) => {
    setSelected(coin);
  };

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <Card className="overflow-hidden border-base-border">
        {/* Header / Tabs */}
        <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-border">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Crypto Markets
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Live market quotes, 24H volume, and performance indicators.
            </p>
          </div>

          <Tabs
            defaultValue="all"
            value={filter}
            onValueChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="top50">Top 50</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="gainers">Gainers</TabsTrigger>
              <TabsTrigger value="losers">Losers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Market Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>24H Volume</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>24H Change</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted py-12">
                    Loading live crypto market data...
                  </TableCell>
                </TableRow>
              )}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted py-12">
                    No coins found for this filter.
                  </TableCell>
                </TableRow>
              )}

              {filtered.map((c) => {
                const change = c.price_change_percentage_24h ?? 0;
                const isPositive = change >= 0;
                return (
                  <TableRow
                    key={c.id}
                    onClick={() => handleRowClick(c)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selected?.id === c.id && "bg-base-panel2"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-7 w-7 rounded-full shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-base-panel2 shrink-0" />
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
                      className={cn(
                        "font-semibold text-sm",
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-100 text-sm">
                      {c.current_price < 1
                        ? `$${c.current_price?.toFixed(6) ?? "0.00"}`
                        : formatCurrency(c.current_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/market/${c.id}`);
                        }}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-base-panel2 border border-base-border2 text-muted hover:text-accent hover:border-accent/40 transition-colors"
                        title="Trade this coin"
                      >
                        <ArrowUpRight size={15} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (visible for 'all' filter) */}
        {filter === "all" && (
          <div className="flex items-center justify-between px-5 py-4 text-xs text-muted border-t border-base-border bg-base-panel/50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-base-border2 bg-base-panel hover:bg-base-panel2 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="font-medium text-slate-300">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-base-border2 bg-base-panel hover:bg-base-panel2 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </Card>

      {/* Side Preview Chart */}
      <Card className="h-fit overflow-hidden border-base-border">
        {selected ? (
          <MarketChart selectedCoin={selected} />
        ) : (
          <div className="p-8 text-center text-muted text-sm">
            Select a coin to preview its price chart.
          </div>
        )}
      </Card>
    </div>
  );
}
