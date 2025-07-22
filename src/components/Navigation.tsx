import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎨</span>
          <span className="logo-text">ZKP Gallery</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link
            to="/gallery"
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            🎪 Gallery
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/collections"
            className={`nav-link ${isActive('/collections') ? 'active' : ''}`}
          >
            📚 Collections
          </Link>
        </div>

        <div className="nav-actions">
          <button className="connect-wallet-btn">
            🔗 Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
