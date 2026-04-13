import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import API from "../api/axiosConfig";

// Stripe TEST publishable key — safe to commit, won't charge. Replace with your real key for production via env vars.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY || "pk_test_51RIExampleRealStripeTestKey00000000000000000000000000000000000000000000000000000000000000000000000");

// Store location: No 14 Ark Lane, Uduvil, Chunnakam, Sri Lanka
const STORE_COORDS = { lat: 9.7440, lon: 80.0170 };
const STORE_ADDRESS = "No 14, Ark Lane, Uduvil, Chunnakam, Jaffna, Sri Lanka, 40000";

// ======================== DELIVERY ESTIMATION ========================
async function geocodeAddress(address) {
  try {
    const encoded = encodeURIComponent(address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      { headers: { 'User-Agent': 'BuyMe-Store/1.0' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function getRouteTime(fromLon, fromLat, toLon, toLat) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.routes && data.routes.length > 0) {
      const seconds = data.routes[0].duration;
      const km = data.routes[0].distance / 1000;
      return { seconds, km };
    }
    return null;
  } catch (e) {
    return null;
  }
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins} min`;
}

function estimateDeliveryDays(km) {
  if (km < 20) return '1–2 business days';
  if (km < 100) return '2–3 business days';
  if (km < 300) return '3–5 business days';
  return '5–7 business days';
}

// ======================== STRIPE PAYMENT FORM ========================
function CheckoutForm({ totalAmount, onSuccess, onCancel, cartItems, billingAddress, deliveryEstimate, travelTime }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError('');

    const cardEl = elements.getElement(CardElement);

    // Create payment method (test mode — no real charge)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardEl,
      billing_details: {
        address: {
          line1: billingAddress.street,
          city: billingAddress.city,
          postal_code: billingAddress.postalCode,
          country: 'LK',
        }
      }
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    // In test mode we skip server-side intent and directly confirm order
    try {
      const amount = cartItems.reduce((acc, item) => acc + Number(item.product.price) * item.qty, 0);

      const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + "/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          CartItems: cartItems,
          amount: amount.toString(),
          billingAddress,
          deliveryEstimate,
          travelTime,
          paymentId: paymentMethod.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Order failed");

      onSuccess(data.order);
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="stripe-card-field">
        <label className="stripe-card-label">
          <i className="fas fa-credit-card mr-2" style={{ color: 'var(--primary)' }}></i>
          Card Details
        </label>
        <div className="stripe-card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1e293b',
                  '::placeholder': { color: '#94a3b8' },
                  fontFamily: '"Inter", sans-serif',
                },
                invalid: { color: '#ef4444' },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        {cardError && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <i className="fas fa-exclamation-circle mr-1"></i>{cardError}
          </p>
        )}
      </div>

      <div className="stripe-test-notice">
        <i className="fas fa-info-circle mr-1"></i>
        Test mode: Use card <strong>4242 4242 4242 4242</strong>, any future date, any CVC.
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-modern" style={{ flex: 1, background: '#f1f5f9', color: '#64748b', padding: '0.85rem' }}>
          Cancel
        </button>
        <motion.button
          type="submit"
          disabled={!stripe || processing}
          className="btn-modern btn-primary-modern btn-shimmer"
          style={{ flex: 2, padding: '0.85rem', fontSize: '1rem' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {processing ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i>Processing...</>
          ) : (
            <><i className="fas fa-lock mr-2"></i>Pay & Place Order</>
          )}
        </motion.button>
      </div>
    </form>
  );
}

// ======================== DELIVERY MODAL ========================
function DeliveryModal({ billingAddress, onConfirm, onClose }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const calculate = async () => {
      setLoading(true);

      // Progressive fallback for geocoding to avoid "Couldn't find your address" error on overly specific strings
      let coords = await geocodeAddress(`${billingAddress.street}, ${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.country || 'Sri Lanka'}`);
      
      if (!coords) {
         coords = await geocodeAddress(`${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.country || 'Sri Lanka'}`);
      }
      if (!coords) {
         coords = await geocodeAddress(`${billingAddress.city}, ${billingAddress.country || 'Sri Lanka'}`);
      }

      if (!coords) {
        setError("Couldn't find an exact point. Using estimated standard delivery times.");
        setResult({ travelTime: 'N/A', deliveryDays: '3–5 business days', km: null });
        setLoading(false);
        return;
      }

      const route = await getRouteTime(STORE_COORDS.lon, STORE_COORDS.lat, coords.lon, coords.lat);
      if (!route) {
        setError("Routing service unavailable. Using estimated delivery times.");
        setResult({ travelTime: 'N/A', deliveryDays: '3–5 business days', km: null });
        setLoading(false);
        return;
      }

      setResult({
        travelTime: formatDuration(route.seconds),
        deliveryDays: estimateDeliveryDays(route.km),
        km: route.km.toFixed(1),
      });
      setLoading(false);
    };
    calculate();
  }, [billingAddress]);

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-box" initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.95 }}>
        <div className="modal-header">
          <h4><i className="fas fa-map-marker-alt mr-2" style={{ color: 'var(--secondary)' }}></i>Delivery Estimation</h4>
          <button onClick={onClose} className="modal-close-btn"><i className="fas fa-times"></i></button>
        </div>

        <div className="modal-body">
          <div className="delivery-store-info">
            <i className="fas fa-store mr-2"></i>
            <div>
              <p className="delivery-label">From (Store)</p>
              <p className="delivery-value">{STORE_ADDRESS}</p>
            </div>
          </div>
          <div className="delivery-divider-line">
            <i className="fas fa-arrow-down"></i>
          </div>
          <div className="delivery-store-info">
            <i className="fas fa-home mr-2"></i>
            <div>
              <p className="delivery-label">To (Your Address)</p>
              <p className="delivery-value">{billingAddress.street}, {billingAddress.city}</p>
            </div>
          </div>

          {loading ? (
            <div className="delivery-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Calculating route...</p>
            </div>
          ) : (
            <div className="delivery-results">
              {error && <p className="delivery-error"><i className="fas fa-exclamation-triangle mr-1"></i>{error}</p>}
              <div className="delivery-stat-row">
                <div className="delivery-stat">
                  <i className="fas fa-clock"></i>
                  <span className="delivery-stat-label">Travel Time</span>
                  <span className="delivery-stat-value">{result?.travelTime}</span>
                </div>
                {result?.km && (
                  <div className="delivery-stat">
                    <i className="fas fa-road"></i>
                    <span className="delivery-stat-label">Distance</span>
                    <span className="delivery-stat-value">{result?.km} km</span>
                  </div>
                )}
                <div className="delivery-stat">
                  <i className="fas fa-calendar-check"></i>
                  <span className="delivery-stat-label">Est. Delivery</span>
                  <span className="delivery-stat-value" style={{ color: 'var(--primary)' }}>{result?.deliveryDays}</span>
                </div>
              </div>
              <div className="delivery-status-badge">
                <i className="fas fa-circle" style={{ color: '#f59e0b', fontSize: '0.5rem', marginRight: '6px' }}></i>
                Status: <strong>Delivery Pending</strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-modern" style={{ background: '#f1f5f9', color: '#64748b', padding: '0.75rem 1.5rem' }}>
            Back
          </button>
          <motion.button
            onClick={() => !loading && onConfirm(result?.travelTime, result?.deliveryDays)}
            disabled={loading}
            className="btn-modern btn-primary-modern btn-shimmer"
            style={{ padding: '0.75rem 2rem' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Calculating...</> : <><i className="fas fa-lock mr-2"></i>Proceed to Payment</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== MAIN CART COMPONENT ========================
export default function Cart({ cartItems, setCartItems }) {
  const [complete, setComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({ travelTime: '', deliveryDays: '' });
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAuthenticated = !!userInfo;

  function increaseQty(item) {
    if (item.product.stock === item.qty) return;
    setCartItems(cartItems.map(i => i.product._id === item.product._id ? { ...i, qty: i.qty + 1 } : i));
  }

  function decreaseQty(item) {
    if (item.qty <= 1) return;
    setCartItems(cartItems.map(i => i.product._id === item.product._id ? { ...i, qty: i.qty - 1 } : i));
  }

  function removeItem(item) {
    setCartItems(cartItems.filter(i => i.product._id !== item.product._id));
    toast.info("Item removed from cart");
  }

  async function handleCheckout() {
    if (!isAuthenticated) {
      toast.warning("Please login to place an order");
      navigate('/login');
      return;
    }

    // Check billing address from API
    try {
      const res = await API.get('/auth/me');
      const profile = res.data?.data;
      const addr = profile?.billingAddress;
      const hasBillingAddress = addr && addr.street && addr.city;

      if (!hasBillingAddress) {
        toast.warning("⚠️ Please add a billing address in your profile before checkout.", { autoClose: 4000 });
        navigate('/user/dashboard?section=billing');
        return;
      }

      // Proceed to delivery estimation
      setShowDeliveryModal(true);
    } catch (err) {
      toast.error("Failed to verify profile. Please try again.");
    }
  }

  const handleDeliveryConfirm = (travelTime, deliveryDays) => {
    setDeliveryInfo({ travelTime: travelTime || '', deliveryDays: deliveryDays || '' });
    setShowDeliveryModal(false);
    setShowPaymentModal(true);
  };

  const handleOrderSuccess = (order) => {
    setShowPaymentModal(false);
    setComplete(true);
    setCompletedOrder(order);
    setCartItems([]);
    toast.success("🎉 Order placed successfully!");
  };

  const getUserBillingAddress = () => {
    // Re-fetch fresh from API on demand; for now get from cached profile
    return userInfo?.billingAddress || {};
  };

  if (complete) {
    return (
      <motion.div 
        className="cart-success-screen"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="cart-success-icon">
          <motion.i className="fas fa-check-circle" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} />
        </div>
        <h1>Order Placed! 🎉</h1>
        <p className="cart-success-sub">Your items are being prepared for delivery.</p>
        
        {completedOrder && (
          <div className="cart-success-tracking">
            <div className="tracking-header">
              <i className="fas fa-shipping-fast mr-2" style={{ color: 'var(--secondary)' }}></i>
              Order Tracking
            </div>
            <div className="tracking-id">Order #{completedOrder._id?.substring(0, 10).toUpperCase()}</div>
            <div className="tracking-timeline">
              {[
                { label: 'Order Placed', done: true, icon: 'fa-check-circle' },
                { label: 'Processing', done: false, icon: 'fa-cog' },
                { label: 'Out for Delivery', done: false, icon: 'fa-truck' },
                { label: 'Delivered', done: false, icon: 'fa-home' },
              ].map((step, i) => (
                <div key={i} className={`tracking-step ${step.done ? 'done' : ''} ${i === 1 ? 'current' : ''}`}>
                  <div className="tracking-dot"><i className={`fas ${step.icon}`}></i></div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
            <div className="tracking-status-badge">
              <i className="fas fa-clock mr-1"></i> Status: <strong>Delivery Pending</strong>
            </div>
            {deliveryInfo.deliveryDays && (
              <p className="tracking-delivery-est">
                <i className="fas fa-calendar-alt mr-1"></i> Estimated: {deliveryInfo.deliveryDays}
              </p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/user/dashboard" className="btn-modern btn-primary-modern btn-shimmer">
            <i className="fas fa-box mr-2"></i>Track Orders
          </Link>
          <Link to="/" className="btn-modern" style={{ background: '#f1f5f9', color: 'var(--primary)' }}>
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div className="text-center py-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.div style={{ fontSize: '5rem', marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.2 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <i className="fas fa-shopping-bag"></i>
        </motion.div>
        <h2 className="mb-3" style={{ fontWeight: 800 }}>Your Bag is Empty</h2>
        <p className="text-muted mb-5">Start exploring and fill it with amazing products.</p>
        <Link to="/" className="btn-modern btn-primary-modern btn-shimmer">
          Discover Products <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </motion.div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const freeShippingThreshold = 50;
  const shippingProgress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
  const needsMore = freeShippingThreshold - totalAmount;
  const shippingCost = totalAmount >= 50 ? 0 : 4.99;
  const tax = totalAmount * 0.08;
  const grandTotal = totalAmount + tax + shippingCost;

  return (
    <div data-aos="fade-up" className="cart-wrapper">
      <h1 className="cart-title">
        Your Bag <span className="gradient-text">({cartItems.length})</span>
      </h1>

      {/* Free Shipping Progress */}
      {needsMore > 0 ? (
        <div className="card-premium p-3 mb-4" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.03), rgba(254,189,105,0.03))' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="fas fa-truck mr-2" style={{ color: 'var(--primary)' }}></i>
              Add <strong style={{ color: 'var(--primary)' }}>${needsMore.toFixed(2)}</strong> more for <strong style={{ color: 'var(--success)' }}>FREE shipping!</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.floor(shippingProgress)}%</span>
          </div>
          <div className="shipping-progress">
            <motion.div className="shipping-progress-bar" initial={{ width: 0 }} animate={{ width: `${shippingProgress}%` }} transition={{ duration: 1, ease: "easeOut" }}></motion.div>
          </div>
        </div>
      ) : (
        <div className="card-premium p-3 mb-4" style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
          <span style={{ fontWeight: 700, color: '#065f46' }}><i className="fas fa-check-circle mr-2"></i>You've unlocked FREE shipping!</span>
        </div>
      )}

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-col">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item, idx) => (
              <motion.div 
                key={item.product._id} 
                className="cart-item-row"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.05 }}
                layout
              >
                <img src={item.product.images[0].image} alt={item.product.name} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <Link to={"/product/" + item.product._id} className="cart-item-name">{item.product.name}</Link>
                  <p className="cart-item-seller">{item.product.seller}</p>
                  <div className="cart-item-price-mobile">${item.product.price}</div>
                </div>

                <div className="cart-item-price">${item.product.price}</div>

                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => decreaseQty(item)}>−</button>
                  <motion.span key={item.qty} initial={{ scale: 1.4, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                    {item.qty}
                  </motion.span>
                  <button className="qty-btn" onClick={() => increaseQty(item)}>+</button>
                </div>

                <motion.button 
                  onClick={() => removeItem(item)} 
                  className="cart-remove-btn"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <i className="fa fa-trash"></i>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-col">
          <motion.div className="card-premium order-summary-card p-4" data-aos="fade-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="mb-4" style={{ fontWeight: 800 }}>Order Summary</h3>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal ({subtotal} units)</span>
              <span style={{ fontWeight: 700 }}>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Estimated Tax</span>
              <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="text-muted">Shipping</span>
              <span style={{ fontWeight: 700, color: totalAmount >= 50 ? 'var(--success)' : 'var(--text-main)' }}>
                {totalAmount >= 50 ? 'Free' : '$4.99'}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4 mt-2">
              <span className="h4 mb-0" style={{ fontWeight: 800 }}>Total</span>
              <span className="h4 mb-0 gradient-text" style={{ fontWeight: 900 }}>${grandTotal.toFixed(2)}</span>
            </div>
            <motion.button 
              onClick={handleCheckout} 
              className="btn-modern btn-primary-modern btn-shimmer w-100"
              style={{ padding: '1rem', fontSize: '1.05rem' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-lock mr-2"></i> Checkout Now
            </motion.button>

            <div className="trust-badges">
              <div className="trust-badge"><i className="fas fa-shield-alt"></i><span>Secure</span></div>
              <div className="trust-badge"><i className="fas fa-undo"></i><span>Returns</span></div>
              <div className="trust-badge"><i className="fas fa-lock"></i><span>Encrypted</span></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delivery Estimation Modal */}
      <AnimatePresence>
        {showDeliveryModal && (
          <DeliveryModal
            billingAddress={getUserBillingAddress()}
            onConfirm={handleDeliveryConfirm}
            onClose={() => setShowDeliveryModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Stripe Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.95 }}>
              <div className="modal-header">
                <h4><i className="fas fa-credit-card mr-2" style={{ color: 'var(--secondary)' }}></i>Secure Payment</h4>
                <button onClick={() => setShowPaymentModal(false)} className="modal-close-btn"><i className="fas fa-times"></i></button>
              </div>
              <div className="modal-body">
                <div className="payment-summary">
                  <span>Order Total</span>
                  <span className="gradient-text" style={{ fontWeight: 900, fontSize: '1.4rem' }}>${grandTotal.toFixed(2)}</span>
                </div>
                {deliveryInfo.deliveryDays && (
                  <div className="payment-delivery-note">
                    <i className="fas fa-truck mr-2" style={{ color: 'var(--secondary)' }}></i>
                    Estimated delivery: <strong>{deliveryInfo.deliveryDays}</strong>
                    {deliveryInfo.travelTime && deliveryInfo.travelTime !== 'N/A' && ` (${deliveryInfo.travelTime} from store)`}
                  </div>
                )}
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    totalAmount={grandTotal}
                    onSuccess={handleOrderSuccess}
                    onCancel={() => setShowPaymentModal(false)}
                    cartItems={cartItems}
                    billingAddress={getUserBillingAddress()}
                    deliveryEstimate={deliveryInfo.deliveryDays}
                    travelTime={deliveryInfo.travelTime}
                  />
                </Elements>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}