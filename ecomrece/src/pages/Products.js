  import React, { useEffect, useState } from 'react';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import {
    FaShoppingCart,
    FaStar,
    FaHeart,
    FaRegHeart,
    FaEye,
    FaSearch
  } from 'react-icons/fa';
  import axios from 'axios';

  const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Load favorites
    useEffect(() => {
      axios.get('http://localhost:5000/api/favorites')
        .then(res => {
          if (Array.isArray(res.data)) {
            setFavorites(res.data.map(fav => fav.productId));
          } else {
            console.error("Unexpected favorites response", res.data);
          }
        })
        .catch(err => console.error('Failed to load favorites:', err));
    }, []);

    // Load products
    useEffect(() => {
      axios.get('http://localhost:5000/api/products')
        .then(res => {
          if (Array.isArray(res.data)) {
            setProducts(res.data);
          } else {
            console.error("Unexpected products response", res.data);
          }
        })
        .catch(err => {
          console.error('Error fetching products:', err);
        });
    }, []);

    // Search suggestions
    useEffect(() => {
      if (searchQuery) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, [searchQuery, products]);

    const handleFavoriteClick = async (product) => {
      const isFavorite = favorites.includes(product._id);
      try {
        if (isFavorite) {
          await axios.delete('http://localhost:5000/api/favorites/remove', {
            data: { productId: product._id }
          });
          setFavorites(prev => prev.filter(id => id !== product._id));
          alert(`${product.name} removed from favorites!`);
        } else {
          await axios.post('http://localhost:5000/api/favorites', {
            productId: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
          });
          setFavorites(prev => [...prev, product._id]);
          alert(`${product.name} added to favorites!`);
        }
      } catch (error) {
        console.error('Favorite toggle error:', error?.response?.data || error.message);
        alert("Failed to update favorites");
      }
    };

    const handleAddToCart = async (product) => {
      try {
        const response = await axios.post('http://localhost:5000/api/cart', {
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        });

        if (response.status === 200 || response.status === 201) {
          alert(`${product.name} added to cart!`);
        } else {
          throw new Error("Unexpected server response");
        }
      } catch (error) {
        console.error('Error adding to cart:', error?.response?.data || error.message);
        alert("Failed to add to cart");
      }
    };

    const handleClearSearch = () => {
      setSearchQuery("");
      setSuggestions([]);
    };

    const filteredProducts = products.filter((product) =>
      (categoryFilter === "All" || product.category === categoryFilter) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="container">
        <nav className="nav">
          <div className="logo">👓 FramesArt</div>
          <div className="navLinks">
            <Link to="/Home" className="link">Home</Link>
            <Link to="/shop" className="link">Shop</Link>
            <Link to="/profile" className="link">Profile</Link>
            <Link to="/favorites" className="link">
              <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                <FaHeart className="favoritesIcon" />
              </motion.div>
            </Link>
            <Link to="/cart" className="link">
              <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ duration: 0.3 }}>
                <FaShoppingCart className="cartIcon" />
              </motion.div>
            </Link>
          </div>
        </nav>

        <section className="hero">
          <div className="heroText">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="heroTitle"
            >
              Discover Your Perfect Eyewear 🕶️
            </motion.h1>
            <p className="heroSubtitle">The perfect combination of style, comfort, and clarity awaits you!</p>
          </div>
        </section>

        <section className="filtersSection">
          <h2 className="sectionTitle">Filter by Category</h2>
          <div className="filterButtons">
            {["All", "Goggles", "Specs", "Sunglasses"].map((cat) => (
              <button
                key={cat}
                className={`filterButton ${categoryFilter === cat ? 'filterHover' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <section className="searchSection">
            <motion.div
              className={`searchBarContainer ${isSearchFocused ? "focused" : ""}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FaSearch className="searchIcon" />
              <input
                type="text"
                className="searchInput"
                placeholder="Search eyewear by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchQuery && (
                <motion.button
                  className="clearSearchButton"
                  onClick={handleClearSearch}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  🧹
                </motion.button>
              )}
            </motion.div>

            <div className="searchResultsCount">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {searchQuery && suggestions.length > 0 && (
              <div className="suggestionsList">
                {suggestions.map((product) => (
                  <div key={product._id} className="suggestionItem" onClick={() => setSearchQuery(product.name)}>
                    <img src={product.imageUrl} alt={product.name} className="suggestionImage" />
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>

        <section className="productsSection">
          <h2 className="sectionTitle">Featured Eyewear</h2>
          <div className="productList">
            {filteredProducts.slice(0, 6).map((product, i) => (
              <motion.div
                key={product._id}
                className="productCard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="imageWrapper">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="productImage"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <h4 className="productName">{product.name}</h4>
                <div className="productRating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < product.rating ? 'starFilled' : 'starEmpty'} />
                  ))}
                </div>
                <p className="productPrice">₹{product.price}</p>
                <div className="actionButtons">
                  <motion.button className="actionButton" whileHover={{ scale: 1.1 }} onClick={() => handleAddToCart(product)}>
                    <FaShoppingCart className="icon" /> Add to Cart
                  </motion.button>
                  <motion.button
                    className="actionButton"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleFavoriteClick(product)}
                  >
                    {favorites.includes(product._id)
                      ? <FaHeart className="icon favoriteIcon" />
                      : <FaRegHeart className="icon" />}
                    {favorites.includes(product._id) ? "Remove from Favorites" : "Add to Favorites"}
                  </motion.button>
                  <Link to={`/product/${product._id}`} className="actionButton">
                    <FaEye className="icon" /> View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>© 2025 FramesArt. Stylish Vision Starts Here.</p>
        </footer>

        {/* ✅ Embedding the CSS here as requested */}
        <style jsx="true">{`
          .container {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg,rgb(250, 252, 255) 0%,rgb(255, 255, 255) 100%);
            
            color: #222;
          }
          .nav {
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
          .navLinks {
            display: flex;
            gap: 32px;
          }
          .link {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            font-size: 16px;
          }
          .favoritesIcon { font-size: 22px; color: #ff1493; }
          .cartIcon { font-size: 22px; color: #6c63ff; }
          .hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 60px;
            flex-wrap: wrap;
            gap: 50px;
            
          }
          .heroText {
            flex: 1;
            max-width: 520px;
          }
          .heroTitle {
            font-size: 50px;
            font-weight: 800;
            margin-bottom: 10px;
          }
          .heroSubtitle {
            font-size: 20px;
            color: #555;
            margin-bottom: 30px;
          }
          .filtersSection {
            padding: 40px 80px;
            background: #fff;
          }
          .filterButtons {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 30px;
          }
          .filterButton {
            background: #6c63ff;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
          }
          .filterButton:hover {
            background: #00c9ff;
          }
          .searchSection {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 40px;
          }
          .searchBarContainer {
            display: flex;
            align-items: center;
            background: #ffffff;
            border: 2px solid #6c63ff;
            border-radius: 40px;
            padding: 12px 20px;
            width: 100%;
            max-width: 480px;
            box-shadow: 0 4px 10px rgba(108, 99, 255, 0.15);
            transition: all 0.3s ease-in-out;
            position: relative;
          }
          .searchBarContainer.focused {
            box-shadow: 0 6px 16px rgba(108, 99, 255, 0.3);
          }
          .searchIcon {
            font-size: 18px;
            color: #6c63ff;
            margin-right: 12px;
          }
          .searchInput {
            flex: 1;
            border: none;
            font-size: 16px;
            padding: 10px;
            outline: none;
            border-radius: 20px;
            font-weight: 500;
            color: #333;
          }
          .clearSearchButton {
            font-size: 18px;
            color: #6c63ff;
            background: transparent;
            border: none;
            cursor: pointer;
          }
          .suggestionsList {
            margin-top: 15px;
            background: #fff;
            width: 100%;
            max-width: 480px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            z-index: 10;
          }
          .suggestionItem {
            display: flex;
            align-items: center;
            padding: 12px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .suggestionItem:hover {
            background-color: #f0f0f0;
          }
          .suggestionImage {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 12px;
          }
          .productsSection {
            padding: 40px 80px;
          }
          .productList {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
          }
          .productCard {
            background: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
          }
          .imageWrapper {
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .productImage {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .productName {
            font-size: 18px;
            font-weight: 600;
            margin-top: 15px;
          }
          .productRating {
            margin-top: 10px;
          }
          .starFilled {
            color: #ff9800;
          }
          .starEmpty {
            color: #e0e0e0;
          }
          .productPrice {
            font-size: 20px;
            font-weight: 700;
            color: #6c63ff;
            margin-top: 10px;
          }
          .actionButtons {
            margin-top: 20px;
          }
          .actionButton {
            background-color: #6c63ff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 10px;
            width: 100%;
            cursor: pointer;
          }
          .actionButton:hover {
            background-color: #00c9ff;
          }
          .favoriteIcon {
            color: #ff1493;
          }
          .footer {
            background-color: #f4f6fc;
            padding: 20px 50px;
            text-align: center;
          }
          .footer p {
            font-size: 14px;
            color: #888;
          }
        `}</style>
      </div>
    );
  };

  export default ProductPage;
