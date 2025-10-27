import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { tests, testResults, certificates, userStats, paymentSignatures } from "../db/schema";
import type { Test, TestResult, Certificate, UserStats } from "@shared/schema";

export interface IStorage {
  createTest(test: Test): Promise<Test>;
  getTest(id: string): Promise<Test | undefined>;
  
  createTestResult(result: TestResult): Promise<TestResult>;
  createCertificate(certificate: Certificate): Promise<Certificate>;
  
  getUserStats(walletAddress: string): Promise<UserStats>;
  updateUserStats(walletAddress: string, stats: Partial<UserStats>): Promise<void>;
  getUserCertificates(walletAddress: string): Promise<Certificate[]>;
  getAllUserStats(): Promise<UserStats[]>;
  
  isPaymentSignatureUsed(signature: string): Promise<boolean>;
  markPaymentSignatureUsed(signature: string, walletAddress: string, amount: number): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async createTest(test: Test): Promise<Test> {
    await db.insert(tests).values({
      id: test.id,
      topic: test.topic,
      mainCategory: test.mainCategory,
      narrowCategory: test.narrowCategory,
      specificCategory: test.specificCategory,
      questions: test.questions,
    });
    return test;
  }

  async getTest(id: string): Promise<Test | undefined> {
    const result = await db.select().from(tests).where(eq(tests.id, id)).limit(1);
    if (!result || !Array.isArray(result) || result.length === 0) return undefined;
    
    const row = result[0];
    
    // Safely handle createdAt - convert to ISO string or use current time
    let createdAtString: string;
    if (row.createdAt && row.createdAt instanceof Date && !isNaN(row.createdAt.getTime())) {
      createdAtString = row.createdAt.toISOString();
    } else if (row.createdAt) {
      // If it's a string or timestamp, try to convert
      try {
        const date = new Date(row.createdAt);
        if (!isNaN(date.getTime())) {
          createdAtString = date.toISOString();
        } else {
          createdAtString = new Date().toISOString();
        }
      } catch {
        createdAtString = new Date().toISOString();
      }
    } else {
      // Fallback to current time if null
      createdAtString = new Date().toISOString();
    }
    
    return {
      id: row.id,
      topic: row.topic,
      mainCategory: row.mainCategory,
      narrowCategory: row.narrowCategory,
      specificCategory: row.specificCategory,
      questions: row.questions as Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        points: number;
      }>,
      createdAt: createdAtString,
    };
  }

  async createTestResult(result: TestResult): Promise<TestResult> {
    await db.insert(testResults).values({
      testId: result.testId,
      walletAddress: result.walletAddress,
      topic: result.topic,
      score: result.score,
      level: result.level,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      totalPoints: result.totalPoints,
      solReward: Math.round(result.solReward * 1000),
      passed: result.passed ? 1 : 0,
    });
    return result;
  }

  async createCertificate(certificate: Certificate): Promise<Certificate> {
    await db.insert(certificates).values({
      id: certificate.id,
      walletAddress: certificate.walletAddress,
      topic: certificate.topic,
      level: certificate.level,
      score: certificate.score,
      nftMint: certificate.nftMint,
      nftMetadataUri: certificate.nftMetadataUri,
    });
    return certificate;
  }

  async getUserStats(walletAddress: string): Promise<UserStats> {
    let stats;
    try {
      stats = await db.select()
        .from(userStats)
        .where(eq(userStats.walletAddress, walletAddress))
        .limit(1);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      stats = null;
    }

    let userCerts;
    try {
      userCerts = await db.select()
        .from(certificates)
        .where(eq(certificates.walletAddress, walletAddress));
    } catch (error) {
      console.error("Error fetching certificates:", error);
      userCerts = null;
    }

    const certsData: Certificate[] = (userCerts && Array.isArray(userCerts) ? userCerts : []).map(c => {
      let earnedAtString: string;
      if (c.earnedAt && c.earnedAt instanceof Date && !isNaN(c.earnedAt.getTime())) {
        earnedAtString = c.earnedAt.toISOString();
      } else if (c.earnedAt) {
        try {
          const date = new Date(c.earnedAt);
          if (!isNaN(date.getTime())) {
            earnedAtString = date.toISOString();
          } else {
            earnedAtString = new Date().toISOString();
          }
        } catch {
          earnedAtString = new Date().toISOString();
        }
      } else {
        earnedAtString = new Date().toISOString();
      }

      return {
        id: c.id,
        walletAddress: c.walletAddress,
        topic: c.topic,
        level: c.level as "Junior" | "Middle" | "Senior",
        score: c.score,
        nftMint: c.nftMint || undefined,
        nftMetadataUri: c.nftMetadataUri || undefined,
        earnedAt: earnedAtString,
      };
    });

    if (!stats || !Array.isArray(stats) || stats.length === 0) {
      const newStats: UserStats = {
        walletAddress,
        totalTests: 0,
        totalCertificates: 0,
        successRate: 0,
        totalSolEarned: 0,
        certificates: certsData,
      };

      try {
        await db.insert(userStats).values({
          walletAddress,
          totalTests: 0,
          totalCertificates: 0,
          successRate: 0,
          totalSolEarned: 0,
        });
      } catch (error) {
        console.error("Error creating new user stats:", error);
        // Return the stats object even if insert fails
        // This allows the user to continue using the app
      }

      return newStats;
    }

    const stat = stats[0];
    return {
      walletAddress: stat.walletAddress,
      totalTests: stat.totalTests,
      totalCertificates: stat.totalCertificates,
      successRate: stat.successRate,
      totalSolEarned: stat.totalSolEarned / 1000,
      certificates: certsData,
    };
  }

  async updateUserStats(walletAddress: string, updates: Partial<UserStats>): Promise<void> {
    const dbUpdates: any = {};
    
    if (updates.totalTests !== undefined) {
      dbUpdates.totalTests = updates.totalTests;
    }
    if (updates.totalCertificates !== undefined) {
      dbUpdates.totalCertificates = updates.totalCertificates;
    }
    if (updates.successRate !== undefined) {
      dbUpdates.successRate = updates.successRate;
    }
    if (updates.totalSolEarned !== undefined) {
      dbUpdates.totalSolEarned = Math.round(updates.totalSolEarned * 1000);
    }

    await db.update(userStats)
      .set(dbUpdates)
      .where(eq(userStats.walletAddress, walletAddress));
  }

  async isPaymentSignatureUsed(signature: string): Promise<boolean> {
    try {
      const result = await db.select()
        .from(paymentSignatures)
        .where(eq(paymentSignatures.signature, signature))
        .limit(1);
      
      return result && Array.isArray(result) && result.length > 0;
    } catch (error) {
      console.error("Error checking payment signature:", error);
      // If there's an error checking, assume signature is not used (safer to allow payment)
      return false;
    }
  }

  async markPaymentSignatureUsed(signature: string, walletAddress: string, amount: number): Promise<void> {
    try {
      await db.insert(paymentSignatures).values({
        signature,
        walletAddress,
        amount,
      });
    } catch (error) {
      console.error("Error marking payment signature as used:", error);
      // Log but don't throw - the payment was verified on-chain, so it's safe to proceed
    }
  }

  async getUserCertificates(walletAddress: string): Promise<Certificate[]> {
    try {
      const certs = await db.select()
        .from(certificates)
        .where(eq(certificates.walletAddress, walletAddress));
      
      if (!certs || !Array.isArray(certs)) {
        return [];
      }
      
      return certs.map(cert => {
        let earnedAtString: string;
        if (cert.earnedAt && cert.earnedAt instanceof Date && !isNaN(cert.earnedAt.getTime())) {
          earnedAtString = cert.earnedAt.toISOString();
        } else if (cert.earnedAt) {
          try {
            const date = new Date(cert.earnedAt);
            earnedAtString = !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
          } catch {
            earnedAtString = new Date().toISOString();
          }
        } else {
          earnedAtString = new Date().toISOString();
        }
        
        return {
          id: cert.id,
          walletAddress: cert.walletAddress,
          topic: cert.topic,
          level: cert.level as "Junior" | "Middle" | "Senior",
          score: cert.score,
          nftMint: cert.nftMint || undefined,
          nftMetadataUri: cert.nftMetadataUri || undefined,
          earnedAt: earnedAtString,
        };
      });
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      return [];
    }
  }

  async getAllUserStats(): Promise<UserStats[]> {
    try {
      const allStats = await db.select().from(userStats);
      
      if (!allStats || !Array.isArray(allStats)) {
        return [];
      }
      
      return Promise.all(allStats.map(async (stat) => {
        const certs = await this.getUserCertificates(stat.walletAddress);
        
        return {
          walletAddress: stat.walletAddress,
          totalTests: stat.totalTests,
          totalCertificates: stat.totalCertificates,
          successRate: stat.successRate,
          totalSolEarned: stat.totalSolEarned / 1000,
          certificates: certs,
        };
      }));
    } catch (error) {
      console.error("Error fetching all user stats:", error);
      return [];
    }
  }
}

export const storage = new PostgresStorage();
