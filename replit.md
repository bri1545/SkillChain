# SkillChain - Blockchain-Based Professional Certification Platform

## Overview
SkillChain is a Web3 application on the Solana blockchain that offers verifiable NFT certificates for skill assessment. Users pay 0.15 SOL to generate AI-powered tests, take them, and receive an NFT certificate (Junior/Middle/Senior level) stored via Metaplex. The platform rewards users based on performance, blending educational testing with blockchain for immutable proof of skills. It aims for a user experience inspired by modern Web3 and educational platforms.

## Recent Changes (October 26, 2025)

### Real NFT Minting Enabled
**NFT certificates are now real and stored on Solana blockchain:**
1. **METAPLEX_PRIVATE_KEY** - Configured minting wallet (6HedLGSwpz7oqvYqFQ3kiG1pKregGtdjXsQrt21NLsUe)
2. **Real blockchain storage** - NFTs are minted on Solana Devnet and appear in user wallets
3. **Wallet generation script** - Added `npm run generate-wallet` for easy keypair creation
4. **Impact:** Users now receive genuine NFT certificates visible in Phantom and other Solana wallets

### SkillPool Feature Page Added
**New page displaying platform's reward pool mechanics (prototype/mockup):**
1. **Revenue streams** - Shows income from failed tests (45%), ads (30%), partnerships (15%), other (10%)
2. **Reward distribution** - Displays payout percentages: Senior 15%, Middle 12%, Junior 10%
3. **Pool statistics** - Mock data showing balance, monthly revenue/rewards, active users
4. **Navigation integration** - Added to header with Coins icon
5. **Impact:** Users can see how the platform economics work (currently demo data)

### Docker Support Added
**Added complete Docker deployment configuration:**
1. **Dockerfile** - Multi-stage build for production-ready deployment
2. **docker-compose.yml** - One-command setup with PostgreSQL database included
3. **.dockerignore** - Optimized build context
4. **.env.example** - Template for environment variables
5. **DEPLOYMENT.md** - Complete deployment instructions in Russian and Docker commands
6. **Impact:** Application can now be deployed on any machine with Docker, not just Replit

### Database Error Handling Improvements
**Fixed Multiple Critical Bugs:**
1. **"Invalid time value" Error** - Added comprehensive date validation with try/catch blocks for database timestamp fields (createdAt, earnedAt)
2. **"Cannot read properties of null (reading 'map')" Error** - Wrapped all database queries in try/catch blocks to handle null results from Neon HTTP driver
3. **Race Conditions** - Added error handling for INSERT operations when creating new user stats records
4. **Files Changed:** `server/storage.ts` - Enhanced `getTest()`, `getUserStats()` methods with robust error handling
5. **Impact:** Eliminated all database-related crashes, app now handles edge cases gracefully

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React 18 with TypeScript, Vite for bundling, and Wouter for routing. UI is built with `shadcn/ui` (New York style) using Radix UI primitives and Tailwind CSS for styling, supporting light/dark mode. State management relies on TanStack Query for server state and local React state for UI. Solana integration uses `@solana/wallet-adapter-react` and `@solana/web3.js` for Devnet interactions. Key design patterns include component composition, custom hooks, and path aliases.

### Backend Architecture
The backend is built with Node.js and Express.js, entirely in TypeScript. It provides RESTful API endpoints, utilizing Zod schemas (`shared/schema.ts`) for shared request/response validation. Payment verification occurs via on-chain transaction validation, and replay attacks are prevented using signature tracking. AI integration uses Google Gemini (gemini-2.5-flash) for generating structured JSON test questions. NFT features include Metaplex SDK integration for minting certificates with enhanced metadata, serving as immutable proof of skill.

### Data Storage
The application uses PostgreSQL with Drizzle ORM for persistent storage. The database schema defines tables for tests, test results, certificates, and user statistics. Payment signatures are tracked to prevent replay attacks. Data models include `Test`, `Question`, `TestResult`, `Certificate`, and `UserStats`.

### Key Features and Implementations
- **AI-Powered Test Generation:** Dynamic, multi-level category selection (10 main, 15 sub, 20 specific skills) for test generation using Gemini AI. Tests consist of 10 questions, each worth 10 points (total 100).
- **Scoring and Rewards:** A new scoring system awards Senior (90-100 pts, 15% SOL reward), Middle (80-89 pts, 12% SOL reward), and Junior (70-79 pts, 10% SOL reward) levels. Scores below 70 fail.
- **Real NFT Certificate Minting:** NFTs are minted on Solana Devnet blockchain using Metaplex SDK with real keypair. Enhanced metadata with 10 attributes and dynamic image generation using DiceBear API. NFTs appear in users' Phantom wallets.
- **SkillPool Dashboard:** Prototype page showing platform economics - revenue streams (failed tests, ads, partnerships) and reward distribution mechanisms. Currently displays demo data.
- **Payment Verification:** On-chain payment verification using Solana transactions ensures secure test generation and prevents backend exploitation.
- **Robust Error Handling:** Comprehensive date validation and retry logic for fetching tests from the database.

## External Dependencies

### Blockchain Services
- **Solana Devnet:** RPC endpoints for development and testing.
- **Metaplex Protocol:** For NFT minting and metadata standards.

### AI Services
- **Google Gemini API:** `gemini-2.5-flash` model for generating AI test questions. Requires `GEMINI_API_KEY`.

### Database
- **PostgreSQL:** Primary data store, managed by Drizzle ORM.
- **Neon Database:** Serverless driver for PostgreSQL.

### Third-Party Libraries
- **@solana/wallet-adapter-react, @solana/wallet-adapter-phantom, @solana/web3.js:** For Solana wallet integration and blockchain interactions.
- **Radix UI primitives:** For accessible UI components.
- **bs58:** For Base58 encoding/decoding.
- **nanoid:** For generating unique IDs.
- **class-variance-authority, tailwind-merge:** For styling utilities.
- **Zod:** For schema validation.

### Development Tools
- **Vite:** Build tool and development server.
- **esbuild:** For server-side bundling.
- **TypeScript:** For type checking.

## Deployment

### Docker Deployment
The application includes complete Docker support for deployment on any machine. See `DEPLOYMENT.md` for detailed instructions.

**Quick start with Docker Compose:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY and DB_PASSWORD

# Start application with database
docker-compose up -d

# Application will be available at http://localhost:5000
```

**Files:**
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Complete stack with PostgreSQL
- `.env.example` - Environment variables template
- `DEPLOYMENT.md` - Full deployment guide

### Replit Deployment
The application is configured to run in Replit with the following setup:
- **Workflow:** `npm run dev` on port 5000
- **Database:** Replit PostgreSQL (auto-provisioned)
- **Secrets:** 
  - `GEMINI_API_KEY` - Google Gemini API for test generation
  - `METAPLEX_PRIVATE_KEY` - Solana wallet for NFT minting (Base58 format)
- **Helper Scripts:**
  - `npm run generate-wallet` - Generate new Solana keypair for NFT minting