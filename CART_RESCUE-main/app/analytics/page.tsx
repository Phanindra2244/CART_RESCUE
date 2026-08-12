"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AuthGuard } from "@/components/auth-guard";
import { RecoveryTrendChart, ActionDistributionChart, IntentBreakdownChart } from "@/components/charts/recovery-chart";
import { fetchAnalyticsData } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const aData = await fetchAnalyticsData();
      setData(aData);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" />
          <p className="mt-4 font-mono text-xs text-slate-400">Loading System Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl animate-aura-1" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-3xl animate-aura-2" />

        <Navbar />

        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <BarChart3 className="h-7 w-7 text-teal-400" />
              Financial & Behavioral Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Deep dive into gross margin preservation, intent breakdown, and intervention ROI metrics.
            </p>
          </div>

          {/* CHARTS GRID 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1">Weekly Recovery & Margin Trend</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">Gross margin saved ($) vs total recovered sessions</p>
              {data?.recovery_trend && <RecoveryTrendChart trendData={data.recovery_trend} />}
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1">Root Cause Intent Breakdown</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">Distribution of cart abandonment reasons</p>
              {data?.intent_breakdown && <IntentBreakdownChart intentBreakdown={data.intent_breakdown} />}
            </div>

          </div>

          {/* ACTION PROFITABILITY TABLE */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Intervention Strategy Profitability Matrix</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">Comparing net profit yield per action against intervention channel costs</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="glass-subcard text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4 rounded-l-xl">Action Strategy</th>
                    <th className="py-3.5 px-4">Conversions</th>
                    <th className="py-3.5 px-4">Discount Cost</th>
                    <th className="py-3.5 px-4">Net Profit Yield</th>
                    <th className="py-3.5 px-4 rounded-r-xl">ROI Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {data?.action_profitability?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/[0.05] transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                        {item.action}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-300">{item.conversions} orders</td>
                      <td className="py-4 px-4 text-amber-300 font-medium">{formatCurrency(item.discount_cost)}</td>
                      <td className="py-4 px-4 text-emerald-400 font-black">{formatCurrency(item.net_profit)}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-bold">
                          {(item.net_profit / (item.discount_cost || 1)).toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
