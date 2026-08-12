"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useStore } from "@/context/store-context";
import { LiquidGlassCaptcha } from "@/components/liquid-glass-captcha";
import {
  Lock,
  User,
  LogIn,
  ArrowRight,
  UserPlus,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { setCustomerName, recordActivity } = useStore();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isHumanVerified, setIsHumanVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function handleLogin() {
    if (!isHumanVerified) {
      setMessage({
        type: "error",
        text: "Human verification required. Please click the security checkbox below.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        setCustomerName(username.trim());
        recordActivity(username.trim(), "LOGIN");
        setMessage({ type: "success", text: result.message });
        setTimeout(() => {
          router.push("/store");
        }, 800);
      } else {
        setMessage({ type: "error", text: result.message });
        setLoading(false);
      }
    }, 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="relative min-h-screen text-white font-sans flex flex-col justify-between overflow-hidden selection:bg-teal-500 selection:text-white">
      
      {/* Dynamic Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/25 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-indigo-600/25 blur-3xl animate-aura-2" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-aura-3" />

      {/* Top Frosted Glass Navigation Bar */}
      <header className="relative z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center font-extrabold text-lg text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.5)] group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <span className="font-black tracking-tight text-white text-lg block">ApexStore</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-teal-300 block -mt-1 font-semibold">Customer Portal</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold glass-pill px-3.5 py-1.5 rounded-full transition-all hover:bg-white/15"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180 text-teal-400" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-5">
          
          {/* Main Card */}
          <div className="glass-panel rounded-3xl overflow-hidden p-8 sm:p-9 space-y-6">
            
            {/* Header / Avatar */}
            <div className="text-center space-y-2">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-500/30 to-indigo-500/30 border border-white/25 flex items-center justify-center text-teal-300 shadow-[0_0_25px_rgba(20,184,166,0.3)]">
                <LogIn className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white pt-1">
                Customer Sign In
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Sign in to browse products, manage orders, and unlock customer benefits
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-teal-400" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your customer username"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-teal-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full glass-input rounded-xl px-4 py-3 pr-11 text-sm placeholder-slate-400 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Human Verification Widget */}
              <div className="pt-1">
                <LiquidGlassCaptcha
                  isVerified={isHumanVerified}
                  onVerify={(verified) => {
                    setIsHumanVerified(verified);
                    if (verified && message?.text.includes("Human verification")) {
                      setMessage(null);
                    }
                  }}
                />
              </div>

              {/* Message Alert */}
              {message && (
                <div
                  className={`flex items-center gap-2.5 text-xs font-medium rounded-xl p-3 border backdrop-blur-md animate-in fade-in-50 duration-200 ${
                    message.type === "success"
                      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
                      : "bg-red-500/15 border-red-400/30 text-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username || !password || !isHumanVerified}
                className="w-full glass-btn-primary font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Authenticating..." : "Sign In to Store"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] uppercase font-mono text-slate-400">New customer?</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Sign Up Link */}
              <Link
                href="/store/signup"
                className="w-full flex items-center justify-center gap-2 glass-pill hover:bg-white/15 text-white font-bold py-3 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
              >
                <UserPlus className="h-4 w-4 text-teal-400" />
                Create New Customer Account
              </Link>

            </form>
          </div>

          {/* Quick Demo Customer Accounts Box */}
          <div className="glass-subcard rounded-2xl p-4 text-center space-y-2">
            <p className="text-[11px] text-teal-300 font-semibold flex items-center justify-center gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-teal-400/30 text-teal-400" />
              <span>One-Click Demo Customer Logins:</span>
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setUsername("Samantha");
                  setPassword("vip123");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                Samantha (VIP)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername("David");
                  setPassword("david123");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <User className="h-3.5 w-3.5 text-indigo-400" />
                David (Shopper)
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400 border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <ShoppingBag className="h-4 w-4 text-teal-400" />
            ApexStore Customer Experience Portal
          </div>
          <span className="text-slate-400 text-[11px]">Protected by CloudVerify Anti-Bot Security</span>
        </div>
      </footer>

    </div>
  );
}
