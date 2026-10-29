import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders } from "@/State/Order/Action";
import { formatCurrency } from "@/lib/utils";
import { Activity as ActivityIcon, ArrowUpRight, RefreshCw, ShoppingCart, Tag } from "lucide-react";

function formatDateTime(ts) {
  if (!ts) return "N/A";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Activity() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.order);

  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    dispatch(getAllOrders()).catch(() => {});
  }, [dispatch]);

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    if (typeFilter === "BUY") return orders.filter((o) => o.orderType === "BUY");
    if (typeFilter === "SELL") return orders.filter((o) => o.orderType === "SELL");
    return orders;
  }, [orders, typeFilter]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ActivityIcon size={20} className="text-accent" /> Trade & Order History
          </h2>
          <p className="text-xs text-muted mt-1">
            Complete audit trail of all cryptocurrency orders executed on your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList>
              <TabsTrigger value="ALL">All Orders</TabsTrigger>
              <TabsTrigger value="BUY">Buys</TabsTrigger>
              <TabsTrigger value="SELL">Sells</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(getAllOrders())}
            className="gap-1.5 text-xs"
          >
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden border-base-border">
        <CardContent className="p-0">
          {loading && (!filteredOrders || filteredOrders.length === 0) && (
            <div className="text-center text-muted py-16">
              Loading your order history...
            </div>
          )}

          {!loading && (!filteredOrders || filteredOrders.length === 0) && (
            <div className="text-center py-16 px-4">
              <ShoppingCart size={36} className="text-muted/40 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-200 mb-1">
                No orders found
              </p>
              <p className="text-xs text-muted max-w-sm mx-auto mb-5">
                {typeFilter === "ALL"
                  ? "You have not placed any trade orders yet. Select a cryptocurrency to make your first trade."
                  : `No ${typeFilter} orders recorded.`}
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

          {filteredOrders && filteredOrders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Execution Time</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const item = order.orderItem || {};
                  const coin = item.coin || {};
                  const isBuy = order.orderType === "BUY";
                  const unitPrice = isBuy
                    ? item.buyPrice || coin.current_price
                    : item.sellPrice || coin.current_price;

                  return (
                    <TableRow
                      key={order.id}
                      className="hover:bg-base-panel2 transition-colors cursor-pointer"
                      onClick={() => coin.id && navigate(`/market/${coin.id}`)}
                    >
                      <TableCell className="text-xs text-muted font-mono whitespace-nowrap">
                        {formatDateTime(order.timestamp)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.name || "coin"}
                              className="h-7 w-7 rounded-full shadow-sm"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-base-panel2 flex items-center justify-center font-bold text-xs uppercase text-slate-300">
                              {coin.symbol?.[0] || "C"}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-slate-200 text-sm block">
                              {coin.name || "Crypto Asset"}
                            </span>
                            <span className="text-xs text-muted uppercase font-mono">
                              {coin.symbol || "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={isBuy ? "up" : "down"}
                          className={`font-semibold uppercase text-xs px-2.5 py-0.5 ${
                            isBuy
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {order.orderType}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-mono text-slate-200 text-sm">
                        {item.quantity?.toFixed(6) ?? "0.00"}
                      </TableCell>

                      <TableCell className="text-muted text-sm font-mono">
                        {formatCurrency(unitPrice)}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            order.status === "SUCCESS"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : order.status === "PENDING"
                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {order.status || "COMPLETED"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-bold text-slate-100 text-sm font-mono">
                        {formatCurrency(order.price)}
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
