import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setError, clearError } from '../store/slices/authSlice';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If already logged in, redirect away from login page
  const { accessToken, user } = useSelector((state) => state.auth);
  if (accessToken && user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'} replace />;
  }

  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    dispatch(clearError());

    try {
      const res = await axiosInstance.post('/auth/login', form);
      const { accessToken, user } = res.data;

      dispatch(loginSuccess({ accessToken, user }));

      // Role-based redirect after login
      if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard/customer', { replace: true });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setStatus('error');
      setMessage(errMsg);
      dispatch(setError(errMsg));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>
              Password
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </label>
            <div className="input-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                name="password" required
                value={form.password} onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? '○' : '●'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`form-message ${status}`}>{message}</div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Need an account? <Link to="/register">Request Invite</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;