use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct UpdateSkillScore<'info> {
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
}

pub fn handler(ctx: Context<UpdateSkillScore>, score_delta: i16) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    
    let new_score = if score_delta >= 0 {
        user_profile.skill_score
            .checked_add(score_delta as u32)
            .ok_or(SkillChainError::ArithmeticOverflow)?
    } else {
        user_profile.skill_score
            .checked_sub((-score_delta) as u32)
            .unwrap_or(0)
    };
    
    user_profile.skill_score = new_score;
    
    msg!("Skill score updated: {} -> {}", 
        user_profile.skill_score, new_score);
    
    Ok(())
}
