import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(null);

  const startCountdown = () => {
    let seconds = 300; // 5 minutes
    setCountdown(seconds);
    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setCountdown(0);
      }
    }, 1000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await axiosInstance.post('/auth/reset-password', { email });
      setStatus('success');
      setMessage(res.data.message || 'Reset link sent! Check your email.');
      startCountdown();
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  const canResend = countdown === 0;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>

        {/* Countdown Banner */}
        {countdown !== null && countdown > 0 && (
          <div className="countdown-banner">
            <span className="countdown-icon">⏱</span>
            <span>Reset link expires in </span>
            <span className="countdown-time">{formatTime(countdown)}</span>
          </div>
        )}
        {countdown === 0 && (
          <div className="countdown-banner expired">
            <span>⚠ Link expired — you can request a new one</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              autoComplete="email"
              disabled={status === 'loading' || (countdown !== null && countdown > 0)}
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
              ? 'Resend Reset Link'
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;