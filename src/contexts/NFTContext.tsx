import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NFTAsset } from '../types/zkp';

interface NFTContextType {
  assets: NFTAsset[];
  unlockedCount: number;
  totalCount: number;
  unlockAsset: (assetId: string) => void;
  resetAssets: () => void;
  getAssetById: (id: string) => NFTAsset | undefined;
  getUnlockedAssets: () => NFTAsset[];
  getLockedAssets: () => NFTAsset[];
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

// Initial NFT data with realistic blockchain metadata
const initialAssets: NFTAsset[] = [
  {
    id: '1',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    imageUrl: '/images/nfts/starry-night.jpg',
    description: 'An impressionist starry night',
    position: [-4, 0, 0],
    isUnlocked: false,
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    tokenId: '12345',
    collection: 'Van Gogh Collection',
    rarity: 'legendary',
    ownershipHash: 'hash123',
    attributes: [
      { trait_type: 'Style', value: 'Post-Impressionism', rarity_score: 95 },
      { trait_type: 'Year', value: 1889, rarity_score: 100 },
      { trait_type: 'Medium', value: 'Oil on canvas', rarity_score: 80 }
    ],
    exclusiveContent: {
      type: 'video',
      url: '/exclusive/starry-night-documentary.mp4',
      description: 'Exclusive documentary on the creation of the painting'
    }
  },
  {
    id: '2',
    title: 'The Scream',
    artist: 'Edvard Munch',
    imageUrl: '/images/nfts/the-scream.jpg',
    description: 'Expression of existential anguish',
    position: [0, 0, 0],
    isUnlocked: false,
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    tokenId: '54321',
    collection: 'Modern Masters',
    rarity: 'epic',
    ownershipHash: 'hash456',
    attributes: [
      { trait_type: 'Style', value: 'Expressionism', rarity_score: 90 },
      { trait_type: 'Year', value: 1893, rarity_score: 95 },
      { trait_type: 'Emotion', value: 'Anxiety', rarity_score: 85 }
    ],
    exclusiveContent: {
      type: 'audio',
      url: '/exclusive/scream-analysis.mp3',
      description: 'In-depth psychological analysis of the artwork'
    }
  },
  {
    id: '3',
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    imageUrl: '/images/nfts/mona-lisa.jpg',
    description: 'The most famous enigmatic smile in the world',
    position: [4, 0, 0],
    isUnlocked: true, // Pre-unlocked for demo
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    tokenId: '98765',
    collection: 'Renaissance Masters',
    rarity: 'legendary',
    ownershipHash: 'hash789',
    attributes: [
      { trait_type: 'Style', value: 'Renaissance', rarity_score: 100 },
      { trait_type: 'Technique', value: 'Sfumato', rarity_score: 100 },
      { trait_type: 'Mystery Level', value: 'Maximum', rarity_score: 100 }
    ],
    exclusiveContent: {
      type: '3d-model',
      url: '/exclusive/mona-lisa-3d.glb',
      description: 'High-resolution interactive 3D model'
    }
  },
  {
    id: '4',
    title: 'Guernica',
    artist: 'Pablo Picasso',
    imageUrl: '/images/nfts/guernica.jpg',
    description: 'Cubist masterpiece against war',
    position: [-4, 0, -6],
    isUnlocked: false,
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    tokenId: '22222',
    collection: 'Modern Masters',
    rarity: 'epic',
    ownershipHash: 'hash_guernica',
    attributes: [
      { trait_type: 'Style', value: 'Cubism', rarity_score: 93 },
      { trait_type: 'Political Impact', value: 'Revolutionary', rarity_score: 100 },
      { trait_type: 'Historical Significance', value: 'Monumental', rarity_score: 98 }
    ],
    exclusiveContent: {
      type: 'document',
      url: '/exclusive/guernica-historical-context.pdf',
      description: 'Historical context and detailed political analysis'
    }
  },
  {
    id: '5',
    title: 'The Great Wave',
    artist: 'Katsushika Hokusai',
    imageUrl: '/images/nfts/great-wave.jpg',
    description: 'The Great Wave off Kanagawa',
    position: [0, 0, -6],
    isUnlocked: false,
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    tokenId: '33333',
    collection: 'Japanese Masters',
    rarity: 'rare',
    ownershipHash: 'hash_wave',
    attributes: [
      { trait_type: 'Style', value: 'Ukiyo-e', rarity_score: 87 },
      { trait_type: 'Cultural Impact', value: 'Iconic', rarity_score: 96 },
      { trait_type: 'Natural Force', value: 'Tsunami', rarity_score: 90 }
    ],
    exclusiveContent: {
      type: 'video',
      url: '/exclusive/japanese-woodblock-technique.mp4',
      description: 'Master class on traditional ukiyo-e technique'
    }
  }
];

interface NFTProviderProps {
  children: ReactNode;
}

export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<NFTAsset[]>(initialAssets);

  const unlockAsset = (assetId: string) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId ? { ...asset, isUnlocked: true } : asset
      )
    );
  };

  const resetAssets = () => {
    setAssets(initialAssets.map(asset => ({ ...asset, isUnlocked: asset.id === '4' })));
  };

  const getAssetById = (id: string): NFTAsset | undefined => {
    return assets.find(asset => asset.id === id);
  };

  const getUnlockedAssets = (): NFTAsset[] => {
    return assets.filter(asset => asset.isUnlocked);
  };

  const getLockedAssets = (): NFTAsset[] => {
    return assets.filter(asset => !asset.isUnlocked);
  };

  const unlockedCount = assets.filter(asset => asset.isUnlocked).length;
  const totalCount = assets.length;

  const value: NFTContextType = {
    assets,
    unlockedCount,
    totalCount,
    unlockAsset,
    resetAssets,
    getAssetById,
    getUnlockedAssets,
    getLockedAssets
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = (): NFTContextType => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
};

export default NFTContext;
