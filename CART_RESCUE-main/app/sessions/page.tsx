"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { AuthGuard } from "@/components/auth-guard";
import { AgentPanel } from "@/components/agent-panel";
import { runRescueEngine } from "@/lib/api";
import { Play, Sparkles, RefreshCw, Sliders } from "lucide-react";

export default function SimulatorPage() {
  const [cartValue, setCartValue] = useState<number>(185.0);
  const [itemCount, setItemCount] = useState<number>(2);
  const [shippingFee, setShippingFee] = useState<number>(15.0);
  const [timeCheckout, setTimeCheckout] = useState<number>(180);
  const [tabSwitches, setTabSwitches] = useState<number>(4);
  const [paymentError, setPaymentError] = useState<boolean>(true);
  const [couponFailed, setCouponFailed] = useState<number>(2);
  const [mouseExit, setMouseExit] = useState<boolean>(true);
  const [customerSegment, setCustomerSegment] = useState<string>("VIP Shopper");
  const [customerName, setCustomerName] = useState<string>("Samantha Reed");

  const [loading, setLoading] = useState<boolean>(false);
  const [rescueResult, setRescueResult] = useState<any>(null);

  async function executeEngine() {
    setLoading(true);
    try {
      const telemetry = {
        session_id: `sim_${Math.random().toString(36).substring(2, 9)}`,
        customer_id: `cust_sim_${Math.random().toString(36).substring(2, 6)}`,
        customer_name: customerName,
        customer_segment: customerSegment,
        cart_value: cartValue,
        item_count: itemCount,
        shipping_fee: shippingFee,
        time_on_checkout_sec: timeCheckout,
        tab_switch_count: tabSwitches,
        mouse_exit_intent: mouseExit,
        payment_error_triggered: paymentError,
        coupon_failed_attempts: couponFailed,
        shipping_cost_viewed: shippingFee > 0,
        device: "Desktop"
      };

      const result = await runRescueEngine(telemetry);
      setRescueResult(result);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  }

  function loadPreset(preset: string) {
    if (preset === "PAYMENT_GATEWAY_FAIL") {
      setCustomerName("David Chen");
      setCustomerSegment("Standard");
      setCartValue(210.0);
      setShippingFee(0.0);
      setPaymentError(true);
      setTabSwitches(1);
      setCouponFailed(0);
      setTimeCheckout(85);
      setMouseExit(false);
    } else if (preset === "PRICE_COMPARISON") {
      setCustomerName("Sarah Jenkins");
      setCustomerSegment("Price Sensitive");
      setCartValue(340.0);
      setShippingFee(15.0);
      setPaymentError(false);
      setTabSwitches(6);
      setCouponFailed(3);
      setTimeCheckout(240);
      setMouseExit(true);
    } else if (preset === "SHIPPING_FRICTION_LOW_CART") {
      setCustomerName("Elena Rostova");
      setCustomerSegment("Standard");
      setCartValue(28.0);
      setShippingFee(15.0);
      setPaymentError(false);
      setTabSwitches(2);
      setCouponFailed(0);
      setTimeCheckout(110);
      setMouseExit(true);
    } else if (preset === "ORGANIC_ORGANIC_BUYER") {
      setCustomerName("Marcus Vance");
      setCustomerSegment("VIP Shopper");
      setCartValue(650.0);
      setShippingFee(0.0);
      setPaymentError(false);
      setTabSwitches(0);
      setCouponFailed(0);
      setTimeCheckout(40);
      setMouseExit(false);
    }
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl animate-aura-1" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-teal-500/15 blur-3xl animate-aura-2" />

        <Navbar />

        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <Play className="h-7 w-7 text-teal-400 fill-teal-400/30" />
                Live Interactive Telemetry Simulator
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
                Manipulate shopper session telemetry live to observe multi-agent consensus and automated recovery output.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono font-medium">Quick Presets:</span>
              <button
                onClick={() => loadPreset("PAYMENT_GATEWAY_FAIL")}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs hover:bg-purple-500/30 font-bold transition-all cursor-pointer"
              >
                Payment Error
              </button>
              <button
                onClick={() => loadPreset("PRICE_COMPARISON")}
                className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs hover:bg-blue-500/30 font-bold transition-all cursor-pointer"
              >
                Price Compare
              </button>
              <button
                onClick={() => loadPreset("SHIPPING_FRICTION_LOW_CART")}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs hover:bg-amber-500/30 font-bold transition-all cursor-pointer"
              >
                Shipping Friction
              </button>
              <button
                onClick={() => loadPreset("ORGANIC_ORGANIC_BUYER")}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs hover:bg-emerald-500/30 font-bold transition-all cursor-pointer"
              >
                Organic VIP
              </button>
            </div>
          </div>

          {/* INPUT FORM & AGENT TRACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: CONTROLS PANEL (5 COLS) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/10 pb-3">
                <Sliders className="h-4 w-4 text-teal-400" />
                Session Telemetry Controls
              </div>

              {/* Shopper Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">Customer Tier</label>
                  <select
                    value={customerSegment}
                    onChange={(e) => setCustomerSegment(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none bg-slate-900"
                  >
                    <option className="bg-slate-900 text-white">VIP Shopper</option>
                    <option className="bg-slate-900 text-white">Standard</option>
                    <option className="bg-slate-900 text-white">Price Sensitive</option>
                    <option className="bg-slate-900 text-white">New Shopper</option>
                  </select>
                </div>
              </div>

              {/* Cart Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300">Cart Total Value ($)</span>
                    <span className="text-teal-400 font-mono font-bold">${cartValue.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="15" max="1000" step="5"
                    value={cartValue} onChange={(e) => setCartValue(parseFloat(e.target.value))}
                    className="w-full accent-teal-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300">Shipping Fee ($)</span>
                    <span className="text-amber-400 font-mono font-bold">${shippingFee.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0" max="40" step="5"
                    value={shippingFee} onChange={(e) => setShippingFee(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300">Checkout Dwell Time (sec)</span>
                    <span className="text-blue-400 font-mono font-bold">{timeCheckout}s</span>
                  </div>
                  <input
                    type="range" min="10" max="400" step="10"
                    value={timeCheckout} onChange={(e) => setTimeCheckout(parseInt(e.target.value))}
                    className="w-full accent-blue-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300">Browser Tab Switch Count</span>
                    <span className="text-purple-400 font-mono font-bold">{tabSwitches} switches</span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="1"
                    value={tabSwitches} onChange={(e) => setTabSwitches(parseInt(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <label className="flex items-center justify-between text-xs text-slate-300 p-3 rounded-2xl glass-subcard cursor-pointer font-medium hover:bg-white/[0.07] transition-all">
                  <span>Payment Gateway Error Triggered</span>
                  <input
                    type="checkbox" checked={paymentError} onChange={(e) => setPaymentError(e.target.checked)}
                    className="h-4 w-4 accent-purple-400 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 p-3 rounded-2xl glass-subcard cursor-pointer font-medium hover:bg-white/[0.07] transition-all">
                  <span>Mouse Viewport Exit Intent</span>
                  <input
                    type="checkbox" checked={mouseExit} onChange={(e) => setMouseExit(e.target.checked)}
                    className="h-4 w-4 accent-teal-400 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* EXECUTE ENGINE BUTTON */}
              <button
                onClick={executeEngine}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 glass-btn-primary font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Executing Multi-Agent Engine...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-white" />
                    Run Rescue Engine
                  </>
                )}
              </button>

            </div>

            {/* RIGHT: AGENT TRACE OUTPUT (7 COLS) */}
            <div className="lg:col-span-7">
              {rescueResult ? (
                <AgentPanel data={rescueResult} />
              ) : (
                <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[500px] shadow-xl">
                  <Sparkles className="h-10 w-10 text-teal-400 mb-4 opacity-50" />
                  <h3 className="text-base font-bold text-white">Interactive Consensus Playground</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                    Adjust session parameters on the left or select a preset, then click <strong>"Run Rescue Engine"</strong> to observe live multi-agent consensus.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
