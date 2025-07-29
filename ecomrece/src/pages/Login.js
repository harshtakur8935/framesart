import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUserPlus, FaKey } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!email || !password) {
      setMsg('Please fill in both fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        setMsg('Login successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setMsg('Invalid response from server.');
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data);
      setMsg(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <h2 style={styles.title}>Welcome Back</h2>
        {msg && <p style={styles.message}>{msg}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button
              type="button"
              style={styles.showPasswordButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <motion.p
            style={styles.forgotPassword}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/forgot-password')}
          >
            <FaKey style={{ marginRight: '6px' }} />
            <span style={styles.link}>Forgot Password?</span>
          </motion.p>

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.footer}>
          <FaUserPlus style={{ marginRight: '6px' }} />
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>Register</span>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#ffffff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '380px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '32px',
    marginBottom: '1.5rem',
    fontWeight: '700',
    color: '#333',
    letterSpacing: '1px',
  },
  message: {
    color: 'crimson',
    fontSize: '14px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    padding: '14px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    paddingLeft: '35px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    transition: 'all 0.3s ease',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    color: '#4C51BF',
  },
  showPasswordButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#4C51BF',
    cursor: 'pointer',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#4C51BF',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '14px',
    color: '#555',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
  },
  link: {
    color: '#4C51BF',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  forgotPassword: {
    fontSize: '14px',
    textAlign: 'right',
    cursor: 'pointer',
    color: '#4C51BF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '6px',
  },
};
