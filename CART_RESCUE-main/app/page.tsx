"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/auth-context";
import {
  User, ShieldCheck, ArrowRight, Zap, LogIn, Sparkles, ShoppingBag
} from "lucide-react";

export default function EntryRoleSelectorPage() {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white flex flex-col justify-between overflow-hidden">
      
      {/* Dynamic Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl animate-aura-2" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[28rem] w-[28rem] rounded-full bg-purple-600/15 blur-3xl animate-aura-3" />

      <Navbar />

      {/* DUAL PORTAL ENTRY HERO */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 my-auto space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-teal-300 text-xs font-mono font-semibold shadow-sm">
            <Zap className="h-3.5 w-3.5 text-teal-400 fill-teal-400/30" />
            <span>Dual-Portal Demo Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            CART <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">RESCUE</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Autonomous AI Decision Engine for Intelligent Cart Recovery
          </p>
        </div>

        {/* ACTIVE SESSION STATUS BANNER IF LOGGED IN */}
        {isAuthenticated && currentUser && (
          <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5 text-left">
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-md ${
                isAdmin
                  ? "bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/30"
                  : "bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/30"
              }`}>
                {isAdmin ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Active Session: {currentUser.username}</span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-teal-300 font-bold border border-white/10">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Authenticated and ready to explore.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={isAdmin ? "/dashboard" : "/store"}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
                  isAdmin ? "glass-btn-primary" : "glass-btn-primary"
                }`}
              >
                Go to {isAdmin ? "Dashboard" : "Store"} →
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* 2 PORTAL OPTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CARD 1: USER LOGIN */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 flex flex-col justify-between group glass-card-hover">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.25)] group-hover:scale-105 transition-transform">
                  <User className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold px-3 py-1 rounded-full glass-pill border-teal-400/30">
                  Customer Portal
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">👤 Customer Portal</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Sign in to browse products, add items to your cart, and trigger realistic abandonment scenarios in the ApexStore storefront.
                </p>
              </div>
            </div>

            <Link
              href="/store/login"
              className="w-full flex items-center justify-center gap-2 glass-btn-primary font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              <LogIn className="h-4 w-4" />
              Customer Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* CARD 2: ADMIN LOGIN */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 flex flex-col justify-between group glass-card-hover">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold px-3 py-1 rounded-full glass-pill border-purple-400/30">
                  Command Center
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">🛡 Command Center</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Sign in as an administrator to monitor real-time recovery streams, agent consensus traces, and financial margin preservation metrics.
                </p>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 glass-btn-secondary hover:bg-white/15 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              Admin Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 text-center text-xs text-slate-400 border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Zap className="h-4 w-4 text-teal-400 fill-teal-400/30" />
            CART RESCUE • Autonomous AI Decision Engine
          </div>
          <span className="text-slate-400 text-[11px]">Production Architecture • FastAPI & Next.js</span>
        </div>
      </footer>

    </div>
  );
}
