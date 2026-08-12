const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

export interface SessionTelemetryInput {
  session_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_segment?: string;
  cart_value: number;
  item_count: number;
  shipping_fee?: number;
  items?: Array<{ id: string; name: string; price: number; quantity: number; category: string }>;
  time_on_checkout_sec: number;
  tab_switch_count: number;
  mouse_exit_intent?: boolean;
  payment_error_triggered?: boolean;
  coupon_failed_attempts?: number;
  shipping_cost_viewed?: boolean;
  device?: string;
}

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback dashboard data:", err);
    return getFallbackDashboardStats();
  }
}

export async function fetchAnalyticsData() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return getFallbackAnalyticsData();
  }
}

export async function runRescueEngine(telemetry: SessionTelemetryInput) {
  try {
    const res = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telemetry),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Primary backend fetch error, attempting fallback on port 8000/8001:", err);
  }

  // Fallback try alternate port if primary failed
  const altUrl = API_BASE_URL.includes("8001")
    ? API_BASE_URL.replace("8001", "8000")
    : API_BASE_URL.replace("8000", "8001");

  try {
    const res = await fetch(`${altUrl}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telemetry),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Fallback rescue engine failed, synthesizing local response:", err);
  }

  // Graceful local synthesis if backend is offline during demo
  return {
    session_id: telemetry.session_id,
    timestamp: new Date().toISOString(),
    behavior: {
      abandonment_risk: telemetry.payment_error_triggered ? 0.94 : 0.72,
      intent: telemetry.payment_error_triggered ? "Payment Failure" : (telemetry.shipping_cost_viewed ? "Shipping Cost" : "Browsing"),
      confidence: 0.96
    },
    strategy: {
      selected_action: telemetry.payment_error_triggered ? "RETRY_PAYMENT" : "EXIT_INTENT_POPUP",
      selected_action_label: telemetry.payment_error_triggered ? "Retry Payment" : "Exit Intent Popup",
      expected_revenue: telemetry.cart_value,
      expected_margin: 28.0,
      expected_cost: 0.0,
      net_profit: telemetry.cart_value * 0.28,
      business_impact: "HIGH"
    },
    critic: {
      decision: "APPROVED",
      final_action: telemetry.payment_error_triggered ? "RETRY_PAYMENT" : "EXIT_INTENT_POPUP",
      final_action_label: telemetry.payment_error_triggered ? "Retry Payment" : "Exit Intent Popup",
      explanation: "Deterministic business rule triggered: Payment retry and exit assist overlay.",
      model_used: "Deterministic Rule Engine"
    },
    final_recommended_action: telemetry.payment_error_triggered ? "RETRY_PAYMENT" : "EXIT_INTENT_POPUP",
    final_action_label: telemetry.payment_error_triggered ? "Retry Payment" : "Exit Intent Popup",
    expected_net_profit: telemetry.cart_value * 0.28,
    notification_preview: {
      channel: "IN_SESSION_OVERLAY",
      headline: "Need help completing your order?",
      body: "We saved your cart items. Click here to resume seamlessly."
    },
    execution_time_ms: 4.5
  };
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE_URL}/audit-logs`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return [];
  }
}

function getFallbackDashboardStats() {
  return {
    active_sessions_count: 5,
    high_risk_count: 3,
    rescued_carts_count: 24,
    recovery_rate_percent: 68.5,
    total_recovered_revenue: 6420.0,
    net_margin_saved: 2568.0,
    unnecessary_discounts_avoided: 1120.0,
    top_intent: "Payment Failure",
    action_distribution: {
      "DO_NOTHING": 8,
      "RETRY_PAYMENT_LINK": 7,
      "FREE_SHIPPING": 5,
      "COUPON_10": 3,
      "PUSH_REMINDER": 4
    },
    recent_sessions: [
      {
        session_id: "sess_8921a",
        customer_name: "Sarah Jenkins",
        customer_segment: "VIP Shopper",
        cart_value: 420.0,
        abandonment_risk: 0.82,
        intent: "Price Comparison",
        final_action: "COUPON_10",
        critic_decision: "APPROVED",
        expected_net_profit: 126.0,
        created_at: new Date().toISOString(),
        status: "ABANDONED"
      },
      {
        session_id: "sess_4102b",
        customer_name: "David Chen",
        customer_segment: "Standard",
        cart_value: 185.0,
        abandonment_risk: 0.94,
        intent: "Payment Failure",
        final_action: "RETRY_PAYMENT_LINK",
        critic_decision: "APPROVED",
        expected_net_profit: 74.0,
        created_at: new Date().toISOString(),
        status: "ABANDONED"
      },
      {
        session_id: "sess_7731c",
        customer_name: "Elena Rostova",
        customer_segment: "Price Sensitive",
        cart_value: 48.0,
        abandonment_risk: 0.65,
        intent: "Shipping Cost",
        final_action: "PUSH_REMINDER",
        critic_decision: "REJECTED",
        expected_net_profit: 19.2,
        created_at: new Date().toISOString(),
        status: "ABANDONED"
      }
    ]
  };
}

function getFallbackAnalyticsData() {
  return {
    recovery_trend: [
      { day: "Mon", abandoned: 42, recovered: 28, margin_saved: 1120.0 },
      { day: "Tue", abandoned: 55, recovered: 39, margin_saved: 1640.0 },
      { day: "Wed", abandoned: 38, recovered: 29, margin_saved: 1280.0 },
      { day: "Thu", abandoned: 61, recovered: 47, margin_saved: 1950.0 },
      { day: "Fri", abandoned: 74, recovered: 58, margin_saved: 2410.0 },
      { day: "Sat", abandoned: 82, recovered: 65, margin_saved: 2890.0 },
      { day: "Sun", abandoned: 69, recovered: 52, margin_saved: 2180.0 }
    ],
    intent_breakdown: {
      "Payment Failure": 34,
      "Price Comparison": 28,
      "Shipping Cost": 22,
      "Delivery Delay": 12,
      "No COD": 8
    },
    action_profitability: [
      { action: "Do Nothing", conversions: 45, discount_cost: 0, net_profit: 3600.0 },
      { action: "Payment Retry Link", conversions: 52, discount_cost: 5.0, net_profit: 4160.0 },
      { action: "Free Shipping", conversions: 38, discount_cost: 570.0, net_profit: 2470.0 },
      { action: "10% Coupon", conversions: 25, discount_cost: 450.0, net_profit: 1550.0 }
    ],
    margin_saved_timeline: [
      { hour: "00:00", cumulative_margin: 450 },
      { hour: "04:00", cumulative_margin: 890 },
      { hour: "08:00", cumulative_margin: 2300 },
      { hour: "12:00", cumulative_margin: 5400 },
      { hour: "16:00", cumulative_margin: 8900 },
      { hour: "20:00", cumulative_margin: 13470 }
    ]
  };
}
