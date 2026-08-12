import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getRiskBadgeColor(risk: number) {
  if (risk >= 0.81) {
    return "bg-red-50 text-red-600 border-red-200";
  } else if (risk >= 0.61) {
    return "bg-orange-50 text-orange-600 border-orange-200";
  } else if (risk >= 0.31) {
    return "bg-amber-50 text-amber-600 border-amber-200";
  }
  return "bg-emerald-50 text-emerald-600 border-emerald-200";
}

export function getRiskCardBorder(risk: number) {
  if (risk >= 0.81) {
    return "border-l-4 border-l-red-500";
  } else if (risk >= 0.61) {
    return "border-l-4 border-l-orange-500";
  } else if (risk >= 0.31) {
    return "border-l-4 border-l-amber-500";
  }
  return "border-l-4 border-l-emerald-500";
}

export function getIntentColor(intent: string) {
  switch (intent) {
    case "Payment Failure":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Price Comparison":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Shipping Cost":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Delivery Delay":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "No COD":
      return "bg-sky-50 text-sky-700 border-sky-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getActionBadgeColor(action: string) {
  switch (action) {
    case "DO_NOTHING":
      return "bg-slate-100 text-slate-700 border-slate-300 font-bold";
    case "RETRY_PAYMENT_LINK":
      return "bg-purple-50 text-purple-700 border-purple-200 font-bold";
    case "FREE_SHIPPING":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
    case "COUPON_10":
    case "COUPON_15":
      return "bg-teal-50 text-teal-700 border-teal-200 font-bold";
    case "PUSH_REMINDER":
      return "bg-blue-50 text-blue-700 border-blue-200 font-bold";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 font-bold";
  }
}
