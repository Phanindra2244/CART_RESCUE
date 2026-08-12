"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Products } from "@/lib/products";
import { runRescueEngine } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PlacedOrder {
  session_id: string;
  customer_name: string;
  customer_segment: string;
  cart_value: number;
  item_count: number;
  shipping_fee: number;
  order_total: number;
  status: string;
  intent: string;
  final_action: string;
  abandonment_risk: number;
  created_at: string;
  items: CartItem[];
}

export interface ActivityEvent {
  session_id: string;
  customer_name: string;
  type: "LOGIN" | "SIGNUP";
  status: string;
  created_at: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
cartTotal: number;
  itemCount: number;
  shippingFee: number;
  setShippingFee: (fee: number) => void;
  couponDiscount: number;
  setCouponDiscount: (discount: number) => void;
  appliedCouponCode: string;
  setAppliedCouponCode: (code: string) => void;
  placedOrders: PlacedOrder[];
  recordPlacedOrder: () => void;

  // Dynamic product catalog
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;

  // Activity stream (login/signup events)
  activityStream: ActivityEvent[];
  recordActivity: (customerName: string, type: "LOGIN" | "SIGNUP") => void;
  
  // Telemetry & Behavior State
  sessionId: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerSegment: string;
  setCustomerSegment: (seg: string) => void;
  timeOnCheckoutSec: number;
  tabSwitchCount: number;
  paymentErrorTriggered: boolean;
  setPaymentErrorTriggered: (err: boolean) => void;
  couponFailedAttempts: number;
  incrementCouponFailed: () => void;
  mouseExitIntent: boolean;
  
  // Rescue Engine Integration
  latestRescueData: any;
  activeNotification: any;
  dismissNotification: () => void;
  runEngine: (overrideParams?: Partial<any>) => Promise<any>;
  triggerDemoScenario: (scenario: "PAYMENT_FAIL" | "SHIPPING_COST" | "PRICE_COMPARE" | "RETURNING_VIP") => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(Products.list);
  const [activityStream, setActivityStream] = useState<ActivityEvent[]>([]);
  const [cart, setCart] = useState<CartItem[]>([
    { product: Products.list[0], quantity: 1 },
    { product: Products.list[4], quantity: 1 }
  ]);
  
const [sessionId, setSessionId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("Samantha Reed");
  const [customerSegment, setCustomerSegment] = useState<string>("VIP Shopper");
  const [shippingFee, setShippingFee] = useState<number>(15.0);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");

  useEffect(() => {
    setSessionId(`sess_shopper_${Math.random().toString(36).substring(2, 7)}`);
  }, []);
  
  const [timeOnCheckoutSec, setTimeOnCheckoutSec] = useState<number>(45);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(1);
  const [paymentErrorTriggered, setPaymentErrorTriggered] = useState<boolean>(false);
  const [couponFailedAttempts, setCouponFailedAttempts] = useState<number>(0);
  const [mouseExitIntent, setMouseExitIntent] = useState<boolean>(false);
  
  const [latestRescueData, setLatestRescueData] = useState<any>(null);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>([]);

  // Load placed orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart_rescue_orders");
      if (stored) {
        setPlacedOrders(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load placed orders:", err);
    }
  }, []);

  // Persist placed orders whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cart_rescue_orders", JSON.stringify(placedOrders));
    } catch (err) {
      console.error("Failed to save placed orders:", err);
    }
  }, [placedOrders]);

  // Load dynamic products & activity stream from localStorage on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("cart_rescue_products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
      const storedActivity = localStorage.getItem("cart_rescue_activity");
      if (storedActivity) {
        setActivityStream(JSON.parse(storedActivity));
      }
    } catch (err) {
      console.error("Failed to load catalog/activity:", err);
    }
  }, []);

  // Persist products & activity stream whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cart_rescue_products", JSON.stringify(products));
    } catch (err) {
      console.error("Failed to save products:", err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("cart_rescue_activity", JSON.stringify(activityStream));
} catch (err) {
      console.error("Failed to save activity:", err);
    }
  }, [activityStream]);

  function addProduct(product: Product) {
    setProducts((prev) => [product, ...prev]);
  }

  function removeProduct(productId: string) {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  function recordActivity(customerName: string, type: "LOGIN" | "SIGNUP") {
    setActivityStream((prev) => {
      // Record each user's login/signup only once — no duplicate entries.
      const exists = prev.some(
        (e) => e.customer_name === customerName && e.type === type
      );
      if (exists) return prev;

      const event: ActivityEvent = {
        session_id: `sess_${Math.random().toString(36).substring(2, 9)}`,
        customer_name: customerName,
        type,
        status: type === "LOGIN" ? "LOGGED IN" : "REGISTERED",
        created_at: new Date().toISOString()
      };
      return [event, ...prev];
    });
  }

function recordPlacedOrder() {
    const order: PlacedOrder = {
      session_id: `order_${Math.random().toString(36).substring(2, 9)}`,
      customer_name: customerName || "Guest Shopper",
      customer_segment: customerSegment,
      cart_value: cartTotal,
      item_count: itemCount,
      shipping_fee: shippingFee,
      order_total: cartTotal - couponDiscount + shippingFee,
      status: "COMPLETED",
      intent: "Order Completed",
      final_action: "COMPLETED",
      abandonment_risk: 0,
      created_at: new Date().toISOString(),
      items: cart
    };
    setPlacedOrders((prev) => [order, ...prev]);
    return order;
  }

  // Tab switch & Exit intent event listeners
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
      }
    }

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 5) {
        setMouseExitIntent(true);
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Checkout timer tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnCheckoutSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setCart([]);
  }

  function incrementCouponFailed() {
    setCouponFailedAttempts((prev) => prev + 1);
  }

  function dismissNotification() {
    setActiveNotification(null);
  }

  async function runEngine(overrideParams?: Partial<any>) {
    const telemetry = {
      session_id: sessionId,
      customer_id: `cust_${sessionId}`,
      customer_name: customerName,
      customer_segment: customerSegment,
      cart_value: cartTotal,
      item_count: itemCount,
      shipping_fee: shippingFee,
      time_on_checkout_sec: timeOnCheckoutSec,
      tab_switch_count: tabSwitchCount,
      mouse_exit_intent: mouseExitIntent,
      payment_error_triggered: paymentErrorTriggered,
      coupon_failed_attempts: couponFailedAttempts,
      shipping_cost_viewed: shippingFee > 0,
      device: "Desktop",
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category
      })),
      ...overrideParams
    };

    try {
      const res = await runRescueEngine(telemetry);
      setLatestRescueData(res);
      if (res.notification_preview && res.final_recommended_action !== "DO_NOTHING") {
        setActiveNotification(res.notification_preview);
      } else {
        setActiveNotification(null);
      }
      return res;
    } catch (err) {
      console.error("Rescue engine execution failed:", err);
    }
  }

  // Preset scenarios trigger
  function triggerDemoScenario(scenario: "PAYMENT_FAIL" | "SHIPPING_COST" | "PRICE_COMPARE" | "RETURNING_VIP") {
    if (scenario === "PAYMENT_FAIL") {
      setCustomerName("David Chen");
      setCustomerSegment("Standard");
      setPaymentErrorTriggered(true);
      setTabSwitchCount(1);
      setCouponFailedAttempts(0);
      setTimeOnCheckoutSec(85);
      runEngine({ payment_error_triggered: true });
    } else if (scenario === "SHIPPING_COST") {
      setCustomerName("Elena Rostova");
      setCustomerSegment("Standard");
      setShippingFee(25.0);
      setPaymentErrorTriggered(false);
      setTabSwitchCount(2);
      runEngine({ shipping_fee: 25.0, cart_value: 38.0 });
    } else if (scenario === "PRICE_COMPARE") {
      setCustomerName("Sarah Jenkins");
      setCustomerSegment("Price Sensitive");
      setTabSwitchCount(6);
      setCouponFailedAttempts(3);
      setPaymentErrorTriggered(false);
      runEngine({ tab_switch_count: 6, coupon_failed_attempts: 3 });
    } else if (scenario === "RETURNING_VIP") {
      setCustomerName("Marcus Vance");
      setCustomerSegment("VIP Shopper");
      setPaymentErrorTriggered(false);
      setTabSwitchCount(0);
      setCouponFailedAttempts(0);
      runEngine({ customer_segment: "VIP Shopper", tab_switch_count: 0, cart_value: 890.0 });
    }
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
cartTotal,
        itemCount,
        shippingFee,
        setShippingFee,
        couponDiscount,
        setCouponDiscount,
        appliedCouponCode,
        setAppliedCouponCode,
        placedOrders,
        recordPlacedOrder,
        products,
        addProduct,
        removeProduct,
        activityStream,
        recordActivity,
        sessionId,
        customerName,
        setCustomerName,
        customerSegment,
        setCustomerSegment,
        timeOnCheckoutSec,
        tabSwitchCount,
        paymentErrorTriggered,
        setPaymentErrorTriggered,
        couponFailedAttempts,
        incrementCouponFailed,
        mouseExitIntent,
        latestRescueData,
        activeNotification,
        dismissNotification,
        runEngine,
        triggerDemoScenario
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
