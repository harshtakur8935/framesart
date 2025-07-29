import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setStatus('');

    if (!email || !newPassword) {
      setMsg('Please fill in both fields.');
      setStatus('error');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email,
        newPassword,
      });
      setMsg(res.data?.msg || 'Password updated successfully!');
      setStatus('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Forgot Password Error:', err);
      setMsg(err.response?.data?.msg || 'Something went wrong, please try again');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Forgot Password</h2>

        {msg && (
          <div
            style={{
              ...styles.message,
              backgroundColor: status === 'success' ? '#e6ffed' : '#ffe6e6',
              color: status === 'success' ? '#2f855a' : '#c53030',
              border: `1px solid ${status === 'success' ? '#38a169' : '#e53e3e'}`,
            }}
          >
            {status === 'success' ? <FaCheckCircle /> : <FaTimesCircle />} &nbsp;
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <FiMail style={styles.icon} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <FiLock style={styles.icon} />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
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
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    animation: 'scaleFade 0.4s ease-in-out',
  },
  title: {
    fontSize: '28px',
    marginBottom: '1.5rem',
    fontWeight: '700',
    color: '#333',
    letterSpacing: '0.5px',
  },
  message: {
    padding: '0.9rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    fontSize: '14px',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4rem',
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '14px',
    transform: 'translateY(-50%)',
    color: '#666',
    fontSize: '18px',
  },
  input: {
    height: '45px', // Fixed height
    width: '100%',  // Full width
    fontSize: '16px', // Font size
    padding: '0 16px 0 42px', // Padding inside the input
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    outline: 'none',
    boxSizing: 'border-box', // Ensures padding and borders are included in the element's total size
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    backgroundColor: '#4C51BF',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
};
