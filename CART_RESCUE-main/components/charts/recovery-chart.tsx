"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";

interface RecoveryChartProps {
  trendData: Array<{ day: string; abandoned: number; recovered: number; margin_saved: number }>;
  actionDistribution: Record<string, number>;
  intentBreakdown: Record<string, number>;
}

const GLOW_COLORS = ["#2DD4BF", "#818CF8", "#F59E0B", "#C084FC", "#34D399", "#F87171"];

export function RecoveryTrendChart({ trendData }: { trendData: Array<{ day: string; abandoned: number; recovered: number; margin_saved: number }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMarginGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorRecoveredGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "rgba(255,255,255,0.15)", borderRadius: "16px", color: "#FFFFFF", fontSize: "12px", backdropFilter: "blur(16px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          />
          <Area type="monotone" dataKey="margin_saved" name="Margin Saved ($)" stroke="#2DD4BF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMarginGlass)" />
          <Area type="monotone" dataKey="recovered" name="Carts Rescued" stroke="#818CF8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecoveredGlass)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActionDistributionChart({ actionDistribution }: { actionDistribution: Record<string, number> }) {
  const data = Object.entries(actionDistribution).map(([key, val]) => ({
    name: key.replace(/_/g, " "),
    count: val,
  }));

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis type="number" stroke="#94A3B8" fontSize={11} hide />
          <YAxis dataKey="name" type="category" stroke="#CBD5E1" fontSize={11} tickLine={false} width={110} />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "rgba(255,255,255,0.15)", borderRadius: "16px", color: "#FFFFFF", fontSize: "12px", backdropFilter: "blur(16px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          />
          <Bar dataKey="count" fill="#2DD4BF" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GLOW_COLORS[index % GLOW_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IntentBreakdownChart({ intentBreakdown }: { intentBreakdown: Record<string, number> }) {
  const data = Object.entries(intentBreakdown).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GLOW_COLORS[index % GLOW_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "rgba(255,255,255,0.15)", borderRadius: "16px", color: "#FFFFFF", fontSize: "12px", backdropFilter: "blur(16px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-[11px] text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
