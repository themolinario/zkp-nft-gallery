import React, { useState, useEffect } from 'react';
import { productionZKPService } from '../services/zkpService';
import { NFTAsset, CollectionProof } from '../types/zkp';
import './CollectionsPage.css';

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<{ [key: string]: NFTAsset[] }>({});
  const [collectionProofs, setCollectionProofs] = useState<CollectionProof[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  useEffect(() => {
    // Simula collezioni disponibili
    const mockCollections = {
      'Van Gogh Collection': [
        { name: 'Starry Night', rarity: 'legendary', owned: false },
        { name: 'Sunflowers', rarity: 'epic', owned: false },
        { name: 'The Potato Eaters', rarity: 'rare', owned: false }
      ],
      'Modern Masters': [
        { name: 'The Scream', rarity: 'epic', owned: false },
        { name: 'Guernica', rarity: 'epic', owned: false },
        { name: 'The Persistence of Memory', rarity: 'rare', owned: true }
      ],
      'Renaissance Masters': [
        { name: 'Mona Lisa', rarity: 'legendary', owned: false },
        { name: 'The Last Supper', rarity: 'legendary', owned: false },
        { name: 'David', rarity: 'epic', owned: false }
      ],
      'Japanese Masters': [
        { name: 'The Great Wave', rarity: 'rare', owned: false },
        { name: 'Mount Fuji', rarity: 'rare', owned: false },
        { name: 'Cherry Blossoms', rarity: 'common', owned: false }
      ]
    };

    setCollections(mockCollections as any);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9C27B0';
      case 'rare': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  const getCollectionProgress = (collectionItems: any[]) => {
    const owned = collectionItems.filter(item => item.owned).length;
    return Math.round((owned / collectionItems.length) * 100);
  };

  const getCollectionBenefits = (collectionName: string, progress: number) => {
    const benefits = [];
    if (progress >= 33) benefits.push('🎨 Accesso galleria esclusiva');
    if (progress >= 66) benefits.push('💰 Sconti su future release');
    if (progress >= 100) benefits.push('👑 Status VIP collezione');
    return benefits;
  };

  const proveCollectionOwnership = async (collectionName: string) => {
    // Simula prova di ownership per collezione
    const mockWallet = '0x1234567890123456789012345678901234567890';
    const ownedNFTs: NFTAsset[] = []; // In produzione, questi verrebbero dalla blockchain

    try {
      const proof = await productionZKPService.proveCollectionOwnership(
        mockWallet,
        collectionName,
        ownedNFTs
      );

      if (proof) {
        setCollectionProofs(prev => [...prev, proof]);
        alert(`Collection proof generated for ${collectionName}!`);
      }
    } catch (error) {
      alert('Error generating collection proof');
    }
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <h1>📚 NFT Collections</h1>
        <p>Explore and complete collections to unlock exclusive benefits</p>
      </div>

      <div className="collections-content">
        <div className="collections-grid">
          {Object.entries(collections).map(([collectionName, items]) => {
            const progress = getCollectionProgress(items);
            const benefits = getCollectionBenefits(collectionName, progress);

            return (
              <div key={collectionName} className="collection-card">
                <div className="collection-header">
                  <h3>{collectionName}</h3>
                  <div className="collection-stats">
                    <span className="items-count">{items.length} NFTs</span>
                    <span className="progress-percent">{progress}% complete</span>
                  </div>
                </div>

                <div className="collection-progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? '#4CAF50' : '#64ffda'
                    }}
                  ></div>
                </div>

                <div className="collection-items">
                  {items.map((item: any, index: number) => (
                    <div key={index} className={`collection-item ${item.owned ? 'owned' : 'not-owned'}`}>
                      <span className="item-name">{item.name}</span>
                      <span
                        className="item-rarity"
                        style={{ color: getRarityColor(item.rarity) }}
                      >
                        {item.rarity}
                      </span>
                      <span className="item-status">
                        {item.owned ? '✅' : '🔒'}
                      </span>
                    </div>
                  ))}
                </div>

                {benefits.length > 0 && (
                  <div className="collection-benefits">
                    <h4>🎁 Unlocked Benefits:</h4>
                    <ul>
                      {benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="collection-actions">
                  <button
                    className="prove-ownership-btn"
                    onClick={() => proveCollectionOwnership(collectionName)}
                    disabled={progress === 0}
                  >
                    🔐 Prove ZKP Ownership
                  </button>
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedCollection(collectionName)}
                  >
                    👁️ Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generated Collection Proofs */}
        {collectionProofs.length > 0 && (
          <div className="collection-proofs">
            <h2>🔐 Generated Collection Proofs</h2>
            <div className="proofs-list">
              {collectionProofs.map((proof, index) => (
                <div key={index} className="proof-card">
                  <h4>{proof.collectionName}</h4>
                  <p><strong>Owned NFTs:</strong> {proof.ownedCount}</p>
                  <p><strong>Benefits:</strong></p>
                  <ul>
                    {proof.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                  <div className="proof-status">
                    ✅ ZKP Proof Verified
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
