"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AuthGuard } from "@/components/auth-guard";
import { fetchAuditLogs } from "@/lib/api";
import { ShieldCheck, Search, RefreshCw } from "lucide-react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filterAgent, setFilterAgent] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAuditLogs();
      setLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesAgent = filterAgent === "ALL" || log.agent_name.toLowerCase().includes(filterAgent.toLowerCase());
    const matchesSearch = !search || log.session_id.toLowerCase().includes(search.toLowerCase()) || log.justification.toLowerCase().includes(search.toLowerCase());
    return matchesAgent && matchesSearch;
  });

  return (
    <AuthGuard requiredRole="admin">
      <div className="relative min-h-screen text-white font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl animate-aura-1" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-[30rem] w-[30rem] rounded-full bg-teal-500/15 blur-3xl animate-aura-2" />

        <Navbar />

        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <ShieldCheck className="h-7 w-7 text-purple-400" />
                Enterprise Compliance Audit Trail
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
                Immutable trace of every agent execution, feature telemetry state, guardrail check, and LLM critique.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search session ID or rationale..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="glass-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none w-64 font-medium"
                />
              </div>

              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="glass-input rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none bg-slate-900 font-medium"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Agents</option>
                <option value="Behavior" className="bg-slate-900 text-white">Behavior Agent</option>
                <option value="Strategy" className="bg-slate-900 text-white">Strategy Agent</option>
                <option value="Critic" className="bg-slate-900 text-white">Critic Agent</option>
              </select>
            </div>
          </div>

          {/* LOG TABLE */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
                Loading audit trail records...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="glass-subcard text-slate-300 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4 rounded-l-xl">Timestamp</th>
                      <th className="py-3.5 px-4">Session ID</th>
                      <th className="py-3.5 px-4">Agent Name</th>
                      <th className="py-3.5 px-4">Action Taken</th>
                      <th className="py-3.5 px-4">Justification & Compliance</th>
                      <th className="py-3.5 px-4 text-right rounded-r-xl">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                          No audit logs match current filters. Run the simulator to observe live audit traces!
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.05] transition-colors">
                          <td className="py-4 px-4 text-slate-400 text-[11px]">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-teal-300">{log.session_id}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              log.agent_name.includes("Behavior")
                                ? "bg-blue-500/15 text-blue-300 border-blue-400/30"
                                : log.agent_name.includes("Strategy")
                                ? "bg-teal-500/15 text-teal-300 border-teal-400/30"
                                : "bg-purple-500/15 text-purple-300 border-purple-400/30"
                            }`}>
                              {log.agent_name}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-white font-semibold">{log.action_taken}</td>
                          <td className="py-4 px-4 text-slate-300 font-sans max-w-md leading-relaxed">
                            {log.justification}
                          </td>
                          <td className="py-4 px-4 text-right text-emerald-400 font-black">
                            {log.execution_time_ms.toFixed(1)} ms
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
