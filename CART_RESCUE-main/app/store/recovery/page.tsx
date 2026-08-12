"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreNavbar } from "@/components/store/store-navbar";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Zap, Gift } from "lucide-react";

export default function RecoveryPage() {
  const router = useRouter();
  const { cart, cartTotal, latestRescueData, clearCart, customerName, recordPlacedOrder } = useStore();

  const actionLabel = latestRescueData?.final_action_label || "Waive Shipping Fee ($15.00 Off)";

  function handleCompletePurchase() {
    recordPlacedOrder();
    clearCart();
    router.push("/store/success");
  }

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 space-y-6">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-9 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.25)]">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 text-[10px] font-mono font-bold border border-teal-400/30">
                  Cart Recovery Offer Active
                </span>
                <h1 className="text-xl font-black text-white mt-1">Welcome back, {customerName}!</h1>
                <p className="text-xs text-slate-400">Your items remain preserved and ready for instant checkout.</p>
              </div>
            </div>
          </div>

          {/* Recommended Recovery Banner */}
          <div className="glass-subcard p-4 sm:p-5 rounded-2xl border border-teal-400/30 space-y-2 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-transparent">
            <div className="flex items-center justify-between text-xs font-mono text-teal-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-teal-400" />
                Active Recommendation Applied:
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-400/30">
                OFFER ACTIVE
              </span>
            </div>
            <h3 className="text-base font-black text-white">{actionLabel}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {latestRescueData?.critic?.explanation || "Special cart recovery offer activated for your account."}
            </p>
          </div>

          {/* Saved Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Saved Cart Items</h3>
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between glass-subcard p-3 rounded-2xl text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-xl object-cover bg-slate-900 border border-white/10" />
                  <div>
                    <span className="font-bold text-white block">{item.product.name}</span>
                    <span className="text-slate-400 block font-mono text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white">{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Summary Math */}
          <div className="glass-subcard p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Cart Subtotal</span>
              <span className="text-white font-bold">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Applied Shipping Discount</span>
              <span className="text-emerald-400 font-bold">FREE ($0.00)</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/10 text-sm font-sans">
              <span className="font-bold text-white">Total Due</span>
              <span className="font-black font-mono text-teal-400 text-base">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <button
            onClick={handleCompletePurchase}
            className="w-full flex items-center justify-center gap-2 glass-btn-primary font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete Purchase Now ({formatCurrency(cartTotal)})
          </button>

        </div>

      </main>
    </div>
  );
}
