import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, opts = {}) {
  const { decimals = 2 } = opts;
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatNumber(value) {
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return "0";
  }
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatCompact(value) {
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return "$0";
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
}
