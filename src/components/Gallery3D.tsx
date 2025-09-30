import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Environment, useTexture } from '@react-three/drei';
import { Mesh } from 'three';
import { NFTAsset } from '../types/zkp';

// Traccia i tentativi di accesso per ogni NFT (condiviso tra Gallery3D e Carousel3D)
const accessAttempts: { [nftId: string]: number } = {};

interface NFTFrameProps {
  asset: NFTAsset;
  onUnlock: (assetId: string) => void;
}

const NFTFrame: React.FC<NFTFrameProps> = ({ asset, onUnlock }) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Carica la texture dell'immagine
  const texture = useTexture(asset.imageUrl);

  const handleClick = async () => {
    if (asset.isUnlocked) return;

    // Fake input to simulate credential entry
    const walletAddress = prompt('Enter your wallet address:');
    const privateKey = prompt('Enter your private key:');

    if (walletAddress && privateKey) {
      // Initialize counter if it doesn't exist
      if (!accessAttempts[asset.id]) {
        accessAttempts[asset.id] = 0;
      }

      // Increment attempt count
      accessAttempts[asset.id]++;

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // First time: error, second time: success
      if (accessAttempts[asset.id] === 1) {
        alert(`❌ Error: Invalid credentials\n\nThe wallet address and private key provided are not valid or do not own this NFT.\n\nPlease try again with correct credentials.`);
      } else {
        // Success on second attempt
        onUnlock(asset.id);
        alert(`NFT unlocked successfully! 🎉\n\nWelcome to the exclusive gallery!`);
      }
    }
  };

  return (
    <group position={asset.position || [0, 0, 0]}>
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
          <meshStandardMaterial map={texture} />
        </Box>
      ) : (
        <>
          {/* Versione bloccata con immagine sfocata/oscurata */}
          <Box args={[2.8, 3.8, 0.05]} position={[0, 0, 0.06]}>
            <meshStandardMaterial
              map={texture}
              color="#333"
              opacity={0.3}
              transparent={true}
            />
          </Box>

          {/* Overlay bloccato */}
          <Box args={[2.8, 3.8, 0.02]} position={[0, 0, 0.07]}>
            <meshStandardMaterial color="#000" opacity={0.6} transparent={true} />
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
        fontSize={0.2}
        color={
          asset.rarity === 'legendary' ? '#FFD700' :
          asset.rarity === 'epic' ? '#9C27B0' :
          asset.rarity === 'rare' ? '#2196F3' : '#4CAF50'
        }
        anchorX="center"
        anchorY="middle"
      >
        ✦ {asset.rarity.toUpperCase()} ✦
      </Text>

      {/* Rarity Badge con sfondo */}
      <Box args={[2, 0.3, 0.02]} position={[0, -3.6, 0.08]}>
        <meshStandardMaterial
          color={
            asset.rarity === 'legendary' ? '#FFD700' :
            asset.rarity === 'epic' ? '#9C27B0' :
            asset.rarity === 'rare' ? '#2196F3' : '#4CAF50'
          }
          opacity={0.2}
          transparent={true}
        />
      </Box>
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
