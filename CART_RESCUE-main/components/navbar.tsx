"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ShoppingBag, Activity, Play, BarChart3, ShieldCheck, Zap, User, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Activity },
    { label: "Live Simulator", href: "/sessions", icon: Play },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Audit Logs", href: "/audit-log", icon: ShieldCheck },
  ];

  // Overview, Dashboard, Live Simulator, Analytics, Audit Logs should only show on Admin pages, never on the Home page
  const showAdminNav = isAdmin && pathname !== "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 fill-teal-400/30 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-white text-base">CART</span>
              <span className="font-black tracking-tight text-teal-400 text-base">RESCUE</span>
            </div>
            <span className="block text-[9px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Autonomous AI Engine</span>
          </div>
        </Link>

        {/* Navigation Links - Only displayed on Admin pages when authenticated as Admin */}
        {showAdminNav && (
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all duration-150 font-medium",
                    isActive
                      ? "bg-teal-500/20 text-teal-300 font-semibold border border-teal-400/40 shadow-[0_0_15px_rgba(45,212,191,0.25)]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-teal-400" : "text-slate-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Backend Status & User Auth Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            AI Engine Online
          </div>

          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-md ${
                isAdmin
                  ? "bg-purple-500/15 border-purple-400/30 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  : "bg-teal-500/15 border-teal-400/30 text-teal-200 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
              }`}>
                {isAdmin ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-teal-400" />
                )}
                <span className="font-bold text-white">{currentUser.username}</span>
                <span className="text-[10px] uppercase font-mono opacity-75">
                  ({currentUser.role})
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 glass-btn-secondary hover:bg-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5 text-teal-400" />
              <span>Admin Login</span>
            </Link>
          )}

          <Link
            href="/store"
            className="hidden sm:flex items-center gap-1.5 glass-btn-primary px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Store</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
