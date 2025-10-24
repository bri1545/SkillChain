

## **ChainLinker — Verified Work & Skills on Solana**

> Web3-профили с реальными подтверждениями опыта и навыков через NFT.

![ChainLinker Preview](https://placehold.co/1200x600/1a1a1a/ffffff?text=ChainLinker+-+Verified+Experience+on+Solana)

---

### **Submission to 2025 Solana Colosseum**

**Команда:**

* Кизиков Степан – [GitHub](https://github.com/bri1545)
* Киреев Трофим – [GitHub](https://github.com/teammate2)
* 

---

### **Resources**

* Презентация проекта – [ссылка](https://example.com/presentation)
* Видео о проекте – [ссылка](https://example.com/video)
* Приложение (Solana Devnet) – [ссылка](https://example.com/app)
* Сайт проекта – [ссылка](https://example.com)
* Twitter / X проекта – [ссылка](https://x.com/chainlinker)
* Репозиторий GitHub – [ссылка](https://github.com/bri1545/ChainLinker)
* Сообщество (Telegram / Discord) – [ссылка](https://t.me/chainlinker)

---

## **Problem and Solution**

### Проблема

В классических профессиональных сетях вроде LinkedIn легко подделать стаж и навыки.
Фальшивые сертификаты и резюме создают шум и мешают работодателям находить реальных специалистов.

* Более 70% рекрутеров сталкивались с ложными данными в профилях.
* Около 45% онлайн-сертификатов невозможно проверить.

### Решение

ChainLinker – это Web3-платформа на Solana, где каждый навык, сертификат или период работы подтверждается NFT.
Организации могут выпускать подтверждённые NFT напрямую в кошелёк пользователя, а тот – проходить тесты и получать on-chain подтверждения.

> «Данные о твоём опыте принадлежат тебе, и они должны храниться в твоём кошельке, а не на серверах компаний.»

---

## **Summary of Features**

* NFT-сертификаты навыков и стажа
* Оплата тестов токенами SOL (
* Привязка Phantom Wallet (Solana Devnet)
* Реальный mint NFT через Metaplex SDK
* Проверка знаний через интерактивный тест
* Тёмная матовая тема и плавные анимации
* Полноценный рабочий прототип на Devnet

---

## **Tech Stack**

| Компонент  | Технологии                                                       |
| ---------- | ---------------------------------------------------------------- |
| Frontend   | Next.js 14, React, TailwindCSS, Framer Motion                    |
| Web3 SDK   | @solana/web3.js, @solana/wallet-adapter, @metaplex-foundation/js |
| Blockchain | Solana Devnet                                                    |
| Wallet     | Phantom, Solflare                                                |
| Storage    | Bundlr / Arweave (для NFT метаданных)                            |

---

## **Architecture**

```text
[ Пользователь ]
       |
[ Next.js интерфейс (тест, NFT mint) ]
       |
[ Phantom Wallet Adapter ]
       |
[ Solana Devnet + Metaplex SDK ]
       |
[ Bundlr / Arweave (метаданные) ]
```

---

## **Quick Start**

### Запуск локально

```bash
git clone https://github.com/yourusername/chainlinker
cd chainlinker
npm install
npm run dev
```

Открыть: [http://localhost:3000](http://localhost:3000)

---

### Без Node.js

```bash
npm run build
npm run export
```

Открыть файл `/out/index.html` в браузере
или залить проект на Vercel / Netlify / StackBlitz.

---

### Основные зависимости

```bash
npm install next react react-dom tailwindcss framer-motion \
@solana/web3.js @solana/wallet-adapter-react \
@solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui \
@metaplex-foundation/js qrcode.react
```

---

## **Program Info**

Развёрнутые программы на Solana Devnet:

* PROGRAM: `EUziGjjJJGRYDdkzKDCLfWhTSSZ35QZBDVyLgQCsQDd4`
  Обрабатывает транзакции и выпускает NFT.

---

## **Почему ChainLinker выделяется**

* Проверка навыков и опыта через реальные транзакции
* Использование Solana Devnet и Metaplex SDK
* Реальный NFT-механизм mint в демонстрации
* Живой интерфейс и работающий Phantom Wallet интегратор
* Полностью оформленный Web3-профиль с on-chain подтверждениями

---

**ChainLinker – Verified Work. Real Skills. On-Chain.**

---

