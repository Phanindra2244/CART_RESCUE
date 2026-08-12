"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { Products } from "@/lib/products";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart, products } = useStore();
  const { isAuthenticated, currentUser } = useAuth();
  const product = products.find((p) => p.id === id) ?? Products.getById(id);
  const [orderStarted, setOrderStarted] = useState(false);
  const [shippingTime, setShippingTime] = useState("Monday, Jul 22 • 3:30 PM");
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  if (!product) return notFound();

  const handleOrder = () => {
    if (!isAuthenticated || !currentUser) {
      router.push("/store/login");
      return;
    }
    addToCart(product);
    setOrderStarted(true);
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated || !currentUser) {
      router.push("/store/login");
      return;
    }
    if (!orderStarted) {
      addToCart(product);
      setOrderStarted(true);
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
        
        <Link href="/store" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium glass-pill px-3.5 py-1.5 rounded-full transition-all">
          <ArrowLeft className="h-3.5 w-3.5 text-teal-400" />
          Back to Store Catalog
        </Link>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
          
          {/* Image */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-teal-300 font-bold px-3 py-1 rounded-full glass-pill border-teal-400/30">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">{product.name}</h1>
              <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

              <div className="pt-2">
                <span className="text-3xl font-black text-white">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through ml-3 font-mono">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-3 rounded-2xl glass-subcard">
                  <Truck className="h-4 w-4 text-teal-400" />
                  <span>Express Shipping Available</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl glass-subcard">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>2 Year Official Warranty</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleOrder}
                    className="flex-1 flex items-center justify-center gap-2 glass-btn-primary py-3.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {orderStarted ? "Order Added" : "Add to Order"}
                  </button>

                  {orderStarted && (
                    <button
                      onClick={handleProceedToPayment}
                      className="flex items-center justify-center gap-2 glass-btn-secondary hover:bg-white/15 px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Proceed to Checkout
                    </button>
                  )}
                </div>

                {orderStarted && (
                  <div className="rounded-2xl border border-white/10 glass-subcard p-4 text-sm space-y-2 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Shipping Estimate</span>
                      <span className="font-mono text-teal-300">{shippingTime}</span>
                    </div>
                    <p className="text-[12px] text-slate-400">
                      Your order is ready for dispatch during the estimated date and time above.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleCancelOrder}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                      >
                        Cancel / Review Shipping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {showCancelPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-xl font-bold">⚡</div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Unlock Fast Shipping</h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Upgrade to priority expedited shipping with optimized courier routing.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 glass-subcard p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Standard Shipping</span>
                    <span>~ {shippingTime}</span>
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
