import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  privateKey: string | null;
  connectionAttempts: { [nftId: string]: number };
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: (address: string, privateKey: string) => void;
  disconnectWallet: () => void;
  incrementAttempt: (nftId: string) => number;
  resetAttempts: (nftId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    walletAddress: null,
    privateKey: null,
    connectionAttempts: {}
  });

  // Carica lo stato dal localStorage al mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletState');
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet);
        setWallet(parsedWallet);
      } catch (error) {
        console.error('Error loading wallet state from localStorage:', error);
      }
    }
  }, []);

  // Salva lo stato nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('walletState', JSON.stringify(wallet));
  }, [wallet]);

  const connectWallet = (address: string, privateKey: string) => {
    setWallet(prev => ({
      ...prev,
      isConnected: true,
      walletAddress: address,
      privateKey: privateKey
    }));
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      walletAddress: null,
      privateKey: null,
      connectionAttempts: {}
    });
    localStorage.removeItem('walletState');
  };

  const incrementAttempt = (nftId: string): number => {
    setWallet(prev => {
      const newAttempts = { ...prev.connectionAttempts };
      newAttempts[nftId] = (newAttempts[nftId] || 0) + 1;
      return {
        ...prev,
        connectionAttempts: newAttempts
      };
    });
    return (wallet.connectionAttempts[nftId] || 0) + 1;
  };

  const resetAttempts = (nftId: string) => {
    setWallet(prev => {
      const newAttempts = { ...prev.connectionAttempts };
      delete newAttempts[nftId];
      return {
        ...prev,
        connectionAttempts: newAttempts
      };
    });
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      connectWallet,
      disconnectWallet,
      incrementAttempt,
      resetAttempts
    }}>
      {children}
    </WalletContext.Provider>
  );
};
