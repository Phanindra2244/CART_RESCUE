"use client";

import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-teal-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />

      <main className="relative z-10 mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-9 space-y-6 shadow-2xl">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(52,211,153,0.3)]">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Order Placed Successfully!</h1>
            <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              Thank you for your purchase. Your order confirmation has been generated and your items are being prepared for delivery.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/store"
              className="w-full sm:w-auto px-8 flex items-center justify-center gap-2 glass-btn-primary font-black py-4 rounded-2xl text-xs uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
