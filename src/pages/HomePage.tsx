import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🎨 ZKP NFT Gallery
          </h1>
          <p className="hero-subtitle">
            Virtual 3D museum where every artwork is protected by Zero-Knowledge Proofs
          </p>
          <p className="hero-description">
            Explore an exclusive collection of famous NFTs, prove your ownership without revealing
            sensitive information and unlock exclusive content through the power of ZKP cryptography.
          </p>

          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              🎪 Explore 3D Carousel
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              📊 ZKP Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Privacy-First</h3>
            <p>Prove ownership without revealing wallet address or private keys</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Reputation System</h3>
            <p>Earn cryptographically verified credibility</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Exclusive Content</h3>
            <p>Unlock videos, audio and documents reserved for owners</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Premium Collections</h3>
            <p>Access exclusive benefits for verified collectors</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Powered by Zero-Knowledge Technology</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">6</span>
            <span className="stat-label">NFT Masterpieces</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Privacy Protected</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Verification Levels</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Possibilities</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
