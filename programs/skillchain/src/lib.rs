use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;
use state::*;

declare_id!("SkiLLcHaiNPRoGraM11111111111111111111111111");

#[program]
pub mod skillchain {
    use super::*;

    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        instructions::initialize_registry::handler(ctx)
    }

    pub fn create_user_profile(ctx: Context<CreateUserProfile>) -> Result<()> {
        instructions::create_user_profile::handler(ctx)
    }

    pub fn add_validator(
        ctx: Context<AddValidator>,
        validator: Pubkey,
    ) -> Result<()> {
        instructions::add_validator::handler(ctx, validator)
    }

    pub fn mint_certificate(
        ctx: Context<MintCertificate>,
        skill_id: String,
        score: u8,
        validator_signature: [u8; 64],
    ) -> Result<()> {
        instructions::mint_certificate::handler(ctx, skill_id, score, validator_signature)
    }

    pub fn update_skill_score(
        ctx: Context<UpdateSkillScore>,
        score_delta: i16,
    ) -> Result<()> {
        instructions::update_skill_score::handler(ctx, score_delta)
    }

    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        amount: u64,
    ) -> Result<()> {
        instructions::distribute_rewards::handler(ctx, amount)
    }

    pub fn initialize_skill_token(ctx: Context<InitializeSkillToken>) -> Result<()> {
        instructions::initialize_skill_token::handler(ctx)
    }
}
