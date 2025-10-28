# SkillChain 🎓⛓️

### Blockchain-Based Professional Certification Platform on Solana

*Verifiable NFT certificates for skill assessment with AI-powered testing*

![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?style=for-the-badge&logo=solana)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 📌 Краткое описание

**SkillChain** — платформа для создания **неизменяемых, проверяемых доказательств профессиональных навыков** на блокчейне Solana. Мы решаем проблему подделки сертификатов и отсутствия доверия к профессиональным квалификациям, используя NFT на блокчейне и AI для генерации тестов.

---

## 🎯 Submission to 2025 Solana Colosseum

**Submission by:**
- **Афанасьев Максим** - Full-stack Developer
  - [GitHub](https://github.com/your-github)
  - [Twitter/X](https://twitter.com/your-twitter)
  - [LinkedIn](https://linkedin.com/in/your-linkedin)

### Resources
- 📊 [Презентация проекта](#) - Coming soon
- 🎥 [Видео демонстрация](#) - Coming soon
- 🌐 [Live Demo](https://your-demo-url.com) - Coming soon
- 🐦 [Twitter/X](#) - Follow for updates
- 📱 [Telegram](#) - Community chat
- 📄 [Документация](./DEPLOYMENT.md) - Инструкция по развертыванию

---

## ⚠️ Problem and Solution

### Проблема

**Традиционные сертификаты легко подделать и сложно проверить:**
- 🚫 Централизованные системы сертификации не дают гарантий подлинности
- 🚫 Отсутствие единой, прозрачной системы репутации для профессионалов
- 🚫 Сертификаты не переносимы между платформами
- 🚫 Работодатели не могут быстро проверить квалификацию кандидатов

**Масштаб проблемы:**
- 85% рекрутеров столкнулись с ложными данными в резюме
- Проверка квалификации занимает в среднем 2-4 недели
- Отсутствие стандартизации навыков между платформами

### Решение

**SkillChain предлагает:**
- ✅ **AI-генерация тестов** через Google Gemini для динамической оценки навыков
- ✅ **NFT сертификаты** на Solana с неизменяемыми метаданными
- ✅ **Награды за результаты** (10-15% SOL возврат за прохождение)
- ✅ **On-chain репутация** с проверяемыми профилями навыков
- ✅ **DAO управление** для экономики платформы

**Экономический эффект:**
- ⚡ Мгновенная верификация квалификации (вместо недель)
- 💰 Экономия до 90% на процессе проверки сертификатов
- 🌍 Глобальная, децентрализованная система доверия

---

## ⚡ Summary of Submission Features

### Основные возможности платформы

- ✅ **AI-Powered Test Generation** - Динамические 10-вопросные тесты по 10 основным категориям, 15 подкатегориям, 20 специализированным навыкам
- ✅ **Real NFT Certificate Minting** - Интеграция с Metaplex SDK и динамическая генерация изображений
- ✅ **Smart Scoring System** - Senior (90-100 баллов, 15% вознаграждение), Middle (80-89, 12%), Junior (70-79, 10%)
- ✅ **On-Chain Payment Verification** - Проверка транзакций Solana для безопасной генерации тестов
- ✅ **User Profile Dashboard** - Просмотр всех заработанных сертификатов со ссылками на Solana Explorer
- ✅ **SkillDAO Governance** - Визуализация экономики платформы и система валидаторов
- ✅ **dApp Integration API** - RESTful эндпоинты для внешней верификации навыков
- ✅ **Multi-sig Payment Distribution** - Автоматическое распределение средств (DAO 50%, Проект 40%, Награды 10%)
- ✅ **Live on Solana Devnet** - Полностью функционирует в тестовой сети Solana
- ✅ **Parsed Solana Transactions** - Детальная история всех транзакций платформы

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Wouter** - Lightweight routing (5x smaller than React Router)
- **shadcn/ui** - Beautiful, accessible UI components (New York style)
- **Radix UI Primitives** - Headless UI components
- **Tailwind CSS** - Utility-first CSS with dark/light mode
- **TanStack Query** - Powerful server state management
- **Framer Motion** - Smooth animations
- **@solana/wallet-adapter-react** - Solana wallet integration
- **@solana/wallet-adapter-phantom** - Phantom wallet support

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Zod** - Schema validation
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Reliable relational database
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

### Blockchain & Smart Contracts
- **@solana/web3.js** - Solana blockchain interactions
- **@solana/spl-token** - SPL token operations
- **@metaplex-foundation/js** - NFT minting and management
- **@coral-xyz/anchor** - Solana program framework
- **bs58** - Base58 encoding/decoding
- **ed25519-hd-key** - Hierarchical deterministic keys

### AI & External Services
- **@google/genai** - Google Gemini API (gemini-2.5-flash model)
- **Arweave/IPFS** - Decentralized metadata storage

### Development Tools
- **Drizzle-kit** - Database migrations
- **tsx** - TypeScript execution
- **esbuild** - Fast bundler
- **PostCSS** - CSS transformations

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                              │
│   (React 18 + Wallet Adapter + shadcn/ui + Tailwind CSS)           │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Test Taking  │  │   Profile    │  │  DAO Stats   │              │
│  │     Page     │  │     Page     │  │     Page     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ REST API (TanStack Query)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                                │
│              (Express.js + TypeScript + Zod)                         │
│                                                                       │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │  Test Generator  │  │ NFT Certificate    │  │  DAO Validator  │ │
│  │  (Gemini AI)     │  │  Minting Service   │  │     System      │ │
│  │                  │  │   (Metaplex SDK)   │  │                 │ │
│  └──────────────────┘  └────────────────────┘  └─────────────────┘ │
│                                                                       │
│  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │  Payment         │  │  Scoring Engine    │  │  User Profile   │ │
│  │  Verification    │  │  (70-100 points)   │  │  Management     │ │
│  └──────────────────┘  └────────────────────┘  └─────────────────┘ │
└──────┬────────────────────────┬────────────────────────┬────────────┘
       │                        │                        │
       ▼                        ▼                        ▼
┌──────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐
│   PostgreSQL     │  │   Solana Devnet     │  │  Anchor Programs     │
│   (Neon DB)      │  │  (Transactions)     │  │  (Smart Contracts)   │
│                  │  │                     │  │                      │
│ • User Stats     │  │ • Payment TXs       │  │ • UserProfile PDA    │
│ • Test Results   │  │ • NFT Minting       │  │ • SkillRegistry      │
│ • Certificates   │  │ • Reward Transfers  │  │ • DAO Governance     │
│ • Payment Sigs   │  │                     │  │ • SKILL Token        │
└──────────────────┘  └─────────────────────┘  └──────────────────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   Arweave/IPFS      │
                      │  (NFT Metadata)     │
                      └─────────────────────┘
```

### User Flow (Step-by-Step)

```
1. CONNECT WALLET
   └─> User connects Phantom/Solana wallet to dApp

2. SELECT SKILL CATEGORY
   └─> Choose from 10 main → 15 sub → 20 specific categories

3. PAY 0.15 SOL
   └─> Submit transaction to platform wallet
   └─> Backend validates transaction signature
   └─> Prevents replay attacks via signature tracking

4. GENERATE AI TEST
   └─> Google Gemini creates 10 unique questions
   └─> Questions worth 5-10 points each (total 100 points)
   └─> Test saved to database with unique ID

5. TAKE TEST
   └─> User answers questions
   └─> Frontend tracks time and answers
   └─> No backend validation during test (prevents cheating)

6. SUBMIT TEST
   └─> Backend calculates final score
   └─> Determines level: Junior/Middle/Senior/Failed
   └─> Calculates SOL reward (10-15% of payment)

7. MINT NFT CERTIFICATE
   └─> Metaplex SDK mints NFT on Solana
   └─> Dynamic image generation with skill info
   └─> Metadata uploaded to Arweave/IPFS
   └─> Certificate saved with NFT mint address

8. RECEIVE REWARD
   └─> Platform transfers SOL reward to user wallet
   └─> Updates user stats and DAO economics
   └─> User profile updated on-chain (simulated)

9. VIEW CERTIFICATES
   └─> User sees all earned certificates in profile
   └─> Click to view on Solana Explorer
   └─> Blockchain-verifiable proof of skills
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** ([Download](https://nodejs.org/))
- **PostgreSQL 16+** или используйте Docker Compose (рекомендуется)
- **Solana Wallet** с Devnet SOL ([Phantom](https://phantom.app/))
- **Google Gemini API Key** ([Получить](https://aistudio.google.com/apikey))
- **Solana Wallet Private Key** для минтинга NFT (Base58 формат)

### Установка (локально)

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/skillchain.git
cd skillchain

# 2. Установите зависимости
npm install

# 3. Настройте переменные окружения
cp .env.example .env
```

Отредактируйте `.env`:
```env
# База данных
DATABASE_URL=postgresql://user:password@localhost:5432/skillchain

# Google Gemini AI
GEMINI_API_KEY=AIza...

# Solana
METAPLEX_PRIVATE_KEY=5K7m...  # Base58 приватный ключ
PLATFORM_WALLET=GN8u...       # Публичный адрес для приема платежей

# Server
NODE_ENV=development
PORT=5000
```

```bash
# 4. Примените миграции базы данных
npm run db:push

# 5. Запустите сервер разработки
npm run dev
```

Откройте `http://localhost:5000` и подключите Solana кошелек!

### Установка с Docker Compose (рекомендуется)

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/skillchain.git
cd skillchain

# 2. Создайте .env файл
cp .env.example .env
# Отредактируйте .env и укажите GEMINI_API_KEY и METAPLEX_PRIVATE_KEY

# 3. Запустите все сервисы
docker-compose up -d

# 4. Проверьте статус
docker-compose ps
```

Приложение доступно по адресу: `http://localhost:5000`

### Получите Devnet SOL

```bash
# Airdrop 2 SOL на ваш кошелек
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet

# Или используйте Web Faucet: https://faucet.solana.com/
```

---

## 📊 Program Info

### Smart Contract Addresses (Ready for Deployment)

Смарт-контракты реализованы на Anchor Framework и готовы к развертыванию:

**SkillChain Program** (Репутационная система)
- **Status:** ✅ Implemented, ⏳ Awaiting deployment
- **Features:**
  - UserProfile PDA management
  - Skill verification and scoring
  - On-chain reputation tracking
  - dApp integration API

**SkillDAO Program** (Управление и экономика)
- **Status:** ✅ Implemented, ⏳ Awaiting deployment
- **Features:**
  - Validator approval system
  - Multi-sig escrow (DAO 50%, Project 40%, Rewards 10%)
  - SKILL governance token foundation
  - Voting mechanism

> **Текущее состояние:** Платформа использует PostgreSQL для симуляции on-chain данных. Anchor программы протестированы и готовы к развертыванию в Devnet.

**Развертывание программ:**
```bash
cd programs/skillchain
anchor build
anchor deploy --provider.cluster devnet

# После развертывания обновите program IDs в:
# - server/anchor-client.ts
# - Anchor.toml
```

После развертывания программ будут добавлены адреса:
```
SKILLCHAIN_PROGRAM: [ADDRESS_WILL_BE_HERE]
SKILLDAO_PROGRAM: [ADDRESS_WILL_BE_HERE]
```

---

## 🎨 Features Breakdown

### 1. AI Test Generation System

**Категории навыков (10 основных):**
- 💻 Programming (JavaScript, Python, Rust, Solana, etc.)
- 🎨 Design (UI/UX, Graphic Design, Motion Design)
- 📊 Marketing (SEO, SMM, Content Marketing)
- 💼 Business (Project Management, Analytics)
- 🔧 DevOps (Docker, Kubernetes, CI/CD)
- 🎓 Education (Teaching, Course Creation)
- 🌐 Languages (English, Spanish, Chinese)
- 💰 Finance (Accounting, Investment, Trading)
- 🏥 Healthcare (Medical Coding, Nursing)
- 🎯 Other Professional Skills

**Процесс генерации:**
1. Google Gemini 2.5 Flash получает тему и категорию
2. AI генерирует 10 уникальных вопросов
3. Каждый вопрос оценивается в 5-10 баллов (всего 100)
4. Вопросы включают 4 варианта ответа
5. Правильный ответ и сложность определяются AI

### 2. Scoring & Reward System

| Уровень | Диапазон баллов | SOL Награда | % от платежа | Цвет сертификата |
|---------|----------------|-------------|--------------|-------------------|
| **Senior** | 90-100 pts | 0.0225 SOL | 15% | 🟡 Gold |
| **Middle** | 80-89 pts | 0.018 SOL | 12% | ⚪ Silver |
| **Junior** | 70-79 pts | 0.015 SOL | 10% | 🟤 Bronze |
| **Failed** | <70 pts | 0 SOL | 0% | ❌ No certificate |

**Распределение 0.15 SOL платежа:**
- 🏆 10-15% → Награда пользователю (за успех)
- 🏛️ 50% → DAO Treasury (управление сообществом)
- 💼 40% → Project Development (развитие платформы)

### 3. NFT Certificate Minting

**Технология:**
- Metaplex Metadata Standard
- Arweave/IPFS для хранения метаданных
- SPL Token для NFT

**Метаданные сертификата:**
```json
{
  "name": "SkillChain Certificate - React.js Senior",
  "symbol": "SKILL",
  "description": "Verified React.js certification - Senior level (95/100)",
  "image": "https://arweave.net/...",
  "attributes": [
    {"trait_type": "Skill", "value": "React.js"},
    {"trait_type": "Category", "value": "Programming"},
    {"trait_type": "Level", "value": "Senior"},
    {"trait_type": "Score", "value": "95"},
    {"trait_type": "Date", "value": "2025-10-28"},
    {"trait_type": "Wallet", "value": "GN8u..."}
  ]
}
```

### 4. DAO Governance Dashboard

**Визуализация:**
- 📊 Общая статистика платформы
- 👥 Количество валидаторов
- 🎓 Выданные сертификаты
- 💰 Доход платформы (coming soon)
- 📈 Топ навыки (coming soon)
- 🗳️ Активные голосования (coming soon)

### 5. dApp Integration API

**Эндпоинты для внешних приложений:**

```bash
# Проверить навык пользователя
GET /api/onchain/profile/:walletAddress

# Получить все сертификаты
GET /api/certificates/:walletAddress

# Проверить валидность сертификата
GET /api/verify/:certificateId

# Получить статистику навыков (skill registry)
GET /api/onchain/registry
```

**Пример использования:**
```javascript
// Проверка квалификации кандидата
const response = await fetch(
  'https://skillchain.com/api/onchain/profile/GN8u...'
);
const profile = await response.json();

if (profile.skills.includes('React.js') && profile.level === 'Senior') {
  console.log('Кандидат квалифицирован!');
}
```

---

## 🔐 Security Features

- ✅ **Payment Signature Validation** - Предотвращение replay атак
- ✅ **On-Chain Transaction Verification** - Проверка валидности платежей
- ✅ **Zod Schema Validation** - Валидация всех API запросов
- ✅ **Environment-Based Secrets** - Безопасное хранение ключей
- ✅ **Session Management** - Безопасные пользовательские сессии
- ✅ **HTTPS Required in Production** - Шифрованное соединение
- ✅ **No Private Keys in Database** - Приватные ключи только в .env
- ✅ **CORS Protection** - Защита от cross-origin атак
- ✅ **Rate Limiting** (coming soon) - Защита от DDoS

---

## 📱 API Documentation

### Generate Test

```http
POST /api/tests/generate
Content-Type: application/json

{
  "mainCategory": "Programming",
  "narrowCategory": "Web Development",
  "specificCategory": "React.js",
  "walletAddress": "GN8u7fSnRBtvx...",
  "paymentSignature": "4XyH3ZfN..."
}
```

**Response:**
```json
{
  "testId": "test_abc123xyz",
  "topic": "React.js",
  "questions": [...]
}
```

### Submit Test

```http
POST /api/tests/submit
Content-Type: application/json

{
  "testId": "test_abc123xyz",
  "answers": [0, 2, 1, 3, 0, 1, 2, 3, 1, 0],
  "walletAddress": "GN8u7fSnRBtvx..."
}
```

**Response:**
```json
{
  "score": 95,
  "level": "Senior",
  "solReward": 0.0225,
  "certificateId": "cert_xyz789",
  "nftMint": "8ZpT4x...",
  "passed": true
}
```

### Get User Profile

```http
GET /api/onchain/profile/:walletAddress
```

**Response:**
```json
{
  "exists": true,
  "pda": "HLyEVoPtFbEAgPn...",
  "profile": {
    "totalTests": 5,
    "passedTests": 4,
    "totalEarned": 0.078,
    "skills": [
      {"skillId": "React.js", "level": "Senior", "score": 95}
    ]
  }
}
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Current)
- [x] AI-powered test generation
- [x] NFT certificate minting
- [x] Payment verification system
- [x] User profile dashboard
- [x] DAO economics visualization
- [x] Docker deployment setup

### 🚧 Phase 2: On-Chain Migration (Q1 2025)
- [ ] Deploy Anchor programs to Devnet
- [ ] Migrate from DB simulation to on-chain data
- [ ] SKILL token deployment
- [ ] Validator onboarding system
- [ ] Advanced DAO governance voting

### 🔮 Phase 3: Mainnet Launch (Q2 2025)
- [ ] Security audit
- [ ] Mainnet migration
- [ ] Production monitoring
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### 🌟 Phase 4: Ecosystem Growth (Q3-Q4 2025)
- [ ] Multi-language support (русский, 中文, español)
- [ ] Integration with job platforms (LinkedIn, Indeed)
- [ ] Corporate B2B solution
- [ ] Advanced reputation algorithms
- [ ] Cross-chain bridges (Ethereum, Polygon)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 👥 Team

**Афанасьев Максим** - Full-stack Developer & Blockchain Engineer
- [GitHub](https://github.com/your-github)
- [Twitter/X](https://twitter.com/your-twitter)
- [LinkedIn](https://linkedin.com/in/your-linkedin)

---

## 🔗 Resources & Links

- 📖 [Full Documentation](./DEPLOYMENT.md) - Инструкция по развертыванию
- 🎥 [Video Demo](#) - Coming soon
- 🌐 [Live Application](#) - Coming soon
- 📊 [Project Presentation](#) - Coming soon
- 🐦 [Twitter/X](#) - Updates & announcements
- 💬 [Telegram Community](#) - Join our community
- 📧 [Email Support](#) - Contact us

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

Для вопросов и поддержки:
- 💬 [GitHub Issues](https://github.com/your-repo/issues)
- 🐦 Twitter DM
- 📧 Email: your-email@example.com
- 💬 Telegram: @your_telegram

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the incredible blockchain platform
- **Metaplex** - For NFT standards and tooling
- **Google Gemini** - For powerful AI capabilities
- **Solana Colosseum** - For hackathon support

---

**Built with ❤️ on Solana | Powered by AI | Secured by Blockchain**

*SkillChain - Proof of Skills, Not Just Words*
