import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnection from '../components/WalletConnection';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { wallet } = useWallet();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to ZKP NFT Gallery
          </h1>
          <p className="hero-subtitle">
            Explore exclusive digital art collections with Zero-Knowledge Proof authentication
          </p>

          <div className="hero-actions">
            <Link to="/gallery" className="cta-button primary">
              Explore Gallery
            </Link>
            <Link to="/collections" className="cta-button secondary">
              View Collections
            </Link>
          </div>

          <div className="wallet-prompt">
            {wallet.isConnected ? (
              <div className="connected-status">
                <span className="status-icon">✅</span>
                <p>Wallet connected! You have full access to all galleries.</p>
                <p className="wallet-info">Connected as: {wallet.walletAddress?.slice(0, 8)}...</p>
              </div>
            ) : (
              <div className="connect-prompt">
                <span className="status-icon">🔒</span>
                <p>Connect your wallet to unlock exclusive NFT collections</p>
                <WalletConnection />
              </div>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-nft">
            <div className="nft-card">
              <div className="nft-image">🎨</div>
              <div className="nft-title">Exclusive Art</div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Zero-Knowledge Proofs</h3>
              <p>Secure authentication without revealing sensitive information</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Global Wallet Connection</h3>
              <p>Connect once and access all galleries across the platform</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Exclusive Collections</h3>
              <p>Discover rare digital art pieces available only to verified owners</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Access</h3>
              <p>Instant verification and seamless browsing experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Exclusive NFTs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3D</div>
              <div className="stat-label">Gallery Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Secure Access</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
