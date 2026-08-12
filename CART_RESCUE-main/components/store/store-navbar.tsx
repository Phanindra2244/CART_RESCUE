"use client";

import Link from "next/link";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import {
  Activity,
  LogOut,
  Search,
  ShoppingCart,
  User,
  ShoppingBag,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function StoreNavbar() {
  const { itemCount, cartTotal, triggerDemoScenario, sessionId } = useStore();
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 text-white shadow-lg">
      
      {/* Telemetry & Scenario Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-black/30 px-4 py-1.5 font-mono text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 text-teal-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
          </span>
          <span className="text-[11px]">
            Telemetry Stream Active ({sessionId || "initializing..."})
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="hidden text-slate-400 sm:inline">
            Simulate Scenarios:
          </span>

          <button
            type="button"
            onClick={() => triggerDemoScenario("PAYMENT_FAIL")}
            className="rounded-lg border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-purple-300 hover:bg-purple-500/30 transition-all cursor-pointer"
          >
            1. Payment Failure
          </button>

          <button
            type="button"
            onClick={() => triggerDemoScenario("SHIPPING_COST")}
            className="rounded-lg border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer"
          >
            2. Shipping Friction
          </button>

          <button
            type="button"
            onClick={() => triggerDemoScenario("PRICE_COMPARE")}
            className="rounded-lg border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 text-blue-300 hover:bg-blue-500/30 transition-all cursor-pointer"
          >
            3. Price Compare
          </button>

          <button
            type="button"
            onClick={() => triggerDemoScenario("RETURNING_VIP")}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            4. Returning VIP
          </button>
        </div>
      </div>

      {/* Main Store Brand & Controls Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/store" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 text-lg font-black text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)] group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <span className="block text-lg font-black tracking-tight text-white">
              ApexStore
            </span>
            <span className="-mt-1 block font-mono text-[9px] uppercase tracking-wider text-teal-300">
              E-Commerce Storefront
            </span>
          </div>
        </Link>

        <div className="relative mx-8 hidden max-w-md flex-1 items-center md:flex">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search catalog (Electronics, Audio, Wearables)..."
            className="w-full rounded-full border border-white/15 bg-white/[0.05] py-2 pl-4 pr-10 text-xs text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/30 backdrop-blur-md transition-all"
          />
          <Search
            aria-hidden="true"
            className="absolute right-3.5 h-4 w-4 text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                title={`Signed in as ${currentUser.username}`}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-slate-200 backdrop-blur-md"
              >
                <User className="h-4 w-4 text-teal-400" />
                <span className="max-w-[90px] truncate font-bold text-white">
                  {currentUser.username}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-300 transition-all hover:bg-red-500/25 active:scale-95 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/store/login"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-xs text-white transition-all hover:bg-white/15 active:scale-95 backdrop-blur-md"
            >
              <User className="h-4 w-4 text-teal-400" />
              <span className="font-bold">Log in</span>
            </Link>
          )}

          <Link
            href="/store/cart"
            className="relative flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs text-white transition-all hover:bg-white/15 backdrop-blur-md active:scale-95"
          >
            <ShoppingCart className="h-4 w-4 text-teal-400" />
            <span className="font-mono font-bold">
              {formatCurrency(cartTotal)}
            </span>

            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 text-[10px] font-black text-slate-950 shadow-[0_0_10px_rgba(45,212,191,0.6)]">
                {itemCount}
              </span>
            )}
          </Link>

          {currentUser?.role === "admin" && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <Activity className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}