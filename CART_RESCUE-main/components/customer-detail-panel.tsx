"use client";

import { Sparkles, User, ShoppingBag, Package, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CustomerDetailItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerDetailData {
  session_id: string;
  customer_name: string;
  customer_segment: string;
  status: string;
  intent: string;
  final_action: string;
  cart_value: number;
  order_total?: number;
  shipping_fee?: number;
  item_count: number;
  abandonment_risk: number;
  created_at: string;
  items: CustomerDetailItem[];
}

export function CustomerDetailPanel({ data }: { data: CustomerDetailData }) {
  const isCompleted = data.status === "COMPLETED";
  const isRegistered = data.status === "REGISTERED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-400" />
            Customer Profile & Agent Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Full profile details for <span className="font-mono text-teal-300 font-bold">{data.customer_name}</span> · Session{" "}
            <span className="font-mono text-teal-300 font-bold">{data.session_id}</span>
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold border font-mono ${
            isCompleted
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
              : isRegistered
              ? "bg-blue-500/15 text-blue-300 border-blue-400/30"
              : "bg-amber-500/15 text-amber-300 border-amber-400/30"
          }`}
        >
          {data.status}
        </span>
      </div>

      {/* Profile Summary Card */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-indigo-500 text-slate-950 flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            {data.customer_name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-black text-white truncate">{data.customer_name}</span>
              <span className="text-[10px] font-medium text-teal-300 px-2.5 py-0.5 rounded-full glass-pill border-teal-400/30">
                <User className="h-3 w-3 inline mr-1 text-teal-400" />
                {data.customer_segment}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <Clock className="h-3 w-3 text-slate-500" />
              <span className="font-mono">
                {data.created_at ? new Date(data.created_at).toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="glass-subcard p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Cart Value</span>
            <span className="text-sm font-black font-mono text-white">{formatCurrency(data.cart_value)}</span>
          </div>
          <div className="glass-subcard p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Items</span>
            <span className="text-sm font-black font-mono text-white flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-teal-400" /> {data.item_count ?? data.items?.length ?? 0}
            </span>
          </div>
          <div className="glass-subcard p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Shipping Fee</span>
            <span className="text-sm font-black font-mono text-white">{formatCurrency(data.shipping_fee ?? 0)}</span>
          </div>
          <div className="glass-subcard p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Order Total</span>
            <span className="text-sm font-black font-mono text-teal-300">{formatCurrency(data.order_total ?? data.cart_value)}</span>
          </div>
        </div>
      </div>

      {/* Purchased Items */}
      {data.items && data.items.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
            <ShoppingBag className="h-4 w-4 text-teal-400" />
            Purchased Items
          </h3>
          <div className="space-y-2.5">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover bg-slate-900 border border-white/10" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-slate-400 block font-mono text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent assessment */}
      <div className="glass-subcard p-4 rounded-2xl border border-emerald-500/20">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1.5">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Agent Real-Time Assessment
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">{data.customer_name}</strong> is a <strong className="text-teal-300">{data.customer_segment}</strong>{" "}
          customer.{" "}
          {isCompleted
            ? `This order has been fully completed and paid (total ${formatCurrency(data.order_total ?? data.cart_value)}). No recovery action is required.`
            : isRegistered
            ? `This is a newly registered customer who has just created an account. The agent is tracking them for their first-purchase journey.`
            : `Detected intent: ${data.intent}. Recommended action: ${data.final_action}.`}{" "}
          Profile synchronized in the live Command Center stream.
        </p>
      </div>
    </div>
  );
}
