import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  Mail,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  sendVerificationOtp,
  enableTwoFactor,
  getUser,
} from "@/State/Auth/Action";
import { useToast } from "@/context/ToastContext";

function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="p-4 rounded-xl border border-base-border bg-base-panel2">
      <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
        {Icon && <Icon size={14} className="text-accent" />}
        <span>{label}</span>
      </div>
      <p className="font-semibold text-slate-100 text-sm truncate">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, loading } = useSelector((state) => state.auth);

  const is2FAEnabled = Boolean(user?.twoFactorAuth?.isEnabled || user?.twoFactorAuth?.enabled);

  // 2FA modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleStartEnable2FA = async () => {
    setOtp("");
    setOtpError("");
    setOtpSending(true);
    setShow2FAModal(true);

    try {
      await dispatch(sendVerificationOtp("EMAIL"));
      toast.info("Verification code sent to your registered email address.");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to send OTP.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpSending(false);
    }
  };

  const handleConfirmEnable2FA = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError("Please enter the verification code.");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");
    try {
      await dispatch(enableTwoFactor(otp.trim()));
      toast.success("Two-Factor Authentication has been successfully enabled!");
      setShow2FAModal(false);
      dispatch(getUser());
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Incorrect verification code.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserIcon size={20} className="text-accent" /> Account & Security
        </h2>
        <p className="text-xs text-muted mt-1">
          Manage your account profile, permissions, and security credentials.
        </p>
      </div>

      {/* User Information Grid */}
      <Card className="border-base-border">
        <CardHeader className="border-b border-base-border px-5 py-4">
          <CardTitle className="text-base font-bold text-slate-100">
            Personal Information
          </CardTitle>
          <CardDescription className="text-xs text-muted">
            Identity information associated with your verified account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoField label="Full Legal Name" value={user?.fullName} icon={UserIcon} />
          <InfoField label="Email Address" value={user?.email} icon={Mail} />
          <InfoField label="Account Role" value={user?.role} icon={ShieldCheck} />
        </CardContent>
      </Card>

      {/* Security Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Two-Factor Authentication Card */}
        <Card className="border-base-border flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-base-border px-5 py-4">
              <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent" /> Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Require an email OTP challenge each time you sign in.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-base-border2 bg-base-panel2">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      is2FAEnabled
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {is2FAEnabled ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <ShieldAlert size={22} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      2-Step Email Verification
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {is2FAEnabled
                        ? "Active & protecting your account."
                        : "Recommended for enhanced trading security."}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                    is2FAEnabled
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  {is2FAEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            {!is2FAEnabled && (
              <Button
                onClick={handleStartEnable2FA}
                disabled={otpSending}
                className="w-full font-semibold"
              >
                {otpSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Sending Code...
                  </span>
                ) : (
                  "Enable Two-Factor Authentication"
                )}
              </Button>
            )}
            {is2FAEnabled && (
              <p className="text-xs text-emerald-400/90 text-center">
                &bull; Two-factor protection is active on your account
              </p>
            )}
          </div>
        </Card>

        {/* Security Info Card */}
        <Card className="border-base-border flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-base-border px-5 py-4">
              <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                <KeyRound size={18} className="text-accent" /> Password & Sessions
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Account credentials and JWT session validity.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs text-muted leading-relaxed">
              <p>
                Your session is secured using stateless JWT authentication with encrypted HMAC SHA-256 tokens.
              </p>
              <p>
                Tokens expire automatically after 24 hours. If you ever notice unrecognized activity, log out immediately to revoke active local sessions.
              </p>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Password can be reset anytime using the Forgot Password flow on the login screen.");
              }}
              className="w-full text-xs"
            >
              Password Reset Information
            </Button>
          </div>
        </Card>
      </div>

      {/* Enable 2FA Dialog */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-accent" /> Verify Identity
            </DialogTitle>
            <DialogDescription>
              We have sent a 6-digit confirmation code to{" "}
              <strong className="text-slate-200">{user?.email}</strong>. Enter it
              below to activate 2-Step Verification.
            </DialogDescription>
          </DialogHeader>

          {otpError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {otpError}
            </div>
          )}

          <form onSubmit={handleConfirmEnable2FA} className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted mb-1 block">
                Verification Code
              </label>
              <Input
                type="text"
                maxLength={8}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center font-mono text-lg tracking-widest"
                required
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShow2FAModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={otpVerifying}>
                {otpVerifying ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin" /> Verifying...
                  </span>
                ) : (
                  "Confirm & Enable"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
