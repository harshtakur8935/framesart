import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrashAlt, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      if (response.data && Array.isArray(response.data.products)) {
        setFavorites(response.data.products);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      const response = await axios.delete('http://localhost:5000/api/favorites/remove', {
        data: { productId },
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        setFavorites((prev) => prev.filter((item) => item.productId !== productId));
        alert('💔 Removed from favorites!');
      }
    } catch (error) {
      console.error('Error removing favorite:', error.response || error);
      alert('Failed to remove from favorites');
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', {
        productId: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      });

      if (res.status === 200 || res.status === 201) {
        await handleRemoveFromFavorites(item.productId);
        alert(`🛒 "${item.name}" moved to cart!`);
      } else {
        alert('Failed to move item to cart');
      }
    } catch (err) {
      console.error('Error moving to cart:', err);
      alert('Move to cart failed');
    }
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">👓 FramesArt</div>
        <div className="navLinks">
          <Link to="/home" className="link"> Home</Link>
          <Link to="/shop" className="link"> Shop</Link>
          <Link to="/profile" className="link"> Profile</Link>
          <Link to="/favorites" className="link active"> Favorites</Link>
          <Link to="/cart" className="link">🛒 Cart</Link>
        </div>
      </nav>

      <section className="favoritesSection">
        <h2 className="sectionTitle">💖 Your Favorite Frames</h2>
        {loading ? (
          <div className="loading">Loading favorites... ⏳</div>
        ) : favorites.length === 0 ? (
          <div className="noFavorites">You haven’t added any favorites yet! 💔</div>
        ) : (
          <div className="favoritesItems">
            {favorites.map((item) => (
              <motion.div
                key={item._id}
                className="favoriteItem"
                whileHover={{ scale: 1.03 }}
              >
                <img src={item.imageUrl} alt={item.name} className="favoriteItemImage" />
                <div className="favoriteItemInfo">
                  <h4 className="favoriteItemName">{item.name}</h4>
                  <p className="favoriteItemPrice">💰 ₹{item.price}</p>
                </div>
                <div className="buttons">
                  <motion.button
                    className="moveButton"
                    onClick={() => handleMoveToCart(item)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaShoppingCart /> Move to Cart
                  </motion.button>
                  <motion.button
                    className="removeButton"
                    onClick={() => handleRemoveFromFavorites(item.productId)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaTrashAlt /> Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 FramesArt. Stylish Vision Starts Here. 👓</p>
      </footer>

      <style jsx="true">{`
        .container {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(to bottom, #ffffff, #f4f6fc);
          color: #222;
          min-height: 100vh;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 50px;
          background: white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          font-size: 30px;
          font-weight: 700;
          background: linear-gradient(90deg, #6c63ff, #00c9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navLinks {
          display: flex;
          gap: 24px;
        }

        .link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
        }

        .link:hover, .link.active {
          color: #ffd700;
        }

        .favoritesSection {
          padding: 40px 60px;
        }

        .sectionTitle {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
        }

        .favoritesItems {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .favoriteItem {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .favoriteItemImage {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .favoriteItemInfo {
          text-align: center;
          margin-bottom: 12px;
        }

        .favoriteItemName {
          font-size: 20px;
          font-weight: 600;
        }

        .favoriteItemPrice {
          font-size: 16px;
          color: #444;
        }

        .buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .removeButton, .moveButton {
          background: #f3f3f3;
          color: #444;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.3s ease;
        }

        .removeButton {
          background: #ff4d4f;
          color: white;
        }

        .removeButton:hover {
          background: #d63031;
        }

        .moveButton {
          background: #6c63ff;
          color: white;
        }

        .moveButton:hover {
          background: #4e47d2;
        }

        .noFavorites, .loading {
          text-align: center;
          font-size: 18px;
          color: #888;
          margin-top: 40px;
        }

        .footer {
          text-align: center;
          padding: 20px;
          background: #6c63ff;
          color: white;
        }

        @media (max-width: 768px) {
          .favoritesSection {
            padding: 20px;
          }

          .favoritesItems {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;
