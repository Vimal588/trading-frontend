import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/layout/Layout";

import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import Activity from "@/pages/Activity";
import Watchlist from "@/pages/Watchlist";
import WalletPage from "@/pages/Wallet";
import PaymentDetails from "@/pages/PaymentDetails";
import Withdrawal from "@/pages/Withdrawal";
import Profile from "@/pages/Profile";
import MarketDetail from "@/pages/MarketDetail";
import PaymentCallback from "@/pages/PaymentCallback";

import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUser } from "@/State/Auth/Action";
import { getUserWallet } from "@/State/Wallet/Action";

export default function App() {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser()).catch(() => {});
      dispatch(getUserWallet()).catch(() => {});
    }
  }, [dispatch, jwt]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={jwt ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={jwt ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/market/:coinId" element={<MarketDetail />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={jwt ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
