use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct MintCertificate<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    pub user: Signer<'info>,
    
    #[account(
        seeds = [b"validator", validator.address.as_ref()],
        bump = validator.bump,
        constraint = validator.is_active @ SkillChainError::ValidatorNotActive
    )]
    pub validator: Account<'info, Validator>,
    
    #[account(
        mut,
        seeds = [b"skill_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    pub nft_mint: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<MintCertificate>,
    skill_id: String,
    score: u8,
    _validator_signature: [u8; 64],
) -> Result<()> {
    require!(score <= 100, SkillChainError::InvalidSkillScore);
    
    let user_profile = &mut ctx.accounts.user_profile;
    let registry = &mut ctx.accounts.registry;
    let clock = Clock::get()?;
    
    require!(
        user_profile.skills.len() < UserProfile::MAX_SKILLS,
        SkillChainError::MaxSkillsReached
    );
    
    let level = if score >= 90 {
        SkillLevel::Senior
    } else if score >= 80 {
        SkillLevel::Middle
    } else {
        SkillLevel::Junior
    };
    
    let skill_record = SkillRecord {
        skill_id: skill_id.clone(),
        level,
        score,
        nft_mint: ctx.accounts.nft_mint.key(),
        earned_at: clock.unix_timestamp,
        validator: ctx.accounts.validator.address,
    };
    
    user_profile.skills.push(skill_record);
    user_profile.total_certificates = user_profile.total_certificates.checked_add(1).unwrap();
    
    let score_increase = score as u32 * 10;
    user_profile.skill_score = user_profile.skill_score.checked_add(score_increase).unwrap();
    
    registry.total_certificates = registry.total_certificates.checked_add(1).unwrap();
    
    msg!("Certificate minted for skill: {} with score: {}", skill_id, score);
    
    Ok(())
}
