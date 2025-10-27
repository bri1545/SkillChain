use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(
        init,
        payer = user,
        space = UserProfile::LEN,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"skill_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateUserProfile>) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    let registry = &mut ctx.accounts.registry;
    let clock = Clock::get()?;
    
    user_profile.owner = ctx.accounts.user.key();
    user_profile.skill_score = 0;
    user_profile.total_tests = 0;
    user_profile.total_certificates = 0;
    user_profile.total_sol_earned = 0;
    user_profile.success_rate = 0;
    user_profile.skills = Vec::new();
    user_profile.created_at = clock.unix_timestamp;
    user_profile.bump = ctx.bumps.user_profile;
    
    registry.total_users = registry.total_users.checked_add(1).unwrap();
    
    msg!("User profile created for: {}", ctx.accounts.user.key());
    
    Ok(())
}
