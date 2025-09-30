import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import Carousel3D from '../components/Carousel3D';
import WalletConnection from '../components/WalletConnection';
import { NFTAsset } from '../types/zkp';
import './GalleryPage.css';

const GalleryPage: React.FC = () => {
  const { wallet } = useWallet();

  // Mock NFT data
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([
    {
      id: 'mona-lisa',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      description: 'The world\'s most famous painting, now in digital form.',
      imageUrl: '/images/nfts/mona-lisa.jpg',
      isUnlocked: false,
      rarity: 'legendary',
      contractAddress: '0x1234567890123456789012345678901234567890',
      tokenId: '1',
      collection: 'classic-masters'
    },
    {
      id: 'starry-night',
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      description: 'A masterpiece of post-impressionist art.',
      imageUrl: '/images/nfts/starry-night.jpg',
      isUnlocked: false,
      rarity: 'epic',
      contractAddress: '0x1234567890123456789012345678901234567890',
      tokenId: '2',
      collection: 'classic-masters'
    },
    {
      id: 'great-wave',
      title: 'The Great Wave',
      artist: 'Katsushika Hokusai',
      description: 'Iconic Japanese woodblock print.',
      imageUrl: '/images/nfts/great-wave.jpg',
      isUnlocked: false,
      rarity: 'rare',
      contractAddress: '0x1234567890123456789012345678901234567890',
      tokenId: '3',
      collection: 'classic-masters'
    },
    {
      id: 'guernica',
      title: 'Guernica',
      artist: 'Pablo Picasso',
      description: 'Powerful anti-war painting in cubist style.',
      imageUrl: '/images/nfts/guernica.jpg',
      isUnlocked: false,
      rarity: 'epic',
      contractAddress: '0x1234567890123456789012345678901234567890',
      tokenId: '4',
      collection: 'modern-art'
    },
    {
      id: 'the-scream',
      title: 'The Scream',
      artist: 'Edvard Munch',
      description: 'Expressionist masterpiece of existential angst.',
      imageUrl: '/images/nfts/the-scream.jpg',
      isUnlocked: false,
      rarity: 'legendary',
      contractAddress: '0x1234567890123456789012345678901234567890',
      tokenId: '5',
      collection: 'modern-art',
      exclusiveContent: {
        type: 'experience',
        url: '/exclusive/scream-vr',
        description: 'Immersive VR experience of The Scream painting'
      }
    }
  ]);

  const handleAssetUnlock = (assetId: string) => {
    setNftAssets(prev =>
      prev.map(asset =>
        asset.id === assetId
          ? { ...asset, isUnlocked: true }
          : asset
      )
    );
  };

  const unlockedCount = nftAssets.filter(asset => asset.isUnlocked).length;
  const totalCount = nftAssets.length;

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="header-content">
          <h1>3D NFT Gallery</h1>
          <p>Explore exclusive digital art in an immersive 3D environment</p>

          <div className="gallery-stats">
            <div className="stat">
              <span className="stat-number">{unlockedCount}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalCount}</span>
              <span className="stat-label">Total NFTs</span>
            </div>
            <div className="stat">
              <span className="stat-number">{wallet.isConnected ? '✓' : '✗'}</span>
              <span className="stat-label">Wallet Status</span>
            </div>
          </div>
        </div>

        <div className="wallet-section">
          {!wallet.isConnected && (
            <div className="wallet-prompt">
              <h3>🔐 Connect Wallet</h3>
              <p>Connect your wallet to unlock exclusive NFTs in the gallery</p>
              <WalletConnection />
            </div>
          )}

          {wallet.isConnected && (
            <div className="wallet-connected">
              <h3>✅ Wallet Connected</h3>
              <p>Welcome! You can now access all NFTs in the gallery.</p>
              <p className="wallet-address">
                {wallet.walletAddress?.slice(0, 8)}...{wallet.walletAddress?.slice(-6)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="gallery-container">
        <Carousel3D
          assets={nftAssets}
          onAssetUnlock={handleAssetUnlock}
        />
      </div>

      <div className="gallery-info">
        <div className="info-grid">
          <div className="info-card">
            <h3>🎨 How it Works</h3>
            <p>
              Each NFT in the gallery is protected by Zero-Knowledge Proof authentication.
              When you connect your wallet, the system verifies your ownership without
              revealing sensitive information.
            </p>
          </div>

          <div className="info-card">
            <h3>🔄 Navigation</h3>
            <p>
              Use the controls at the bottom to navigate through the gallery.
              Click on any NFT frame to attempt unlocking it with your connected wallet.
            </p>
          </div>

          <div className="info-card">
            <h3>🌐 Global Access</h3>
            <p>
              Your wallet connection works across the entire platform.
              Once connected here, you'll have access to all galleries and collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
