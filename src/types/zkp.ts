// Types for Zero-Knowledge Proofs
export interface ZKProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
}

export interface NFTAsset {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  description: string;
  position: [number, number, number];
  isUnlocked: boolean;
  // Realistic blockchain metadata
  contractAddress: string;
  tokenId: string;
  collection: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: NFTAttribute[];
  ownershipHash: string; // Hash derived from wallet + tokenId + secret
  exclusiveContent?: {
    type: 'video' | 'audio' | 'document' | '3d-model';
    url: string;
    description: string;
  };
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  rarity_score?: number;
}

// Input for ZKP ownership circuit
export interface OwnershipCircuitInputs {
  [key: string]: string | number | bigint;
  // Private inputs (not revealed)
  walletAddress: string;
  privateKey: string;
  nonce: string;
  // Public inputs (verifiable)
  contractAddress: string;
  tokenId: string;
  expectedHash: string;
}

// Collection proof (for premium feature access)
export interface CollectionProof {
  collectionName: string;
  minimumNFTs: number;
  ownedCount: number;
  proof: ZKProof;
  benefits: string[];
}

// ZKP-based reputation system
export interface UserReputation {
  totalNFTsOwned: number;
  collectionsCompleted: string[];
  rareNFTsOwned: number;
  verificationLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  zkpRequired: boolean;
}

// Interface compatible with SnarkJS CircuitSignals
export interface CircuitInputs {
  [key: string]: string | number | bigint;
  privateKey: string;
  publicKey: string;
}
