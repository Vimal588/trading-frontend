import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Bookmark,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getMarketChart, getCoinDetails } from "@/State/Coin/Actions";
import { payOrder } from "@/State/Order/Action";
import { getUserWatchlist, toggleWatchlist } from "@/State/Watchlist/Action";
import { getUserWallet } from "@/State/Wallet/Action";
import { getAssetByCoinAndUser, getUserAssets } from "@/State/Asset/Action";
import { formatCurrency, formatCompact, formatNumber } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const RANGES = {
  "1D": { days: 1, format: (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  "1W": { days: 7, format: (ts) => new Date(ts).toLocaleDateString([], { weekday: "short" }) },
  "1M": { days: 30, format: (ts) => new Date(ts).toLocaleDateString([], { day: "2-digit", month: "short" }) },
};

function CrosshairTooltip({ active, payload, fmt }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-base-border2 bg-base-panel/95 backdrop-blur-md px-3.5 py-2.5 shadow-2xl text-xs -translate-y-2">
      <div className="text-muted mb-1">{fmt(point.time)}</div>
      <div className="flex items-center gap-1.5 text-slate-100 font-semibold text-sm">
        <span className="h-2 w-2 rounded-full bg-accent" />
        {formatCurrency(point.price)}
      </div>
    </div>
  );
}

export default function MarketDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [range, setRange] = useState("1D");
  const [hoverTime, setHoverTime] = useState(null);

  // Redux state
  const { marketChart, coinDetails, loading } = useSelector((state) => state.coin);
  const { items: watchlistItems } = useSelector((state) => state.watchlist);
  const { wallet } = useSelector((state) => state.wallet);
  const { coinAsset } = useSelector((state) => state.asset);

  // Trade modal state
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState("BUY"); // "BUY" | "SELL"
  const [tradeQuantity, setTradeQuantity] = useState("");
  const [tradeSubmitting, setTradeSubmitting] = useState(false);
  const [tradeError, setTradeError] = useState("");

  const isSaved = useMemo(() => {
    return watchlistItems?.some((c) => c.id === coinId);
  }, [watchlistItems, coinId]);

  useEffect(() => {
    dispatch(getCoinDetails(coinId)).catch(() => {});
    dispatch(getUserWatchlist()).catch(() => {});
    dispatch(getUserWallet()).catch(() => {});
    dispatch(getAssetByCoinAndUser(coinId)).catch(() => {});
  }, [dispatch, coinId]);

  useEffect(() => {
    dispatch(getMarketChart(coinId, RANGES[range].days));
  }, [dispatch, coinId, range]);

  const data = useMemo(() => {
    if (!marketChart?.prices) return [];
    return marketChart.prices.map(([time, price]) => ({ time, price }));
  }, [marketChart]);

  const { changeAbs, changePct, isUp, lastPrice } = useMemo(() => {
    if (data.length < 2) {
      const fallbackPrice =
        coinDetails?.market_data?.current_price?.usd ||
        coinDetails?.current_price ||
        0;
      return { changeAbs: 0, changePct: 0, isUp: true, lastPrice: data[0]?.price ?? fallbackPrice };
    }
    const first = data[0].price;
    const last = data[data.length - 1].price;
    return {
      changeAbs: last - first,
      changePct: ((last - first) / first) * 100,
      isUp: last - first >= 0,
      lastPrice: last,
    };
  }, [data, coinDetails]);

  const color = isUp ? "#22c55e" : "#ef4444";
  const fmt = RANGES[range].format;

  const coinName = coinDetails?.name || coinId;
  const coinSymbol = coinDetails?.symbol?.toUpperCase() || "";
  const coinImage =
    coinDetails?.image?.large ||
    coinDetails?.image?.small ||
    coinDetails?.image;

  // Watchlist toggle handler
  const handleToggleWatchlist = async () => {
    try {
      await dispatch(toggleWatchlist(coinId));
      toast.success(
        isSaved
          ? `Removed ${coinName} from watchlist`
          : `Added ${coinName} to watchlist`
      );
    } catch (err) {
      toast.error("Failed to update watchlist");
    }
  };

  // Trade submission handler
  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    setTradeError("");
    const qty = parseFloat(tradeQuantity);

    if (isNaN(qty) || qty <= 0) {
      setTradeError("Please enter a valid quantity greater than zero.");
      return;
    }

    const currentCoinPrice = lastPrice || coinDetails?.current_price || 0;
    const orderCost = qty * currentCoinPrice;

    if (tradeType === "BUY") {
      const userBalance = wallet?.balance ?? 0;
      if (orderCost > userBalance) {
        setTradeError(
          `Insufficient wallet balance. Total cost is ${formatCurrency(orderCost)}, but your wallet balance is ${formatCurrency(userBalance)}.`
        );
        return;
      }
    } else {
      const availableHolding = coinAsset?.quantity || 0;
      if (qty > availableHolding) {
        setTradeError(
          `Insufficient crypto holdings. You hold ${availableHolding} ${coinSymbol}, but requested to sell ${qty}.`
        );
        return;
      }
    }

    setTradeSubmitting(true);
    try {
      await dispatch(
        payOrder({
          coinId,
          quantity: qty,
          orderType: tradeType,
        })
      );

      toast.success(
        tradeType === "BUY"
          ? `Successfully purchased ${qty} ${coinSymbol}!`
          : `Successfully sold ${qty} ${coinSymbol}!`
      );

      // Refresh wallet and user asset holdings
      dispatch(getUserWallet());
      dispatch(getUserAssets());
      dispatch(getAssetByCoinAndUser(coinId));

      setShowTradeModal(false);
      setTradeQuantity("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to execute trade";
      setTradeError(msg);
    } finally {
      setTradeSubmitting(false);
    }
  };

  // Quick percent calculation for Buy/Sell
  const handleQuickPercent = (pct) => {
    const currentCoinPrice = lastPrice || 1;
    if (tradeType === "BUY") {
      const userBalance = wallet?.balance ?? 0;
      const budget = userBalance * (pct / 100);
      const computedQty = budget / currentCoinPrice;
      setTradeQuantity(computedQty > 0 ? computedQty.toFixed(6) : "0");
    } else {
      const holding = coinAsset?.quantity || 0;
      const computedQty = holding * (pct / 100);
      setTradeQuantity(computedQty > 0 ? computedQty.toFixed(6) : "0");
    }
  };

  const marketData = coinDetails?.market_data || {};

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-slate-100 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Markets
      </button>

      {/* Coin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {coinImage ? (
            <img
              src={coinImage}
              alt={coinName}
              className="h-12 w-12 rounded-full shrink-0 shadow-md"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-base-panel2 shrink-0" />
          )}
          <div>
            <div className="text-xs font-semibold text-muted tracking-wide flex items-center gap-2">
              <span className="uppercase">{coinSymbol}</span>
              <span>&bull;</span>
              <span>{coinName}</span>
              {marketData?.market_cap_rank && (
                <span className="px-1.5 py-0.5 rounded bg-base-panel2 border border-base-border2 text-[10px]">
                  Rank #{marketData.market_cap_rank}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {formatCurrency(lastPrice)}
              </span>
              {data.length > 1 && (
                <span
                  className={
                    isUp
                      ? "text-emerald-400 text-sm font-semibold"
                      : "text-rose-400 text-sm font-semibold"
                  }
                >
                  {changeAbs >= 0 ? "+" : ""}
                  {changeAbs.toFixed(2)} ({changePct.toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Bookmark & Trade */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWatchlist}
            className={
              isSaved
                ? "text-accent border-accent/40 bg-accent/10"
                : "text-muted hover:text-slate-100"
            }
            title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </Button>

          <Button
            onClick={() => {
              setTradeType("BUY");
              setTradeQuantity("");
              setTradeError("");
              setShowTradeModal(true);
            }}
            className="px-6 font-semibold gap-1.5"
          >
            <span>Trade {coinSymbol}</span>
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="rounded-2xl border border-base-border bg-base-panel p-5">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="1D" value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="1D">24 Hours</TabsTrigger>
              <TabsTrigger value="1W">7 Days</TabsTrigger>
              <TabsTrigger value="1M">30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[440px] mt-5">
          {loading && data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted text-sm">
              Loading market chart...
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted text-sm">
              No chart data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                onMouseMove={(e) => {
                  if (e?.activeLabel !== undefined) setHoverTime(e.activeLabel);
                }}
                onMouseLeave={() => setHoverTime(null)}
              >
                <defs>
                  <linearGradient id="detailFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1c2333" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={fmt}
                  interval={Math.floor(data.length / 10)}
                  tick={{ fill: "#8892a6", fontSize: 11 }}
                  axisLine={{ stroke: "#1c2333" }}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "#8892a6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                {hoverTime !== null && (
                  <ReferenceLine
                    x={hoverTime}
                    stroke="#475569"
                    strokeDasharray="3 3"
                    label={{
                      value: fmt(hoverTime),
                      position: "insideBottom",
                      fill: "#e2e8f0",
                      fontSize: 11,
                    }}
                  />
                )}
                <Tooltip
                  cursor={{ stroke: "#475569", strokeDasharray: "3 3" }}
                  content={<CrosshairTooltip fmt={fmt} />}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={color}
                  strokeWidth={2}
                  fill="url(#detailFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Market Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">24H High</p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatCurrency(marketData?.high_24h?.usd ?? coinDetails?.high_24h)}
          </p>
        </Card>
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">24H Low</p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatCurrency(marketData?.low_24h?.usd ?? coinDetails?.low_24h)}
          </p>
        </Card>
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">Market Cap</p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatCompact(marketData?.market_cap?.usd ?? coinDetails?.market_cap)}
          </p>
        </Card>
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">Total Volume</p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatCompact(marketData?.total_volume?.usd ?? coinDetails?.total_volume)}
          </p>
        </Card>
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">All-Time High (ATH)</p>
          <p className="font-semibold text-slate-100 text-sm">
            {formatCurrency(marketData?.ath?.usd ?? coinDetails?.ath)}
          </p>
        </Card>
        <Card className="p-4 border-base-border">
          <p className="text-xs text-muted mb-1">Circulating Supply</p>
          <p className="font-semibold text-slate-100 text-sm truncate">
            {formatCompact(marketData?.circulating_supply ?? coinDetails?.circulating_supply)}{" "}
            {coinSymbol}
          </p>
        </Card>
      </div>

      {/* Buy / Sell Trading Dialog */}
      <Dialog open={showTradeModal} onOpenChange={setShowTradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-accent" />
              <span>Trade {coinName}</span>
            </DialogTitle>
            <DialogDescription>
              Execute instant crypto orders connected directly to your wallet.
            </DialogDescription>
          </DialogHeader>

          {/* Trade Type Tabs: BUY / SELL */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-base-panel2 border border-base-border2">
            <button
              type="button"
              onClick={() => {
                setTradeType("BUY");
                setTradeError("");
              }}
              className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
                tradeType === "BUY"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted hover:text-slate-200"
              }`}
            >
              Buy {coinSymbol}
            </button>
            <button
              type="button"
              onClick={() => {
                setTradeType("SELL");
                setTradeError("");
              }}
              className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
                tradeType === "SELL"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "text-muted hover:text-slate-200"
              }`}
            >
              Sell {coinSymbol}
            </button>
          </div>

          {tradeError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {tradeError}
            </div>
          )}

          <form onSubmit={handleExecuteTrade} className="space-y-4 pt-1">
            {/* Balance or Holding info */}
            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span>
                {tradeType === "BUY" ? "Available Balance:" : "Available to Sell:"}
              </span>
              <span className="font-semibold text-slate-200">
                {tradeType === "BUY"
                  ? formatCurrency(wallet?.balance ?? 0)
                  : `${coinAsset?.quantity ?? 0} ${coinSymbol}`}
              </span>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="text-xs text-muted mb-1 block">Quantity</label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  min="0.000001"
                  placeholder="0.00"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(e.target.value)}
                  className="pr-16"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-muted uppercase">
                  {coinSymbol}
                </span>
              </div>
            </div>

            {/* Quick Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="py-1.5 rounded-lg border border-base-border2 bg-base-panel2 hover:bg-base-panel2/80 text-xs font-semibold text-slate-300 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Estimated Total */}
            <div className="p-3 rounded-xl border border-base-border bg-base-panel2/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Unit Price:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(lastPrice)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-100 pt-1 border-t border-base-border/50">
                <span>Total Value:</span>
                <span className="text-sm text-accent">
                  {formatCurrency((parseFloat(tradeQuantity) || 0) * (lastPrice || 0))}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={tradeSubmitting}
              className={`w-full h-11 font-semibold ${
                tradeType === "BUY"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
            >
              {tradeSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Processing Order...
                </span>
              ) : (
                `${tradeType === "BUY" ? "Confirm Purchase" : "Confirm Sale"}`
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
