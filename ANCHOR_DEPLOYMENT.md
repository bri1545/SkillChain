# Anchor Program Deployment Guide

## Current Status

The SkillChain Anchor program is fully implemented in Rust but **not yet compiled or deployed**. The current system uses PostgreSQL database simulation to demonstrate the on-chain architecture.

## Architecture Overview

### Anchor Program Structure

```
programs/skillchain/
├── Cargo.toml              # Rust dependencies
├── Anchor.toml             # Anchor configuration
└── src/
    ├── lib.rs              # Main program entry point
    ├── state.rs            # Account structures (SkillRegistry, UserProfile, etc.)
    ├── errors.rs           # Custom error definitions
    └── instructions/       # Program instructions
        ├── initialize_registry.rs
        ├── create_user_profile.rs
        ├── add_validator.rs
        ├── mint_certificate.rs
        ├── update_skill_score.rs
        ├── distribute_rewards.rs
        └── initialize_skill_token.rs
```

### On-Chain Accounts

1. **SkillRegistry** (PDA) - Global registry
   - Authority, total validators, certificates, users
   - SKILL token mint address
   - Treasury wallet

2. **UserProfile** (PDA per user)
   - Skill score, total tests, certificates
   - Array of skill records
   - Success rate

3. **Validator** (PDA per validator)
   - Reputation score
   - Total validations
   - Active status

4. **EscrowAccount** (PDA per test payment)
   - Payment distribution (DAO, Project, Reward Pool)
   - Distribution status

## Production Deployment Steps

### Prerequisites

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

3. Install Anchor:
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

### Build and Deploy

1. **Configure Solana CLI:**
```bash
solana config set --url devnet
solana-keygen new  # Generate wallet for deployment
solana airdrop 2   # Get SOL for deployment fees
```

2. **Build the program:**
```bash
cd programs/skillchain
anchor build
```

3. **Get Program ID:**
```bash
solana address -k target/deploy/skillchain-keypair.json
```

4. **Update program ID in code:**
   - Update `declare_id!()` in `programs/skillchain/src/lib.rs`
   - Update `SKILL_CHAIN_PROGRAM_ID` in `server/anchor-client.ts`
   - Update `SKILL_CHAIN_PROGRAM_ID` in `client/src/lib/anchor/skillchain-client.ts`

5. **Deploy to devnet:**
```bash
anchor deploy --provider.cluster devnet
```

6. **Generate IDL and Types:**
```bash
anchor build --idl target/idl
# IDL file will be at target/idl/skillchain.json
```

### Backend Integration

1. **Install Anchor in Node.js project:**
```bash
npm install @coral-xyz/anchor
```

2. **Copy generated IDL:**
```bash
cp target/idl/skillchain.json server/idl/
```

3. **Implement Account Deserialization:**

Update `server/anchor-client.ts`:

```typescript
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import idl from './idl/skillchain.json';

export class SkillChainAnchorClient {
  private program: Program;

  constructor(connection: Connection, wallet: any) {
    const provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(idl as Idl, provider);
  }

  async getUserProfile(userPubkey: string): Promise<OnChainUserProfile | null> {
    const [userProfilePDA] = await this.getUserProfilePDA(userPubkey);
    
    try {
      const profile = await this.program.account.userProfile.fetch(userProfilePDA);
      
      return {
        owner: profile.owner.toBase58(),
        skillScore: profile.skillScore,
        totalTests: profile.totalTests,
        totalCertificates: profile.totalCertificates,
        totalSolEarned: profile.totalSolEarned.toNumber() / 1e9,
        successRate: profile.successRate,
        skills: profile.skills.map(s => ({
          skillId: s.skillId,
          level: getSkillLevel(s.level),
          score: s.score,
          nftMint: s.nftMint.toBase58(),
          earnedAt: new Date(s.earnedAt.toNumber() * 1000),
          validator: s.validator.toBase58(),
        })),
        createdAt: new Date(profile.createdAt.toNumber() * 1000),
      };
    } catch (error) {
      // Account doesn't exist, fall back to database simulation
      return this.getUserProfileFromDatabase(userPubkey);
    }
  }
}
```

### Initialize On-Chain Registry

After deployment, initialize the registry:

```typescript
import { SkillChainClient } from './client/src/lib/anchor/skillchain-client';

// Initialize registry (once, by authority)
await skillChainClient.initializeRegistry(authorityPubkey);

// Initialize SKILL token
await skillChainClient.initializeSkillToken();
```

### Testing

1. **Local Validator Testing:**
```bash
# Start local validator
solana-test-validator

# In another terminal
anchor test
```

2. **Devnet Testing:**
```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Test with real transactions
npm run test:integration
```

## Migration Path

### Current: Database Simulation
- APIs return data from PostgreSQL
- Demonstrates architecture and UX
- Fast development iteration

### After Deployment: Hybrid
- Check for on-chain PDA first
- Fall back to database if PDA doesn't exist
- Gradually migrate users to on-chain profiles

### Future: Fully On-Chain
- All profiles stored on-chain
- Database only for caching/indexing
- True decentralized reputation system

## Costs

- **Program Deployment:** ~2-5 SOL (one-time)
- **Registry Account:** ~0.01 SOL (one-time)
- **Per User Profile:** ~0.003 SOL
- **Per Certificate Mint:** ~0.002 SOL

## Security Considerations

1. **Authority Key Management:**
   - Store deployment keypair securely
   - Consider multi-sig for registry authority
   - Rotate keys regularly

2. **Validator Approval:**
   - Implement strict validator onboarding
   - Monitor validator reputation
   - Automatic removal for malicious behavior

3. **Payment Escrow:**
   - Verify all amounts before distribution
   - Implement time locks for large payments
   - Add emergency pause functionality

## Monitoring

After deployment, monitor:

- Program account health
- Transaction success rates
- Gas costs
- Account rent status
- Validator activity

## Support

For issues or questions:
- Solana Discord: https://discord.gg/solana
- Anchor Discord: https://discord.gg/anchorlang
- GitHub Issues: Your repository
