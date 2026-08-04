import React from 'react';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import './AppHeader.css';

interface AppHeaderProps {
  children?: React.ReactNode;
}

const NAV_ITEMS = [
  { to: '/explore', label: 'Explore', icon: '🗺️' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/challenges', label: 'Challenges', icon: '🏆' },
] as const;

const AppHeader: React.FC<AppHeaderProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const matchRoute = useMatchRoute();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <Link to="/" className="app-header-logo-link">
          <div className="app-header-logo-container">
            <div className="app-header-logo-mark">B</div>
            <div className="app-header-logo-text">
              <span className="app-header-city">CITY OF BOSTON</span>
              <span className="app-header-title">CIRCULAR ECONOMY TOOL</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="app-header-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: true });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`app-header-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="app-header-nav-icon">{item.icon}</span>
              <span className="app-header-nav-label">{item.label}</span>
            </Link>
          );
        })}
        {children}
      </nav>

      {/* ── Right: Auth + Badge ── */}
      <div className="app-header-right">
        {user ? (
          <div className="app-header-auth">
            <Link to="/dashboard" className="app-header-avatar-link">
              <div
                className="app-header-avatar"
                style={{ backgroundColor: user.avatarColor || 'var(--color-primary)' }}
              >
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            </Link>
            <span className="app-header-username">{user.displayName}</span>
            <button className="app-header-signout" onClick={signOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="app-header-signin">
            Sign In
          </Link>
        )}
        <span className="app-header-prototype-badge">PROTOTYPE</span>
      </div>
    </header>
  );
};

export default AppHeader;
