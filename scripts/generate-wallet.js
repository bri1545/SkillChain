import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

console.log("\n🎯 Генерация нового Solana кошелька для минтинга NFT...\n");

// Generate new keypair
const keypair = Keypair.generate();

// Convert to Base58
const privateKeyBase58 = bs58.encode(keypair.secretKey);

console.log("✅ Новый кошелек создан!\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\n📍 АДРЕС КОШЕЛЬКА (публичный):");
console.log(keypair.publicKey.toString());
console.log("\n🔑 ПРИВАТНЫЙ КЛЮЧ (Base58) - это ваш METAPLEX_PRIVATE_KEY:");
console.log(privateKeyBase58);
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\n📝 ЧТО ДЕЛАТЬ ДАЛЬШЕ:\n");
console.log("1. Скопируйте ПРИВАТНЫЙ КЛЮЧ выше");
console.log("2. Добавьте его в Replit Secrets как METAPLEX_PRIVATE_KEY");
console.log("3. Пополните кошелек тестовыми SOL:");
console.log("   • Перейдите на: https://faucet.solana.com/");
console.log("   • Вставьте адрес кошелька");
console.log("   • Выберите 'Devnet' и запросите 1-2 SOL");
console.log("\n⚠️  ВАЖНО: Храните приватный ключ в секрете!\n");
