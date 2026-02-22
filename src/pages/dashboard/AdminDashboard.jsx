import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const { role, name, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDirushanAPI = async () => {
    try {
      setLoading(true);
      alert('Refreshing... Please wait ⏳');

      const res = await axiosInstance.get('/auth/protected');

      alert('API Success ✅');
      console.log(res.data);

    } catch (error) {
      alert('API Failed ❌');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Users', value: '—', icon: '◉' },
    { label: 'Active Sessions', value: '—', icon: '◈' },
    { label: 'Pending Invites', value: '—', icon: '⊕' },
    { label: 'System Health', value: '●', icon: '◎' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Panel</h1>
            <p className="dashboard-greeting">
              Welcome back, {name} ({role}) {isAuthenticated ? '✓' : '✗'}
            </p>
          </div>
          <div className="header-badge admin-badge">ADMIN</div>
        </header>

        {/* ✅ New Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleDirushanAPI}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Refreshing...' : 'Call Dirushan API'}
          </button>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="empty-state">
            <span>◈</span>
            <p>Activity feed will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;