import React, { useState } from 'react';
import Carousel3D from '../components/Carousel3D';
import Gallery3D from '../components/Gallery3D';
import { useNFT } from '../contexts/NFTContext';
import './GalleryPage.css';

const GalleryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'carousel' | 'gallery'>('carousel');

  // Usa il Context invece dello stato locale
  const { assets, unlockAsset, unlockedCount, totalCount } = useNFT();

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>🎨 ZKP NFT Gallery</h1>
        <p>Explore masterpieces protected by Zero-Knowledge Proofs</p>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'carousel' ? 'active' : ''}`}
            onClick={() => setViewMode('carousel')}
          >
            🎪 3D Carousel
          </button>
          <button
            className={`view-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => setViewMode('gallery')}
          >
            🏛️ Traditional Museum
          </button>
        </div>

        <div className="gallery-stats">
          <span className="stat">
            <strong>{unlockedCount}</strong> / {totalCount} unlocked
          </span>
          <span className="stat">
            <strong>{Math.round((unlockedCount / totalCount) * 100)}%</strong> completed
          </span>
        </div>
      </header>

      <div className="gallery-container">
        {viewMode === 'carousel' ? (
          <Carousel3D
            assets={assets}
            onAssetUnlock={unlockAsset}
          />
        ) : (
          <Gallery3D
            assets={assets}
            onAssetUnlock={unlockAsset}
          />
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
