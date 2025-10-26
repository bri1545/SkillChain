# SkillChain - Blockchain-Based Professional Certification Platform

## Overview
SkillChain is a Web3 application on the Solana blockchain that offers verifiable NFT certificates for skill assessment. Users pay 0.15 SOL to generate AI-powered tests, take them, and receive an NFT certificate (Junior/Middle/Senior level) stored via Metaplex. The platform rewards users based on performance, blending educational testing with blockchain for immutable proof of skills. It aims for a user experience inspired by modern Web3 and educational platforms.

## Recent Changes (October 26, 2025)

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
- **NFT Certificate Minting:** Enhanced NFT metadata with 10 attributes and dynamic image generation using DiceBear API, displaying beautifully in Solana wallets.
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