import { BN } from '../bigNumber'
import { minusFeeBurn } from './nonContract'
import { addLiq } from './router'
import { calcSwapOutput } from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate LP tokens from bond ***WIP --- WAIT UNTIL CONTRACTS CHANGE SEE #89***
 * @param inputToken
 * @param pool poolDetails
 * @param feeOnTsf
 * @returns [unitsLP, _inputSparta]
 */
export const bondLiq = (inputToken, pool, feeOnTsf) => {
  const _bondToken = BN(inputToken) // TOKEN received by DAO
  const _bondSparta = BN(calcSwapOutput(_bondToken, pool, true)) // SPARTA bonded in
  const _spartaRec = minusFeeBurn(_bondSparta) // SPARTA received by ROUTER (feeBurn)
  const [unitsLP, _inputSparta] = addLiq(inputToken, pool, feeOnTsf, _spartaRec) // LP units received by BondVault
  return [unitsLP, _inputSparta]
}
