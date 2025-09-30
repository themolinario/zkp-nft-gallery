import React, { useEffect, useState } from 'react';
import { useNFT } from '../contexts/NFTContext';
import { useWallet } from '../contexts/WalletContext';
import { NFTAsset } from '../types/zkp';
import './ControlPanel.css';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className = '' }) => {
  const [reputation, setReputation] = useState(0);
  const [achievementLevel, setAchievementLevel] = useState<'bronze' | 'silver' | 'gold' | 'diamond'>('bronze');

  // Usa il Context per accedere alle funzioni di reset
  const { resetAssets, getUnlockedAssets } = useNFT();
  const { wallet, disconnectWallet } = useWallet();

  useEffect(() => {
    // Update reputation when unlocked NFT count changes
    const unlockedAssets = getUnlockedAssets();
    const newReputation = unlockedAssets.length * 100;
    setReputation(newReputation);

    // Update achievement level based on unlocked NFTs
    if (unlockedAssets.length >= 5) {
      setAchievementLevel('diamond');
    } else if (unlockedAssets.length >= 3) {
      setAchievementLevel('gold');
    } else if (unlockedAssets.length >= 2) {
      setAchievementLevel('silver');
    } else {
      setAchievementLevel('bronze');
    }
  }, [getUnlockedAssets]);

  const handleReset = () => {
    const confirm = window.confirm('Are you sure you want to reset all NFT progress? This will lock all NFTs again.');
    if (confirm) {
      resetAssets();
      setReputation(0);
      setAchievementLevel('bronze');
    }
  };

  const handleDisconnectWallet = () => {
    const confirm = window.confirm('Disconnect wallet? This will also reset your NFT progress.');
    if (confirm) {
      disconnectWallet();
      resetAssets();
      setReputation(0);
      setAchievementLevel('bronze');
    }
  };

  const getAchievementIcon = (level: string) => {
    switch (level) {
      case 'diamond': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🎖️';
    }
  };

  const getAchievementColor = (level: string) => {
    switch (level) {
      case 'diamond': return '#E1F5FE';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#666';
    }
  };

  const unlockedAssets = getUnlockedAssets();

  return (
    <div className={`control-panel ${className}`}>
      <div className="panel-header">
        <h2>🎮 Control Panel</h2>
        <p>Manage your gallery experience</p>
      </div>

      <div className="wallet-status">
        <h3>🔗 Wallet Connection</h3>
        {wallet.isConnected ? (
          <div className="connected-info">
            <div className="status-badge connected">
              ✅ Connected
            </div>
            <p className="wallet-address">
              {wallet.walletAddress?.slice(0, 8)}...{wallet.walletAddress?.slice(-6)}
            </p>
            <button 
              onClick={handleDisconnectWallet}
              className="disconnect-button"
            >
              Disconnect & Reset
            </button>
          </div>
        ) : (
          <div className="disconnected-info">
            <div className="status-badge disconnected">
              🔴 Not Connected
            </div>
            <p>Connect your wallet to access premium features</p>
          </div>
        )}
      </div>

      <div className="reputation-section">
        <h3>🏆 Your Progress</h3>
        <div className="reputation-card">
          <div className="achievement-level">
            <span className="level-icon">
              {getAchievementIcon(achievementLevel)}
            </span>
            <span 
              className="level-text"
              style={{ color: getAchievementColor(achievementLevel) }}
            >
              {achievementLevel.toUpperCase()}
            </span>
          </div>
          <div className="reputation-points">
            <span className="points-number">{reputation}</span>
            <span className="points-label">Points</span>
          </div>
        </div>
      </div>

      <div className="unlocked-section">
        <h3>🎨 Your Unlocked NFTs</h3>
        <div className="unlocked-nfts-list">
          {getUnlockedAssets().map((asset: NFTAsset) => (
            <div key={asset.id} className="unlocked-nft-item">
              <span className="nft-title">{asset.title}</span>
              <span
                className="nft-artist"
                style={{ color: '#bb86fc', fontSize: '0.9rem' }}
              >
                {asset.artist}
              </span>
            </div>
          ))}
          {unlockedAssets.length === 0 && (
            <p className="no-nfts">No NFTs unlocked yet. Start exploring the gallery!</p>
          )}
        </div>
      </div>

      <div className="actions-section">
        <h3>⚡ Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={handleReset}
            className="reset-button"
            disabled={unlockedAssets.length === 0}
          >
            🔄 Reset Progress
          </button>
        </div>
      </div>

      <div className="stats-section">
        <h3>📊 Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{unlockedAssets.length}</span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">5</span>
            <span className="stat-label">Total NFTs</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {unlockedAssets.length > 0 ? Math.round((unlockedAssets.length / 5) * 100) : 0}%
            </span>
            <span className="stat-label">Completion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
