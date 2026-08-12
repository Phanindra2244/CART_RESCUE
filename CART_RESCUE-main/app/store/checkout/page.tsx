"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Clock, Tag, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Lock, User, LogIn, Sparkles } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const {
    cart, cartTotal, shippingFee, setShippingFee,
    customerName, setCustomerName, customerSegment, setCustomerSegment,
    timeOnCheckoutSec, tabSwitchCount, couponFailedAttempts, incrementCouponFailed,
    runEngine, couponDiscount, setCouponDiscount, appliedCouponCode, setAppliedCouponCode
  } = useStore();

  // Redirect to customer login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push("/store/login");
    } else if (currentUser?.username && (!customerName || customerName === "Samantha Reed")) {
      setCustomerName(currentUser.username);
    }
  }, [isAuthenticated, currentUser, router, customerName, setCustomerName]);

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponMsg, setCouponMsg] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Valid coupon codes: "phanindra" gives 50% off the cart total.
  const VALID_COUPON = "phanindra";
  const COUPON_DISCOUNT_RATE = 0.5;

  function handleApplyCoupon() {
    const code = couponCode.trim().toLowerCase();
    if (!code) return;

    if (code === VALID_COUPON) {
      const discount = cartTotal * COUPON_DISCOUNT_RATE;
      setCouponDiscount(discount);
      setAppliedCouponCode(code);
      setCouponMsg(`✅ Coupon "${couponCode.trim()}" applied! You saved ${formatCurrency(discount)} (50% off).`);
    } else {
      setCouponDiscount(0);
      setAppliedCouponCode("");
      incrementCouponFailed();
      setCouponMsg(`⚠️ Code "${couponCode}" is invalid or expired for this item tier.`);
      // Track coupon failure telemetry event
      runEngine();
    }
    setCouponCode("");
  }

  async function handleSimulateAbandonment() {
    setAnalyzing(true);
    await runEngine();
    setAnalyzing(false);
  }

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />
      <NotificationModal />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
              <CreditCard className="h-6 w-6 text-teal-400" />
              Checkout & Behavioral Telemetry
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Active telemetry monitoring: Dwell time <span className="font-bold text-teal-300">{timeOnCheckoutSec}s</span> | Tab switches <span className="font-bold text-purple-300">{tabSwitchCount}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Fields (7 COLS) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            
            {/* Auth status banner */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-500/15 border border-teal-400/30 text-teal-200 text-xs backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Authenticated as {currentUser.username}</span>
                    <span className="text-[10px] text-teal-300 font-mono">Verified Customer • Instant Checkout</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-300 font-mono font-bold text-[10px] border border-teal-400/30">
                  Active Session
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-2xl glass-subcard text-slate-300 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-teal-400" />
                  <span>Checking out as Guest</span>
                </div>
                <Link
                  href="/store/login"
                  className="flex items-center gap-1 font-bold text-teal-400 hover:text-teal-300 underline"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In for Perks
                </Link>
              </div>
            )}

            {/* Shopper Information */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">1. Shopper Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold block">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold block">Shopper Segment Tier</label>
                  <select
                    value={customerSegment}
                    onChange={(e) => setCustomerSegment(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none bg-slate-900"
                  >
                    <option value="VIP Shopper" className="bg-slate-900 text-white">VIP Shopper</option>
                    <option value="Standard" className="bg-slate-900 text-white">Standard</option>
                    <option value="Price Sensitive" className="bg-slate-900 text-white">Price Sensitive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">2. Shipping Method</h2>
              <div className="space-y-2.5 text-xs">
                <label
                  onClick={() => setShippingFee(15.0)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    shippingFee === 15.0
                      ? "bg-teal-500/20 border-teal-400/50 text-white font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                      : "glass-subcard text-slate-300 hover:bg-white/[0.07]"
                  }`}
                >
                  <span>Express Standard Delivery ($15.00)</span>
                  <span className="font-mono text-teal-300 font-bold">$15.00</span>
                </label>

                <label
                  onClick={() => setShippingFee(0.0)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    shippingFee === 0.0
                      ? "bg-teal-500/20 border-teal-400/50 text-white font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                      : "glass-subcard text-slate-300 hover:bg-white/[0.07]"
                  }`}
                >
                  <span>Economy Free Shipping ($0.00)</span>
                  <span className="font-mono text-emerald-400 font-bold">FREE</span>
                </label>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2">3. Discount Coupon Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. phanindra, SAVE50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 glass-input rounded-xl px-3.5 py-2.5 text-xs placeholder-slate-400 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="glass-btn-secondary hover:bg-white/15 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Apply Code
                </button>
              </div>
              {couponMsg && (
                <p className="text-[11px] text-amber-300 font-mono font-medium p-2 rounded-xl bg-amber-500/10 border border-amber-400/20">
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/store/payment"
                className="flex-1 flex items-center justify-center gap-2 glass-btn-primary font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Proceed to Payment Gateway
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleSimulateAbandonment}
                disabled={analyzing}
                className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 cursor-pointer transition-all"
              >
                <AlertTriangle className="h-4 w-4" />
                Simulate Abandonment
              </button>
            </div>

          </div>

          {/* Cart Summary Side Card (5 COLS) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Order Items</h2>

            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs glass-subcard p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-11 w-11 rounded-xl object-cover bg-slate-900 border border-white/10" />
                    <div>
                      <span className="font-bold text-white block">{item.product.name}</span>
                      <span className="text-slate-400 text-[11px] font-mono">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white text-xs">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-bold">{formatCurrency(cartTotal)}</span>
              </div>
              {appliedCouponCode && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping Fee</span>
                <span className="text-amber-300 font-bold">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans pt-3 border-t border-white/10">
                <span className="font-bold text-white">Total Amount</span>
                <span className="font-black font-mono text-teal-400 text-base">{formatCurrency(cartTotal - couponDiscount + shippingFee)}</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
