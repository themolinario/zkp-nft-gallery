import React, { useState, useEffect } from 'react';
import ControlPanel from '../components/ControlPanel';
import { realisticZKPService } from '../services/zkpService';
import { useNFT } from '../contexts/NFTContext';
import { UserReputation } from '../types/zkp';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [userReputation, setUserReputation] = useState<UserReputation | null>(null);

  // Usa il Context per accedere agli NFT e alle statistiche
  const { assets, unlockedCount, totalCount, getUnlockedAssets, getLockedAssets } = useNFT();

  // Raggruppa gli NFT per collezione
  const collections = React.useMemo(() => {
    const grouped: { [key: string]: typeof assets } = {};
    assets.forEach(asset => {
      if (!grouped[asset.collection]) {
        grouped[asset.collection] = [];
      }
      grouped[asset.collection].push(asset);
    });
    return grouped;
  }, [assets]);

  useEffect(() => {
    // Aggiorna reputation quando cambiano gli NFT sbloccati
    const reputation = realisticZKPService.getUserReputation();
    setUserReputation(reputation);
  }, [unlockedCount]);

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'diamond': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      default: return '🥉';
    }
  };

  const getVerificationColor = (level: string) => {
    switch (level) {
      case 'diamond': return '#B9F2FF';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 ZKP Dashboard</h1>
        <p>Manage your cryptographic identity and monitor your NFTs</p>
      </div>

      <div className="dashboard-content">
        <div className="main-panel">
          <ControlPanel unlockedCount={unlockedCount} totalCount={totalCount} />
        </div>

        <div className="side-panels">
          {/* User Profile */}
          <div className="profile-card">
            <h3>🧑‍💼 User Profile</h3>
            {userReputation ? (
              <div className="profile-content">
                <div className="verification-badge">
                  <span className="badge-icon">
                    {getVerificationIcon(userReputation.verificationLevel)}
                  </span>
                  <span
                    className="badge-text"
                    style={{ color: getVerificationColor(userReputation.verificationLevel) }}
                  >
                    {userReputation.verificationLevel.toUpperCase()}
                  </span>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="stat-number">{userReputation.totalNFTsOwned}</span>
                    <span className="stat-label">Verified NFTs</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-number">{userReputation.rareNFTsOwned}</span>
                    <span className="stat-label">Rare NFTs</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-number">{userReputation.achievements.length}</span>
                    <span className="stat-label">Achievements</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-profile">
                <p>🔗 Connect wallet to see profile</p>
              </div>
            )}
          </div>

          {/* Collections - Ora mostra i dati reali */}
          <div className="collections-card">
            <h3>📚 Your Collections</h3>
            <div className="collections-list">
              {Object.entries(collections).map(([collectionName, nfts]) => {
                const unlockedInCollection = nfts.filter(nft => nft.isUnlocked).length;
                const progressPercent = Math.round((unlockedInCollection / nfts.length) * 100);

                return (
                  <div key={collectionName} className="collection-item">
                    <div className="collection-info">
                      <span className="collection-name">{collectionName}</span>
                      <span className="collection-count">{unlockedInCollection}/{nfts.length} NFTs</span>
                    </div>
                    <div className="collection-progress">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${progressPercent}%`,
                          background: progressPercent > 0 ? '#4CAF50' : '#333'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity - Mostra gli NFT sbloccati reali */}
          <div className="activity-card">
            <h3>📈 Recent Activity</h3>
            <div className="activity-list">
              {getUnlockedAssets().slice(-3).map((asset) => (
                <div key={asset.id} className="activity-item">
                  <span className="activity-icon">🎨</span>
                  <div className="activity-content">
                    <p><strong>NFT Unlocked</strong></p>
                    <p>{asset.title} - {asset.artist}</p>
                    <span className="activity-time">
                      {asset.id === '4' ? 'Pre-unlocked for demo' : 'Recently unlocked'}
                    </span>
                  </div>
                </div>
              ))}

              {getUnlockedAssets().length === 0 && (
                <div className="activity-item placeholder">
                  <span className="activity-icon">🔒</span>
                  <div className="activity-content">
                    <p>Unlock your first NFT to see activity</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Benefits */}
          <div className="benefits-card">
            <h3>🎁 Upcoming Benefits</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🥈</span>
                <div className="benefit-content">
                  <p><strong>Silver Status</strong></p>
                  <p>Unlock 3 NFTs to access exclusive content</p>
                  <div className="benefit-progress">
                    <span>{unlockedCount}/3 NFTs</span>
                  </div>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">🥇</span>
                <div className="benefit-content">
                  <p><strong>Gold Status</strong></p>
                  <p>Own 5 NFTs + 2 rare for premium benefits</p>
                  <div className="benefit-progress">
                    <span>{unlockedCount}/5 NFTs, {getUnlockedAssets().filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}/2 Rare</span>
                  </div>
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
