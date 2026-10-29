import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  getUserWallet,
  getWithdrawalHistory,
  requestWithdrawal,
  getAllWithdrawalsAdmin,
  proceedWithdrawalAdmin,
} from "@/State/Wallet/Action";
import { useToast } from "@/context/ToastContext";
import {
  RefreshCw,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Loader2,
  Check,
  X,
  Wallet,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function getStatusBadge(status) {
  const s = String(status || "").toUpperCase();
  if (s === "SUCCESS" || s === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
        <CheckCircle2 size={12} /> Approved
      </span>
    );
  }
  if (s === "DECLINE" || s === "REJECTED" || s === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-800">
        <XCircle size={12} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-400 border border-amber-800">
      <Clock size={12} /> Pending Review
    </span>
  );
}

export default function Withdrawal() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { user } = useSelector((state) => state.auth);
  const {
    wallet,
    withdrawals = [],
    withdrawalsLoading = false,
    withdrawalSubmitting = false,
    adminWithdrawals = [],
    adminWithdrawalsLoading = false,
  } = useSelector((state) => state.wallet);

  const [activeTab, setActiveTab] = useState("my"); // "my" | "admin"
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const isAdmin = user?.role === "ROLE_ADMIN";
  const balance = Number(wallet?.balance ?? 0);

  useEffect(() => {
    dispatch(getUserWallet()).catch(() => {});
    dispatch(getWithdrawalHistory()).catch(() => {});
    if (isAdmin) {
      dispatch(getAllWithdrawalsAdmin()).catch(() => {});
    }
  }, [dispatch, isAdmin]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const val = Math.round(Number(amount));

    if (!Number.isSafeInteger(val) || val <= 0) {
      setFormError("Enter a positive whole-number amount.");
      return;
    }

    if (val > balance) {
      setFormError("Insufficient wallet balance for this withdrawal.");
      return;
    }

    try {
      await dispatch(requestWithdrawal(val));
      setAmount("");
      toast.success(`Withdrawal request for ${formatCurrency(val)} submitted.`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit withdrawal";
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleAdminDecision = async (id, accept) => {
    setProcessingId(id);
    try {
      await dispatch(proceedWithdrawalAdmin(id, accept));
      toast.success(
        accept
          ? `Withdrawal #${id} approved.`
          : `Withdrawal #${id} rejected and refunded.`
      );
      dispatch(getWithdrawalHistory());
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to process withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Admin Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ArrowDownToLine size={20} className="text-accent" /> Withdrawal Management
          </h2>
          <p className="text-xs text-muted mt-1">
            Request payouts to your registered bank account and review settlement history.
          </p>
        </div>

        {isAdmin && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="my">My Withdrawals</TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-1.5">
                <Shield size={13} className="text-accent" /> Admin Approvals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {activeTab === "my" ? (
        <div className="space-y-6">
          {/* Top Form + Available Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <Card className="p-5 border-base-border bg-base-panel/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span>Available for Withdrawal</span>
                  <Wallet size={16} className="text-accent" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100 mt-2">
                  {formatCurrency(balance)}
                </div>
              </div>
              <p className="text-xs text-muted mt-4">
                Withdrawal requests are reviewed and disbursed directly to your verified bank account.
              </p>
            </Card>

            {/* Request Form */}
            <Card className="md:col-span-2 border-base-border">
              <CardHeader className="px-5 py-4 border-b border-base-border">
                <CardTitle className="text-base font-bold text-slate-100">
                  New Withdrawal Request
                </CardTitle>
                <CardDescription className="text-xs text-muted">
                  Minimum withdrawal amount is $1.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5">
                {formError && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter amount to withdraw (USD)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={withdrawalSubmitting}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={withdrawalSubmitting || balance <= 0}
                    className="font-semibold gap-1.5 shrink-0"
                  >
                    {withdrawalSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={15} className="animate-spin" /> Submitting...
                      </span>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* User Withdrawal History Table */}
          <Card className="border-base-border overflow-hidden">
            <CardHeader className="border-b border-base-border px-5 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-100">
                  Your Withdrawal Requests
                </CardTitle>
                <CardDescription className="text-xs text-muted mt-0.5">
                  Track the verification status of your payouts.
                </CardDescription>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(getWithdrawalHistory())}
                className="text-xs gap-1.5"
              >
                <RefreshCw size={13} className={withdrawalsLoading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {withdrawalsLoading && withdrawals.length === 0 && (
                <div className="text-center text-muted py-14">
                  Loading withdrawal records...
                </div>
              )}

              {!withdrawalsLoading && withdrawals.length === 0 && (
                <div className="text-center py-14 px-4 text-muted text-sm">
                  No withdrawal requests found.
                </div>
              )}

              {withdrawals.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-base-border text-left text-xs text-muted font-medium bg-base-panel2/50">
                        <th className="px-5 py-3">Request ID</th>
                        <th className="px-5 py-3">Date & Time</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-border/50">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-base-panel2 transition-colors">
                          <td className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-200">
                            #{w.id}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted font-mono whitespace-nowrap">
                            {formatDate(w.date)}
                          </td>
                          <td className="px-5 py-3.5">
                            {getStatusBadge(w.status)}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold font-mono text-slate-100 text-sm">
                            {formatCurrency(w.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Admin Approvals Tab */
        <Card className="border-base-border overflow-hidden">
          <CardHeader className="border-b border-base-border px-5 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shield size={17} className="text-accent" /> System-wide Withdrawal Queue
              </CardTitle>
              <CardDescription className="text-xs text-muted mt-0.5">
                Review and approve or reject user withdrawal requests.
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(getAllWithdrawalsAdmin())}
              className="text-xs gap-1.5"
            >
              <RefreshCw size={13} className={adminWithdrawalsLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {adminWithdrawalsLoading && adminWithdrawals.length === 0 && (
              <div className="text-center text-muted py-14">
                Loading admin withdrawals...
              </div>
            )}

            {!adminWithdrawalsLoading && adminWithdrawals.length === 0 && (
              <div className="text-center py-14 px-4 text-muted text-sm">
                No user withdrawal requests in queue.
              </div>
            )}

            {adminWithdrawals.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-base-border text-left text-xs text-muted font-medium bg-base-panel2/50">
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Current Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-border/50">
                    {adminWithdrawals.map((w) => {
                      const isPending =
                        String(w.status || "").toUpperCase() === "PENDING";
                      const isBusy = processingId === w.id;

                      return (
                        <tr key={w.id} className="hover:bg-base-panel2 transition-colors">
                          <td className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-200">
                            #{w.id}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-slate-200 block text-xs">
                              {w.user?.fullName || "User"}
                            </span>
                            <span className="text-[11px] text-muted">
                              {w.user?.email || "N/A"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted font-mono whitespace-nowrap">
                            {formatDate(w.date)}
                          </td>
                          <td className="px-5 py-3.5 font-bold font-mono text-slate-100 text-sm">
                            {formatCurrency(w.amount)}
                          </td>
                          <td className="px-5 py-3.5">
                            {getStatusBadge(w.status)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() => handleAdminDecision(w.id, true)}
                                  className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
                                >
                                  <Check size={13} /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isBusy}
                                  onClick={() => handleAdminDecision(w.id, false)}
                                  className="h-8 px-2.5 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs gap-1"
                                >
                                  <X size={13} /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted">Processed</span>
                            )}
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
      )}
    </div>
  );
}
