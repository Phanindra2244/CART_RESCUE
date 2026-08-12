"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, AlertTriangle, CheckCircle2, Lock, ShieldCheck } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const { cartTotal, shippingFee, couponDiscount, appliedCouponCode, setPaymentErrorTriggered, runEngine, clearCart, recordPlacedOrder } = useStore();
  const [loading, setLoading] = useState<boolean>(false);

  // Total due after coupon discount (if any) plus shipping.
  const totalDue = cartTotal - couponDiscount + shippingFee;

  async function handleSimulateSuccess() {
    setLoading(true);
    setPaymentErrorTriggered(false);
    recordPlacedOrder();
    clearCart();
    router.push("/store/success");
  }

  async function handleSimulateFailure() {
    setLoading(true);
    setPaymentErrorTriggered(true);
    await runEngine({ payment_error_triggered: true });
    router.push("/store/failed");
  }

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />
      <NotificationModal />

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 space-y-6">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-9 space-y-6 text-center shadow-2xl">
          
          <div className="h-14 w-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 mx-auto shadow-[0_0_20px_rgba(45,212,191,0.25)]">
            <CreditCard className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Payment Gateway Simulator</h1>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
              Complete the transaction or simulate an unexpected gateway failure to observe automated multi-agent recovery interventions.
            </p>
          </div>

          <div className="glass-subcard p-4 rounded-2xl text-xs font-mono flex items-center justify-between">
            <span className="text-slate-300">Total Order Amount Due:</span>
            <span className="text-xl font-black text-teal-400">{formatCurrency(totalDue)}</span>
          </div>

          {appliedCouponCode && (
            <div className="text-xs text-emerald-300 font-mono font-semibold glass-pill p-2 rounded-xl border-emerald-400/30">
              ✅ Coupon "{appliedCouponCode}" applied — 50% discount (-{formatCurrency(couponDiscount)})
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleSimulateSuccess}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-slate-950" />
              Complete Payment Successfully ({formatCurrency(totalDue)})
            </button>

            <button
              onClick={handleSimulateFailure}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              Simulate Gateway Error
            </button>
          </div>

          <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-center gap-2 border-t border-white/10 font-mono">
            <Lock className="h-3.5 w-3.5 text-teal-400" />
            <span>256-bit Encrypted Payment Gateway Protocol</span>
          </div>

        </div>

      </main>
    </div>
  );
}
