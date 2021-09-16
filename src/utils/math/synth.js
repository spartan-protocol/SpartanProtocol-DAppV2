import { BN } from '../bigNumber'
import {
  calcActualSynthUnits,
  calcLiquidityUnitsAsym,
  calcLiqValue,
} from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate the premium that will be burned if realise is called
 * @param synth @param pool
 * @returns [premiumLP, premium]
 */
export const realise = (synth, pool) => {
  const baseValueLP = calcLiqValue(synth.lpBalance, pool)[0] // Get the SPARTA value of the LP tokens
  const baseValueSynth = calcActualSynthUnits(pool, synth.totalSupply) // Get the SPARTA value of the synths
  if (baseValueLP.isGreaterThan(baseValueSynth)) {
    const premium = baseValueLP.minus(baseValueSynth) // Get the premium between the two values
    if (premium.isGreaterThan(one)) {
      const premiumLP = calcLiquidityUnitsAsym(premium, pool) // Get the LP value of the premium
      return [premiumLP, premium]
    }
  }
  return ['0.00', '0.00']
}
