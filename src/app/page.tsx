"use client";

import { useState } from "react";
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js";
import { Metaplex, bundlrStorage, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function SkillChainApp() {
  const wallet = useWallet();
  const [connected, setConnected] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const connection = new Connection(clusterApiUrl("devnet"));

  // Пример вопросов
  const questions = [
    { q: "Что такое Solana?", a: "Блокчейн" },
    { q: "Что такое NFT?", a: "Уникальный токен" },
    { q: "Какой язык чаще всего используют в Solana-программах?", a: "Rust" },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handlePayAndStart = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return alert("Подключи Phantom!");

    const recipient = wallet.publicKey;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipient, // В будущем можно заменить на адрес платформы
        lamports: 0.01 * LAMPORTS_PER_SOL,
      })
    );
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(sig, "confirmed");

    setTestStarted(true);
  };

  const handleFinishTest = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (q.a.toLowerCase() === answers[i].toLowerCase()) correct++;
    });
    setScore(correct);

    if (correct >= 2) {
      await mintCertificateNFT();
    }
  };

  const mintCertificateNFT = async () => {
    if (!wallet.publicKey) return;

    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet))
      .use(bundlrStorage());

    const { nft } = await metaplex.nfts().create({
      uri: "https://bafybeig.../certificate.json", // JSON с метаданными NFT
      name: "SkillChain Certificate",
      symbol: "SKLC",
      sellerFeeBasisPoints: 0,
    });

    setMintAddress(nft.address.toBase58());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6 text-purple-400"
      >
        SkillChain
      </motion.h1>

      {!wallet.connected ? (
        <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600" />
      ) : !testStarted ? (
        <button
          onClick={handlePayAndStart}
          className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Оплатить 0.01 SOL и начать тест
        </button>
      ) : score === null ? (
        <div className="w-full max-w-md bg-gray-800 rounded-xl p-6">
          {questions.map((q, i) => (
            <div key={i} className="mb-4">
              <p className="mb-2">{q.q}</p>
              <input
                type="text"
                value={answers[i]}
                onChange={(e) => handleAnswer(i, e.target.value)}
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>
          ))}
          <button
            onClick={handleFinishTest}
            className="bg-purple-500 hover:bg-purple-600 w-full py-2 rounded-lg mt-4 font-semibold"
          >
            Завершить тест
          </button>
        </div>
      ) : (
        <div className="text-center mt-6">
          <h2 className="text-2xl mb-4">
            {score >= 2 ? "Поздравляем! 🎉 Ты прошёл тест!" : "Попробуй ещё раз 😅"}
          </h2>
          {mintAddress && (
            <p className="text-sm text-gray-400">
              NFT сертификат:{" "}
              <a
                href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                target="_blank"
                className="underline text-purple-400"
              >
                {mintAddress.slice(0, 8)}...
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
