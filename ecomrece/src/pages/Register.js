import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      setMsg(res.data.msg || 'Registration successful!');
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Registration failed');
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
        <h2 style={styles.title}>Create Your Account</h2>
        {msg && <p style={styles.message}>{msg}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

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
              onClick={() => setShowPassword((prev) => !prev)}
              style={styles.showPasswordButton}
              aria-label="Toggle password visibility"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" style={styles.button}>Sign Up</button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={styles.link}>Login</span>
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
};
