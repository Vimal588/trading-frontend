import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Copy,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ArrowLeftRight,
  ArrowDownToLine,
  Wallet as WalletIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  getUserWallet,
  walletToWalletTransfer,
  getTransactions,
  requestWithdrawal,
  addMoneyToWallet,
} from "@/State/Wallet/Action";
import { createPaymentOrder } from "@/State/Payment/Action";
import { useToast } from "@/context/ToastContext";

function getErrorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || error?.message || "Something went wrong.";
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

// -------------------- TOP UP MODAL --------------------
function TopUpModal({ open, onOpenChange, onSuccess }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("RAZORPAY");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleProceed = async () => {
    setError("");
    const value = Math.round(Number(amount));

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid whole-number amount.");
      return;
    }

    if (value > 1000000) {
      setError("Amount exceeds allowed limit ($1,000,000).");
      return;
    }

    try {
      setSubmitting(true);
      const response = await dispatch(
        createPaymentOrder(method.toUpperCase(), value)
      );

      const paymentUrl =
        response?.payment_url || response?.paymentUrl || response?.url;

      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      setError("Payment order created, but no redirect URL was returned.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} className="text-accent" /> Top Up Your Wallet
          </DialogTitle>
          <DialogDescription>
            Add funds using your preferred secure payment gateway.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Deposit Amount (USD, whole number)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-2 block">
              Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "RAZORPAY", label: "Razorpay" },
                { id: "STRIPE", label: "Stripe" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={`rounded-xl border p-3.5 text-sm font-semibold transition-all ${
                    method === item.id
                      ? "border-accent bg-accent/15 text-accent shadow-sm"
                      : "border-base-border2 bg-base-panel2 text-slate-300 hover:border-base-border"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleProceed} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Redirecting...
              </span>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -------------------- WITHDRAW MODAL --------------------
function WithdrawModal({ open, onOpenChange, wallet, onSuccess }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const balance = Number(wallet?.balance ?? 0);

  const handleWithdraw = async () => {
    setError("");
    const value = Math.round(Number(amount));

    if (!Number.isSafeInteger(value) || value <= 0) {
      setError("Enter a positive whole-number amount.");
      return;
    }

    if (value > balance) {
      setError("Insufficient wallet balance.");
      return;
    }

    try {
      setSubmitting(true);
      const withdrawal = await dispatch(requestWithdrawal(value));
      setAmount("");
      onOpenChange(false);
      onSuccess(`Withdrawal request #${withdrawal?.id ?? ""} created successfully.`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownToLine size={18} className="text-accent" /> Request Withdrawal
          </DialogTitle>
          <DialogDescription>
            Withdraw available balance directly to your registered bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-base-border2 bg-base-panel2 p-3.5">
            <p className="text-xs text-muted mb-0.5">Available Wallet Balance</p>
            <p className="text-2xl font-extrabold text-slate-100">
              {formatCurrency(balance)}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Withdrawal Amount (USD)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleWithdraw} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </span>
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -------------------- P2P TRANSFER MODAL --------------------
function TransferModal({ open, onOpenChange, onSuccess }) {
  const dispatch = useDispatch();
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    setError("");
    const value = Math.round(Number(amount));
    const receiverId = Number(walletId);

    if (
      !Number.isSafeInteger(receiverId) ||
      receiverId <= 0 ||
      !Number.isSafeInteger(value) ||
      value <= 0
    ) {
      setError("Enter a valid receiver Wallet ID and whole-number amount.");
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(walletToWalletTransfer(receiverId, { amount: value }));
      setAmount("");
      setWalletId("");
      onOpenChange(false);
      onSuccess("P2P wallet transfer completed successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight size={18} className="text-accent" /> Peer-to-Peer Transfer
          </DialogTitle>
          <DialogDescription>
            Instant internal transfer to another platform user's wallet ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Receiver Wallet ID
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 5"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              Transfer Amount (USD)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Transferring...
              </span>
            ) : (
              "Confirm Transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -------------------- MAIN WALLET PAGE --------------------
export default function WalletPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const {
    wallet,
    loading,
    transactions = [],
    transactionsLoading = false,
  } = useSelector((state) => state.wallet);

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const callbackHandled = useRef(false);

  const loadWalletData = async () => {
    await Promise.allSettled([
      dispatch(getUserWallet()),
      dispatch(getTransactions()),
    ]);
  };

  useEffect(() => {
    loadWalletData();
  }, [dispatch]);

  // Payment Callback Auto-Verification
  useEffect(() => {
    if (callbackHandled.current) return;

    const orderId = searchParams.get("order_id");
    const paymentId =
      searchParams.get("razorpay_payment_id") ||
      searchParams.get("payment_id") ||
      searchParams.get("session_id");

    if (!orderId || !paymentId) return;

    callbackHandled.current = true;

    (async () => {
      try {
        toast.info("Verifying payment callback with gateway...");
        await dispatch(addMoneyToWallet(orderId, paymentId));
        await loadWalletData();
        toast.success("Deposit confirmed! Funds credited to your wallet.");
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        navigate("/wallet", { replace: true });
      }
    })();
  }, [searchParams, dispatch, navigate, toast]);

  const copyWalletId = async () => {
    if (!wallet?.id) return;
    try {
      await navigator.clipboard.writeText(String(wallet.id));
      setCopied(true);
      toast.info(`Wallet ID #${wallet.id} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy wallet ID");
    }
  };

  const handleSuccess = (text) => {
    toast.success(text);
    loadWalletData();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Wallet Balance Hero Card */}
      <Card className="border-base-border bg-gradient-to-br from-base-panel via-base-panel to-base-panel2 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 text-xs text-muted mb-2">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Primary Trading Wallet
              </span>
              <span>&bull;</span>
              <button
                onClick={copyWalletId}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-panel2 border border-base-border2 hover:border-accent/40 text-slate-200 transition-colors"
                title="Copy Wallet ID"
              >
                <span>ID: #{wallet?.id ?? "..."}</span>
                <Copy size={12} className={copied ? "text-accent" : "text-muted"} />
              </button>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              {formatCurrency(wallet?.balance ?? 0)}
            </div>

            <p className="text-xs text-muted mt-2">
              Available USD balance for instant cryptocurrency execution.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setTopUpOpen(true)}
              className="gap-2 font-semibold shadow-md shadow-accent/20"
            >
              <Plus size={16} /> Top Up
            </Button>

            <Button
              variant="outline"
              onClick={() => setTransferOpen(true)}
              className="gap-2 font-semibold border-base-border2 hover:bg-base-panel2"
            >
              <ArrowLeftRight size={16} /> Transfer
            </Button>

            <Button
              variant="outline"
              onClick={() => setWithdrawOpen(true)}
              className="gap-2 font-semibold border-base-border2 hover:bg-base-panel2"
            >
              <ArrowDownToLine size={16} /> Withdraw
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={loadWalletData}
              className="text-muted hover:text-slate-100"
              title="Refresh wallet"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction History Section */}
      <Card className="border-base-border overflow-hidden">
        <CardHeader className="border-b border-base-border px-5 py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-100">
              Wallet Transaction History
            </CardTitle>
            <CardDescription className="text-xs text-muted mt-0.5">
              Audited log of deposits, transfers, and wallet deductions.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(getTransactions())}
            className="text-xs gap-1.5"
          >
            <RefreshCw size={13} className={transactionsLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {transactionsLoading && transactions.length === 0 && (
            <div className="text-center text-muted py-14">
              Loading wallet transactions...
            </div>
          )}

          {!transactionsLoading && transactions.length === 0 && (
            <div className="text-center py-14 px-4 text-muted text-sm">
              No wallet transactions recorded yet.
            </div>
          )}

          {transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-base-border text-left text-xs text-muted font-medium bg-base-panel2/50">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Details / Purpose</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-border/50">
                  {transactions.map((tx) => {
                    const type = tx.type || "TRANSACTION";
                    const isCredit =
                      type === "ADD_MONEY" || type === "SELL_ASSET";

                    return (
                      <tr key={tx.id} className="hover:bg-base-panel2 transition-colors">
                        <td className="px-5 py-3.5 text-xs text-muted font-mono whitespace-nowrap">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                              isCredit
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                                : "bg-base-panel2 text-slate-300 border border-base-border2"
                            }`}
                          >
                            {type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 text-xs">
                          {tx.purpose || tx.transferId || "General wallet transaction"}
                        </td>
                        <td
                          className={`px-5 py-3.5 text-right font-bold font-mono text-sm ${
                            isCredit ? "text-emerald-400" : "text-slate-100"
                          }`}
                        >
                          {isCredit ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSuccess={handleSuccess}
      />
      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        wallet={wallet}
        onSuccess={handleSuccess}
      />
      <TransferModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
