import { 
  DepositCollateral, 
  WithdrawCollateral, 
  VaultCollateralSwap, 
  SubmitProposal,
  SubmitVote, 
  ProcessProposal,
  ProcessLoanRepayment  
} from '../generated/StableYieldVaultWithCreditDelegation/StableYieldVaultWithCreditDelegation'
import { Swap, Vote, Proposal, Loan, LoanRepayment } from "../generated/schema"
import { getUser } from './helpers'
import { BigInt } from '@graphprotocol/graph-ts'

import { StableYieldVaultWithCreditDelegation } from '../generated/StableYieldVaultWithCreditDelegation/StableYieldVaultWithCreditDelegation'
/**
 * @name handleDeposit
 * @param event 
 */
export function handleDepositCollateral(event: DepositCollateral): void {
  let ENTITY = getUser(event.params.user)
  ENTITY.shares = ENTITY.shares.plus(event.params.shares)
  ENTITY.save()
}

/**
 * @name handleWithdraw
 * @param event 
 */
export function handleWithdrawCollateral(event: WithdrawCollateral): void {
  let ENTITY = getUser(event.params.user)
  ENTITY.shares = ENTITY.shares.minus(event.params.shares)
  ENTITY.save()
}

/**
 * @name handleVaultCollateralSwap
 * @param event 
 */
export function handleVaultCollateralSwap(event: VaultCollateralSwap): void {
    let ENTITY = new Swap(event.params.timestamp.toString());
    ENTITY.tokenFrom = event.params.tokenFrom
    ENTITY.tokenTo = event.params.tokenTo
    ENTITY.apyFrom = event.params.apyFrom
    ENTITY.apyTo = event.params.apyTo
    ENTITY.timestamp = event.params.timestamp
    ENTITY.user = event.params.user
    ENTITY.save()
}

// ----------------------------------
// GOVERNANCE
// ----------------------------------

/**
 * @name handleSubmitProposal
 * @param event 
 */
export function handleSubmitProposal(event: SubmitProposal): void {
  let ENTITY = new Proposal(event.params.proposalId.toString());
  ENTITY.borrower = event.params.borrower
  ENTITY.borrowAmount = event.params.delegationAmount
  ENTITY.borrowAsset = event.params.delegationAsset
  ENTITY.interestRateMode = event.params.interestRateMode
  ENTITY.details = event.params.details
  ENTITY.yesVotes = BigInt.fromI32(0);
  ENTITY.noVotes = BigInt.fromI32(0);
  ENTITY.yesCount = BigInt.fromI32(0);
  ENTITY.details = event.params.details
  ENTITY.createdAt = event.block.timestamp;
  ENTITY.save()
}


/**
 * @name handleSubmitVote
 * @param event 
 */
export function handleSubmitVote(event: SubmitVote): void {
  let ENTITY = new Vote( event.params.proposalId.toHexString() + "-" + event.params.user.toHexString() );
  ENTITY.user = event.params.user
  ENTITY.proposalId = event.params.proposalId
  ENTITY.proposalIndex = event.params.proposalIndex
  ENTITY.vote = event.params.vote == 1 ? true : false
  ENTITY.maxSharesStaked = event.params.maxSharesStaked
  ENTITY.createdAt = event.block.timestamp;
  ENTITY.save()
}

/**
 * @name handleProcessProposal
 * @param event 
 */
export function handleProcessProposal(event: ProcessProposal): void {
  if(event.params.didPass == true) {
    let ENTITY = new Loan(event.params.proposalId.toString());
    let PROPOSAL = Proposal.load(event.params.proposalId.toString());
    ENTITY.borrower = PROPOSAL.borrower;
    ENTITY.asset = PROPOSAL.borrowAsset;
    ENTITY.amount = PROPOSAL.borrowAmount;
    ENTITY.loanStart = BigInt.fromI32(0);
    ENTITY.loanEnd = BigInt.fromI32(0);
    ENTITY.repayed = BigInt.fromI32(0);
    ENTITY.withdrawn = BigInt.fromI32(0);
    ENTITY.createdAt = event.block.timestamp;
    ENTITY.save()
  }
}

// borrower: Bytes
// asset: Bytes
// amount: BigInt
// interest: BigInt
// interestRateMode: BigInt
// loanStart: BigInt
// loanEnd: BigInt
// withdrawn: BigInt
// repayed: BigInt
// createdAt: BigInt


/**
 * @name handleProcessLoanRepayment
 * @param event 
 */
export function handleProcessLoanRepayment(event: ProcessLoanRepayment): void {
  let ENTITY = new LoanRepayment(event.params.user.toHexString());

  ENTITY.save()
}