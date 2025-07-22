import React, { useState, useEffect } from 'react';
import { realisticZKPService } from '../services/zkpService';
import { useNFT } from '../contexts/NFTContext';
import { UserReputation } from '../types/zkp';
import './ControlPanel.css';

interface ControlPanelProps {
  unlockedCount: number;
  totalCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ unlockedCount, totalCount }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [userReputation, setUserReputation] = useState<UserReputation | null>(null);

  // Usa il Context per accedere alle funzioni di reset
  const { resetAssets, getUnlockedAssets } = useNFT();

  useEffect(() => {
    // Update reputation when unlocked NFT count changes
    const reputation = realisticZKPService.getUserReputation();
    setUserReputation(reputation);
  }, [unlockedCount]);

  const connectWallet = async () => {
    setIsConnecting(true);

    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockWallet = `0x${Math.random().toString(16).substr(2, 40)}`;
    setWalletAddress(mockWallet);
    setIsConnecting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getVerificationLevelColor = (level: string) => {
    switch (level) {
      case 'diamond': return '#B9F2FF';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  const resetData = async () => {
    await realisticZKPService.resetUserData();
    resetAssets(); // Reset anche gli NFT nel Context
    setUserReputation(null);
    setWalletAddress('');
  };

  return (
    <div className="control-panel">
      <h2>Realistic ZKP Dashboard</h2>

      <div className="stats-section">
        <h3>Gallery Statistics</h3>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{unlockedCount}</span>
            <span className="stat-label">Unlocked NFTs</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total NFTs</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>

      {/* Sezione NFT Sbloccati */}
      {getUnlockedAssets().length > 0 && (
        <div className="unlocked-nfts-section">
          <h3>🎨 Your Unlocked NFTs</h3>
          <div className="unlocked-nfts-list">
            {getUnlockedAssets().map(asset => (
              <div key={asset.id} className="unlocked-nft-item">
                <span className="nft-title">{asset.title}</span>
                <span
                  className="nft-rarity"
                  style={{
                    color: asset.rarity === 'legendary' ? '#FFD700' :
                           asset.rarity === 'epic' ? '#9C27B0' :
                           asset.rarity === 'rare' ? '#2196F3' : '#4CAF50'
                  }}
                >
                  {asset.rarity.toUpperCase()}
                </span>
                {asset.exclusiveContent && (
                  <span className="exclusive-indicator">🎁 Exclusive</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="keys-section">
        <h3>Wallet Connection</h3>

        {!walletAddress ? (
          <div className="no-keys">
            <p>Connect your wallet to verify NFT ownership</p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="generate-btn"
            >
              {isConnecting ? 'Connecting...' : '🔗 Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="keys-display">
            <div className="key-item">
              <label>Wallet Address:</label>
              <div className="key-value">
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                <button onClick={() => copyToClipboard(walletAddress)}>📋</button>
              </div>
            </div>

            <button onClick={connectWallet} className="regenerate-btn">
              🔄 Change Wallet
            </button>
          </div>
        )}
      </div>

      {userReputation && (
        <div className="reputation-section">
          <h3>ZKP Reputation</h3>
          <div className="reputation-display">
            <div className="verification-level">
              <span className="level-badge" style={{
                background: getVerificationLevelColor(userReputation.verificationLevel),
                color: '#000'
              }}>
                {userReputation.verificationLevel.toUpperCase()}
              </span>
            </div>

            <div className="reputation-stats">
              <div className="rep-stat">
                <span className="rep-value">{userReputation.totalNFTsOwned}</span>
                <span className="rep-label">Owned NFTs</span>
              </div>
              <div className="rep-stat">
                <span className="rep-value">{userReputation.rareNFTsOwned}</span>
                <span className="rep-label">Rare NFTs</span>
              </div>
            </div>

            {userReputation.achievements.length > 0 && (
              <div className="achievements">
                <h4>🏆 Unlocked Achievements</h4>
                {userReputation.achievements.map(achievement => (
                  <div key={achievement.id} className="achievement">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-info">
                      <strong>{achievement.name}</strong>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>Realistic ZKP System</h3>
        <ul>
          <li>🔗 Connect wallet for ownership verification</li>
          <li>🎨 Prove NFT ownership without revealing wallet address</li>
          <li>🏆 Earn verified reputation and achievements</li>
          <li>🎁 Unlock exclusive content based on ZKP</li>
          <li>💎 Reach higher verification levels</li>
        </ul>

        <div className="demo-keys">
          <h4>Demo Wallet for Testing:</h4>
          <p><strong>Use any wallet address + key:</strong></p>
          <p>The system simulates ZKP ownership verification</p>
          <p><strong>Each verification increases your reputation!</strong></p>
        </div>

        <button onClick={resetData} className="reset-btn" style={{
          background: '#f44336',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '20px',
          marginTop: '15px',
          cursor: 'pointer'
        }}>
          🔄 Reset Data
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
