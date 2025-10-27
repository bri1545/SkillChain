use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = SkillRegistry::LEN,
        seeds = [b"skill_registry"],
        bump
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeRegistry>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    
    registry.authority = ctx.accounts.authority.key();
    registry.total_validators = 0;
    registry.total_certificates = 0;
    registry.total_users = 0;
    registry.skill_token_mint = Pubkey::default();
    registry.treasury = ctx.accounts.authority.key();
    registry.bump = ctx.bumps.registry;
    
    msg!("SkillChain Registry initialized");
    
    Ok(())
}
