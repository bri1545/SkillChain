use anchor_lang::prelude::*;

#[error_code]
pub enum SkillChainError {
    #[msg("Unauthorized: Only authority can perform this action")]
    Unauthorized,
    
    #[msg("Invalid validator signature")]
    InvalidValidatorSignature,
    
    #[msg("Validator not active")]
    ValidatorNotActive,
    
    #[msg("Skill score out of range (0-100)")]
    InvalidSkillScore,
    
    #[msg("Maximum skills limit reached")]
    MaxSkillsReached,
    
    #[msg("Insufficient escrow funds")]
    InsufficientEscrowFunds,
    
    #[msg("Escrow already distributed")]
    EscrowAlreadyDistributed,
    
    #[msg("Invalid skill level")]
    InvalidSkillLevel,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
