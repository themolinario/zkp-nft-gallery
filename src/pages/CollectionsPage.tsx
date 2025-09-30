import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnection from '../components/WalletConnection';
import './CollectionsPage.css';

interface Collection {
  id: string;
  title: string;
  description: string;
  nftCount: number;
  unlockedCount: number;
  thumbnail: string;
  requiresWallet: boolean;
}

const CollectionsPage: React.FC = () => {
  const { wallet } = useWallet();

  const collections: Collection[] = [
    {
      id: 'classic-masters',
      title: 'Classic Masters',
      description: 'Timeless masterpieces from history\'s greatest artists',
      nftCount: 5,
      unlockedCount: wallet.isConnected ? 2 : 0,
      thumbnail: '🎨',
      requiresWallet: true
    },
    {
      id: 'modern-art',
      title: 'Modern Art',
      description: 'Contemporary digital art pieces',
      nftCount: 8,
      unlockedCount: wallet.isConnected ? 3 : 0,
      thumbnail: '🖼️',
      requiresWallet: true
    },
    {
      id: 'abstract-collection',
      title: 'Abstract Collection',
      description: 'Experimental and abstract digital creations',
      nftCount: 12,
      unlockedCount: wallet.isConnected ? 5 : 0,
      thumbnail: '🌈',
      requiresWallet: true
    },
    {
      id: 'photography',
      title: 'Digital Photography',
      description: 'Stunning digital photography collection',
      nftCount: 15,
      unlockedCount: wallet.isConnected ? 7 : 0,
      thumbnail: '📸',
      requiresWallet: false
    }
  ];

  const totalNFTs = collections.reduce((sum, col) => sum + col.nftCount, 0);
  const totalUnlocked = collections.reduce((sum, col) => sum + col.unlockedCount, 0);

  return (
    <div className="collections-page">
      <div className="collections-header">
        <div className="header-content">
          <h1>NFT Collections</h1>
          <p>Discover curated collections of exclusive digital art</p>

          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{collections.length}</span>
              <span className="stat-label">Collections</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalNFTs}</span>
              <span className="stat-label">Total NFTs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalUnlocked}</span>
              <span className="stat-label">Accessible</span>
            </div>
          </div>
        </div>

        <div className="wallet-status-card">
          {wallet.isConnected ? (
            <div className="connected-wallet">
              <div className="status-indicator connected">
                <span className="status-icon">✅</span>
                <span>Wallet Connected</span>
              </div>
              <p className="wallet-address">
                {wallet.walletAddress?.slice(0, 8)}...{wallet.walletAddress?.slice(-6)}
              </p>
              <p className="access-info">
                Full access to all premium collections
              </p>
            </div>
          ) : (
            <div className="disconnected-wallet">
              <div className="status-indicator disconnected">
                <span className="status-icon">🔒</span>
                <span>Wallet Not Connected</span>
              </div>
              <p className="access-info">
                Connect your wallet to unlock premium collections
              </p>
              <WalletConnection />
            </div>
          )}
        </div>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className={`collection-card ${!wallet.isConnected && collection.requiresWallet ? 'locked' : ''}`}
          >
            <div className="collection-thumbnail">
              <span className="thumbnail-icon">{collection.thumbnail}</span>
              {!wallet.isConnected && collection.requiresWallet && (
                <div className="lock-overlay">
                  <span className="lock-icon">🔒</span>
                </div>
              )}
            </div>

            <div className="collection-info">
              <h3 className="collection-title">{collection.title}</h3>
              <p className="collection-description">{collection.description}</p>

              <div className="collection-stats">
                <div className="nft-count">
                  <span className="count-number">{collection.unlockedCount}</span>
                  <span className="count-separator">/</span>
                  <span className="count-total">{collection.nftCount}</span>
                  <span className="count-label">NFTs</span>
                </div>

                <div className="access-badge">
                  {wallet.isConnected || !collection.requiresWallet ? (
                    <span className="badge accessible">Accessible</span>
                  ) : (
                    <span className="badge locked">Requires Wallet</span>
                  )}
                </div>
              </div>

              <div className="collection-actions">
                {wallet.isConnected || !collection.requiresWallet ? (
                  <Link
                    to="/gallery"
                    className="explore-button"
                  >
                    Explore Collection
                  </Link>
                ) : (
                  <button
                    className="locked-button"
                    onClick={() => alert('Please connect your wallet to access this premium collection')}
                  >
                    🔒 Connect Wallet to Access
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="collections-info">
        <div className="info-section">
          <h2>About Collections</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🎨 Curated Content</h3>
              <p>
                Each collection is carefully curated to provide the best digital art experience.
                Our collections span various styles, periods, and artistic movements.
              </p>
            </div>

            <div className="info-card">
              <h3>🔐 Wallet-Gated Access</h3>
              <p>
                Premium collections require wallet authentication. Once connected,
                your access is maintained across all pages and sessions.
              </p>
            </div>

            <div className="info-card">
              <h3>⚡ Real-time Updates</h3>
              <p>
                Your access status updates instantly when you connect or disconnect your wallet.
                No page refresh needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
