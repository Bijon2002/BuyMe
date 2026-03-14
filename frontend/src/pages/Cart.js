import { Fragment, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Cart({ cartItems, setCartItems }) {
    const [complete, setComplete] = useState(false);

    function increaseQty(item) {
        if (item.product.stock === item.qty) return;
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                return { ...i, qty: i.qty + 1 };
            }
            return i;
        });
        setCartItems(updatedItems);
    }

    function decreaseQty(item) {
        if (item.qty <= 1) return;
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                return { ...i, qty: i.qty - 1 };
            }
            return i;
        });
        setCartItems(updatedItems);
    }

    function removeItem(item) {
        const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
        setCartItems(updatedItems);
        toast.info("Item removed from cart");
    }

    function placeOrderHandler() {
        const amount = cartItems.reduce(
            (acc, item) => acc + Number(item.product.price) * item.qty,
            0
        );

        fetch(process.env.REACT_APP_API_URL + "/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                CartItems: cartItems,
                amount: amount.toString(),
                status: "success",
                createdAt: new Date(),
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Order failed");
                return res.json();
            })
            .then(() => {
                setCartItems([]);
                setComplete(true);
                toast.success("Order placed successfully");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Order failed. Please try again.");
            });
    }

    if (complete) {
        return (
            <div className="text-center py-5 animate-fade-in">
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                <h1 className="mb-3" style={{ fontWeight: 800 }}>Order Complete!</h1>
                <p className="text-muted mb-5">Your premium items are being prepared for shipment.</p>
                <Link to="/" className="btn-modern btn-primary-modern">Continue Shopping</Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-5 animate-fade-in">
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛍️</div>
                <h2 className="mb-3" style={{ fontWeight: 800 }}>Your Bag is Empty</h2>
                <p className="text-muted mb-5">Start discovery and fill it with amazing products.</p>
                <Link to="/" className="btn-modern btn-primary-modern">Discover Products</Link>
            </div>
        );
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);

    return (
        <div className="animate-fade-in">
            <h1 className="mb-4" style={{ fontWeight: 800 }}>Your Bag <span style={{ color: 'var(--primary)' }}>({cartItems.length})</span></h1>

            <div className="row">
                <div className="col-12 col-lg-8">
                    {cartItems.map((item) => (
                        <div key={item.product._id} className="cart-item-row animate-fade-in">
                            <img src={item.product.images[0].image} alt={item.product.name} className="cart-item-img" />
                            
                            <div>
                                <Link to={"/product/" + item.product._id} style={{ textDecoration: 'none', color: 'var(--secondary)', fontWeight: 600 }}>
                                    {item.product.name}
                                </Link>
                                <p className="text-muted mb-0 small">{item.product.seller}</p>
                            </div>

                            <div className="font-weight-bold" style={{ fontSize: '1.25rem' }}>
                                ${item.product.price}
                            </div>

                            <div className="quantity-control">
                                <button className="qty-btn" onClick={() => decreaseQty(item)} style={{ width: '2rem', height: '2rem' }}>−</button>
                                <span style={{ fontWeight: 700 }}>{item.qty}</span>
                                <button className="qty-btn" onClick={() => increaseQty(item)} style={{ width: '2rem', height: '2rem' }}>+</button>
                            </div>

                            <button onClick={() => removeItem(item)} className="btn-modern text-danger" style={{ padding: '0.5rem' }}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card-premium order-summary-card p-4 animate-fade-in">
                        <h3 className="mb-4">Order Summary</h3>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal ({subtotal} units)</span>
                            <span className="font-weight-bold">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-muted">Estimated Shipping</span>
                            <span className="text-success font-weight-bold">Free</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-4 mt-2">
                            <span className="h4 mb-0">Total</span>
                            <span className="h4 mb-0" style={{ fontWeight: 800, color: 'var(--primary)' }}>${totalAmount.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={placeOrderHandler} 
                            className="btn-modern btn-primary-modern btn-block"
                            style={{ padding: '1rem' }}
                        >
                            Checkout Now
                        </button>
                        <p className="text-center mt-3 text-muted small">
                            Secure Encrypted Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}