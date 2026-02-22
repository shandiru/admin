import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token and email from URL: /setup-password?token=xxx&email=yyy
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid or missing invite link. Please request a new invite.');
    }
  }, [token, email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await axiosInstance.post('/auth/verify-setup', {
        token,
        email,
        password: form.password,
      });
      setStatus('success');
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Setup failed. Link may have expired.');
    }
  };

  const passwordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h1 className="auth-title">Setup Password</h1>
          <p className="auth-subtitle">Create your account password</p>
        </div>

        {/* Email (disabled — prefilled from URL) */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email || ''}
            disabled
            className="input-disabled"
            placeholder="Email from invite"
          />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
                disabled={status === 'success' || (!token || !email)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? '○' : '●'}
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <div className="strength-bar">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="strength-segment"
                    style={{
                      backgroundColor: i <= strength ? strengthColors[strength] : '#374151',
                    }}
                  />
                ))}
                <span className="strength-label" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={status === 'success' || (!token || !email)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '○' : '●'}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span className="field-error">Passwords don't match</span>
            )}
          </div>

          {message && (
            <div className={`form-message ${status}`}>{message}</div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading' || status === 'success' || !token || !email}
          >
            {status === 'loading' ? 'Setting up...' : status === 'success' ? 'Done! Redirecting...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPasswordPage;