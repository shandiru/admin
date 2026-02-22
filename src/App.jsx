import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshSuccess, logout } from './store/slices/authSlice';
import axios from 'axios';

import RegisterPage from './pages/RegisterPage';
import SetupPasswordPage from './pages/SetupPasswordPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/Forgotpasswordpage';
import ResetPasswordPage from './pages/ResetPasswordPages';
// On app load, try to silently refresh the access token using the httpOnly cookie.
// This handles the case where user refreshes the page (Redux state is wiped, but cookie survives).
const SilentRefresh = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    if (!accessToken) {
      // Try to get a new access token using httpOnly cookie
      axios
        .post(
          `${import.meta.env.VITE_API_URL || 'https://backend-nu-ruddy-13.vercel.app/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          dispatch(refreshSuccess({ accessToken: res.data.accessToken, user: res.data.user }));
        })
        .catch(() => {
          // No valid cookie — user needs to login
          dispatch(logout());
        })
        .finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">N</div>
        <div className="splash-spinner" />
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <SilentRefresh>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup-password" element={<SetupPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Admin-only routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Customer routes */}
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
         
        </Routes>
      </SilentRefresh>
    </BrowserRouter>
  );
};

export default App;