import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Environment } from '@react-three/drei';
import { Mesh } from 'three';
import { NFTAsset } from '../types/zkp';
import { productionZKPService } from '../services/zkpService';

interface NFTFrameProps {
  asset: NFTAsset;
  onUnlock: (assetId: string) => void;
}

const NFTFrame: React.FC<NFTFrameProps> = ({ asset, onUnlock }) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    if (asset.isUnlocked) return;

    // Simulate wallet connection and ownership verification
    const walletAddress = prompt('Enter your wallet address to verify ownership:');
    const privateKey = prompt('Enter your private key (simulated):');

    if (walletAddress && privateKey) {
      try {
        // Use the production ZKP system
        const result = await productionZKPService.proveNFTOwnership(
          walletAddress,
          privateKey,
          asset
        );

        if (result.success) {
          onUnlock(asset.id);

          // Check if there are unlocked exclusive contents
          const exclusiveContent = await productionZKPService.unlockExclusiveContent(asset);

          if (exclusiveContent.unlocked) {
            alert(`NFT unlocked! 🎉\n\nExclusive content available:\n${exclusiveContent.content?.description}`);
          } else {
            alert('NFT unlocked successfully! 🎉');
          }
        } else {
          alert(`Verification failed: ${result.error}`);
        }
      } catch (error) {
        alert('Error during ZKP verification. Please try again.');
      }
    }
  };

  return (
    <group position={asset.position}>
      {/* Cornice */}
      <Box
        ref={meshRef}
        args={[3, 4, 0.1]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial
          color={isHovered ? "#444" : "#222"}
          roughness={0.3}
          metalness={0.1}
        />
      </Box>

      {/* Contenuto dell'NFT */}
      {asset.isUnlocked ? (
        <Box args={[2.8, 3.8, 0.05]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#fff" />
        </Box>
      ) : (
        <>
          {/* Overlay bloccato */}
          <Box args={[2.8, 3.8, 0.05]} position={[0, 0, 0.06]}>
            <meshStandardMaterial color="#333" opacity={0.8} transparent={true} />
          </Box>

          {/* Icona lucchetto */}
          <Text
            position={[0, 0, 0.1]}
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
        </>
      )}

      {/* Title */}
      <Text
        position={[0, -2.5, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {asset.title}
      </Text>

      {/* Artist */}
      <Text
        position={[0, -2.9, 0.1]}
        fontSize={0.2}
        color="#ccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        by {asset.artist}
      </Text>

      {/* Status */}
      <Text
        position={[0, -3.3, 0.1]}
        fontSize={0.15}
        color={asset.isUnlocked ? "#4CAF50" : "#F44336"}
        anchorX="center"
        anchorY="middle"
      >
        {asset.isUnlocked ? "✓ Unlocked" : "🔒 Click to verify ownership"}
      </Text>

      {/* Mostra rarity */}
      <Text
        position={[0, -3.6, 0.1]}
        fontSize={0.12}
        color={
          asset.rarity === 'legendary' ? '#FFD700' :
          asset.rarity === 'epic' ? '#9C27B0' :
          asset.rarity === 'rare' ? '#2196F3' : '#4CAF50'
        }
        anchorX="center"
        anchorY="middle"
      >
        {asset.rarity.toUpperCase()}
      </Text>
    </group>
  );
};

interface Gallery3DProps {
  assets: NFTAsset[];
  onAssetUnlock: (assetId: string) => void;
}

const Gallery3D: React.FC<Gallery3DProps> = ({ assets, onAssetUnlock }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      {/* Illuminazione */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Controlli camera */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={15}
        minDistance={3}
      />

      {/* Ambiente */}
      <Environment preset="city" />

      {/* Pavimento del museo trasparente */}
      <Box args={[30, 0.1, 30]} position={[0, -4, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.1}
          metalness={0.1}
          opacity={0.3}
          transparent={true}
        />
      </Box>

      {/* Rendering degli NFT */}
      {assets.map((asset) => (
        <NFTFrame
          key={asset.id}
          asset={asset}
          onUnlock={onAssetUnlock}
        />
      ))}
    </Canvas>
  );
};

export default Gallery3D;
