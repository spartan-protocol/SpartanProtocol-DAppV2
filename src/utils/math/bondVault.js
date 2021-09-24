import { BN } from '../bigNumber'
import { getSecsSince } from './nonContract'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate claimable LP tokens from BondVault for member
 * @param bond bondDetails item
 * @returns claimAmount
 */
export const calcBondedLP = (bond) => {
  const _secondsSinceClaim = getSecsSince(bond.lastBlockTime)
  const rate = BN(bond.claimRate) // Get user's claim rate
  let claimAmount = _secondsSinceClaim.times(rate) // Set claim amount
  if (claimAmount.isGreaterThanOrEqualTo(bond.staked)) {
    claimAmount = bond.staked // If final claim; set claimAmount as remainder
  }
  return claimAmount
}
