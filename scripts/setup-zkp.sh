#!/bin/bash

# Script per compilare i circuiti ZKP e generare le chiavi per produzione
set -e

echo "🔧 Compilazione circuiti ZKP per produzione..."

# Assicurati che circom sia installato
if ! command -v circom &> /dev/null; then
    echo "❌ circom non trovato. Installalo con: npm install -g circom"
    exit 1
fi

# Assicurati che snarkjs sia installato globalmente
if ! command -v snarkjs &> /dev/null; then
    echo "📦 Installazione snarkjs globalmente..."
    npm install -g snarkjs
fi

# Directory per i circuiti
CIRCUITS_DIR="public/circuits"
BUILD_DIR="$CIRCUITS_DIR/build"

# Crea directory se non esistono
mkdir -p "$BUILD_DIR"

echo "📁 Compilazione circuito ownership.circom..."

# Compila il circuito
circom "$CIRCUITS_DIR/ownership.circom" --r1cs --wasm --sym -o "$BUILD_DIR"

echo "🔑 Generazione trusted setup..."

# Powers of Tau ceremony (per circuiti piccoli)
echo "⚡ Generazione powers of tau..."
snarkjs powersoftau new bn128 12 "$BUILD_DIR/pot12_0000.ptau" -v

echo "📝 Contributo alla ceremony..."
snarkjs powersoftau contribute "$BUILD_DIR/pot12_0000.ptau" "$BUILD_DIR/pot12_0001.ptau" --name="First contribution" -v -e="random entropy"

echo "🎯 Preparazione phase 2..."
snarkjs powersoftau prepare phase2 "$BUILD_DIR/pot12_0001.ptau" "$BUILD_DIR/pot12_final.ptau" -v

echo "🔐 Generazione proving key..."
snarkjs groth16 setup "$BUILD_DIR/ownership.r1cs" "$BUILD_DIR/pot12_final.ptau" "$BUILD_DIR/ownership_0000.zkey"

echo "🤝 Contributo alla ceremony del circuito..."
snarkjs zkey contribute "$BUILD_DIR/ownership_0000.zkey" "$BUILD_DIR/ownership_0001.zkey" --name="1st Contributor Name" -v -e="Another random entropy"

echo "📋 Esportazione verification key..."
snarkjs zkey export verificationkey "$BUILD_DIR/ownership_0001.zkey" "$BUILD_DIR/verification_key.json"

echo "📦 Copia file per produzione..."
# Copia i file necessari nella directory pubblica
cp "$BUILD_DIR/ownership_js/ownership.wasm" "$CIRCUITS_DIR/"
cp "$BUILD_DIR/ownership_0001.zkey" "$CIRCUITS_DIR/ownership_final.zkey"
cp "$BUILD_DIR/verification_key.json" "$CIRCUITS_DIR/"

echo "✅ Setup ZKP completato con successo!"
echo "📂 File generati:"
echo "   - $CIRCUITS_DIR/ownership.wasm"
echo "   - $CIRCUITS_DIR/ownership_final.zkey"
echo "   - $CIRCUITS_DIR/verification_key.json"

echo ""
echo "🚀 Il sistema ZKP è ora pronto per la produzione!"
