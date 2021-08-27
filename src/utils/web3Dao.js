import { BN } from './bigNumber'
import { addLiq } from './web3Router'
import { calcSwapOutput, minusFeeBurn } from './web3Utils'

export const one = BN(1).times(10).pow(18)

// ////////////// ROUTER CALCS //////////////////////////

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
  const [unitsLP, _inputSparta] = addLiq(_spartaRec, inputToken, pool, feeOnTsf) // LP units received by BondVault (Change to inc SPARTAamnt???)
  return [unitsLP, _inputSparta]
}
