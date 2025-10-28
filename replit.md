# SkillChain - Blockchain-Based Professional Certification Platform

## Overview
SkillChain is a Web3 application on the Solana blockchain that provides verifiable NFT certificates for skill assessment. Users can generate AI-powered tests for 0.15 SOL, take them, and receive an NFT certificate (Junior/Middle/Senior level) stored via Metaplex. The platform rewards users based on performance, blending educational testing with blockchain for immutable proof of skills. It aims to create a decentralized, on-chain reputation system for professional skills, enabling dApp integrations and a Skill-to-Earn economy through a DAO governance model.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React 18 with TypeScript, Vite, and Wouter. UI is built with `shadcn/ui` (New York style) using Radix UI primitives and Tailwind CSS, supporting light/dark mode. State management uses TanStack Query for server state and local React state. Solana integration utilizes `@solana/wallet-adapter-react` and `@solana/web3.js` for Devnet interactions.

### Backend Architecture
The backend is built with Node.js and Express.js in TypeScript, providing RESTful API endpoints. Zod schemas (`shared/schema.ts`) are used for request/response validation. Payment verification occurs via on-chain transaction validation. AI integration uses Google Gemini (`gemini-2.5-flash`) for structured JSON test question generation. NFT features include Metaplex SDK for minting certificates with enhanced metadata. The backend integrates with the Anchor program for on-chain reputation, skill verification, and DAO statistics.

### Data Storage
The application uses PostgreSQL with Drizzle ORM. The database schema defines tables for tests, test results, certificates, and user statistics. Payment signatures are tracked to prevent replay attacks.

### Key Features and Implementations
- **AI-Powered Test Generation:** Dynamic, multi-level category selection (10 main, 15 sub, 20 specific skills) for test generation using Google Gemini. Tests consist of 10 questions.
- **Scoring and Rewards:** A scoring system awards Senior (90-100 pts, 15% SOL reward), Middle (80-89 pts, 12% SOL reward), and Junior (70-79 pts, 10% SOL reward) levels.
- **Real NFT Certificate Minting:** NFTs are minted on Solana Devnet using Metaplex SDK with dynamic image generation and enhanced metadata.
- **On-Chain Reputation System (Architectural Foundation):** Anchor program implementation designed for UserProfile PDAs, SkillRegistry, and on-chain skill scores. Currently functional with database simulation, ready for on-chain deployment.
- **SkillDAO Governance (Architectural Foundation):** Designed for a validator-based approval system, escrow payment distribution (DAO 50%, Project 40%, Rewards 10%), and a SKILL token foundation. Smart contract implemented, awaiting deployment.
- **dApp Integration API:** RESTful endpoints for external applications to verify user skills, transitioning from database simulation to on-chain data post-deployment.
- **SkillPool Dashboard:** A prototype page visualizing platform economics, including revenue streams and reward distribution.
- **Payment Verification:** On-chain Solana transaction verification for secure test generation.

## External Dependencies

### Blockchain Services
- **Solana Devnet:** RPC endpoints.
- **Metaplex Protocol:** For NFT minting and metadata standards.

### AI Services
- **Google Gemini API:** `gemini-2.5-flash` model for AI test generation.

### Database
- **PostgreSQL:** Primary data store, managed by Drizzle ORM.
- **Neon Database:** Serverless driver for PostgreSQL.

### Third-Party Libraries
- **@coral-xyz/anchor:** Solana program development and client integration.
- **@solana/wallet-adapter-react, @solana/wallet-adapter-phantom, @solana/web3.js:** Solana wallet integration and blockchain interactions.
- **@solana/spl-token:** SPL token operations.
- **Radix UI primitives:** Accessible UI components.
- **bs58:** Base58 encoding/decoding.
- **nanoid:** Unique ID generation.
- **class-variance-authority, tailwind-merge:** Styling utilities.
- **Zod:** Schema validation.