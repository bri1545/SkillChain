use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct InitializeSkillToken<'info> {
    #[account(
        init,
        payer = authority,
        mint::decimals = 9,
        mint::authority = registry,
        seeds = [b"skill_token_mint"],
        bump
    )]
    pub skill_token_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        seeds = [b"skill_registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key() @ SkillChainError::Unauthorized
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitializeSkillToken>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    
    registry.skill_token_mint = ctx.accounts.skill_token_mint.key();
    
    msg!("SKILL token initialized: {}", ctx.accounts.skill_token_mint.key());
    
    Ok(())
}
