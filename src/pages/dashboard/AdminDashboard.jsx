import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { role,name ,isAuthenticated,accessToken,} = useAuth();
   

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
            <p className="dashboard-greeting">Welcome back, {name} {role} {accessToken} {isAuthenticated ? '✓' : '✗'} ◈</p>
          </div>
          <div className="header-badge admin-badge">ADMIN</div>
        </header>

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