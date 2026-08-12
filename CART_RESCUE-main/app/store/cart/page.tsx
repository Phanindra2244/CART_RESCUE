"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, shippingFee } = useStore();
  const [orderStarted, setOrderStarted] = useState(false);
  const [shippingTime, setShippingTime] = useState<string>(
    shippingFee > 0 ? "Monday, Jul 22 • 3:30 PM" : "Wednesday, Jul 24 • 12:00 PM"
  );
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const startOrder = () => {
    // If user is not logged in, redirect to customer login
    if (!isAuthenticated || !currentUser) {
      router.push("/store/login");
      return;
    }
    setShippingTime(shippingFee > 0 ? "Monday, Jul 22 • 3:30 PM" : "Wednesday, Jul 24 • 12:00 PM");
    setOrderStarted(true);
  };

  const handleProceedToCheckout = () => {
    // If user is not logged in, redirect to customer login
    if (!isAuthenticated || !currentUser) {
      router.push("/store/login");
      return;
    }
    if (!orderStarted) {
      startOrder();
    }
    router.push("/store/checkout");
  };

  const handleCancelOrder = () => {
    setShowCancelPopup(true);
  };

  const handleFastShipping = () => {
    setShippingTime("Saturday, Jul 20 • 10:45 AM");
    setShowCancelPopup(false);
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />
      <NotificationModal />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShoppingCart className="h-6 w-6 text-teal-400" />
            Shopping Cart ({itemCount} items)
          </h1>
          <Link href="/store" className="text-xs text-teal-300 hover:text-teal-200 font-semibold glass-pill px-3.5 py-1.5 rounded-full transition-all hover:bg-white/15">
            + Add More Products
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto opacity-50" />
            <h2 className="text-lg font-bold text-white">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add products from the catalog to build a shopping cart and observe real-time decision telemetry.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 glass-btn-primary font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items Table (7 COLS) */}
            <div className="lg:col-span-7 space-y-3.5">
              {cart.map((item) => (
                <div key={item.product.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 glass-card-hover">
                  <div className="flex items-center gap-3.5">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover bg-slate-900 border border-white/10" />
                    <div>
                      <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider">{item.product.category}</span>
                      <h3 className="text-sm font-bold text-white">{item.product.name}</h3>
                      <span className="text-xs font-black text-white block mt-1 font-mono">{formatCurrency(item.product.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 glass-subcard p-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-lg hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-lg hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (5 COLS) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-5 shadow-xl">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Order Summary</h2>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white font-bold">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Shipping</span>
                  <span className="text-amber-400 font-bold">{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-sans">
                  <span className="font-bold text-white">Total Order</span>
                  <span className="font-black font-mono text-teal-400 text-base">{formatCurrency(cartTotal + shippingFee)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startOrder}
                  className="w-full inline-flex items-center justify-center gap-2 glass-btn-secondary hover:bg-white/15 font-black py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {orderStarted ? "Order Initialized" : "Initialize Order"}
                </button>

                {orderStarted && (
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full inline-flex items-center justify-center gap-2 glass-btn-primary font-black py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {orderStarted && (
                <div className="rounded-2xl border border-white/10 glass-subcard p-4 text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Shipping Estimate</span>
                    <span className="font-mono text-teal-300">{shippingTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Your order is queued for preparation. Simulate shipping friction or trigger fast delivery.
                  </p>
                  <button
                    onClick={handleCancelOrder}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    Cancel / Review Shipping
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {showCancelPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-xl font-bold">⚡</div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Unlock Fast Shipping Option</h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Upgrade to priority expedited shipping with AI-optimized courier routing.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 glass-subcard p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Standard Shipping</span>
                    <span>{shippingTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-teal-300 font-bold pt-2 border-t border-white/10">
                    <span>Priority Fast Shipping</span>
                    <span>Sat, Jul 20 • 10:45 AM</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleFastShipping}
                    className="flex-1 glass-btn-primary font-bold py-3 rounded-2xl text-xs cursor-pointer shadow-md"
                  >
                    Choose Fast Shipping
                  </button>
                  <button
                    onClick={() => setShowCancelPopup(false)}
                    className="flex-1 glass-btn-secondary hover:bg-white/15 font-bold py-3 rounded-2xl text-xs cursor-pointer"
                  >
                    Keep Standard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
