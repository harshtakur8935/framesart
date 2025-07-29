import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaUserCircle, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';  // Icons for Profile

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('🚫 No token found. Please login again.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { 'x-auth-token': token },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Profile fetch error:', error.response || error.message);
        const errorMsg = error?.response?.data?.msg || '❗ Error fetching user data';
        setMessage(errorMsg);

        if (
          errorMsg === 'Unauthorized: No token' ||
          errorMsg === 'Token is not valid' ||
          errorMsg === 'User not found'
        ) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('🚫 No token found. Please login again.');
      return;
    }
  
    try {
      // Deleting user from DB
      const response = await axios.delete('http://localhost:5000/api/auth/delete-account', {
        headers: { 'x-auth-token': token },
      });
  
      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/register');
      } else {
        setMessage('❗ Error deleting user account');
      }
    } catch (error) {
      console.error('Account deletion error:', error.response || error.message);
      setMessage('❗ Error deleting account');
    }
  };
  

  return (
    <motion.div style={styles.container}>
      <motion.div style={styles.profileContainer}>
        <h2 style={styles.profileTitle}>👤 Welcome to Your Profile</h2>

        {message && <p style={styles.errorMessage}>{message}</p>}

        {userData ? (
          <div style={styles.profileCard}>
            <motion.div style={styles.profileInfo}>
              <div style={styles.profileField}>
                <FaUserCircle style={styles.icon} />
                <span><strong>Username:</strong> {userData.username}</span>
              </div>
              <div style={styles.profileField}>
                <FaEnvelope style={styles.icon} />
                <span><strong>Email:</strong> {userData.email}</span>
              </div>
            </motion.div>

            <motion.button
              style={styles.logoutButton}
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        ) : (
          <div style={styles.loading}>Loading profile...</div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Inline Styles
const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to bottom, #ffffff, #f4f6fc)',
    color: '#222',
    paddingTop: '60px',
  },
  profileContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
  profileTitle: {
    fontSize: '32px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '20px',
  },
  profileCard: {
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  profileInfo: {
    marginBottom: '30px',
  },
  profileField: {
    fontSize: '18px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '24px',
    color: '#6c63ff',
  },
  logoutButton: {
    background: '#e74c3c',
    color: 'white',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  errorMessage: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '20px',
  },
};

export default Profile;
