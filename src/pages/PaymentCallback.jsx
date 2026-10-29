import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addMoneyToWallet, getUserWallet } from "@/State/Wallet/Action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function PaymentCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("Verifying payment with gateway...");

  useEffect(() => {
    let active = true;

    const processPayment = async () => {
      const orderId = searchParams.get("order_id");
      const paymentId =
        searchParams.get("razorpay_payment_id") ||
        searchParams.get("payment_id") ||
        searchParams.get("session_id");

      if (!orderId || !paymentId) {
        if (active) {
          setStatus("error");
          setMessage("Payment parameters are missing from callback URL.");
        }
        return;
      }

      try {
        await dispatch(addMoneyToWallet(orderId, paymentId));
        await dispatch(getUserWallet());

        if (active) {
          setStatus("success");
          setMessage("Payment verified successfully! Your wallet has been credited.");
        }
      } catch (error) {
        if (active) {
          setStatus("error");
          setMessage(
            error?.response?.data?.message ||
              error.message ||
              "Payment verification failed."
          );
        }
      }
    };

    processPayment();

    return () => {
      active = false;
    };
  }, [dispatch, searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-base-border text-center p-6">
        <div className="flex justify-center mb-4">
          {status === "verifying" ? (
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Loader2 size={30} className="animate-spin" />
            </div>
          ) : status === "success" ? (
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle size={32} />
            </div>
          )}
        </div>

        <CardTitle className="text-xl font-bold text-slate-100 mb-2">
          {status === "verifying"
            ? "Verifying Payment"
            : status === "success"
            ? "Deposit Confirmed"
            : "Payment Unsuccessful"}
        </CardTitle>

        <p className="text-xs text-muted leading-relaxed mb-6">
          {message}
        </p>

        <Button
          onClick={() => navigate("/wallet")}
          className="w-full gap-2 font-semibold"
        >
          <span>Go to Wallet</span>
          <ArrowRight size={15} />
        </Button>
      </Card>
    </div>
  );
}
