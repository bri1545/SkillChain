use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(test_id: String)]
pub struct DistributeRewards<'info> {
    #[account(
        mut,
        seeds = [b"escrow", test_id.as_bytes()],
        bump = escrow.bump,
        constraint = !escrow.is_distributed @ SkillChainError::EscrowAlreadyDistributed
    )]
    pub escrow: Account<'info, EscrowAccount>,
    
    #[account(mut)]
    pub dao_treasury: SystemAccount<'info>,
    
    #[account(mut)]
    pub project_treasury: SystemAccount<'info>,
    
    #[account(mut)]
    pub reward_pool: SystemAccount<'info>,
    
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"skill_registry"],
        bump = registry.bump
    )]
    pub registry: Account<'info, SkillRegistry>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DistributeRewards>, _amount: u64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    
    require!(
        escrow.amount >= escrow.dao_share + escrow.project_share + escrow.reward_pool_share,
        SkillChainError::InsufficientEscrowFunds
    );
    
    **ctx.accounts.dao_treasury.lamports.borrow_mut() += escrow.dao_share;
    **ctx.accounts.project_treasury.lamports.borrow_mut() += escrow.project_share;
    **ctx.accounts.reward_pool.lamports.borrow_mut() += escrow.reward_pool_share;
    
    **escrow.to_account_info().lamports.borrow_mut() -= 
        escrow.dao_share + escrow.project_share + escrow.reward_pool_share;
    
    escrow.is_distributed = true;
    
    msg!("Rewards distributed - DAO: {}, Project: {}, Pool: {}", 
        escrow.dao_share, escrow.project_share, escrow.reward_pool_share);
    
    Ok(())
}
