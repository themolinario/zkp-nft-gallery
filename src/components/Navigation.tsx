import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnection from './WalletConnection';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { wallet } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🎨</span>
            <span className="brand-text">ZKP Gallery</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          >
            Gallery
          </Link>
          <Link
            to="/collections"
            className={`nav-link ${isActive('/collections') ? 'active' : ''}`}
          >
            Collections
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </div>

        <div className="nav-wallet">
          <div className="wallet-status">
            {wallet.isConnected && (
              <span className="connection-indicator">
                🟢 Connected
              </span>
            )}
          </div>
          <WalletConnection variant="minimal" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
