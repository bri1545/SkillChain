'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getPhantomWallet, getSolflareWallet } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, bundlrStorage, walletAdapterIdentity } from '@metaplex-foundation/js';

import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

// ====== КОНФИГ: адрес проекта (куда переводят 1 SOL на devnet) ======
const PROJECT_PUBKEY = new PublicKey('EUziGjjJJGRYDdkzKDCLfWhTSSZ35QZBDVyLgQCsQDd4');
const NETWORK = 'devnet'; // devnet
const SOL_PRICE_FALLBACK = 10; // если не подтянули цену — просто показать

// ====== Простые вопросы (3 шт) — по теме Web3/Solana ======
const QUIZ = [
  {
    q: 'Что такое SOL в экосистеме Solana?',
    options: ['Название NFT стандарта', 'Нативный токен сети', 'Смарт-контракт'],
    a: 1
  },
  {
    q: 'Что делает кошелёк Phantom?',
    options: ['Служит браузерным кошельком и подписывает транзакции', 'Майнинг SOL', 'Хостит сайт'],
    a: 0
  },
  {
    q: 'Почему полезно выдавать сертификаты в виде NFT?',
    options: ['Они дорого стоят всегда', 'Доказуемая история владения и подлинность', 'Ускоряют интернет'],
    a: 1
  }
];

// ====== Providers (в одном файле, чтобы можно было просто вставить) ======
function AppProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl(NETWORK as any), []);
  const wallets = useMemo(() => [getPhantomWallet(), getSolflareWallet()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// ====== Основной компонент страницы ======
export default function Page() {
  return (
    <AppProviders>
      <MainUI />
    </AppProviders>
  );
}

function MainUI() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [step, setStep] = useState<'intro' | 'quiz' | 'pay' | 'minting' | 'done'>('intro');
  const [answers, setAnswers] = useState<number[]>([]);
  const [solPriceUSD, setSolPriceUSD] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mintInfo, setMintInfo] = useState<{ mintAddress?: string; explorerUrl?: string } | null>(null);
  const [confettiToggle, setConfettiToggle] = useState(false);

  // Подтягиваем цену SOL (для отображения) — не критично
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then(r => r.json())
      .then(d => {
        if (d?.solana?.usd) setSolPriceUSD(d.solana.usd);
      })
      .catch(() => setSolPriceUSD(null));
  }, []);

  // Удобный расчет 1 SOL в USD
  const oneSolUsdStr = useMemo(() => {
    const usd = solPriceUSD ?? SOL_PRICE_FALLBACK;
    return `$${Math.round(usd * 100) / 100}`;
  }, [solPriceUSD]);

  // Обновляем ответы
  const selectAnswer = (i: number) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[copy.length] = i;
      return copy;
    });
  };

  const gradeQuiz = () => {
    // Надо минимум 3/3 (можно изменить)
    let correct = 0;
    for (let i = 0; i < QUIZ.length; i++) if (answers[i] === QUIZ[i].a) correct++;
    return { correct, total: QUIZ.length, passed: correct === QUIZ.length };
  };

  // Обработка оплаты 1 SOL и последующего mint (после прохождения теста)
  const handlePayAndMint = useCallback(async () => {
    setMessage(null);
    if (!wallet.connected || !wallet.publicKey) {
      setMessage('Подключите кошелёк (Phantom) для оплаты и подписи транзакций.');
      return;
    }

    const result = gradeQuiz();
    if (!result.passed) {
      setMessage(`Вы не прошли тест — правильных ${result.correct}/${result.total}. Для получения сертификата нужно ответить верно на все вопросы.`);
      return;
    }

    try {
      setStep('minting');
      setMessage('Готовим транзакцию оплаты 1 SOL...');

      // 1 SOL перевод от пользователя на PROJECT_PUBKEY
      const lamports = Math.round(1 * LAMPORTS_PER_SOL);
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey!,
          toPubkey: PROJECT_PUBKEY,
          lamports,
        })
      );
      tx.feePayer = wallet.publicKey!;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      // Подписываем транзакцию через кошелёк
      const signed = await wallet.signTransaction?.(tx);
      if (!signed) throw new Error('Не удалось подписать транзакцию кошельком.');

      const txid = await connection.sendRawTransaction(signed.serialize());
      setMessage(`Платёж отправлен. Tx = ${txid}. Ждём подтверждения...`);
      await connection.confirmTransaction(txid, 'confirmed');

      // ====== Создаём NFT через Metaplex (используя wallet adapter identity) ======
      setMessage('Платёж подтверждён. Создаём NFT-сертификат (devnet)...');

      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: clusterApiUrl(NETWORK as any),
          timeout: 60000,
        }));

      // Метаданные NFT
      const metadata = {
        name: `Web3 Certificate — Passed test`,
        symbol: 'HACKCERT',
        description: 'Certificate issued by hackathon demo — proof of passed knowledge test (devnet).',
        image: 'https://placehold.co/600x400?text=Web3+Certified', // можно заменить на IPFS позже
        attributes: [
          { trait_type: 'Issuer', value: 'Hackathon Demo' },
          { trait_type: 'Network', value: NETWORK },
          { trait_type: 'Type', value: 'Test Certificate' },
          { trait_type: 'Date', value: new Date().toISOString().split('T')[0] },
        ],
      };

      // Загружаем метаданные в bundlr (или devnet fallback)
      const { uri } = await metaplex.nfts().uploadMetadata(metadata);

      // Создаём NFT
      const { nft } = await metaplex.nfts().create({
        uri,
        name: metadata.name,
        sellerFeeBasisPoints: 0,
        symbol: metadata.symbol,
        creators: [
          { address: wallet.publicKey!.toBase58(), share: 100, verified: true },
        ],
      });

      const explorerUrl = `https://explorer.solana.com/address/${nft.address.toString()}?cluster=${NETWORK}`;

      setMintInfo({ mintAddress: nft.address.toString(), explorerUrl });
      setMessage(`NFT создан! Mint: ${nft.address.toString()}`);
      setStep('done');

      // лёгкая «конфетти»-индикация (toggle)
      setConfettiToggle(true);
      setTimeout(() => setConfettiToggle(false), 3500);
    } catch (err: any) {
      console.error(err);
      setMessage('Ошибка при mint: ' + (err?.message || String(err)));
      setStep('pay');
    }
  }, [wallet, connection, answers]);

  // UI helper — плавные появления
  const appear = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <div className="min-h-screen p-6 bg-[#111214] text-gray-100">
      <div className="max-w-4xl mx-auto">
        <motion.header {...appear} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">CertNFT — Web3 Certified (demo)</h1>
            <p className="text-gray-400 mt-1">Матовый тёмный интерфейс · devnet · 1 SOL за тест · реальный NFT</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400 mr-2">Сеть: <span className="text-gray-200 ml-1">{NETWORK}</span></div>
            <WalletMultiButton />
          </div>
        </motion.header>

        <motion.main {...appear} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* left: main card */}
          <div className="md:col-span-2 bg-[#151517] border border-[#232326] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <section className="mb-6">
              <h2 className="text-xl font-medium">Инструкция</h2>
              <p className="text-gray-400 mt-2">
                Подключи Phantom → пройди мини-тест (3 вопроса) → оплати <b>1 SOL</b> (devnet) → получи NFT-сертификат.
                Цена в USD ≈ <span className="text-gray-100">{oneSolUsdStr}</span>.
              </p>
            </section>

            {step === 'intro' && (
              <motion.div {...appear}>
                <div className="p-5 bg-gradient-to-b from-[#0f1011] to-[#0f1112] rounded-xl border border-[#202023]">
                  <h3 className="font-semibold text-lg">Готов начать?</h3>
                  <p className="text-gray-400 mt-2">Нажми кнопку ниже, чтобы пройти тест и получить NFT.</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-[#6B46C1] hover:brightness-105 transition text-white"
                      onClick={() => setStep('quiz')}
                    >
                      Пройти тест
                    </button>
                    <a
                      className="px-4 py-2 rounded-lg border border-[#2b2b2d] text-gray-200 hover:bg-[#111214] transition"
                      href="https://faucet.solana.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Получить SOL (faucet)
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div {...appear} className="mt-4">
                <h3 className="text-lg font-medium">Тест — 3 вопроса</h3>
                <p className="text-gray-400 mb-3">Отвечай аккуратно — нужно ответить верно на все, чтобы получить NFT.</p>
                <div className="space-y-4">
                  {QUIZ.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#0c0c0d] rounded-lg border border-[#202024]">
                      <div className="font-medium">{idx + 1}. {item.q}</div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.options.map((opt, oi) => {
                          const selected = answers[idx] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => {
                                // set answer for this index
                                setAnswers(prev => {
                                  const copy = [...prev];
                                  copy[idx] = oi;
                                  return copy;
                                });
                              }}
                              className={`text-left px-3 py-2 rounded-lg border ${selected ? 'border-[#7c3aed] bg-[#1b1630]' : 'border-[#222225] bg-transparent'} transition`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      // если не все ответы, можно подсказать
                      if (answers.length < QUIZ.length || answers.some(a => a === undefined)) {
                        setMessage('Пожалуйста, ответьте на все вопросы перед оплатой.');
                        return;
                      }
                      setStep('pay');
                      setMessage(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0891b2] text-white hover:brightness-105 transition"
                  >
                    Перейти к оплате (1 SOL)
                  </button>
                  <button onClick={() => { setStep('intro'); setAnswers([]); }} className="px-4 py-2 rounded-lg border border-[#2b2b2d]">Отмена</button>
                </div>
              </motion.div>
            )}

            {step === 'pay' && (
              <motion.div {...appear} className="mt-4">
                <h3 className="text-lg font-medium">Оплата 1 SOL</h3>
                <p className="text-gray-400">При оплате <b>1 SOL</b> (devnet) и успешном прохождении теста мы создадим NFT-сертификат и пришлём его на ваш кошелёк.</p>

                <div className="mt-4 p-4 bg-[#070708] rounded-lg border border-[#262629]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Сумма</div>
                      <div className="text-lg font-semibold">1 SOL • {oneSolUsdStr}</div>
                    </div>
                    <div className="text-sm text-gray-400">На адрес проекта</div>
                  </div>

                  <div className="mt-3 p-3 bg-[#0b0b0c] rounded-md border border-[#1f1f21]">
                    <div className="text-xs text-gray-400 break-all">{PROJECT_PUBKEY.toBase58()}</div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white hover:brightness-105"
                      onClick={handlePayAndMint}
                    >
                      Оплатить 1 SOL и получить NFT
                    </button>
                    <button onClick={() => setStep('quiz')} className="px-4 py-2 rounded-lg border border-[#2b2b2d]">Назад к тесту</button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'minting' && (
              <motion.div {...appear} className="mt-4 p-4 bg-[#0b0b0c] rounded-lg border border-[#232326]">
                <div className="text-gray-300">Выполняется создание NFT — ждём, пока транзакции завершатся...</div>
                <div className="mt-3 text-xs text-gray-500">Сообщения: {message}</div>
              </motion.div>
            )}

            {message && (
              <motion.div {...appear} className="mt-4 p-3 bg-[#081018] rounded-md border border-[#1a1b1d] text-sm text-gray-200">
                {message}
              </motion.div>
            )}
          </div>

          {/* right: профиль / NFT preview */}
          <div className="bg-[#151517] border border-[#232326] rounded-2xl p-6">
            <motion.div {...appear} className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-[#1f1b2d] to-[#0f1220] flex items-center justify-center border border-[#27242b]">
                <div className="text-white font-bold">You</div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-400">Профиль</div>
                <div className="text-lg font-medium mt-1">{wallet.publicKey ? wallet.publicKey.toBase58().slice(0, 8) + '...' : 'Не подключён'}</div>
              </div>

              {/* NFT preview / result */}
              {step === 'done' && mintInfo && (
                <motion.div {...appear} className="mt-6 w-full bg-[#0b0b0c] border border-[#232326] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 bg-gradient-to-br from-[#3b0764] to-[#5b2fb0] rounded-md flex items-center justify-center text-white font-semibold">CERT</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 font-semibold">Web3 Certificate</div>
                      <div className="text-xs text-gray-400 mt-1">Mint: <span className="text-xs text-gray-200 break-all">{mintInfo.mintAddress}</span></div>
                      <a className="text-xs text-teal-300 mt-2 inline-block" href={mintInfo.explorerUrl} target="_blank" rel="noreferrer">Открыть в Explorer</a>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Дата</div>
                      <div className="text-sm text-gray-200">{new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="bg-[#0c0c0d] p-2 rounded-md border border-[#1f1f21]">
                      <QRCodeCanvas value={mintInfo.explorerUrl || ''} size={80} bgColor="#0c0c0d" fgColor="#e6e6e6" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Пока нет NFT — показать подсказку */}
              {(!mintInfo || step !== 'done') && (
                <motion.div {...appear} className="mt-6 text-center text-sm text-gray-400">
                  После успешной оплаты и прохождения теста здесь появится твой NFT-сертификат.
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.main>

        <motion.footer {...appear} className="mt-8 text-center text-xs text-gray-500">
          Demo для хакатона — работаем на devnet. Не используйте mainnet без подготовки.
        </motion.footer>
      </div>
    </div>
  );
}
