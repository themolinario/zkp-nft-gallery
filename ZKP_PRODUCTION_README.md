# Production ZKP Service - Documentation

## Overview

The ZKP service has been completely rewritten for production using real Zero-Knowledge Proof implementations with snarkjs and real cryptography. There are no more mocked implementations.

## Main Features

### 🔐 Real Zero-Knowledge Proofs
- Uses **snarkjs** with Groth16 protocol
- Compiled Circom circuits for NFT property verification
- Cryptographic hashes with Poseidon and SHA256
- Nullifiers to prevent double-spending

### ⛓️ On-Chain Verification
- Direct integration with Ethereum/Polygon blockchain
- NFT property verification through ERC721 smart contracts
- Multiple provider fallback for resilience
- Automatic timeouts and retries

### 🚀 Performance and Scalability
- Intelligent ZKP proof caching
- Configurable timeouts for proof generation
- Memory management with nullifier limits
- Automatic cleanup of expired cache

### 🔧 Monitoring and Debugging
- Complete system health check
- Configurable logging for debugging
- Cache and performance statistics
- Nullifier usage metrics

## Production Setup

### 1. Dependency Installation

```bash
# Install circom globally
npm install -g circom

# Install snarkjs globally  
npm install -g snarkjs

# Install project dependencies
npm install
```

### 2. ZKP Circuit Compilation

Run the setup script to compile circuits and generate cryptographic keys:

```bash
./scripts/setup-zkp.sh
```

This script:
- Compiles the `ownership.circom` circuit
- Executes the trusted setup ceremony
- Generates proving key and verification key
- Creates necessary WASM files

### 3. Environment Configuration

Copy `.env.production` and configure variables:

```bash
cp .env.production .env.local
```

Modify the following variables:
- `REACT_APP_RPC_URL`: Your Infura/Alchemy endpoint
- `REACT_APP_POLYGON_RPC_URL`: Polygon provider (optional)
- `REACT_APP_TESTNET_RPC_URL`: Testnet provider for development

## Service Usage

### Import

```typescript
import { productionZKPService } from './services/zkpService';
```

### NFT Ownership Proof

```typescript
const result = await productionZKPService.proveNFTOwnership(
  walletAddress,
  privateKey,
  nftAsset
);

if (result.success) {
  console.log('ZKP proof generated:', result.proof);
} else {
  console.error('Error:', result.error);
}
```

### Anonymous Verification

```typescript
const isValid = await productionZKPService.verifyAnonymousOwnership(
  proof,
  contractAddress,
  tokenId
);
```

### System Monitoring

```typescript
const health = await productionZKPService.healthCheck();
console.log('System status:', health.status);

const stats = productionZKPService.getCacheStats();
console.log('Cache size:', stats.size);
```

## Advanced Configuration

### Environment Variables

| Variable | Default | Description |
|-----------|---------|-------------|
| `REACT_APP_MAX_PROOF_TIME` | 30000 | Proof generation timeout (ms) |
| `REACT_APP_ENABLE_DEBUG` | false | Enable debug logging |
| `REACT_APP_CACHE_PROOFS` | true | Enable proof caching |
| `REACT_APP_CACHE_DURATION` | 3600000 | Cache duration (ms) |
| `REACT_APP_MAX_NULLIFIERS` | 10000 | Nullifier memory limit |

### Performance Optimization

1. **Proof Caching**: Proofs are automatically cached for 1 hour
2. **Batch Verification**: For collections, use `proveCollectionOwnership`
3. **Provider Fallback**: Configure multiple providers for resilience
4. **Appropriate Timeouts**: Adjust `MAX_PROOF_TIME` based on your needs

## Security

### Implemented Protections

- ✅ Cryptographic verification private key/address
- ✅ Nullifiers to prevent replay attacks
- ✅ Timeouts to avoid DoS
- ✅ Mandatory on-chain verification
- ✅ Secure hashes with Poseidon/SHA256
- ✅ Cryptographically secure random nonces

### Best Practices

1. **Never log private keys** in production
2. **Use HTTPS** for all RPC endpoints
3. **Configure rate limiting** for ZKP APIs
4. **Monitor memory usage** of nullifiers
5. **Backup verification keys**

## Troubleshooting

### Common Errors

**"Failed to load verification key"**
- Verify that `./scripts/setup-zkp.sh` has been executed
- Check that files in `/circuits/` exist

**"ZKP generation timeout"**
- Increase `REACT_APP_MAX_PROOF_TIME`
- Verify device performance

**"NFT ownership not verified on blockchain"**
- Check RPC configuration
- Verify that NFT exists and is owned by the wallet

### Debug Mode

Enable debug mode for detailed logging:

```bash
REACT_APP_ENABLE_DEBUG=true npm start
```

## Generated Files

After setup, these files will be present in `/public/circuits/`:

- `ownership.wasm`: Compiled circuit
- `ownership_final.zkey`: Proving key
- `verification_key.json`: Verification key

**⚠️ DO NOT commit keys to git for security!**

## Migration from Mock

The new service is **completely compatible** with the previous API. No changes are needed to existing code using `productionZKPService`.

All mocked functions are now real implementations:
- `proveNFTOwnership()` - Real ZKP proofs
- `verifyOnChainOwnership()` - Real blockchain verification
- `generateOwnershipHash()` - Real Poseidon hashes
- `verifyAnonymousOwnership()` - Complete ZKP verification

## Support

For problems or questions about ZKP implementation:
1. Check logs with debug mode enabled
2. Verify environment configuration
3. Test with `healthCheck()` API
