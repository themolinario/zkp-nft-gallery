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
  description: string;
  imageUrl: string;
  isUnlocked: boolean;
  zkpProof?: string | null;
  // Proprietà per il posizionamento 3D
  position?: [number, number, number];
  // Proprietà per il sistema di rarità
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  // Proprietà per blockchain/smart contracts
  contractAddress: string;
  tokenId: string;
  // Proprietà per collezioni
  collection?: string;
  // Contenuto esclusivo
  exclusiveContent?: {
    type: 'video' | 'audio' | 'document' | 'image' | 'experience';
    url: string;
    description: string;
  };
}

export interface ZKPProof {
  proof: string;
  publicSignals: string[];
}

export interface WalletCredentials {
  address: string;
  privateKey: string;
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
