"use client";

import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { NotificationModal } from "@/components/store/notification-modal";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Eye, Sparkles } from "lucide-react";

export default function StoreCatalogPage() {
  const { addToCart, products } = useStore();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

      <StoreNavbar />
      <NotificationModal />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Store Banner */}
        <div className="glass-panel rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-teal-500/10 via-indigo-500/10 to-transparent pointer-events-none" />
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-teal-300 text-xs font-mono border-teal-400/30">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              Real-Time Behavioral Telemetry Active
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">ApexStore Gear & Electronics</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore catalog items, add to cart, or proceed to checkout to simulate shopper behaviors and observe automated recovery agent decisions in real time.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">Featured Products</h2>
            <span className="text-xs text-teal-300 font-mono glass-pill px-3 py-1 rounded-full">{products.length} products available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="glass-panel rounded-3xl p-5 flex flex-col justify-between space-y-4 glass-card-hover group">
                
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900/80 relative border border-white/10">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-bold tracking-wider">{product.category}</span>
                    <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">{product.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-white">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-2 font-mono">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/store/product/${product.id}`}
                      className="p-2.5 rounded-xl glass-pill hover:bg-white/15 text-slate-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-teal-400" />
                    </Link>

                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 glass-btn-primary px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
