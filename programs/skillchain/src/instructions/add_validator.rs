use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct AddValidator<'info> {
    #[account(
        init,
        payer = authority,
        space = Validator::LEN,
        seeds = [b"validator", validator_address.key().as_ref()],
        bump
    )]
    pub validator: Account<'info, Validator>,
    
    pub validator_address: SystemAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"skill_registry"],
        bump = registry.bump,
        constraint = registry.authority == authority.key() @ SkillChainError::Unauthorized
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddValidator>, validator_pubkey: Pubkey) -> Result<()> {
    let validator = &mut ctx.accounts.validator;
    let registry = &mut ctx.accounts.registry;
    let clock = Clock::get()?;
    
    validator.address = validator_pubkey;
    validator.total_validations = 0;
    validator.reputation = 100;
    validator.is_active = true;
    validator.joined_at = clock.unix_timestamp;
    validator.bump = ctx.bumps.validator;
    
    registry.total_validators = registry.total_validators.checked_add(1).unwrap();
    
    msg!("Validator added: {}", validator_pubkey);
    
    Ok(())
}
