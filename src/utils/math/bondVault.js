import { BN } from '../bigNumber'
import { getSecsSince } from './nonContract'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate claimable LP tokens from BondVault for member
 * @param pool poolDetails
 * @returns claimAmount
 */
export const calcBondedLP = (pool) => {
  const _secondsSinceClaim = getSecsSince(pool.bondLastClaim)
  const rate = BN(pool.bondClaimRate) // Get user's claim rate
  let claimAmount = _secondsSinceClaim.times(rate) // Set claim amount
  if (claimAmount.isGreaterThanOrEqualTo(pool.bonded)) {
    claimAmount = pool.bonded // If final claim; set claimAmount as remainder
  }
  return claimAmount
}
