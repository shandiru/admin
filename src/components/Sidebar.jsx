import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const adminLinks = [
  { path: '/dashboard/admin', label: 'Overview', icon: '◈' },
  { path: '/dashboard/admin/users', label: 'Users', icon: '◉' },
  { path: '/dashboard/admin/invite', label: 'Invite User', icon: '⊕' },
  { path: '/dashboard/admin/settings', label: 'Settings', icon: '◎' },
];

const customerLinks = [
  { path: '/dashboard/customer', label: 'Home', icon: '◈' },
  { path: '/dashboard/customer/profile', label: 'Profile', icon: '◉' },
  { path: '/dashboard/customer/orders', label: 'Orders', icon: '◎' },
];

const Sidebar = () => {
  const { name, role, handleLogout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
 
  const links = role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? '64px' : '220px',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Brand */}
      <div className="sidebar-brand">
        {!collapsed && <span className="brand-text">NEXUS</span>}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">{name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-role">{role?.toUpperCase()}</div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            title={collapsed ? link.label : ''}
          >
            <span className="nav-icon">{link.icon}</span>
            {!collapsed && <span className="nav-label">{link.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout} title="Logout">
        <span className="nav-icon">⊗</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;