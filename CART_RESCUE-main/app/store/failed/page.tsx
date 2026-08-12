"use client";

import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { useStore } from "@/context/store-context";
import { XCircle, ArrowRight, Zap } from "lucide-react";

export default function PaymentFailedPage() {
  const { cartTotal, shippingFee } = useStore();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-teal-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />
      <NotificationModal />

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 space-y-6">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-9 space-y-6 text-center shadow-2xl">
          
          <div className="h-16 w-16 rounded-2xl bg-red-500/20 text-red-300 border border-red-400/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(248,113,113,0.3)]">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-300 text-xs font-mono border border-red-400/30 font-bold">
              Gateway Exception Triggered
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">Payment Interrupted</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
              Your payment could not be processed due to a temporary bank gateway hiccup. Your cart items remain safely reserved.
            </p>
          </div>

          {/* AI Decision Box */}
          <div className="glass-subcard p-5 rounded-2xl text-left space-y-3 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-purple-400" />
                Autonomous Rescue Intervention
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] border border-emerald-400/30 font-bold">
                CRITIC APPROVED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Behavior Agent diagnosed <strong className="text-purple-300">Payment Failure</strong>. Strategy Agent selected 1-Click Instant Retry Link preserving 100% gross margin.
            </p>

            <div className="pt-2">
              <Link
                href="/store/recovery"
                className="w-full flex items-center justify-center gap-2 glass-btn-primary font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                1-Click Instant Payment Retry (${(cartTotal + shippingFee).toFixed(2)})
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
