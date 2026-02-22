import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', gender: '', role: 'customer', adminKey: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(null); // seconds remaining
  const [timerInterval, setTimerInterval] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startCountdown = () => {
    // 5 minutes = 300 seconds
    let seconds = 300;
    setCountdown(seconds);

    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setCountdown(0);
      }
    }, 1000);

    setTimerInterval(interval);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Clear existing timer
    if (timerInterval) clearInterval(timerInterval);

    try {
      const res = await axiosInstance.post('/auth/invite', form);
      setStatus('success');
      setMessage(res.data.message);
      startCountdown();
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const canResend = countdown === 0;

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h1 className="auth-title">Invite User</h1>
          <p className="auth-subtitle">Send a secure setup link to a new user</p>
        </div>

        {/* Countdown Banner */}
        {countdown !== null && countdown > 0 && (
          <div className="countdown-banner">
            <span className="countdown-icon">⏱</span>
            <span>Invite link expires in </span>
            <span className="countdown-time">{formatTime(countdown)}</span>
          </div>
        )}
        {countdown === 0 && (
          <div className="countdown-banner expired">
            <span>⚠ Link expired — you can send a new invite</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text" name="firstName" required
                value={form.firstName} onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text" name="lastName" required
                value={form.lastName} onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel" name="phone"
                value={form.phone} onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Admin Secret Key</label>
            <input
              type="password" name="adminKey" required
              value={form.adminKey} onChange={handleChange}
              placeholder="Enter admin secret key"
            />
          </div>

          {message && (
            <div className={`form-message ${status}`}>{message}</div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading' || (countdown !== null && countdown > 0)}
          >
            {status === 'loading'
              ? 'Sending...'
              : countdown !== null && countdown > 0
              ? `Wait ${formatTime(countdown)} to resend`
              : canResend
              ? 'Resend Invite'
              : 'Send Invite Link'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;