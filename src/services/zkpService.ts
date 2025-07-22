import { groth16 } from 'snarkjs';
import { ethers } from 'ethers';
import { sha256 } from '@noble/hashes/sha256';
import { poseidon } from 'circomlib';
import { ZKProof, NFTAsset, UserReputation, CollectionProof, Achievement } from '../types/zkp';

// Helper function for Poseidon hash
const poseidonHash = async (inputs: (string | number | bigint)[]): Promise<string> => {
  try {
    return poseidon(inputs).toString();
  } catch (error) {
    // Fallback using SHA256 if poseidon is not available
    const combinedInput = inputs.join('');
    const hash = sha256(new TextEncoder().encode(combinedInput));
    return BigInt('0x' + Array.from(hash, (byte: number) => byte.toString(16).padStart(2, '0')).join('')).toString();
  }
};

// Cache for ZKP proofs
interface ProofCache {
  [key: string]: {
    proof: ZKProof;
    timestamp: number;
    expires: number;
  };
}

class ProductionZKPService {
  private wasmPath = '/circuits/ownership.wasm';
  private zkeyPath = '/circuits/ownership_final.zkey';
  private vkeyPath = '/circuits/verification_key.json';
  private userReputation: UserReputation | null = null;
  private nullifierSet = new Set<string>();
  private proofCache: ProofCache = {};
  private verificationKeyCache: any = null;

  // Advanced configuration
  private readonly config = {
    maxProofTime: parseInt(process.env.REACT_APP_MAX_PROOF_TIME || '30000'),
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    cacheProofs: process.env.REACT_APP_CACHE_PROOFS !== 'false',
    cacheDuration: parseInt(process.env.REACT_APP_CACHE_DURATION || '3600000'), // 1 hour
    maxNullifiers: parseInt(process.env.REACT_APP_MAX_NULLIFIERS || '10000')
  };

  constructor() {
    // Clean cache periodically
    if (this.config.cacheProofs) {
      setInterval(() => this.cleanExpiredProofs(), 300000); // every 5 minutes
    }
  }

  // Generate real ownership hash using Poseidon (now used)
  async generateOwnershipHash(walletAddress: string, tokenId: string, contractAddress: string): Promise<string> {
    const inputs = [
      this.addressToField(walletAddress),
      this.addressToField(contractAddress),
      BigInt(tokenId),
      BigInt(Math.floor(Date.now() / 1000)) // timestamp
    ];

    return await poseidonHash(inputs);
  }

  // Real implementation of NFT ownership proof using ZKP with caching
  async proveNFTOwnership(
    walletAddress: string,
    privateKey: string,
    nft: NFTAsset
  ): Promise<{ success: boolean; proof?: ZKProof; error?: string }> {
    const startTime = Date.now();

    try {
      // Verify that private key matches wallet address
      const wallet = new ethers.Wallet(privateKey);
      if (wallet.address.toLowerCase() !== walletAddress.toLowerCase()) {
        return { success: false, error: 'Private key does not match wallet address' };
      }

      // Check cache for existing proofs
      const cacheKey = this.generateProofCacheKey(walletAddress, nft);
      if (this.config.cacheProofs && this.proofCache[cacheKey] && this.proofCache[cacheKey].expires > Date.now()) {
        this.log('Using cached proof for NFT ownership');
        return { success: true, proof: this.proofCache[cacheKey].proof };
      }

      // Verify on-chain NFT ownership
      const ownsNFT = await this.verifyOnChainOwnership(walletAddress, nft);
      if (!ownsNFT) {
        return { success: false, error: 'NFT ownership not verified on blockchain' };
      }

      // Generate random nonce to prevent replay attacks
      const nonce = this.generateSecureNonce();

      // Prepare inputs for ZKP circuit
      const circuitInputs = {
        privateKey: this.privateKeyToField(privateKey),
        nonce: this.stringToField(nonce),
        publicAddress: this.addressToField(walletAddress),
        contractAddress: this.addressToField(nft.contractAddress),
        tokenId: BigInt(nft.tokenId),
        timestamp: BigInt(Math.floor(Date.now() / 1000))
      };

      // Generate real ZKP proof with timeout
      const proof = await this.generateRealZKProofWithTimeout(circuitInputs);

      // Verify the proof
      const isValid = await this.verifyOwnershipProof(proof);

      if (isValid) {
        // Check nullifier to prevent double-spending
        const nullifier = proof.publicSignals[1];
        if (this.nullifierSet.has(nullifier)) {
          return { success: false, error: 'Proof already used (nullifier collision)' };
        }

        // Manage nullifier limit
        if (this.nullifierSet.size >= this.config.maxNullifiers) {
          this.nullifierSet.clear(); // Reset if we reach the limit
          this.log('Nullifier set reset due to size limit');
        }

        this.nullifierSet.add(nullifier);

        // Cache the proof if enabled
        if (this.config.cacheProofs) {
          this.proofCache[cacheKey] = {
            proof,
            timestamp: Date.now(),
            expires: Date.now() + this.config.cacheDuration
          };
        }

        // Update user reputation
        await this.updateUserReputation(nft);

        const duration = Date.now() - startTime;
        this.log(`ZKP proof generated successfully in ${duration}ms`);

        return { success: true, proof };
      } else {
        return { success: false, error: 'ZKP verification failed' };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(`Error in ownership proof after ${duration}ms:`, error);
      return { success: false, error: `Technical error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Verify on-chain NFT ownership with retry and fallback
  private async verifyOnChainOwnership(walletAddress: string, nft: NFTAsset): Promise<boolean> {
    const providers = [
      process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_KEY',
      process.env.REACT_APP_POLYGON_RPC_URL,
      process.env.REACT_APP_TESTNET_RPC_URL
    ].filter(Boolean);

    for (const providerUrl of providers) {
      try {
        const provider = new ethers.JsonRpcProvider(providerUrl);

        // Simplified ABI for ERC721
        const erc721ABI = [
          "function ownerOf(uint256 tokenId) view returns (address)"
        ];

        const contract = new ethers.Contract(nft.contractAddress, erc721ABI, provider);
        const owner = await contract.ownerOf(nft.tokenId);

        return owner.toLowerCase() === walletAddress.toLowerCase();
      } catch (error) {
        this.log(`Error with provider ${providerUrl}:`, error);
        // Try the next provider (removing unnecessary continue)
      }
    }

    this.log('All providers failed for on-chain verification');
    return false;
  }

  // Generate real ZKP proof using snarkjs with timeout
  private async generateRealZKProofWithTimeout(inputs: any): Promise<ZKProof> {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`ZKP generation timeout after ${this.config.maxProofTime}ms`));
      }, this.config.maxProofTime);

      try {
        const { proof, publicSignals } = await groth16.fullProve(
          inputs,
          this.wasmPath,
          this.zkeyPath
        );

        clearTimeout(timeout);

        resolve({
          proof: {
            pi_a: proof.pi_a.map((x: any) => x.toString()),
            pi_b: proof.pi_b.map((row: any) => row.map((x: any) => x.toString())),
            pi_c: proof.pi_c.map((x: any) => x.toString()),
            protocol: "groth16",
            curve: "bn128"
          },
          publicSignals: publicSignals.map((x: any) => x.toString())
        });
      } catch (error) {
        clearTimeout(timeout);
        reject(new Error(`ZKP generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  // Real verification of ZKP proof with verification key caching (removed unused parameter)
  private async verifyOwnershipProof(proof: ZKProof): Promise<boolean> {
    try {
      const vKey = await this.loadVerificationKeyWithCache();

      return await groth16.verify(
        vKey,
        proof.publicSignals,
        proof.proof
      );
    } catch (error) {
      this.log('Error verifying ZKP:', error);
      return false;
    }
  }

  // Load real verification key with caching
  private async loadVerificationKeyWithCache(): Promise<any> {
    if (this.verificationKeyCache) {
      return this.verificationKeyCache;
    }

    try {
      const response = await fetch(this.vkeyPath);
      if (!response.ok) {
        throw new Error('Failed to load verification key');
      }

      this.verificationKeyCache = await response.json();
      return this.verificationKeyCache;
    } catch (error) {
      throw new Error(`Failed to load verification key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility for cache management
  private generateProofCacheKey(walletAddress: string, nft: NFTAsset): string {
    return this.sha256Hash(`${walletAddress}_${nft.contractAddress}_${nft.tokenId}`);
  }

  private cleanExpiredProofs(): void {
    const now = Date.now();
    const expiredKeys = Object.keys(this.proofCache).filter(
      key => this.proofCache[key].expires < now
    );

    expiredKeys.forEach(key => delete this.proofCache[key]);

    if (expiredKeys.length > 0) {
      this.log(`Cleaned ${expiredKeys.length} expired proofs from cache`);
    }
  }

  // Logging utility
  private log(message: string, data?: any): void {
    if (this.config.enableDebug) {
      console.log(`[ZKPService] ${message}`, data || '');
    }
  }

  // Collection ownership proof using ZKP aggregation
  async proveCollectionOwnership(
    walletAddress: string,
    collectionName: string,
    ownedNFTs: NFTAsset[]
  ): Promise<CollectionProof | null> {
    const collectionNFTs = ownedNFTs.filter(nft => nft.collection === collectionName);

    if (collectionNFTs.length === 0) return null;

    try {
      // Verify ownership for each NFT in the collection
      for (const nft of collectionNFTs) {
        const ownershipResult = await this.verifyOnChainOwnership(walletAddress, nft);
        if (!ownershipResult) {
          throw new Error(`Ownership verification failed for NFT ${nft.tokenId}`);
        }
      }

      // Calculate benefits based on collection
      const benefits = this.calculateCollectionBenefits(collectionNFTs.length);

      // Generate aggregated proof (simplified for demo)
      const aggregatedProof = await this.generateCollectionAggregatedProof(collectionNFTs, walletAddress);

      return {
        collectionName,
        minimumNFTs: this.getMinimumForCollection(collectionName),
        ownedCount: collectionNFTs.length,
        proof: aggregatedProof,
        benefits
      };
    } catch (error) {
      this.log('Error proving collection ownership:', error);
      return null;
    }
  }

  // Anonymous verification using pure ZKP (now used)
  async verifyAnonymousOwnership(
    proof: ZKProof,
    nftContractAddress: string,
    tokenId: string
  ): Promise<boolean> {
    try {
      const vKey = await this.loadVerificationKeyWithCache();

      // Verify that public signals match the required parameters
      const expectedContractHash = this.addressToField(nftContractAddress).toString();
      const expectedTokenId = BigInt(tokenId).toString();

      const validContract = proof.publicSignals[0] === expectedContractHash;
      const validTokenId = proof.publicSignals[2] === expectedTokenId;

      if (!validContract || !validTokenId) {
        return false;
      }

      // Verify the ZKP proof
      return await groth16.verify(vKey, proof.publicSignals, proof.proof);
    } catch (error) {
      this.log('Error in anonymous verification:', error);
      return false;
    }
  }

  // Utility functions for converting data to field elements
  private addressToField(address: string): bigint {
    // Convert Ethereum address to field element (improved)
    const cleanAddress = address.toLowerCase().replace('0x', '');
    return BigInt('0x' + cleanAddress);
  }

  private privateKeyToField(privateKey: string): bigint {
    // Convert private key to field element
    const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    return BigInt('0x' + cleanKey);
  }

  private stringToField(str: string): bigint {
    // Convert string to field element using hash (fix for unknown type)
    const hash = sha256(new TextEncoder().encode(str));
    return BigInt('0x' + Array.from(hash, (byte: number) => byte.toString(16).padStart(2, '0')).join(''));
  }

  private generateSecureNonce(): string {
    // Generate cryptographically secure nonce
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Real SHA256 hash instead of simulation (fix for unknown type)
  private sha256Hash(data: string): string {
    const hash = sha256(new TextEncoder().encode(data));
    return Array.from(hash, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
  }

  private async generateCollectionAggregatedProof(nfts: NFTAsset[], walletAddress: string): Promise<ZKProof> {
    // Simplified implementation - in production you would use an aggregation circuit
    const firstNFT = nfts[0];
    const inputs = {
      privateKey: this.stringToField('collection_proof'),
      nonce: this.stringToField(Math.random().toString()),
      publicAddress: this.addressToField(walletAddress),
      contractAddress: this.addressToField(firstNFT.contractAddress),
      tokenId: BigInt(nfts.length),
      timestamp: BigInt(Math.floor(Date.now() / 1000))
    };

    return await this.generateRealZKProofWithTimeout(inputs);
  }

  private calculateCollectionBenefits(ownedCount: number): string[] {
    const benefits: string[] = [];

    if (ownedCount >= 1) benefits.push('Access to exclusive collection chat');
    if (ownedCount >= 3) benefits.push('Discounts on future collection NFTs');
    if (ownedCount >= 5) benefits.push('Early access to exclusive drops');
    if (ownedCount >= 10) benefits.push('VIP status and behind-the-scenes content');

    return benefits;
  }

  private getMinimumForCollection(collectionName: string): number {
    const requirements: { [key: string]: number } = {
      'Van Gogh Collection': 3,
      'Modern Masters': 5,
      'Digital Pioneers': 2
    };
    return requirements[collectionName] || 1;
  }

  async updateUserReputation(nft: NFTAsset): Promise<void> {
    if (!this.userReputation) {
      this.userReputation = {
        totalNFTsOwned: 0,
        collectionsCompleted: [],
        rareNFTsOwned: 0,
        verificationLevel: 'bronze',
        achievements: []
      };
    }

    this.userReputation.totalNFTsOwned++;

    if (nft.rarity === 'epic' || nft.rarity === 'legendary') {
      this.userReputation.rareNFTsOwned++;
    }

    await this.checkAndUnlockAchievements(nft);
    this.updateVerificationLevel();
  }

  private async checkAndUnlockAchievements(nft: NFTAsset): Promise<void> {
    if (!this.userReputation) return;

    const achievements: Achievement[] = [
      {
        id: 'first_nft',
        name: 'First Collector',
        description: 'You unlocked your first NFT!',
        icon: '🎨',
        zkpRequired: true
      },
      {
        id: 'rare_collector',
        name: 'Rarity Hunter',
        description: 'Own 3+ rare NFTs',
        icon: '💎',
        zkpRequired: true
      },
      {
        id: 'collection_master',
        name: 'Collection Master',
        description: 'You completed an entire collection',
        icon: '👑',
        zkpRequired: true
      }
    ];

    if (this.userReputation.totalNFTsOwned === 1) {
      this.unlockAchievement(achievements[0]);
    }

    if (this.userReputation.rareNFTsOwned >= 3) {
      this.unlockAchievement(achievements[1]);
    }
  }

  private unlockAchievement(achievement: Achievement): void {
    if (!this.userReputation) return;

    const alreadyUnlocked = this.userReputation.achievements.some(a => a.id === achievement.id);
    if (!alreadyUnlocked) {
      achievement.unlockedAt = new Date();
      this.userReputation.achievements.push(achievement);
    }
  }

  private updateVerificationLevel(): void {
    if (!this.userReputation) return;

    const { totalNFTsOwned, rareNFTsOwned } = this.userReputation;

    if (totalNFTsOwned >= 10 && rareNFTsOwned >= 3) {
      this.userReputation.verificationLevel = 'diamond';
    } else if (totalNFTsOwned >= 5 && rareNFTsOwned >= 2) {
      this.userReputation.verificationLevel = 'gold';
    } else if (totalNFTsOwned >= 3) {
      this.userReputation.verificationLevel = 'silver';
    }
  }

  async unlockExclusiveContent(nft: NFTAsset): Promise<{
    unlocked: boolean;
    content?: any;
    requirements?: string;
  }> {
    if (!nft.exclusiveContent) {
      return { unlocked: false, requirements: 'No exclusive content available' };
    }

    const meetsRequirements = await this.checkExclusiveContentRequirements(nft);

    if (meetsRequirements) {
      return {
        unlocked: true,
        content: {
          type: nft.exclusiveContent.type,
          url: nft.exclusiveContent.url,
          description: nft.exclusiveContent.description,
          accessGrantedAt: new Date().toISOString()
        }
      };
    }

    return {
      unlocked: false,
      requirements: this.getContentRequirements(nft)
    };
  }

  private async checkExclusiveContentRequirements(nft: NFTAsset): Promise<boolean> {
    if (nft.rarity === 'legendary') {
      return this.userReputation?.verificationLevel === 'diamond' || false;
    }
    if (nft.rarity === 'epic') {
      return ['gold', 'diamond'].includes(this.userReputation?.verificationLevel || 'bronze');
    }
    return true;
  }

  private getContentRequirements(nft: NFTAsset): string {
    if (nft.rarity === 'legendary') {
      return 'Requires Diamond status (10+ NFTs, 3+ rare)';
    }
    if (nft.rarity === 'epic') {
      return 'Requires Gold+ status (5+ NFTs, 2+ rare)';
    }
    return 'No special requirements';
  }

  // Advanced public APIs
  getUserReputation(): UserReputation | null {
    return this.userReputation;
  }

  async resetUserData(): Promise<void> {
    this.userReputation = null;
    this.nullifierSet.clear();
    this.proofCache = {};
    this.log('User data reset completed');
  }

  // New APIs for monitoring
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: Object.keys(this.proofCache).length,
      hitRate: 0 // To be implemented with counters
    };
  }

  getNullifierCount(): number {
    return this.nullifierSet.size;
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: string[] }> {
    const details: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // Verify verification key loading
      await this.loadVerificationKeyWithCache();
      details.push('Verification key loaded successfully');
    } catch (error) {
      details.push('Failed to load verification key');
      status = 'unhealthy';
    }

    // Verify RPC provider availability
    try {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_KEY');
      await provider.getBlockNumber();
      details.push('RPC provider accessible');
    } catch (error) {
      details.push('RPC provider not accessible');
      status = status === 'unhealthy' ? 'unhealthy' : 'degraded';
    }

    details.push(`Cache size: ${Object.keys(this.proofCache).length}`);
    details.push(`Nullifier count: ${this.nullifierSet.size}`);

    return { status, details };
  }
}

export const productionZKPService = new ProductionZKPService();
