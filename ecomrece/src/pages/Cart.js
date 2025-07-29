import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrashAlt, FaTimesCircle, FaMinus, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Added for navigation

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      const uniqueItems = response.data.products.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setCartItems(uniqueItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete('http://localhost:5000/api/cart/remove', { data: { productId } });
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear');
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    navigate('/checkout');
  };

  const updateQuantity = (productId, increment) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId._id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + increment) }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <nav className="navbar">
        <div className="logo">👓 FramesArt</div>
        <div className="nav-links">
          <Link to="/Home" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/cart" className="nav-link active">🛒 Cart</Link>
        </div>
      </nav>

      <section className="cart-section">
        <h2 className="section-title">🛒 Your Cart</h2>

        {loading ? (
          <div className="loading">Loading cart items... ⏳</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty. 🧺</div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <motion.div key={item.productId._id} className="cart-item" whileHover={{ scale: 1.05 }}>
                  <img src={item.productId.imageUrl} alt={item.productId.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.productId.name}</h4>
                    <p className="cart-item-price">₹{item.productId.price} x {item.quantity}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.productId._id, -1)} disabled={item.quantity === 1}><FaMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId._id, 1)}><FaPlus /></button>
                    </div>
                  </div>
                  <motion.button
                    className="remove-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleRemoveFromCart(item.productId._id)}
                    data-tooltip-id="remove-tooltip"
                    data-tooltip-content="Remove from Cart 🗑️"
                  >
                    <FaTrashAlt />
                  </motion.button>
                </motion.div>
              ))}
              <Tooltip id="remove-tooltip" />
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{totalPrice.toFixed(2)} 💸</h3>
              <motion.button
                className="checkout-button"
                onClick={handleCheckout}
                whileHover={{ scale: 1.05 }}
                disabled={cartItems.length === 0}
              >
                Checkout
              </motion.button>
              <motion.button
                className="clear-cart-button"
                onClick={handleClearCart}
                whileHover={{ scale: 1.05 }}
                disabled={cartItems.length === 0}
              >
                <FaTimesCircle /> Clear Cart
              </motion.button>
            </div>
          </>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 FramesArt. Stylish Vision Starts Here. 👓</p>
      </footer>

      <style>{`
        /* Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: #f7f9fc;
          color: #333;
        }

        /* Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 50px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 999;
        }

        .logo {
          font-size: 30px;
          font-weight: 700;
          background: linear-gradient(90deg, #6c63ff, #00c9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          font-size: 16px;
          position: relative;
          padding: 5px 0;
          transition: color 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #ffd700;
        }

        /* Cart Section */
        .cart-section {
          padding: 40px;
          background: #ffffff;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #f9f9f9;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
          border-left: 6px solid #6c63ff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cart-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #e2e2e2;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .cart-item-price {
          font-size: 16px;
          color: #555;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .quantity-controls button {
          padding: 6px 12px;
          background: #f0f4ff;
          border: 1px solid #d6d6ff;
          border-radius: 8px;
          cursor: pointer;
        }

        .quantity-controls button:hover {
          background: #e0e8ff;
        }

        .remove-button {
          background-color: #ffe4e6;
          color: #e11d48;
          border: none;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
        }

        .remove-button:hover {
          background-color: #fecdd3;
        }

        .cart-summary {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkout-button,
        .clear-cart-button {
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .checkout-button {
          background-color: #388e3c;
          color: white;
        }

        .clear-cart-button {
          background-color: #ff4081;
          color: white;
        }

        .checkout-button:hover {
          background-color: #2e7d32;
        }

        .clear-cart-button:hover {
          background-color: #f50057;
        }

        .footer {
          text-align: center;
          padding: 30px;
          background-color: #6c63ff;
          color: white;
          font-size: 14px;
        }

        .loading,
        .empty-cart {
          text-align: center;
          font-size: 18px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
