import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getMarketChart } from "@/State/Coin/Actions";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const RANGES = {
  "1D": { days: 1, format: (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  "1W": { days: 7, format: (ts) => new Date(ts).toLocaleDateString([], { weekday: "short" }) },
  "1M": { days: 30, format: (ts) => new Date(ts).toLocaleDateString([], { day: "2-digit", month: "short" }) },
};

function CustomTooltip({ active, payload, fmt }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-base-border2 bg-base-panel/95 backdrop-blur-md px-3 py-2 shadow-2xl text-xs">
      <div className="text-muted mb-1">{fmt(point.time)}</div>
      <div className="text-slate-100 font-semibold">{formatCurrency(point.price)}</div>
    </div>
  );
}

export default function MarketChart({ selectedCoin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [range, setRange] = useState("1D");
  const { marketChart, loading } = useSelector((state) => state.coin);

  useEffect(() => {
    if (selectedCoin?.id) {
      dispatch(getMarketChart(selectedCoin.id, RANGES[range].days));
    }
  }, [dispatch, selectedCoin?.id, range]);

  const data = useMemo(() => {
    if (!marketChart?.prices) return [];
    return marketChart.prices.map(([time, price]) => ({ time, price }));
  }, [marketChart]);

  const { changeAbs, changePct, isUp, lastPrice } = useMemo(() => {
    if (data.length < 2) {
      return {
        changeAbs: 0,
        changePct: 0,
        isUp: true,
        lastPrice: data[0]?.price ?? selectedCoin?.current_price ?? 0,
      };
    }
    const first = data[0].price;
    const last = data[data.length - 1].price;
    return {
      changeAbs: last - first,
      changePct: ((last - first) / first) * 100,
      isUp: last - first >= 0,
      lastPrice: last,
    };
  }, [data, selectedCoin]);

  const color = isUp ? "#22c55e" : "#ef4444";
  const fmt = RANGES[range].format;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-5">
        <Tabs defaultValue="1D" value={range} onValueChange={setRange}>
          <TabsList>
            <TabsTrigger value="1D">24H</TabsTrigger>
            <TabsTrigger value="1W">7D</TabsTrigger>
            <TabsTrigger value="1M">30D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] mt-4 px-2">
        {loading && data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-sm">
            Loading market chart...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-sm">
            No chart data available for this range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1c2333" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={fmt}
                interval={Math.floor(data.length / 7)}
                tick={{ fill: "#8892a6", fontSize: 11 }}
                axisLine={{ stroke: "#1c2333" }}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#8892a6", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={65}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip fmt={fmt} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-base-border mt-auto">
        <div className="flex items-center gap-3 min-w-0">
          {selectedCoin?.image ? (
            <img
              src={selectedCoin.image}
              alt={selectedCoin.name}
              className="h-9 w-9 rounded-full shrink-0 shadow-sm"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-base-panel2 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-xs text-muted truncate">
              {selectedCoin?.symbol?.toUpperCase()} &bull; {selectedCoin?.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-100">
                {formatCurrency(lastPrice)}
              </span>
              {data.length > 1 && (
                <span
                  className={
                    isUp
                      ? "text-emerald-400 text-xs font-semibold"
                      : "text-rose-400 text-xs font-semibold"
                  }
                >
                  {changeAbs >= 0 ? "+" : ""}
                  {changeAbs.toFixed(2)} ({changePct.toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {selectedCoin?.id && (
          <Button
            size="sm"
            onClick={() => navigate(`/market/${selectedCoin.id}`)}
            className="gap-1.5 shrink-0"
          >
            <span>Trade</span>
            <ArrowUpRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
