import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useNFT } from '../contexts/NFTContext';
import WalletConnection from '../components/WalletConnection';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { wallet } = useWallet();
  const { getUnlockedAssets, assets } = useNFT();

  const unlockedAssets = getUnlockedAssets();
  const totalAssets = assets.length;
  const unlockedCount = unlockedAssets.length;
  const completionPercentage = totalAssets > 0 ? Math.round((unlockedCount / totalAssets) * 100) : 0;

  const getStatusEmoji = () => {
    return wallet.isConnected ? '🟢' : '🔴';
  };

  const getAccessEmoji = () => {
    return wallet.isConnected ? '👑' : '🔒';
  };

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '🏆';
      case 'epic': return '💎';
      case 'rare': return '⭐';
      default: return '🎨';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ff6b35';
      case 'epic': return '#bb86fc';
      case 'rare': return '#64ffda';
      default: return '#90a4ae';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="animated-title">Dashboard</h1>
          <p className="subtitle">
            ✨ Manage your wallet connection and access exclusive NFT galleries ✨
          </p>
        </header>

        <div className="dashboard-content">
          <div className="wallet-section">
            <div className="section-header" style={{
              marginTop: 64,
            }}>
              <h2>💼 Wallet Connection</h2>
            </div>
            <WalletConnection variant="card" />
          </div>

          <div className="stats-section">
            <div className="section-header">
              <h2>📊 Statistics</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-card floating-card">
                <div className="stat-icon">🔗</div>
                <h3>Connection Status</h3>
                <div className={`status-indicator ${wallet.isConnected ? 'connected' : 'disconnected'}`}>
                  {getStatusEmoji()} {wallet.isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="stat-card floating-card">
                <div className="stat-icon">📱</div>
                <h3>Wallet Address</h3>
                <p className="wallet-address">
                  {wallet.isConnected ? wallet.walletAddress : '🚫 Not connected'}
                </p>
              </div>

              <div className="stat-card floating-card">
                <div className="stat-icon">{getAccessEmoji()}</div>
                <h3>Access Level</h3>
                <p className="access-level">
                  {wallet.isConnected ? '💎 Premium Access' : '🔐 Limited Access'}
                </p>
              </div>

              <div className="stat-card floating-card">
                <div className="stat-icon">🎨</div>
                <h3>NFTs Attempted</h3>
                <p className="attempts-count">
                  🔢 {Object.keys(wallet.connectionAttempts || {}).length} NFTs attempted
                </p>
              </div>
            </div>
          </div>

          <div className="nft-collection-section">
            <div className="section-header">
              <h2>🎨 NFT Collection Progress</h2>
            </div>

            <div className="collection-overview">
              <div className="progress-card">
                <div className="progress-header">
                  <h3>🏆 Collection Progress</h3>
                  <div className="progress-percentage">{completionPercentage}%</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <span>📈 {unlockedCount} of {totalAssets} NFTs unlocked</span>
                </div>
              </div>

              <div className="collection-stats">
                <div className="collection-stat">
                  <div className="stat-value">{unlockedCount}</div>
                  <div className="stat-label">🔓 Unlocked</div>
                </div>
                <div className="collection-stat">
                  <div className="stat-value">{totalAssets - unlockedCount}</div>
                  <div className="stat-label">🔒 Locked</div>
                </div>
                <div className="collection-stat">
                  <div className="stat-value">{totalAssets}</div>
                  <div className="stat-label">🎨 Total</div>
                </div>
              </div>
            </div>

            {unlockedCount > 0 && (
              <div className="unlocked-nfts">
                <h3 className="unlocked-title">🌟 Your Unlocked NFTs</h3>
                <div className="nft-grid">
                  {unlockedAssets.map((nft) => (
                    <div key={nft.id} className="nft-card">
                      <div className="nft-image-container">
                        <img src={nft.imageUrl} alt={nft.title} className="nft-image" />
                        <div className="nft-rarity-badge" style={{ backgroundColor: getRarityColor(nft.rarity) }}>
                          {getRarityEmoji(nft.rarity)} {nft.rarity}
                        </div>
                      </div>
                      <div className="nft-info">
                        <h4 className="nft-title">{nft.title}</h4>
                        <p className="nft-artist">👨‍🎨 {nft.artist}</p>
                        <p className="nft-collection">📚 {nft.collection}</p>
                        {nft.exclusiveContent && (
                          <div className="exclusive-badge">
                            ⭐ Exclusive Content Available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unlockedCount === 0 && wallet.isConnected && (
              <div className="no-nfts-unlocked">
                <div className="empty-state">
                  <div className="empty-icon">🔐</div>
                  <h3>No NFTs Unlocked Yet</h3>
                  <p>Connect to different galleries and verify your ownership to unlock exclusive NFTs!</p>
                </div>
              </div>
            )}
          </div>

          <div className="features-section">
            <div className="section-header">
              <h2>🚀 Platform Features</h2>
            </div>

            <div className="features-grid">
              <div className="feature-card pulse-card">
                <div className="feature-icon">🎨</div>
                <h3>Gallery Access</h3>
                <p>
                  Connect your wallet to unlock exclusive NFT galleries throughout the platform.
                  Your credentials will be saved automatically and used across the entire app.
                </p>
                <div className="feature-badge">🌟 Premium</div>
              </div>

              <div className="feature-card pulse-card">
                <div className="feature-icon">🔐</div>
                <h3>Advanced Security</h3>
                <p>
                  Your wallet connection is managed securely with local storage.
                  Disconnect at any time to clear all credentials and reset your session.
                </p>
                <div className="feature-badge">🛡️ Secure</div>
              </div>

              <div className="feature-card pulse-card">
                <div className="feature-icon">⚡</div>
                <h3>Premium Features</h3>
                <div className="features-list">
                  <div className="feature-item">🌐 Global connection across all pages</div>
                  <div className="feature-item">🎯 Automatic NFT access verification</div>
                  <div className="feature-item">💾 Persistent session management</div>
                  <div className="feature-item">📡 Real-time connection status</div>
                  <div className="feature-item">🏆 NFT collection tracking</div>
                  <div className="feature-item">⭐ Exclusive content access</div>
                </div>
                <div className="feature-badge">🚀 Fast</div>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <div className="section-header">
              <h2>📈 Recent Activity</h2>
            </div>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon">🔄</div>
                <div className="activity-content">
                  <h4>Last Access</h4>
                  <p>{wallet.isConnected ? '🕐 Currently active' : '⏰ Never connected'}</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🎨</div>
                <div className="activity-content">
                  <h4>Galleries Visited</h4>
                  <p>🏛️ {wallet.isConnected ? 'Full access granted' : 'No access'}</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">⭐</div>
                <div className="activity-content">
                  <h4>Account Status</h4>
                  <p>{wallet.isConnected ? '✅ Verified' : '❌ Not verified'}</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🏆</div>
                <div className="activity-content">
                  <h4>Collection Progress</h4>
                  <p>📊 {completionPercentage}% complete ({unlockedCount}/{totalAssets} NFTs)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
