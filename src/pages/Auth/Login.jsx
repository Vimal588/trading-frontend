import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, ShieldCheck, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  verifyTwoFactorOtp,
  sendForgotPasswordOtp,
  resetPassword,
  getUser,
} from "@/State/Auth/Action";
import { useToast } from "@/context/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { jwt, loading, error, twoFactorSession, twoFactorMessage } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [submittingOtp, setSubmittingOtp] = useState(false);

  // Forgot password dialog state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = enter email, 2 = enter otp + new pass
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotSessionId, setForgotSessionId] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser()).catch(() => {});
      toast.success("Welcome back! Logged in successfully.");
      navigate("/");
    }
  }, [jwt, dispatch, navigate]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login(formData));
      if (res?.twoFactor) {
        toast.info("Two-Factor Authentication required. Check your email for OTP.");
      }
    } catch (err) {
      // Error message is set in redux auth.error
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!twoFactorOtp.trim()) return;
    setSubmittingOtp(true);
    try {
      await dispatch(verifyTwoFactorOtp(twoFactorOtp.trim(), twoFactorSession));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to verify 2FA OTP");
    } finally {
      setSubmittingOtp(false);
    }
  };

  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await dispatch(
        sendForgotPasswordOtp({
          sendTo: forgotEmail,
          verificationType: "EMAIL",
        })
      );
      setForgotSessionId(res?.session || "");
      setForgotStep(2);
      toast.success("Password reset code sent to your email.");
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || "Failed to send reset code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp || !forgotNewPass) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      await dispatch(
        resetPassword(forgotSessionId, {
          otp: forgotOtp.trim(),
          password: forgotNewPass,
        })
      );
      toast.success("Password updated successfully! You can now log in.");
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOtp("");
      setForgotNewPass("");
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-bg px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="h-11 w-11 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <TrendingUp size={24} className="text-black stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-2xl text-slate-100 tracking-tight">
            Apex Trading
          </span>
        </div>

        <div className="rounded-2xl border border-base-border bg-base-panel p-7 shadow-2xl">
          {/* If Two Factor Auth Challenge is Active */}
          {twoFactorSession ? (
            <div>
              <div className="flex items-center gap-2 mb-2 text-accent">
                <ShieldCheck size={20} />
                <h2 className="text-lg font-bold text-slate-100">
                  Two-Factor Authentication
                </h2>
              </div>
              <p className="text-xs text-muted mb-6">
                {twoFactorMessage ||
                  "A verification code has been sent to your registered email. Enter it below to complete sign-in."}
              </p>

              {error && (
                <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    6-Digit Security Code
                  </label>
                  <Input
                    type="text"
                    maxLength={8}
                    autoFocus
                    placeholder="Enter OTP"
                    value={twoFactorOtp}
                    onChange={(e) => setTwoFactorOtp(e.target.value)}
                    className="text-center font-mono text-lg tracking-widest"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingOtp}
                  className="w-full h-11 text-sm font-semibold"
                >
                  {submittingOtp ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Verifying...
                    </span>
                  ) : (
                    "Verify & Proceed"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full text-center text-xs text-muted hover:text-slate-200 mt-2 flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </form>
            </div>
          ) : (
            /* Standard Login Form */
            <div>
              <h1 className="text-xl font-bold text-slate-100 mb-1.5">
                Welcome back
              </h1>
              <p className="text-xs text-muted mb-6">
                Sign in to your account to monitor markets and execute trades.
              </p>

              {error && (
                <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmitLogin}>
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Email address
                  </label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setForgotError("");
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-base-border text-center text-xs text-muted">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-accent font-semibold hover:underline"
                >
                  Create one now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={18} className="text-accent" /> Reset Password
            </DialogTitle>
            <DialogDescription>
              {forgotStep === 1
                ? "Enter your email to receive a password reset verification code."
                : "Enter the code sent to your email and your new password."}
            </DialogDescription>
          </DialogHeader>

          {forgotError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {forgotError}
            </div>
          )}

          {forgotStep === 1 ? (
            <form onSubmit={handleSendForgotOtp} className="space-y-4 py-2">
              <div>
                <label className="text-xs text-muted mb-1 block">Your Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 py-2">
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Verification OTP
                </label>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={forgotNewPass}
                  onChange={(e) => setForgotNewPass(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    "Set New Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
