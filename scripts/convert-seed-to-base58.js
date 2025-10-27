import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

// Usage: node scripts/convert-seed-to-base58.js "your seed phrase here"

async function convertSeedToBase58() {
  const seedPhrase = process.argv[2];
  
  if (!seedPhrase) {
    console.error("Usage: node scripts/convert-seed-to-base58.js \"your 12 or 24 word seed phrase\"");
    process.exit(1);
  }

  try {
    // Validate seed phrase
    if (!bip39.validateMnemonic(seedPhrase, wordlist)) {
      console.error("Invalid seed phrase");
      process.exit(1);
    }

    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(seedPhrase, "");
    
    // Derive Solana's default derivation path (same as Phantom uses)
    const path = "m/44'/501'/0'/0'";
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    
    // Create keypair from derived seed
    const keypair = Keypair.fromSeed(derivedSeed);
    
    // Convert to Base58
    const privateKeyBase58 = bs58.encode(keypair.secretKey);
    
    console.log("\n✅ Conversion successful!\n");
    console.log("Public Key (Address):", keypair.publicKey.toString());
    console.log("\n🔑 Private Key (Base58) - Copy this for METAPLEX_PRIVATE_KEY:");
    console.log(privateKeyBase58);
    console.log("\n⚠️  Keep this private key secure! Never share it with anyone.\n");
    
  } catch (error) {
    console.error("Error converting seed phrase:", error.message);
    process.exit(1);
  }
}

convertSeedToBase58();
