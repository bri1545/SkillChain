import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import bs58 from 'bs58';

export const SKILL_CHAIN_PROGRAM_ID = new PublicKey('SkiLLcHaiNPRoGraM11111111111111111111111111');

export interface OnChainUserProfile {
  owner: string;
  skillScore: number;
  totalTests: number;
  totalCertificates: number;
  totalSolEarned: number;
  successRate: number;
  skills: OnChainSkillRecord[];
  createdAt: Date;
}

export interface OnChainSkillRecord {
  skillId: string;
  level: 'Junior' | 'Middle' | 'Senior';
  score: number;
  nftMint: string;
  earnedAt: Date;
  validator: string;
}

export interface SkillRegistryInfo {
  authority: string;
  totalValidators: number;
  totalCertificates: number;
  totalUsers: number;
  skillTokenMint: string;
  treasury: string;
}

/**
 * SkillChain Anchor Client
 * 
 * CURRENT STATUS: Proof-of-Concept Implementation
 * 
 * This client currently uses database simulation for on-chain data because:
 * 1. The Anchor program needs to be compiled (requires Rust toolchain)
 * 2. IDL must be generated from the compiled program
 * 3. Program must be deployed to Solana devnet
 * 4. Proper Anchor account deserialization must be implemented using the IDL
 * 
 * PRODUCTION DEPLOYMENT STEPS:
 * 1. Install Rust and Anchor CLI on deployment machine
 * 2. Compile: `cd programs/skillchain && anchor build`
 * 3. Deploy: `anchor deploy --provider.cluster devnet`
 * 4. Generate TypeScript types: `anchor build --idl target/idl`
 * 5. Implement proper account deserialization in this file
 * 6. Update getUserProfile() and getSkillRegistry() to decode real on-chain data
 * 
 * Currently falls back to PostgreSQL simulation when PDAs don't exist on-chain.
 */
export class SkillChainAnchorClient {
  private connection: Connection;
  private programKeypair: Keypair | null = null;

  constructor(rpcUrl: string = 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    if (process.env.METAPLEX_PRIVATE_KEY) {
      try {
        const secretKey = bs58.decode(process.env.METAPLEX_PRIVATE_KEY);
        this.programKeypair = Keypair.fromSecretKey(secretKey);
      } catch (error) {
        console.warn('Failed to load program keypair:', error);
      }
    }
  }

  async getSkillRegistryPDA(): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('skill_registry')],
      SKILL_CHAIN_PROGRAM_ID
    );
  }

  async getUserProfilePDA(userPubkey: string): Promise<[PublicKey, number]> {
    const userKey = new PublicKey(userPubkey);
    return PublicKey.findProgramAddressSync(
      [Buffer.from('user_profile'), userKey.toBuffer()],
      SKILL_CHAIN_PROGRAM_ID
    );
  }

  async getValidatorPDA(validatorPubkey: string): Promise<[PublicKey, number]> {
    const validatorKey = new PublicKey(validatorPubkey);
    return PublicKey.findProgramAddressSync(
      [Buffer.from('validator'), validatorKey.toBuffer()],
      SKILL_CHAIN_PROGRAM_ID
    );
  }

  async getUserProfile(userPubkey: string): Promise<OnChainUserProfile | null> {
    try {
      const [userProfilePDA] = await this.getUserProfilePDA(userPubkey);
      const accountInfo = await this.connection.getAccountInfo(userProfilePDA);
      
      if (!accountInfo || !accountInfo.data) {
        console.log(`No on-chain profile found for ${userPubkey}, simulating from database`);
        
        // TODO: Replace with actual Anchor account deserialization when program is deployed
        // This is a simulation using PostgreSQL data for demonstration
        const { storage } = await import('./storage');
        const stats = await storage.getUserStats(userPubkey);
        const certificates = await storage.getUserCertificates(userPubkey);
        
        const skills: OnChainSkillRecord[] = certificates.map(cert => ({
          skillId: cert.topic,
          level: cert.level,
          score: cert.score,
          nftMint: cert.nftMint || 'MOCK',
          earnedAt: new Date(cert.earnedAt),
          validator: this.programKeypair?.publicKey.toBase58() || 'System',
        }));
        
        return {
          owner: userPubkey,
          skillScore: stats.totalCertificates * 100,
          totalTests: stats.totalTests,
          totalCertificates: stats.totalCertificates,
          totalSolEarned: stats.totalSolEarned,
          successRate: stats.successRate,
          skills,
          createdAt: new Date(),
        };
      }

      // TODO: Implement proper Anchor account deserialization here
      // Example: const decoded = UserProfileLayout.decode(accountInfo.data);
      // For now, return placeholder until IDL is generated and program is deployed
      console.warn('Found on-chain account but deserialization not implemented yet');
      return {
        owner: userPubkey,
        skillScore: 0,
        totalTests: 0,
        totalCertificates: 0,
        totalSolEarned: 0,
        successRate: 0,
        skills: [],
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error fetching user profile from chain:', error);
      return null;
    }
  }

  async getSkillRegistry(): Promise<SkillRegistryInfo | null> {
    try {
      const [registryPDA] = await this.getSkillRegistryPDA();
      const accountInfo = await this.connection.getAccountInfo(registryPDA);
      
      if (!accountInfo || !accountInfo.data) {
        console.log('No skill registry found on-chain, simulating from database');
        
        const { storage } = await import('./storage');
        const allStats = await storage.getAllUserStats();
        const totalCerts = allStats.reduce((sum, s) => sum + s.totalCertificates, 0);
        
        return {
          authority: this.programKeypair?.publicKey.toBase58() || 'System',
          totalValidators: 1,
          totalCertificates: totalCerts,
          totalUsers: allStats.length,
          skillTokenMint: 'SKiLLToKeN1111111111111111111111111111111',
          treasury: process.env.TREASURY_WALLET || '9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g',
        };
      }

      return {
        authority: '',
        totalValidators: 0,
        totalCertificates: 0,
        totalUsers: 0,
        skillTokenMint: '',
        treasury: '',
      };
    } catch (error) {
      console.error('Error fetching skill registry:', error);
      return null;
    }
  }

  async checkProfileExists(userPubkey: string): Promise<boolean> {
    try {
      const [userProfilePDA] = await this.getUserProfilePDA(userPubkey);
      const accountInfo = await this.connection.getAccountInfo(userProfilePDA);
      
      if (accountInfo !== null) {
        return true;
      }
      
      const { storage } = await import('./storage');
      const stats = await storage.getUserStats(userPubkey);
      return stats.totalCertificates > 0;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }

  async estimateSkillScore(skills: OnChainSkillRecord[]): Promise<number> {
    let totalScore = 0;
    
    for (const skill of skills) {
      const levelMultiplier = skill.level === 'Senior' ? 3 : skill.level === 'Middle' ? 2 : 1;
      totalScore += skill.score * levelMultiplier;
    }
    
    return totalScore;
  }

  getSkillRegistryAddress(): string {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('skill_registry')],
      SKILL_CHAIN_PROGRAM_ID
    );
    return pda.toBase58();
  }

  getUserProfileAddress(userPubkey: string): string {
    const userKey = new PublicKey(userPubkey);
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user_profile'), userKey.toBuffer()],
      SKILL_CHAIN_PROGRAM_ID
    );
    return pda.toBase58();
  }
}

export const anchorClient = new SkillChainAnchorClient();
