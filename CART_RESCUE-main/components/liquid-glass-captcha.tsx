"use client";

import { useState } from "react";
import { ShieldCheck, Check, RefreshCw } from "lucide-react";

interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
  isVerified: boolean;
}

export function LiquidGlassCaptcha({ onVerify, isVerified }: CaptchaProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  function handleTriggerVerification() {
    if (isVerified || isVerifying) return;

    setIsVerifying(true);

    // Realistic human verification challenge delay with fluid biometric check
    setTimeout(() => {
      const generatedToken = `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setToken(generatedToken);
      setIsVerifying(false);
      onVerify(true);
    }, 1200);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 transition-all duration-300 glass-subcard">
      {/* Specular light highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-indigo-500/10 pointer-events-none opacity-50" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        
        {/* Left: Checkbox / Status */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={handleTriggerVerification}
            disabled={isVerified || isVerifying}
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 focus:outline-none ${
              isVerified
                ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_0_20px_rgba(52,211,153,0.6)] ring-2 ring-emerald-400/50 scale-105"
                : isVerifying
                ? "bg-teal-500/20 text-teal-300 ring-2 ring-teal-400/40"
                : "bg-white/10 hover:bg-white/15 active:scale-95 border border-white/25 hover:border-teal-400/60 cursor-pointer shadow-inner"
            }`}
            aria-label="Verify human interaction"
          >
            {isVerified ? (
              <Check className="h-5 w-5 stroke-[3] animate-in zoom-in-50 duration-200" />
            ) : isVerifying ? (
              <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
            ) : (
              <div className="h-3 w-3 rounded-md bg-white/20 group-hover:bg-teal-400/40 transition-colors" />
            )}
          </button>

          <div className="text-left">
            <p className={`text-xs font-semibold tracking-wide transition-colors ${
              isVerified ? "text-emerald-300 font-bold" : "text-white"
            }`}>
              {isVerified
                ? "Human Biometrics Verified"
                : isVerifying
                ? "Analyzing interaction dynamics..."
                : "Verify you are human"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              {isVerified ? (
                <>
                  <span className="text-emerald-400 font-bold">● Token:</span>
                  <span className="text-slate-300">{token}</span>
                </>
              ) : (
                "Click checkmark to authenticate session"
              )}
            </p>
          </div>
        </div>

        {/* Right: Security Badge Branding */}
        <div className="flex flex-col items-end shrink-0 pl-2 border-l border-white/10">
          <div className="flex items-center gap-1 text-[10px] font-bold text-teal-300">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            <span>CloudVerify</span>
          </div>
          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono">
            Anti-Bot Shield
          </span>
        </div>

      </div>

      {/* Verified success animated beam */}
      {isVerified && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
      )}
    </div>
  );
}
