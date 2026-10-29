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
import { getPaymentDetails, addPaymentDetails } from "@/State/Payment/Action";
import { useToast } from "@/context/ToastContext";
import {
  CreditCard,
  Building,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";

export default function PaymentDetails() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { paymentDetails, loading } = useSelector((state) => state.payment);

  const [formData, setFormData] = useState({
    accountNumber: "",
    accountHolderName: "",
    ifsc: "",
    bankName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getPaymentDetails())
      .then((data) => {
        if (data) {
          setFormData({
            accountNumber: data.accountNumber || "",
            accountHolderName: data.accountHolderName || "",
            ifsc: data.ifsc || "",
            bankName: data.bankName || "",
          });
        }
      })
      .catch(() => {});
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.accountNumber.trim()) {
      setError("Account number is required.");
      return;
    }
    if (!formData.accountHolderName.trim()) {
      setError("Account holder name is required.");
      return;
    }
    if (!formData.ifsc.trim()) {
      setError("IFSC / Bank Code is required.");
      return;
    }
    if (!formData.bankName.trim()) {
      setError("Bank name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(addPaymentDetails(formData));
      toast.success("Bank account details saved successfully.");
      dispatch(getPaymentDetails());
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save bank details";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const hasExistingAccount = Boolean(
    paymentDetails?.accountNumber || formData.accountNumber
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CreditCard size={20} className="text-accent" /> Bank & Payout Details
        </h2>
        <p className="text-xs text-muted mt-1">
          Registered bank account for direct fiat withdrawals and settlements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Visual Bank Card Preview */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-base-panel to-slate-800 border border-base-border2 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-44 h-44 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="font-bold tracking-wider text-sm flex items-center gap-1.5 text-accent">
                <Building size={16} />
                {formData.bankName || "YOUR BANK NAME"}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={11} /> Verified
              </span>
            </div>

            <div className="space-y-1 mb-8 relative z-10 font-mono tracking-widest text-lg sm:text-xl font-semibold text-slate-100">
              {formData.accountNumber
                ? formData.accountNumber.length > 4
                  ? `•••• •••• •••• ${formData.accountNumber.slice(-4)}`
                  : formData.accountNumber
                : "•••• •••• •••• ••••"}
            </div>

            <div className="flex items-end justify-between relative z-10 text-xs">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                  Account Holder
                </p>
                <p className="font-semibold text-slate-200 uppercase">
                  {formData.accountHolderName || "FULL LEGAL NAME"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                  IFSC / Code
                </p>
                <p className="font-mono font-semibold text-slate-200 uppercase">
                  {formData.ifsc || "IFSC000000"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-base-border bg-base-panel2 text-xs text-muted">
            <Lock size={15} className="text-accent shrink-0" />
            <span>
              Bank credentials are encrypted and strictly used for withdrawal disbursement.
            </span>
          </div>
        </div>

        {/* Edit / Add Bank Details Form */}
        <Card className="border-base-border">
          <CardHeader className="border-b border-base-border px-5 py-4">
            <CardTitle className="text-base font-bold text-slate-100">
              {hasExistingAccount ? "Update Bank Account" : "Add Bank Account"}
            </CardTitle>
            <CardDescription className="text-xs text-muted mt-0.5">
              Ensure details match your bank passbook or statement.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5">
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Bank Name
                </label>
                <Input
                  placeholder="e.g. JPMorgan Chase / HDFC Bank"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Account Holder Name
                </label>
                <Input
                  placeholder="Legal name on bank account"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountHolderName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Account Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter full account number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  IFSC / Routing / Swift Code
                </label>
                <Input
                  placeholder="e.g. HDFC0001234"
                  value={formData.ifsc}
                  onChange={(e) =>
                    setFormData({ ...formData, ifsc: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-10 font-semibold mt-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin" /> Saving Details...
                  </span>
                ) : hasExistingAccount ? (
                  "Update Bank Details"
                ) : (
                  "Save Bank Details"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
