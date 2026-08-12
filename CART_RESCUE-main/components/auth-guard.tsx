"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ShieldAlert, LogIn, Lock, User, Sparkles } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer" | "any";
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  requiredRole = "any",
  title,
  description,
}: AuthGuardProps) {
  const router = useRouter();
  const { currentUser, isAuthenticated, isAdmin, isLoaded, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // Check role authorization
  const isAuthorized =
    isAuthenticated &&
    (requiredRole === "any" ||
      (requiredRole === "admin" && isAdmin) ||
      (requiredRole === "customer" && currentUser?.role === "customer"));

  if (!isAuthorized) {
    const isRoleMismatch = isAuthenticated && requiredRole === "admin" && !isAdmin;
    const loginLink = requiredRole === "admin" ? "/admin/login" : "/store/login";

    return (
      <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-purple-600/20 blur-3xl animate-aura-1" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-[28rem] w-[28rem] rounded-full bg-teal-500/15 blur-3xl animate-aura-2" />

        <div className="relative z-10 max-w-md w-full glass-panel rounded-3xl p-8 shadow-2xl space-y-6 text-center border border-white/15 backdrop-blur-2xl">
          
          <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            {requiredRole === "admin" ? (
              <ShieldAlert className="h-8 w-8 text-amber-400" />
            ) : (
              <Lock className="h-8 w-8 text-teal-400" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {title || (requiredRole === "admin" ? "Admin Clearance Required" : "Authentication Required")}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {description ||
                (isRoleMismatch
                  ? `You are currently authenticated as "${currentUser?.username}" (Customer). This command center requires Administrator credentials.`
                  : requiredRole === "admin"
                  ? "You must authenticate with an Administrator account to view multi-agent traces and system analytics."
                  : "Please sign in to your account to continue.")}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-2">
            {isRoleMismatch ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/admin/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 glass-btn-primary font-bold py-3.5 rounded-xl text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  Switch to Admin Account
                </button>
                <Link
                  href="/store"
                  className="w-full flex items-center justify-center gap-2 glass-btn-secondary hover:bg-white/15 text-white font-bold py-3 rounded-xl text-xs transition-all"
                >
                  <User className="h-4 w-4 text-teal-400" />
                  Return to Store Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={loginLink}
                  className="w-full flex items-center justify-center gap-2 glass-btn-primary font-bold py-3.5 rounded-xl text-xs shadow-lg transition-all active:scale-95"
                >
                  <LogIn className="h-4 w-4" />
                  {requiredRole === "admin" ? "Sign In as Admin" : "Sign In to Continue"}
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-1.5 glass-btn-secondary hover:bg-white/15 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition-all"
                  >
                    Back Home
                  </Link>
                  <Link
                    href="/store"
                    className="flex items-center justify-center gap-1.5 glass-btn-secondary hover:bg-white/15 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition-all"
                  >
                    ApexStore
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Quick Demo Hint */}
          <div className="glass-subcard rounded-2xl p-3 text-[11px] text-slate-300 font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Admin credentials: <strong className="text-teal-300 font-bold">admin / admin123</strong></span>
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
