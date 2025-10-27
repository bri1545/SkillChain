use anchor_lang::prelude::*;

#[account]
pub struct SkillRegistry {
    pub authority: Pubkey,
    pub total_validators: u32,
    pub total_certificates: u64,
    pub total_users: u64,
    pub skill_token_mint: Pubkey,
    pub treasury: Pubkey,
    pub bump: u8,
}

impl SkillRegistry {
    pub const LEN: usize = 8 + 32 + 4 + 8 + 8 + 32 + 32 + 1;
}

#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub skill_score: u32,
    pub total_tests: u32,
    pub total_certificates: u32,
    pub total_sol_earned: u64,
    pub success_rate: u8,
    pub skills: Vec<SkillRecord>,
    pub created_at: i64,
    pub bump: u8,
}

impl UserProfile {
    pub const MAX_SKILLS: usize = 50;
    pub const LEN: usize = 8 + 32 + 4 + 4 + 4 + 8 + 1 + 4 + (SkillRecord::LEN * Self::MAX_SKILLS) + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SkillRecord {
    pub skill_id: String,
    pub level: SkillLevel,
    pub score: u8,
    pub nft_mint: Pubkey,
    pub earned_at: i64,
    pub validator: Pubkey,
}

impl SkillRecord {
    pub const LEN: usize = 4 + 64 + 1 + 1 + 32 + 8 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum SkillLevel {
    Junior,
    Middle,
    Senior,
}

#[account]
pub struct Validator {
    pub address: Pubkey,
    pub total_validations: u64,
    pub reputation: u32,
    pub is_active: bool,
    pub joined_at: i64,
    pub bump: u8,
}

impl Validator {
    pub const LEN: usize = 8 + 32 + 8 + 4 + 1 + 8 + 1;
}

#[account]
pub struct EscrowAccount {
    pub test_id: String,
    pub user: Pubkey,
    pub amount: u64,
    pub dao_share: u64,
    pub project_share: u64,
    pub reward_pool_share: u64,
    pub is_distributed: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl EscrowAccount {
    pub const LEN: usize = 8 + 4 + 64 + 32 + 8 + 8 + 8 + 8 + 1 + 8 + 1;
}
