import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register, getUser } from "@/State/Auth/Action";
import { useToast } from "@/context/ToastContext";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { jwt, loading, error } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (jwt) {
      dispatch(getUser()).catch(() => {});
      toast.success("Account created successfully! Welcome to Apex Trading.");
      navigate("/");
    }
  }, [jwt, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(data));
    } catch (err) {
      // Error message is stored in auth.error
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
          <h1 className="text-xl font-bold text-slate-100 mb-1.5">
            Create an account
          </h1>
          <p className="text-xs text-muted mb-6">
            Join thousands of traders enjoying instant crypto execution.
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                Full Name
              </label>
              <Input
                placeholder="Alex Morgan"
                value={data.fullName}
                onChange={(e) =>
                  setData({
                    ...data,
                    fullName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="alex@example.com"
                value={data.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Choose a strong password"
                value={data.password}
                onChange={(e) =>
                  setData({
                    ...data,
                    password: e.target.value,
                  })
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
                  <Loader2 size={16} className="animate-spin" /> Creating Account...
                </span>
              ) : (
                "Get Started"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted text-center mt-6 pt-5 border-t border-base-border">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
