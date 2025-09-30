import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

interface WalletConnectionProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'button' | 'card' | 'minimal';
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  className = '',
  style = {},
  variant = 'button'
}) => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    const walletAddress = prompt('Enter your wallet address:');
    const privateKey = prompt('Enter your private key:');

    if (walletAddress && privateKey) {
      // Simula una verifica della connessione
      await new Promise(resolve => setTimeout(resolve, 1000));
      connectWallet(walletAddress, privateKey);
      alert(`Wallet connected successfully! 🎉\n\nAddress: ${walletAddress.slice(0, 8)}...\n\nYou can now access all NFTs across the app.`);
    }

    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    const confirm = window.confirm('Are you sure you want to disconnect your wallet?');
    if (confirm) {
      disconnectWallet();
      alert('Wallet disconnected successfully.');
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={className} style={style}>
        {wallet.isConnected ? (
          <span style={{ color: '#4CAF50', fontSize: '14px' }}>
            🟢 {wallet.walletAddress?.slice(0, 8)}...
          </span>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            style={{
              background: 'none',
              border: '1px solid #64ffda',
              color: '#64ffda',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={className}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          ...style
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#64ffda' }}>
          Wallet Connection
        </h3>

        {wallet.isConnected ? (
          <div>
            <div style={{
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4CAF50',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                ✅ Connected
              </p>
              <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>
                {wallet.walletAddress}
              </p>
            </div>

            <button
              onClick={handleDisconnect}
              style={{
                background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ccc' }}>
              Connect your wallet to access exclusive NFTs across the entire gallery.
            </p>

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              style={{
                background: isConnecting
                  ? 'rgba(100, 255, 218, 0.5)'
                  : 'linear-gradient(45deg, #bb86fc, #64ffda)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: isConnecting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <button
      className={className}
      onClick={wallet.isConnected ? handleDisconnect : handleConnect}
      disabled={isConnecting}
      style={{
        background: wallet.isConnected
          ? 'linear-gradient(45deg, #4CAF50, #2E7D32)'
          : isConnecting
            ? 'rgba(187, 134, 252, 0.5)'
            : 'linear-gradient(45deg, #bb86fc, #64ffda)',
        border: 'none',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '25px',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!isConnecting) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {wallet.isConnected
        ? `🟢 ${wallet.walletAddress?.slice(0, 8)}...`
        : isConnecting
          ? 'Connecting...'
          : 'Connect Wallet'
      }
    </button>
  );
};

export default WalletConnection;
