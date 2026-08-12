"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store-context";
import { MessageSquare, Bell, Mail, X, ArrowRight } from "lucide-react";

export function NotificationModal() {
  const { activeNotification, dismissNotification } = useStore();

  if (!activeNotification) return null;

  const isWhatsApp = activeNotification.channel?.includes("WHATSAPP");
  const isPush = activeNotification.channel?.includes("PUSH");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full glass-panel rounded-2xl border border-white/20 shadow-2xl p-4 space-y-3 backdrop-blur-2xl text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2.5">
            {isWhatsApp ? (
              <div className="h-7 w-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                <MessageSquare className="h-4 w-4" />
              </div>
            ) : isPush ? (
              <div className="h-7 w-7 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xs shadow-md">
                <Bell className="h-4 w-4" />
              </div>
            ) : (
              <div className="h-7 w-7 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                <Mail className="h-4 w-4" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-white block">{activeNotification.channel} Alert</span>
              <span className="text-[10px] text-slate-400 font-mono block">Recipient: {activeNotification.recipient}</span>
            </div>
          </div>

          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">{activeNotification.headline}</h4>
          <p className="text-xs text-slate-300 leading-normal">{activeNotification.body}</p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 text-[10px] font-bold border border-teal-400/30 font-mono">
            {activeNotification.badge}
          </span>

          <Link
            href="/store/recovery"
            onClick={dismissNotification}
            className="flex items-center gap-1 glass-btn-primary font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {activeNotification.cta_label || "Claim Offer"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
