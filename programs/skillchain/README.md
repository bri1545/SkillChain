# SkillChain Anchor Program

## Status: Not Yet Deployed

This directory contains a fully implemented Solana Anchor program for on-chain skill verification and reputation, but it is **not yet compiled or deployed**.

## What's Implemented

- ✅ Complete Rust implementation of all instructions
- ✅ Account structures (SkillRegistry, UserProfile, Validator, etc.)
- ✅ Error handling
- ✅ PDA derivations
- ✅ Escrow payment distribution
- ✅ SKILL token initialization

## What's NOT Implemented

- ❌ Compiled .so binary
- ❌ Deployed program on devnet
- ❌ Generated IDL file
- ❌ TypeScript account deserialization
- ❌ Integration tests against deployed program

## Why Database Simulation?

This is a **Node.js/TypeScript project** running in Replit's environment. Compiling and deploying Solana programs requires:

1. Rust toolchain
2. Solana CLI
3. Anchor framework CLI
4. Deployment wallet with SOL

These requirements are outside the scope of this development environment, which focuses on the application layer.

## Current Approach: Hybrid Architecture

The application currently uses a **hybrid approach**:

- **Anchor Program (Rust):** Fully implemented, ready for compilation
- **API Layer:** Uses PostgreSQL to simulate on-chain data
- **Frontend:** Displays simulated data with identical UX

This allows:
- ✅ Rapid development and testing
- ✅ Complete UX demonstration
- ✅ API design validation
- ✅ Clear migration path to on-chain

## Deployment for Production

See `ANCHOR_DEPLOYMENT.md` in the root directory for complete deployment instructions.

Quick summary:
```bash
# 1. Install dependencies
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli

# 2. Build
cd programs/skillchain
anchor build

# 3. Deploy
anchor deploy --provider.cluster devnet

# 4. Generate IDL
anchor build --idl target/idl

# 5. Implement deserialization in server/anchor-client.ts
```

## Architecture Value

Even without deployment, this implementation provides:

1. **Complete Architecture:** All on-chain logic is defined
2. **Security Model:** Permission checks and validation logic
3. **Data Structures:** Clear account layouts
4. **Business Logic:** Payment distribution, reputation scoring
5. **Migration Path:** Database → Hybrid → Fully On-Chain

## Testing

Currently, the program can be tested locally:

```bash
# Start local validator
solana-test-validator

# Run Anchor tests
anchor test
```

For production deployment, see full guide in `ANCHOR_DEPLOYMENT.md`.
