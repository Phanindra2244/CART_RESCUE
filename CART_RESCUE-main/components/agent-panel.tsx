"use client";

import { motion } from "framer-motion";
import { Brain, Calculator, ShieldCheck, CheckCircle2, XCircle, Sparkles, Send, Zap, Trophy } from "lucide-react";
import { formatCurrency, formatPercent, getRiskBadgeColor, getIntentColor } from "@/lib/utils";

interface AgentPanelProps {
  data: {
    session_id: string;
    behavior: {
      abandonment_risk: number;
      intent: string;
      confidence: number;
      risk_level: string;
      key_drivers?: string[];
    };
    strategy: {
      selected_action: string;
      selected_action_label: string;
      expected_revenue: number;
      expected_margin: number;
      expected_cost: number;
      net_profit: number;
      business_impact: string;
      evaluations: Array<{
        action: string;
        label: string;
        expected_conversion_rate: number;
        expected_revenue: number;
        discount_cost: number;
        channel_cost: number;
        expected_margin: number;
        net_profit: number;
        business_impact: string;
        is_best_candidate: boolean;
      }>;
    };
    critic: {
      decision: string;
      final_action: string;
      final_action_label: string;
      explanation: string;
      guardrail_checks?: Record<string, boolean>;
      model_used: string;
    };
    final_recommended_action: string;
    final_action_label: string;
    expected_net_profit: number;
    notification_preview?: {
      channel: string;
      recipient: string;
      headline: string;
      body: string;
      cta_label: string;
      badge: string;
    } | null;
    execution_time_ms: number;
  };
}

export function AgentPanel({ data }: AgentPanelProps) {
  const { behavior, strategy, critic, expected_net_profit, notification_preview, execution_time_ms } = data;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Latency Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            3-Agent Multi-Model Consensus Trace
          </h2>
          <p className="text-xs text-slate-400">
            Telemetry pipeline for Session <span className="font-mono text-teal-300 font-bold">{data.session_id}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-xl text-xs font-mono">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-slate-300">Execution:</span>
          <span className="text-emerald-400 font-bold">{execution_time_ms} ms</span>
        </div>
      </div>

      {/* 4 COLUMNS WORKFLOW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* AGENT 1: BEHAVIOR INTELLIGENCE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-2xl p-4 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-blue-400 font-bold block">Agent 1 (ML Model)</span>
                  <h3 className="text-xs font-bold text-white">Behavior Intelligence</h3>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeColor(behavior.abandonment_risk)}`}>
                {behavior.risk_level} RISK
              </span>
            </div>

            {/* Risk Bar */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Abandonment Risk:</span>
                <span className="text-white font-bold">{formatPercent(behavior.abandonment_risk)}</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-500 ${
                    behavior.abandonment_risk >= 0.8 ? "bg-red-500" : behavior.abandonment_risk >= 0.5 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${behavior.abandonment_risk * 100}%` }}
                />
              </div>
            </div>

            {/* Intent & Confidence */}
            <div className="grid grid-cols-2 gap-2 glass-subcard p-2.5 rounded-xl mb-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Diagnosed Intent</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${getIntentColor(behavior.intent)}`}>
                  {behavior.intent}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ML Confidence</span>
                <span className="text-xs font-mono font-bold text-teal-300 mt-0.5 block">
                  {formatPercent(behavior.confidence)}
                </span>
              </div>
            </div>

            {/* Key Drivers */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Observed Key Drivers:</span>
              {behavior.key_drivers?.length ? (
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {behavior.key_drivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 italic">No key driver details available.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* AGENT 2: STRATEGY DECISION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="glass-panel rounded-2xl p-4 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-teal-400 font-bold block">Agent 2 (Solver)</span>
                  <h3 className="text-xs font-bold text-white">Strategy Decision</h3>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full glass-pill text-teal-300 font-bold">
                8 Candidates
              </span>
            </div>

            <div className="space-y-3">
              <div className="glass-subcard p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5">Optimal Candidate:</span>
                <span className="text-xs font-bold text-teal-300 block">{strategy.selected_action_label}</span>
                <p className="text-[11px] text-slate-300 mt-1 italic leading-tight">{strategy.business_impact}</p>
              </div>

              {/* Financial Math */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="glass-subcard p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block">Expected Revenue</span>
                  <span className="text-white font-bold">{formatCurrency(strategy.expected_revenue)}</span>
                </div>
                <div className="glass-subcard p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block">Expected Cost</span>
                  <span className="text-amber-400 font-bold">{formatCurrency(strategy.expected_cost)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AGENT 3: CRITIC AGENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="glass-panel rounded-2xl p-4 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Agent 3 (LLM Critic)</span>
                  <h3 className="text-xs font-bold text-white">Enterprise Auditor</h3>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                critic.decision === "APPROVED"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                  : "bg-red-500/15 text-red-300 border-red-400/30"
              }`}>
                {critic.decision === "APPROVED" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {critic.decision}
              </span>
            </div>

            {/* Policy Checks Pills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {critic.guardrail_checks && Object.entries(critic.guardrail_checks).length > 0 ? (
                Object.entries(critic.guardrail_checks).map(([checkKey, isPassed]) => (
                  <span
                    key={checkKey}
                    className={`px-2 py-0.5 rounded-md text-[9px] border flex items-center gap-1 font-medium ${
                      isPassed ? "glass-subcard text-slate-300 border-white/10" : "bg-red-500/15 text-red-300 border-red-500/30"
                    }`}
                  >
                    {checkKey.replace(/_/g, " ")} {isPassed ? "✓" : "✗"}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500 italic">No guardrail checks available.</span>
              )}
            </div>

            {/* Explanation Rationale */}
            <div className="glass-subcard p-2.5 rounded-xl">
              <span className="text-[9px] font-mono text-purple-300 font-bold block mb-0.5">Model: {critic.model_used}</span>
              <p className="text-[11px] text-slate-300 leading-snug">{critic.explanation}</p>
            </div>
          </div>
        </motion.div>

        {/* FINAL OUTPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="glass-panel rounded-2xl p-4 border border-teal-400/30 flex flex-col justify-between bg-gradient-to-br from-teal-500/10 via-slate-900/60 to-indigo-500/10"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-teal-400 font-bold block">Final Output</span>
              <div className="h-7 w-7 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Trophy className="h-3.5 w-3.5" />
              </div>
            </div>

            <span className="text-[10px] text-slate-400 block mb-0.5">Recommended Action</span>
            <h4 className="text-sm font-black text-teal-300 uppercase tracking-wide mb-2">
              {data.final_recommended_action}
            </h4>

            <div className="space-y-2 text-xs border-t border-white/10 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Confidence</span>
                <span className="font-bold text-white">{formatPercent(behavior.confidence)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Why this action?</span>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Customer demonstrates high purchase intent. Unnecessary discounts prevented.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400">Margin Protected:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{formatCurrency(expected_net_profit)}</span>
          </div>
        </motion.div>

      </div>

      {/* DISPATCHED NOTIFICATION PREVIEW */}
      {notification_preview && (
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <Send className="h-3.5 w-3.5 text-teal-400" />
            Dispatched Channel Payload ({notification_preview.channel}):
          </div>
          <div className="glass-subcard p-3 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{notification_preview.headline}</span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-400/30">
                {notification_preview.badge}
              </span>
            </div>
            <p className="text-slate-300">{notification_preview.body}</p>
          </div>
        </div>
      )}

      {/* Bottom System Status Bar */}
      <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300 gap-2 font-medium">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-bold">System Status: All Multi-Agent Services Active</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
          <span>Real-time stream</span>
          <span>•</span>
          <span>Privacy Compliant</span>
          <span>•</span>
          <span>Margin Safe</span>
        </div>
      </div>

    </div>
  );
}
