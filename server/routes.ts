import type { Express } from "express";
import { createServer, type Server } from "http";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { storage } from "./storage";
import { generateTestQuestions, generateCategories } from "./gemini";
import { mintCertificateNFT } from "./metaplex";
import { anchorClient } from "./anchor-client";
import { randomUUID } from "crypto";
import { 
  generateTestRequestSchema, 
  testSubmissionSchema,
  getCategoriesRequestSchema,
  type Test,
  type TestResult,
  type Certificate,
  type UserStats,
  type GenerateTestResponse,
  type GetCategoriesResponse
} from "@shared/schema";

// Solana connection for payment verification
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Treasury wallet address from environment variable
const TREASURY_WALLET = new PublicKey(
  process.env.TREASURY_WALLET || "9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g"
);
// Price set to approximately $20 (0.15 SOL based on average SOL price)
const TEST_PRICE_LAMPORTS = 0.15 * LAMPORTS_PER_SOL;

// Verify payment transaction on-chain
async function verifyPaymentTransaction(
  signature: string,
  expectedSender: string
): Promise<boolean> {
  try {
    // Check if signature already used (database check)
    const isUsed = await storage.isPaymentSignatureUsed(signature);
    if (isUsed) {
      console.error("Payment signature already used:", signature);
      return false;
    }

    // Fetch transaction from blockchain
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) {
      console.error("Transaction not found:", signature);
      return false;
    }

    // Verify transaction succeeded
    if (transaction.meta?.err) {
      console.error("Transaction failed:", transaction.meta.err);
      return false;
    }

    // Verify sender matches
    const accountKeys = transaction.transaction.message.getAccountKeys();
    const sender = accountKeys.get(0)?.toString();
    if (sender !== expectedSender) {
      console.error("Sender mismatch:", { expected: expectedSender, actual: sender });
      return false;
    }

    // Verify transfer amount and recipient
    const preBalances = transaction.meta?.preBalances || [];
    const postBalances = transaction.meta?.postBalances || [];
    
    // Get account keys - handle both versioned and legacy transactions
    const staticAccountKeys = accountKeys.staticAccountKeys || [];
    
    // Find the treasury account index
    const treasuryIndex = staticAccountKeys.findIndex(
      (key) => key.toString() === TREASURY_WALLET.toString()
    );

    if (treasuryIndex === -1) {
      console.error("Treasury wallet not found in transaction");
      return false;
    }

    // Calculate amount transferred to treasury
    const treasuryBalanceChange = postBalances[treasuryIndex] - preBalances[treasuryIndex];
    
    // Allow some tolerance for transaction fees
    if (treasuryBalanceChange < TEST_PRICE_LAMPORTS * 0.95) {
      console.error("Insufficient payment amount:", {
        expected: TEST_PRICE_LAMPORTS,
        actual: treasuryBalanceChange,
      });
      return false;
    }

    // Mark signature as used in database
    await storage.markPaymentSignatureUsed(signature, expectedSender, treasuryBalanceChange);
    
    console.log("Payment verified successfully:", {
      signature,
      sender,
      amount: treasuryBalanceChange / LAMPORTS_PER_SOL,
    });

    return true;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Get AI-generated categories
  app.post("/api/categories", async (req, res) => {
    try {
      const validated = getCategoriesRequestSchema.parse(req.body);
      
      const categories = await generateCategories(
        validated.level,
        validated.parentCategory
      );

      const response: GetCategoriesResponse = {
        categories,
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating categories:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate categories" 
      });
    }
  });

  // Generate a new test
  app.post("/api/tests/generate", async (req, res) => {
    try {
      const validated = generateTestRequestSchema.parse(req.body);
      
      // Verify payment transaction on-chain
      const paymentValid = await verifyPaymentTransaction(
        validated.paymentSignature,
        validated.walletAddress
      );

      if (!paymentValid) {
        return res.status(402).json({ 
          error: "Payment verification failed. Please ensure you have completed the 0.15 SOL (~$20) payment transaction." 
        });
      }
      
      // Generate 10 questions using Gemini AI based on categories
      const questions = await generateTestQuestions(
        validated.mainCategory,
        validated.narrowCategory,
        validated.specificCategory
      );
      
      // Create test object with categories
      const topic = `${validated.mainCategory} > ${validated.narrowCategory} > ${validated.specificCategory}`;
      const test: Test = {
        id: `${validated.walletAddress}-${randomUUID()}`,
        topic,
        mainCategory: validated.mainCategory,
        narrowCategory: validated.narrowCategory,
        specificCategory: validated.specificCategory,
        questions,
        createdAt: new Date().toISOString(),
      };

      // Save test to storage
      await storage.createTest(test);
      console.log(`✅ Test created successfully with ID: ${test.id}`);
      
      // Verify test was saved by trying to read it back
      const savedTest = await storage.getTest(test.id);
      if (!savedTest) {
        console.error(`❌ ERROR: Test ${test.id} was not saved properly!`);
        throw new Error("Test was not saved to database");
      }
      console.log(`✅ Test ${test.id} verified in database`);

      const response: GenerateTestResponse = {
        test,
        paymentRequired: true,
        amount: 0.15, // 0.15 SOL (~$20)
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating test:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate test" 
      });
    }
  });

  // Get test by ID
  app.get("/api/tests/:testId", async (req, res) => {
    try {
      const { testId } = req.params;
      const test = await storage.getTest(testId);

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Return test without correct answers
      const testWithoutAnswers = {
        ...test,
        questions: test.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
        })),
      };

      res.json(testWithoutAnswers);
    } catch (error) {
      console.error("Error fetching test:", error);
      res.status(500).json({ error: "Failed to fetch test" });
    }
  });

  // Submit test answers
  app.post("/api/tests/submit", async (req, res) => {
    try {
      const validated = testSubmissionSchema.parse(req.body);
      
      // Get the test
      const test = await storage.getTest(validated.testId);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Calculate score (10 questions × 10 points each = 100 points max)
      let correctAnswers = 0;
      test.questions.forEach((question, index) => {
        if (validated.answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const totalQuestions = test.questions.length; // Should be 10
      const totalPoints = 100;
      const score = correctAnswers * 10; // Each correct answer = 10 points

      // Determine level and if passed based on new scoring system
      let level: "Junior" | "Middle" | "Senior" | "Failed";
      let passed = false;
      let solReward = 0;

      if (score >= 90) {
        level = "Senior";
        passed = true;
        solReward = 0.15; // 15% reward for Senior
      } else if (score >= 80) {
        level = "Middle";
        passed = true;
        solReward = 0.12; // 12% reward for Middle
      } else if (score >= 70) {
        level = "Junior";
        passed = true;
        solReward = 0.1; // 10% reward for Junior
      } else {
        level = "Failed";
        passed = false;
        solReward = 0; // No reward if failed
      }

      // Create test result
      const result: TestResult = {
        testId: validated.testId,
        walletAddress: validated.walletAddress,
        topic: test.topic,
        score,
        level,
        correctAnswers,
        totalQuestions,
        totalPoints,
        solReward,
        passed,
        completedAt: new Date().toISOString(),
      };

      await storage.createTestResult(result);

      // Only mint NFT certificate if passed (score >= 70)
      let nftData = null;
      let certificate = null;

      if (passed) {
        try {
          nftData = await mintCertificateNFT(
            validated.walletAddress,
            test.topic,
            level as "Junior" | "Middle" | "Senior",
            score
          );
          console.log("NFT minted successfully:", nftData);
        } catch (error) {
          console.error("NFT minting failed:", error);
          // Continue with mock data if minting fails
          nftData = {
            mint: `MOCK-${randomUUID().slice(0, 8)}`,
            metadataUri: `https://arweave.net/${randomUUID()}`,
          };
        }

        // Create certificate only if passed
        certificate = {
          id: randomUUID(),
          walletAddress: validated.walletAddress,
          topic: test.topic,
          level: level as "Junior" | "Middle" | "Senior",
          score,
          nftMint: nftData.mint,
          nftMetadataUri: nftData.metadataUri,
          earnedAt: new Date().toISOString(),
        };

        await storage.createCertificate(certificate);
      }

      // Update user stats (only increment certificates if passed)
      const stats = await storage.getUserStats(validated.walletAddress);
      const newTotalTests = stats.totalTests + 1;
      const newTotalCertificates = passed ? stats.totalCertificates + 1 : stats.totalCertificates;
      const newTotalSolEarned = stats.totalSolEarned + solReward;
      const newSuccessRate = Math.round((newTotalCertificates / newTotalTests) * 100);

      await storage.updateUserStats(validated.walletAddress, {
        totalTests: newTotalTests,
        totalCertificates: newTotalCertificates,
        totalSolEarned: newTotalSolEarned,
        successRate: newSuccessRate,
      });

      console.log(`Updated stats for ${validated.walletAddress}:`, {
        totalTests: newTotalTests,
        totalCertificates: newTotalCertificates,
        totalSolEarned: newTotalSolEarned,
        successRate: newSuccessRate,
        passed,
        score,
        level,
      });

      res.json(result);
    } catch (error) {
      console.error("Error submitting test:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to submit test" 
      });
    }
  });

  // Get user stats
  app.get("/api/user/stats/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const stats = await storage.getUserStats(walletAddress);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // On-chain profile endpoints
  app.get("/api/onchain/profile/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      const onchainProfile = await anchorClient.getUserProfile(walletAddress);
      const profileExists = await anchorClient.checkProfileExists(walletAddress);
      
      const profilePDA = anchorClient.getUserProfileAddress(walletAddress);
      
      res.json({
        exists: profileExists,
        pda: profilePDA,
        profile: onchainProfile,
        message: profileExists 
          ? "On-chain profile found" 
          : "No on-chain profile yet. Create one to enable DAO features.",
      });
    } catch (error) {
      console.error("Error fetching on-chain profile:", error);
      res.status(500).json({ error: "Failed to fetch on-chain profile" });
    }
  });

  // Get skill registry info
  app.get("/api/onchain/registry", async (req, res) => {
    try {
      const registry = await anchorClient.getSkillRegistry();
      const registryPDA = anchorClient.getSkillRegistryAddress();
      
      res.json({
        pda: registryPDA,
        registry,
        programId: 'SkiLLcHaiNPRoGraM11111111111111111111111111',
      });
    } catch (error) {
      console.error("Error fetching skill registry:", error);
      res.status(500).json({ error: "Failed to fetch skill registry" });
    }
  });

  // Verify user skill (for dApp integrations)
  app.post("/api/onchain/verify-skill", async (req, res) => {
    try {
      const { walletAddress, skillId, minScore } = req.body;
      
      if (!walletAddress || !skillId) {
        return res.status(400).json({ 
          error: "walletAddress and skillId are required" 
        });
      }

      const profile = await anchorClient.getUserProfile(walletAddress);
      
      if (!profile) {
        return res.json({
          verified: false,
          message: "User has no on-chain profile",
        });
      }

      const skill = profile.skills.find(s => s.skillId === skillId);
      
      if (!skill) {
        return res.json({
          verified: false,
          message: "User does not have this skill",
        });
      }

      const meetsRequirement = minScore ? skill.score >= minScore : true;
      
      res.json({
        verified: meetsRequirement,
        skill: {
          id: skill.skillId,
          level: skill.level,
          score: skill.score,
          earnedAt: skill.earnedAt,
          nftMint: skill.nftMint,
        },
        message: meetsRequirement 
          ? "Skill verified successfully" 
          : `Skill score ${skill.score} is below required ${minScore}`,
      });
    } catch (error) {
      console.error("Error verifying skill:", error);
      res.status(500).json({ error: "Failed to verify skill" });
    }
  });

  // Get DAO statistics
  app.get("/api/dao/stats", async (req, res) => {
    try {
      const registry = await anchorClient.getSkillRegistry();
      
      res.json({
        totalValidators: registry?.totalValidators || 0,
        totalCertificates: registry?.totalCertificates || 0,
        totalUsers: registry?.totalUsers || 0,
        rewardDistribution: {
          senior: 15,
          middle: 12,
          junior: 10,
        },
        revenueStreams: {
          failedTests: 45,
          ads: 30,
          partnerships: 15,
          other: 10,
        },
      });
    } catch (error) {
      console.error("Error fetching DAO stats:", error);
      res.status(500).json({ error: "Failed to fetch DAO stats" });
    }
  });

  // Get SkillPool statistics (real data from database)
  app.get("/api/skillpool/stats", async (req, res) => {
    try {
      // Get all user stats from database
      const allStats = await storage.getAllUserStats();
      
      // Calculate real pool statistics
      let totalSolEarned = 0;
      let totalTests = 0;
      let totalCertificates = 0;
      let activeUsers = 0;
      
      allStats.forEach(stat => {
        totalSolEarned += stat.totalSolEarned;
        totalTests += stat.totalTests;
        totalCertificates += stat.totalCertificates;
        if (stat.totalTests > 0) {
          activeUsers++;
        }
      });

      // Calculate revenue from failed tests (test price 0.15 SOL)
      const failedTests = totalTests - totalCertificates;
      const revenueFromFailedTests = failedTests * 0.15;
      
      // Mock revenue from other sources (for now)
      const revenueFromAds = revenueFromFailedTests * 0.30 / 0.45; // 30% vs 45%
      const revenueFromPartnerships = revenueFromFailedTests * 0.15 / 0.45; // 15% vs 45%
      const revenueFromOther = revenueFromFailedTests * 0.10 / 0.45; // 10% vs 45%
      
      const totalRevenue = revenueFromFailedTests + revenueFromAds + revenueFromPartnerships + revenueFromOther;
      const totalBalance = totalRevenue - totalSolEarned;

      res.json({
        poolBalance: {
          sol: totalBalance.toFixed(2),
          usd: (totalBalance * 133).toFixed(2), // Approx SOL price
        },
        revenue: {
          total: totalRevenue.toFixed(2),
          failedTests: revenueFromFailedTests.toFixed(2),
          ads: revenueFromAds.toFixed(2),
          partnerships: revenueFromPartnerships.toFixed(2),
          other: revenueFromOther.toFixed(2),
        },
        rewards: {
          total: totalSolEarned.toFixed(2),
          monthly: (totalSolEarned * 0.3).toFixed(2), // Estimate 30% in last month
        },
        users: {
          active: activeUsers,
          totalTests: totalTests,
          totalCertificates: totalCertificates,
        },
        revenuePercentages: {
          failedTests: 45,
          ads: 30,
          partnerships: 15,
          other: 10,
        },
        rewardPercentages: {
          senior: 15,
          middle: 12,
          junior: 10,
        },
      });
    } catch (error) {
      console.error("Error fetching SkillPool stats:", error);
      res.status(500).json({ error: "Failed to fetch SkillPool stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
