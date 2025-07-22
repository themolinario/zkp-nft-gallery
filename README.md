# 🎨 ZKP NFT Gallery

A revolutionary 3D virtual museum where NFT ownership is verified using **Zero-Knowledge Proofs**, ensuring complete privacy while proving authenticity.

## 🌟 Features

- **🎪 3D Carousel Gallery**: Interactive rotating gallery with smooth animations
- **🏛️ Traditional Museum View**: Classic grid layout for NFT browsing
- **🔐 Zero-Knowledge Proofs**: Prove NFT ownership without revealing sensitive data
- **🏆 Reputation System**: Earn achievements and verification levels through ZKP
- **💎 Exclusive Content**: Unlock premium materials based on your collection
- **📚 Collection Management**: Track and prove ownership of complete collections
- **🎮 Gamification**: Bronze, Silver, Gold, and Diamond verification levels

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/themolinario/tesi.git
   cd zkp-nft-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### 🏠 **Home Page**
- **Overview** of the ZKP NFT Gallery concept
- **Feature highlights** with interactive cards
- **Quick navigation** to Gallery and Dashboard

### 🎪 **Gallery Experience**

#### **3D Carousel Mode** (Default)
- **Navigate** using arrow buttons ← → or dots
- **3D rotation** with mouse/touch controls
- **Zoom** in/out with scroll wheel
- **Click locked NFTs** (🔒) to attempt unlock

#### **Traditional Museum Mode**
- **Grid layout** of NFT frames
- **Free exploration** with camera controls
- **Same ZKP verification** system

#### **Unlocking NFTs with ZKP**
1. Click on any **locked NFT** (🔒 icon)
2. Enter your **wallet address** when prompted
3. Enter your **private key** (simulated for demo)
4. System generates **Zero-Knowledge Proof**
5. If valid: NFT unlocks + reputation increases

### 📊 **Dashboard & Profile**

#### **Statistics Panel**
- **Real-time progress** tracking
- **Unlocked vs Total** NFT counts
- **Completion percentage**

#### **Wallet Management**
- **Connect wallet** simulation
- **Address display** with privacy (0x1234...5678)
- **Copy to clipboard** functionality

#### **Reputation System**
- **Verification Levels**: 🥉 Bronze → 🥈 Silver → 🥇 Gold → 💎 Diamond
- **Achievement tracking** with ZKP requirements
- **NFT collection** overview by category

#### **Your Unlocked NFTs**
- **Live list** of owned artworks
- **Rarity indicators** (Common, Rare, Epic, Legendary)
- **Exclusive content** markers (🎁)

### 📚 **Collections**

- **Collection progress** tracking
- **Benefit tiers** based on completion
- **ZKP collection proofs** for multiple NFTs
- **Exclusive perks** for complete collections

## 🔐 Zero-Knowledge Proof System

### **How ZKP Works in the App**

1. **Privacy Preservation**
   - Your wallet address is **never revealed** during verification
   - Private keys remain **completely hidden**
   - Only cryptographic proofs are shared

2. **Ownership Verification**
   - Prove you own specific NFTs **without doxxing**
   - Smart contract verification **without transaction**
   - Reputation building **with full anonymity**

3. **Exclusive Benefits**
   - **Legendary NFTs**: Require Diamond status (10+ NFTs, 3+ rare)
   - **Epic NFTs**: Require Gold+ status (5+ NFTs, 2+ rare)
   - **Collection bonuses**: VIP access, discounts, early drops

### **Demo Keys for Testing**

Use these simulated keys to test the ZKP system:

| NFT | Demo Wallet + Key |
|-----|-------------------|
| **Starry Night** | Any wallet + any key |
| **The Scream** | Any wallet + any key |
| **Mona Lisa** | Any wallet + any key |
| **Guernica** | Any wallet + any key |
| **The Great Wave** | Any wallet + any key |

*Note: The system simulates real ZKP verification for demonstration purposes*

## 🎮 Gamification Elements

### **Verification Levels**

- **🥉 Bronze** (Default): Basic access
- **🥈 Silver** (3+ NFTs): Exclusive content access
- **🥇 Gold** (5+ NFTs, 2+ rare): Premium benefits
- **💎 Diamond** (10+ NFTs, 3+ rare): Ultimate collector status

### **Achievements**

- **🎨 First Collector**: Unlock your first NFT via ZKP
- **💎 Rarity Hunter**: Own 3+ rare/legendary NFTs
- **👑 Collection Master**: Complete an entire collection
- **🔐 ZKP Expert**: Generate multiple ownership proofs

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **3D Graphics**: React Three Fiber + Three.js
- **UI Components**: React Three Drei
- **ZKP Library**: SnarkJS (Groth16 protocol)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: CSS3 with custom properties

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Carousel3D.tsx   # 3D rotating gallery
│   ├── Gallery3D.tsx    # Traditional museum view
│   ├── Navigation.tsx   # App navigation bar
│   └── ControlPanel.tsx # ZKP dashboard panel
├── pages/               # Application pages
│   ├── HomePage.tsx     # Landing page
│   ├── GalleryPage.tsx  # Main gallery experience
│   ├── DashboardPage.tsx# User dashboard & profile
│   └── CollectionsPage.tsx # Collection management
├── contexts/            # React Context providers
│   └── NFTContext.tsx   # Global NFT state management
├── services/            # Business logic
│   └── zkpService.ts    # Zero-Knowledge Proof service
└── types/               # TypeScript definitions
    └── zkp.ts           # ZKP and NFT type definitions
```

## 🔧 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

### Production Deployment
```bash
npm run build      # Creates optimized build
# Deploy the 'build' folder to your hosting service
```

## 🌐 Browser Support

- **Chrome/Edge**: Full support with WebGL
- **Firefox**: Full support with WebGL
- **Safari**: Full support with WebGL
- **Mobile**: Touch controls supported

## 🚧 Future Enhancements

- **Real ZKP Circuits**: Integration with Circom/SnarkJS circuits
- **Blockchain Integration**: Ethereum/Polygon NFT verification
- **IPFS Storage**: Decentralized content delivery
- **Web3 Wallet**: MetaMask/WalletConnect integration
- **Social Features**: Community voting and governance
- **AR/VR Support**: Immersive gallery experiences

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in this repository.

---

**Built with ❤️ using React Three Fiber and Zero-Knowledge Proofs**
