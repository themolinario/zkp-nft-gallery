pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/bitify.circom";

// Circuit per dimostrare la proprietà di un NFT senza rivelare la chiave privata
template OwnershipProof() {
    signal private input privateKey;
    signal private input nonce;
    signal input publicAddress; // address derivato dalla chiave privata
    signal input contractAddress;
    signal input tokenId;
    signal input timestamp;

    signal output ownershipHash;
    signal output nullifierHash;

    component poseidonHasher = Poseidon(4);
    component nullifierHasher = Poseidon(2);

    // Verifica che l'indirizzo pubblico corrisponda alla chiave privata
    // In un'implementazione reale, questo includerebbe la derivazione ECDSA

    // Hash di proprietà: combina tutti i parametri pubblici
    poseidonHasher.inputs[0] <== publicAddress;
    poseidonHasher.inputs[1] <== contractAddress;
    poseidonHasher.inputs[2] <== tokenId;
    poseidonHasher.inputs[3] <== timestamp;

    ownershipHash <== poseidonHasher.out;

    // Nullifier per prevenire double-spending delle prove
    nullifierHasher.inputs[0] <== privateKey;
    nullifierHasher.inputs[1] <== nonce;

    nullifierHash <== nullifierHasher.out;
}

component main = OwnershipProof();
