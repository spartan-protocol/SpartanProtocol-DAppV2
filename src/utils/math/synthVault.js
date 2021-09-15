import { BN } from '../bigNumber'
import { getSecsSince, getSynthWeight } from './nonContract'
import { calcShare, getPool } from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate the user's current total claimable incentive (per Era)
 * @param reserveBal @param globalDetails @param memberWeight @param totalWeight
 * @returns [_share, _vaultReward]
 */
export const calcRewardSynth = (reserve, globalDetails, membW, totalW) => {
  const { erasToEarn, vaultClaim, synthCount } = globalDetails
  const _reserve = BN(reserve).div(erasToEarn).times(vaultClaim) // Aim to deplete reserve over a number of days
  const _vaultReward = _reserve.div(synthCount).div(10000) // Get the vaults's share of that
  const _share = calcShare(membW, totalW, _vaultReward) // Get users's share of that (1 era worth)
  return [_share, _vaultReward]
}

/**
 * Calculate the user's current incentive-claim since last harvest
 * @param pools @param synth @param synthItem @param secsPerEra @param reserveBal
 * @returns claimAmount
 */
export const calcCurrentRewardSynth = (
  pools,
  synth,
  synthItem,
  secsEra,
  reserveBal,
) => {
  const _memberW = getSynthWeight(
    synthItem,
    getPool(synthItem.tokenAddress, pools),
  )
  const _totalW = BN(synth.totalWeight)
  const _secsSinceClaim = getSecsSince(synthItem.lastHarvest)
  const [share, vaultReward] = calcRewardSynth(
    reserveBal,
    synth.globalDetails,
    _memberW,
    _totalW,
  )
  const reward = share.times(_secsSinceClaim).div(secsEra)
  if (reward.isGreaterThan(vaultReward)) {
    return vaultReward
  }
  return reward
}
