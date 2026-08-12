"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Navbar } from "@/components/navbar";
import { AuthGuard } from "@/components/auth-guard";
import { AgentPanel } from "@/components/agent-panel";
import { CustomerDetailPanel } from "@/components/customer-detail-panel";
import {
  RecoveryTrendChart,
  ActionDistributionChart,
} from "@/components/charts/recovery-chart";
import {
  fetchDashboardStats,
  fetchAnalyticsData,
  runRescueEngine,
} from "@/lib/api";
import { useStore } from "@/context/store-context";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Activity,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Trash2,
  PackagePlus,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const {
    placedOrders = [],
    activityStream = [],
    products = [],
    addProduct,
    removeProduct,
  } = useStore();

  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedSessionId, setSelectedSessionId] = useState("sess_8921a");
  const [activeRescueData, setActiveRescueData] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodCategory, setProdCategory] = useState("Electronics");
  const [prodMsg, setProdMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProdMsg({
        type: "error",
        text: "Please choose a valid image file (JPG, PNG, etc.).",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProdImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleAddProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const price = Number.parseFloat(prodPrice);

    if (!prodName.trim() || !Number.isFinite(price) || price <= 0) {
      setProdMsg({
        type: "error",
        text: "Please provide a product name and a valid price.",
      });
      return;
    }

    const newProduct = {
      id: `p_custom_${Date.now()}`,
      name: prodName.trim(),
      price,
      originalPrice: price * 1.2,
      image:
        prodImage ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      description: `Custom ${prodCategory} product added from Admin Dashboard.`,
      category: prodCategory,
      rating: 4.8,
      reviewCount: 15,
      stockStatus: "In Stock" as const,
    };

    addProduct(newProduct);
    setProdMsg({
      type: "success",
      text: `"${newProduct.name}" added successfully! It is now visible in the customer store.`,
    });
    setProdName("");
    setProdPrice("");
    setProdImage("");
  }

  const inspectSession = useCallback(
    async (session: any) => {
      setSelectedSessionId(session.session_id);

      setSelectedCustomer({
        session_id: session.session_id,
        customer_name: session.customer_name,
        customer_segment: session.customer_segment || "Standard",
        status: session.status || "ABANDONED",
        intent: session.intent || "Browsing",
        final_action: session.final_action || "INSPECT",
        cart_value: session.cart_value || 0,
        order_total: session.order_total,
        shipping_fee: session.shipping_fee,
        item_count: session.item_count || 0,
        abandonment_risk: session.abandonment_risk || 0,
        created_at: session.created_at,
        items: session.items || [],
      });

      if (session.status === "COMPLETED" || session.isActivity) {
        setActiveRescueData(null);
        return;
      }

      setAnalyzing(true);

      try {
        const res = await runRescueEngine({
          session_id: session.session_id,
          customer_id: `cust_${session.session_id}`,
          customer_name: session.customer_name,
          customer_segment: session.customer_segment || "Standard",
          cart_value: session.cart_value || 0,
          item_count: session.item_count || 1,
          time_on_checkout_sec: 145,
          tab_switch_count: 3,
          coupon_failed_attempts: 2,
          shipping_fee: session.shipping_fee ?? 15.0,
          payment_error_triggered: false,
        });

        setActiveRescueData(res);
      } catch (err) {
        console.error("Failed to run rescue engine for inspect:", err);
      } finally {
        setAnalyzing(false);
      }
    },
    [],
  );

  const loadDashboard = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);

      try {
        const [statsData, analyticsData] = await Promise.all([
          fetchDashboardStats(),
          fetchAnalyticsData(),
        ]);

        setStats(statsData);
        setAnalytics(analyticsData);

        if (isInitial && statsData.recent_sessions?.length) {
          void inspectSession(statsData.recent_sessions[0]);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [inspectSession],
  );

  useEffect(() => {
    void loadDashboard(true);

    const interval = setInterval(() => {
      void loadDashboard(false);
    }, 5000);

    const handleStorageChange = () => {
      void loadDashboard(false);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
        <Navbar />
        <div className="flex h-[80vh] flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />
          <p className="mt-4 font-mono text-xs text-slate-400">
            Initializing Autonomous Command Center...
          </p>
        </div>
      </div>
    );
  }

  const recentSessions = stats?.recent_sessions ?? [];

  const orderMap = new Map<
    string,
    { latest: any; count: number; totalSpent: number }
  >();

  placedOrders.forEach((order: any) => {
    const key = order.customer_name || "Guest Shopper";

    const mapped = {
      session_id: order.session_id,
      customer_name: order.customer_name,
      customer_segment: order.customer_segment,
      cart_value: order.cart_value ?? 0,
      order_total: order.order_total ?? 0,
      shipping_fee: order.shipping_fee ?? 0,
      item_count: order.item_count ?? 0,
      abandonment_risk: 0,
      intent: "Order Completed",
      final_action: "COMPLETED",
      critic_decision: "APPROVED",
      expected_net_profit: (order.cart_value ?? 0) * 0.28,
      created_at: order.created_at,
      status: order.status,
      items: (order.items || []).map((item: any) => ({
        name: item.product?.name ?? "Unknown product",
        price: item.product?.price ?? 0,
        quantity: item.quantity ?? 0,
        image: item.product?.image ?? "",
      })),
    };

    const orderAmount = order.order_total ?? order.cart_value ?? 0;

    const existing = orderMap.get(key);

    if (existing) {
      if (new Date(mapped.created_at) > new Date(existing.latest.created_at)) {
        existing.latest = mapped;
      }

      existing.count += 1;
      existing.totalSpent = (existing.totalSpent ?? 0) + orderAmount;
    } else {
      orderMap.set(key, { latest: mapped, count: 1, totalSpent: orderAmount });
    }
  });

  const completedOrders = Array.from(orderMap.values())
    .map(({ latest, count, totalSpent }) => ({
      ...latest,
      orderCount: count,
      totalSpent,
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const totalCompletedOrders = placedOrders.length;
  const totalOrderedAmount = placedOrders.reduce(
    (sum, o) => sum + (o.order_total ?? o.cart_value ?? 0),
    0,
  );

  const activityEvents = activityStream.map((evt: any) => ({
    session_id: evt.session_id,
    customer_name: evt.customer_name,
    customer_segment: "Customer Portal",
    cart_value: 0,
    order_total: 0,
    shipping_fee: 0,
    item_count: 0,
    abandonment_risk: 0,
    intent: evt.type === "LOGIN" ? "Account Login" : "New Signup",
    final_action: evt.type === "LOGIN" ? "LOGGED IN" : "SIGNUP",
    status: evt.status,
    created_at: evt.created_at,
    items: [],
    isActivity: true,
    activityType: evt.type,
  }));

  const combinedStream = [
    ...activityEvents,
    ...completedOrders,
    ...recentSessions,
  ];

  return (
    <AuthGuard requiredRole="admin">
      <div className="relative min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white overflow-hidden">

        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl animate-aura-1" />
        <div className="pointer-events-none absolute top-1/3 right-10 h-[30rem] w-[30rem] rounded-full bg-teal-500/15 blur-3xl animate-aura-2" />

        <Navbar />

        <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="flex items-center gap-2.5 text-2xl font-black text-white sm:text-3xl">
                <Activity className="h-7 w-7 text-teal-400" />
                Live Autonomous Command Center
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Real-time cart recovery analytics, agent consensus traces, and net profit protection metrics.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard(false)}
              className="self-start glass-btn-secondary hover:bg-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 md:self-auto cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 text-teal-400" />
                Refresh Stream
              </span>
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-panel rounded-3xl p-5 shadow-xl glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Net Profit Saved
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-3 block font-mono text-2xl font-black text-white">
                {formatCurrency(stats?.net_margin_saved ?? 0)}
              </span>
              <span className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> 38.4% Net Margin Lift
              </span>
            </div>

            <div className="glass-panel rounded-3xl p-5 shadow-xl glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Recovery Rate
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-3 block font-mono text-2xl font-black text-white">
                {formatPercent((stats?.recovery_rate_percent ?? 0) / 100)}
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-400 font-mono">
                {stats?.rescued_carts_count ?? 0} carts converted
              </span>
            </div>

            <div className="glass-panel rounded-3xl p-5 shadow-xl glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Avoided Discount Spam
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
                  <ShieldAlert className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-3 block font-mono text-2xl font-black text-white">
                {formatCurrency(stats?.unnecessary_discounts_avoided ?? 0)}
              </span>
              <span className="mt-1 block text-xs font-bold text-purple-300">
                Preserved Gross Margin
              </span>
            </div>

            <div className="glass-panel rounded-3xl p-5 shadow-xl glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Top Abandonment Cause
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-3 block truncate text-lg font-bold text-white">
                {stats?.top_intent ?? "No data"}
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-400 font-mono">
                Auto-routed to 1-Click Retry
              </span>
            </div>
          </div>

          {/* Active Sessions & Inspect Split */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                  <ShoppingCart className="h-4 w-4 text-teal-400" />
                  Active Sessions Stream ({combinedStream.length})
                </h2>
                <span className="text-xs font-medium text-slate-400 font-mono">
                  Select session to inspect
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl glass-subcard px-3.5 py-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-teal-300">
                    Orders Placed
                  </span>
                  <span className="block font-mono text-lg font-black text-white">
                    {totalCompletedOrders}
                  </span>
                </div>
                <div className="rounded-2xl glass-subcard px-3.5 py-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    Total Revenue
                  </span>
                  <span className="block font-mono text-lg font-black text-emerald-400">
                    {formatCurrency(totalOrderedAmount)}
                  </span>
                </div>
              </div>

              <div className="max-h-[640px] space-y-2.5 overflow-y-auto pr-1">
                {combinedStream.map((sess: any) => {
                  const isSelected = sess.session_id === selectedSessionId;

                  return (
                    <button
                      key={sess.session_id}
                      type="button"
                      onClick={() => void inspectSession(sess)}
                      className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all cursor-pointer ${isSelected
                        ? "border-teal-400/60 bg-teal-500/20 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
                        : "glass-subcard hover:bg-white/[0.08] hover:border-white/20"
                        }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-slate-950 ${isSelected
                            ? "bg-teal-400"
                            : "bg-white/20 text-white"
                            }`}
                        >
                          {sess.customer_name?.charAt(0).toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">
                          <span className="block truncate text-sm font-bold text-white">
                            {sess.customer_name}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {sess.isActivity && (
                              <span
                                className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold ${sess.activityType === "LOGIN"
                                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                                  : "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                                  }`}
                              >
                                {sess.activityType === "LOGIN" ? "LOGIN" : "SIGNUP"}
                              </span>
                            )}

                            {sess.orderCount > 0 && (
                              <span className="rounded-full border border-teal-400/30 bg-teal-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-teal-300">
                                {sess.orderCount}{" "}
                                {sess.orderCount === 1 ? "order" : "orders"}
                              </span>
                            )}

                            {sess.totalSpent > 0 && (
                              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                                {formatCurrency(sess.totalSpent)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${sess.abandonment_risk > 0
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                          : sess.status === "REGISTERED"
                            ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                            : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                          }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              {selectedCustomer ? (
                <div className="space-y-6">
                  <CustomerDetailPanel data={selectedCustomer} />

                  {analyzing ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl glass-panel p-8 shadow-xl">
                      <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />
                      <p className="mt-4 font-mono text-xs text-slate-300">
                        Executing 3-Agent Multi-Model Pipeline...
                      </p>
                    </div>
                  ) : activeRescueData ? (
                    <AgentPanel data={activeRescueData} />
                  ) : null}
                </div>
              ) : (
                <div className="rounded-3xl glass-panel p-8 text-center text-slate-400">
                  Select a session from the stream to view full profile and multi-agent trace.
                </div>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-2">
            <div className="rounded-3xl glass-panel p-6 shadow-xl">
              <h3 className="mb-1 text-sm font-bold text-white">
                Recovery & Margin Saved Trend
              </h3>
              <p className="mb-4 text-xs text-slate-400 font-mono">
                Daily cumulative net margin saved vs rescued carts
              </p>
              {analytics?.recovery_trend && (
                <RecoveryTrendChart trendData={analytics.recovery_trend} />
              )}
            </div>

            <div className="rounded-3xl glass-panel p-6 shadow-xl">
              <h3 className="mb-1 text-sm font-bold text-white">
                Action Distribution
              </h3>
              <p className="mb-4 text-xs text-slate-400 font-mono">
                Frequency of actions highlighting Do Nothing margin preservation
              </p>
              {stats?.action_distribution && (
                <ActionDistributionChart
                  actionDistribution={stats.action_distribution}
                />
              )}
            </div>
          </div>

          {/* Product Catalog Management */}
          <div className="rounded-3xl glass-panel p-6 sm:p-7 shadow-xl">
            <div className="mb-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <PackagePlus className="h-4 w-4 text-teal-400" />
                Product Catalog Management
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Add new products with an image and price. They reflect immediately in the customer storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <form
                onSubmit={handleAddProduct}
                className="space-y-3.5 rounded-2xl glass-subcard p-4 sm:p-5"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 text-xs font-bold text-white">
                  <Plus className="h-3.5 w-3.5 text-teal-400" />
                  Add New Product
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Smart Watch Active"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="99.99"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                      Category
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none bg-slate-900"
                    >
                      <option className="bg-slate-900 text-white">Electronics</option>
                      <option className="bg-slate-900 text-white">Headphones</option>
                      <option className="bg-slate-900 text-white">Smartphones</option>
                      <option className="bg-slate-900 text-white">Laptops</option>
                      <option className="bg-slate-900 text-white">Shoes</option>
                      <option className="bg-slate-900 text-white">Fashion</option>
                      <option className="bg-slate-900 text-white">Accessories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-400">
                    Product Image
                  </label>

                  <div className="flex items-start gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                      {prodImage ? (
                        <img
                          src={prodImage}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-500 font-mono">
                          No image
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full glass-input rounded-xl px-3 py-1.5 text-xs font-medium file:mr-2 file:rounded-lg file:border-0 file:bg-teal-500/20 file:px-3 file:py-1 file:text-xs file:font-bold file:text-teal-300 hover:file:bg-teal-500/30"
                      />

                      <input
                        type="url"
                        value={
                          prodImage.startsWith("data:") ? "" : prodImage
                        }
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="...or paste image URL"
                        className="w-full glass-input rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />

                      {prodImage && (
                        <button
                          type="button"
                          onClick={() => setProdImage("")}
                          className="text-[11px] font-semibold text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Clear image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {prodMsg && (
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${prodMsg.type === "success"
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                      : "border-red-400/30 bg-red-500/15 text-red-200"
                      }`}
                  >
                    {prodMsg.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    )}
                    {prodMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 glass-btn-primary py-3 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Product to Store
                </button>
              </form>

              <div className="rounded-2xl glass-subcard p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <PackagePlus className="h-3.5 w-3.5 text-teal-400" />
                    Store Catalog ({products.length})
                  </span>
                </div>

                <div className="mt-3 max-h-[280px] space-y-2 overflow-y-auto pr-1">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 glass-panel p-2.5"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg bg-slate-900 object-cover border border-white/10"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-white">
                          {product.name}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {formatCurrency(product.price)} • {product.category}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                        title={`Remove ${product.name}`}
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
