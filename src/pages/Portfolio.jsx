import React, { useEffect, useMemo } from "react";
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
import { getUserAssets } from "@/State/Asset/Action";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { Briefcase, ArrowUpRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

export default function Portfolio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userAssets, loading } = useSelector((state) => state.asset);

  useEffect(() => {
    dispatch(getUserAssets()).catch(() => {});
  }, [dispatch]);

  // Compute portfolio totals
  const { totalValue, totalCost, totalProfitLoss, totalProfitLossPct } = useMemo(() => {
    if (!userAssets || userAssets.length === 0) {
      return { totalValue: 0, totalCost: 0, totalProfitLoss: 0, totalProfitLossPct: 0 };
    }

    let val = 0;
    let cost = 0;

    userAssets.forEach((a) => {
      const currentPrice = a.coin?.current_price ?? a.buyPrice ?? 0;
      val += a.quantity * currentPrice;
      cost += a.quantity * (a.buyPrice ?? 0);
    });

    const pl = val - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;

    return {
      totalValue: val,
      totalCost: cost,
      totalProfitLoss: pl,
      totalProfitLossPct: plPct,
    };
  }, [userAssets]);

  const isProfitable = totalProfitLoss >= 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Banner: Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Value */}
        <Card className="p-5 border-base-border bg-base-panel/90">
          <div className="flex items-center justify-between text-xs text-muted mb-1.5">
            <span>Total Portfolio Value</span>
            <Briefcase size={16} className="text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-xs text-muted mt-2">
            Invested capital: <span className="text-slate-300 font-medium">{formatCurrency(totalCost)}</span>
          </div>
        </Card>

        {/* Total Profit / Loss */}
        <Card className="p-5 border-base-border bg-base-panel/90">
          <div className="flex items-center justify-between text-xs text-muted mb-1.5">
            <span>Total Returns (P&L)</span>
            {isProfitable ? (
              <TrendingUp size={16} className="text-emerald-400" />
            ) : (
              <TrendingDown size={16} className="text-rose-400" />
            )}
          </div>
          <div
            className={`text-3xl font-extrabold ${
              isProfitable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isProfitable ? "+" : ""}
            {formatCurrency(totalProfitLoss)}
          </div>
          <div
            className={`text-xs font-semibold mt-2 ${
              isProfitable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isProfitable ? "+" : ""}
            {totalProfitLossPct.toFixed(2)}% overall ROI
          </div>
        </Card>

        {/* Action Card */}
        <Card className="p-5 border-base-border bg-base-panel/90 flex flex-col justify-between">
          <div>
            <span className="text-xs text-muted">Holdings Status</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              {userAssets?.length || 0} Distinct Coins
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => dispatch(getUserAssets())}
              variant="outline"
              className="gap-1.5 text-xs"
            >
              <RefreshCw size={14} /> Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/")}
              className="gap-1.5 text-xs font-semibold"
            >
              Explore Markets <ArrowUpRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Asset Table */}
      <Card className="overflow-hidden border-base-border">
        <CardHeader className="border-b border-base-border px-5 py-4">
          <CardTitle className="text-base font-bold text-slate-100">
            Holding Assets
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Holding Quantity</TableHead>
                <TableHead>Avg Buy Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Unrealized P&L</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-center w-24">Trade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (!userAssets || userAssets.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted py-14">
                    Loading your portfolio assets...
                  </TableCell>
                </TableRow>
              )}

              {!loading && (!userAssets || userAssets.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted py-14">
                    <p className="text-slate-300 font-semibold mb-1">
                      No assets in your portfolio yet
                    </p>
                    <p className="text-xs text-muted mb-4">
                      Buy cryptocurrency on the Dashboard to start building your holdings.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate("/")}
                      className="font-semibold"
                    >
                      Go to Markets
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {userAssets?.map((a) => {
                const coin = a.coin || {};
                const currentPrice = coin.current_price ?? a.buyPrice ?? 0;
                const assetValue = a.quantity * currentPrice;
                const cost = a.quantity * (a.buyPrice ?? 0);
                const pl = assetValue - cost;
                const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                const rowProfitable = pl >= 0;

                return (
                  <TableRow
                    key={a.id}
                    className="hover:bg-base-panel2 transition-colors cursor-pointer"
                    onClick={() => coin.id && navigate(`/market/${coin.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {coin.image ? (
                          <img
                            src={coin.image}
                            alt={coin.name || "coin"}
                            className="h-8 w-8 rounded-full shadow-sm"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-base-panel2 flex items-center justify-center font-bold text-xs uppercase text-slate-300">
                            {coin.symbol?.[0] || "C"}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-200 block text-sm">
                            {coin.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted uppercase font-mono">
                            {coin.symbol || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-200 text-sm">
                      {a.quantity?.toFixed(6)}
                    </TableCell>

                    <TableCell className="text-muted text-sm">
                      {formatCurrency(a.buyPrice)}
                    </TableCell>

                    <TableCell className="text-slate-200 font-medium text-sm">
                      {formatCurrency(currentPrice)}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`text-sm font-semibold block ${
                          rowProfitable ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {rowProfitable ? "+" : ""}
                        {formatCurrency(pl)}
                      </span>
                      <span
                        className={`text-xs ${
                          rowProfitable ? "text-emerald-400/80" : "text-rose-400/80"
                        }`}
                      >
                        {rowProfitable ? "+" : ""}
                        {plPct.toFixed(2)}%
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-100 text-sm">
                      {formatCurrency(assetValue)}
                    </TableCell>

                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => coin.id && navigate(`/market/${coin.id}`)}
                        className="h-8 px-2.5 text-xs font-semibold gap-1"
                      >
                        <span>Trade</span>
                        <ArrowUpRight size={13} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
