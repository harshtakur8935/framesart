import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaGooglePay, FaApple, FaMoneyBillAlt, FaPaypal } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // To access location/state

const stripePromise = loadStripe('pk_test_51R9JXQ2ft8NtfRcn1Tq55NzQYNL6FAoer4IMwebXgInItKeOY9zkgZXSitcRw8pmRTDd24Ojdag2cpybLt3n9r2R00apYzGCVA');

const CheckoutPage = () => {
  const location = useLocation(); // Get the location object
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const cartItems = location.state?.cartItems || []; // Get cartItems from state

  // Calculate total price from cartItems
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        items: cartItems,
        customerEmail: 'customer@example.com',
      });
      
      const session = response.data;
      if (session && session.id) {
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) alert(result.error.message);
      } else {
        alert('Checkout session not created properly. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🕶️ Frames Art</div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/cart">Cart</a></li>
          <li><a href="/checkout">Checkout</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>

      {/* Checkout Section */}
      <motion.div className="checkout-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>🛍️ Checkout</h2>
        <p>Select your preferred payment method</p>

        {/* Display Total Price */}
        <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>

        <div className="payment-grid">
          {[['Credit/Debit Card', FaCreditCard], ['Google Pay', FaGooglePay], ['Apple Pay', FaApple], ['Cash on Delivery', FaMoneyBillAlt], ['Paypal', FaPaypal]].map(([label, Icon]) => (
            <motion.div className="payment-option" key={label} whileHover={{ scale: 1.05 }}>
              <Icon className="pay-icon" />
              <span>{label}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="pay-button"
          onClick={handlePayment}
          disabled={loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Processing...' : `💳 Pay ₹${totalAmount.toFixed(2)}`}
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="footer">
        <p>🔐 Secure Payment | Powered by Stripe</p>
        <p>&copy; 2025 Frames Art</p>
      </footer>

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .checkout-wrapper {
          font-family: 'Segoe UI', sans-serif;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #6c63ff;
          padding: 1rem 2rem;
          color: white;
        }
        .navbar .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .navbar ul {
          display: flex;
          gap: 20px;
          list-style: none;
        }
        .navbar ul li a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
        }
        .navbar ul li a:hover {
          text-decoration: underline;
        }

        .checkout-box {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          background: #f9f9ff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        .checkout-box h2 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        .checkout-box p {
          margin-bottom: 25px;
          color: #666;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .payment-option {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s;
          cursor: pointer;
        }
        .pay-icon {
          font-size: 2rem;
          color: #6c63ff;
          margin-bottom: 10px;
        }

        .pay-button {
          background: #6c63ff;
          color: white;
          border: none;
          font-size: 1.1rem;
          padding: 12px 30px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .pay-button:hover {
          background: #594df2;
        }

        .footer {
          margin-top: 40px;
          background: #6c63ff;
          color: white;
          text-align: center;
          padding: 1rem 0;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
