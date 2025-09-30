import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NFTAsset } from '../types/zkp';

interface NFTContextType {
  assets: NFTAsset[];
  updateAsset: (assetId: string, updates: Partial<NFTAsset>) => void;
  unlockAsset: (assetId: string) => void;
  getAssetById: (assetId: string) => NFTAsset | undefined;
  resetAssets: () => void;
  getUnlockedAssets: () => NFTAsset[];
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
};

interface NFTProviderProps {
  children: ReactNode;
}

export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<NFTAsset[]>([
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

  const updateAsset = (assetId: string, updates: Partial<NFTAsset>) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === assetId
          ? { ...asset, ...updates }
          : asset
      )
    );
  };

  const unlockAsset = (assetId: string) => {
    updateAsset(assetId, { isUnlocked: true });
  };

  const getAssetById = (assetId: string): NFTAsset | undefined => {
    return assets.find(asset => asset.id === assetId);
  };

  const resetAssets = () => {
    setAssets(prev =>
      prev.map(asset => ({ ...asset, isUnlocked: false }))
    );
  };

  const getUnlockedAssets = (): NFTAsset[] => {
    return assets.filter(asset => asset.isUnlocked);
  };

  return (
    <NFTContext.Provider value={{
      assets,
      updateAsset,
      unlockAsset,
      getAssetById,
      resetAssets,
      getUnlockedAssets
    }}>
      {children}
    </NFTContext.Provider>
  );
};
