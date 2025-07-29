import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaRegCheckCircle, FaStar, FaGuitar, FaLeaf, FaHeart } from 'react-icons/fa';
import heroImage from '../assets/goggle-removebg-preview (1).png';

const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/images')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Image fetch error:', err));
  }, []);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>👓 FramesArt</div>
        <div style={styles.navLinks}>
          <Link to="/home" style={styles.link}>Home</Link>
          <Link to="/shop" style={styles.link}>Shop</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <Link to="/favorites" style={styles.link}>
            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <FaHeart style={styles.favoritesIcon} />
            </motion.div>
          </Link>
          <Link to="/cart" style={styles.link}>
            <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ duration: 0.3 }}>
              <FaShoppingCart style={styles.cartIcon} />
            </motion.div>
          </Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={styles.heroTitle}
          >
            Style. Comfort. Clarity. ✨
          </motion.h1>
          <p style={styles.heroSubtitle}>
            Discover eyewear that perfectly complements your vibe and vision. 🕶️
          </p>
          <Link to="/shop">
            <motion.button style={styles.cta}>Shop Collection</motion.button>
          </Link>
        </div>
        <motion.div style={styles.heroImageWrapper}>
          <motion.img
            src={heroImage}
            alt="Hero Glasses"
            style={styles.heroImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      <section style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Our Top Picks 👓</h2>
        <div style={styles.productList}>
          {images.length > 0 ? images.map((item, i) => (
            <motion.div
              key={i}
              style={styles.productCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div
                style={styles.imageWrapper}
                onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = 1}
                onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = 0}
              >
                <motion.img
                  src={`http://localhost:5000${item.url}`}
                  alt={item.altText}
                  style={styles.productImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="overlay" style={styles.overlay}>
                  <motion.div whileHover={{ opacity: 1 }} style={styles.overlayContent}>
                    View Details 🔍
                  </motion.div>
                </div>
              </div>
              <h4 style={styles.productName}>{item.altText} 🕶️</h4>
              <p style={styles.productTagline}>Trendy eyewear for everyday style</p>
              <Link to="/shop">
                <motion.button
                  style={styles.productButton}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  View Details
                </motion.button>
              </Link>
            </motion.div>
          )) : (
            <div style={styles.loading}>Loading products...</div>
          )}
        </div>
      </section>

      <section style={styles.whyUsSection}>
        <h2 style={styles.sectionTitle}>Why Choose FramesArt? 🌟</h2>
        <div style={styles.whyUsContent}>
          <div style={styles.whyUsItem}>
            <FaRegCheckCircle style={styles.icon} />
            <h3>Quality Materials 💎</h3>
            <p>We use only premium materials to ensure durability and comfort.</p>
          </div>
          <div style={styles.whyUsItem}>
            <FaStar style={styles.icon} />
            <h3>Stylish Designs 🎨</h3>
            <p>Our eyewear is designed to elevate your look and reflect your style.</p>
          </div>
          <div style={styles.whyUsItem}>
            <FaGuitar style={styles.icon} />
            <h3>Affordable Prices 💰</h3>
            <p>Get the best eyewear without breaking the bank.</p>
          </div>
          <div style={styles.whyUsItem}>
            <FaLeaf style={styles.icon} />
            <h3>Eco-friendly 🌍</h3>
            <p>We care about the planet, so our eyewear is made with eco-friendly materials.</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2025 FramesArt. Stylish Vision Starts Here.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to bottom, #ffffff, #f4f6fc)',
    color: '#222',
    overflowX: 'hidden',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    background: 'rgba(255, 255)', 
boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
position: 'sticky',
top: 0,
zIndex: 100,
},
logo: {
fontWeight: 'bold',
fontSize: '1.6rem',
color: '#1a73e8',
cursor: 'default',
},
navLinks: {
display: 'flex',
gap: '25px',
alignItems: 'center',
},
link: {
color: '#333',
textDecoration: 'none',
fontWeight: '500',
fontSize: '1rem',
transition: 'color 0.3s',
},
favoritesIcon: {
color: '#e0245e',
fontSize: '1.4rem',
},
cartIcon: {
color: '#1a73e8',
fontSize: '1.4rem',
},
hero: {
display: 'flex',
justifyContent: 'space-between',
padding: '60px 50px',
alignItems: 'center',
gap: '50px',
flexWrap: 'wrap',
background: 'linear-gradient(135deg,rgb(246, 249, 254) 0%,rgb(255, 255, 255) 100%)',
},
heroText: {
flex: 1,
maxWidth: '600px',
},
heroTitle: {
fontSize: '3rem',
marginBottom: '15px',
color: '#222',
},
heroSubtitle: {
fontSize: '1.25rem',
marginBottom: '30px',
color: '#555',
},
cta: {
backgroundColor: '#1a73e8',
color: '#fff',
border: 'none',
padding: '14px 32px',
borderRadius: '30px',
fontSize: '1.1rem',
cursor: 'pointer',
boxShadow: '0 6px 20px rgba(26, 115, 232, 0.4)',
},
heroImageWrapper: {
flex: 1,
maxWidth: '450px',
textAlign: 'center',
},
heroImage: {
width: '100%',
height: 'auto',
},
productsSection: {
padding: '60px 50px',
backgroundColor: '#fff',
textAlign: 'center',
},
sectionTitle: {
fontSize: '2.5rem',
marginBottom: '40px',
color: '#1a73e8',
},
productList: {
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
gap: '30px',
},
productCard: {
backgroundColor: '#f8f9fc',
borderRadius: '20px',
boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
padding: '15px',
cursor: 'pointer',
position: 'relative',
overflow: 'hidden',
},
imageWrapper: {
position: 'relative',
overflow: 'hidden',
borderRadius: '20px',
},
productImage: {
width: '100%',
display: 'block',
borderRadius: '20px',
transition: 'transform 0.3s ease',
},
overlay: {
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: 'rgba(26, 115, 232, 0.6)',
opacity: 0,
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
color: '#fff',
fontWeight: '600',
fontSize: '1.2rem',
transition: 'opacity 0.3s ease',
borderRadius: '20px',
},
overlayContent: {
opacity: 0.9,
},
productName: {
marginTop: '15px',
fontWeight: '600',
fontSize: '1.1rem',
color: '#222',
},
productTagline: {
fontSize: '0.9rem',
color: '#666',
marginBottom: '12px',
},
productButton: {
backgroundColor: '#1a73e8',
border: 'none',
borderRadius: '25px',
padding: '10px 25px',
color: 'white',
fontWeight: '600',
fontSize: '1rem',
cursor: 'pointer',
boxShadow: '0 5px 15px rgba(26, 115, 232, 0.4)',
},
loading: {
fontSize: '1.2rem',
color: '#999',
},
whyUsSection: {
padding: '60px 50px',
backgroundColor: '#f0f4ff',
textAlign: 'center',
},
whyUsContent: {
display: 'flex',
justifyContent: 'center',
gap: '45px',
flexWrap: 'wrap',
},
whyUsItem: {
maxWidth: '220px',
backgroundColor: '#fff',
padding: '25px',
borderRadius: '15px',
boxShadow: '0 4px 10px rgba(26, 115, 232, 0.1)',
},
icon: {
fontSize: '2rem',
color: '#1a73e8',
marginBottom: '10px',
},
footer: {
padding: '25px',
backgroundColor: '#222',
color: 'white',
textAlign: 'center',
},
};

export default Home;