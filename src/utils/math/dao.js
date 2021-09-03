import { BN } from '../bigNumber'
import { getSecsSince, getVaultWeights, minusFeeBurn } from './nonContract'
import { addLiq } from './router'
import { calcShare, calcSwapOutput } from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate LP tokens from bond
 * @param inputToken @param pool poolDetails @param feeOnTsf
 * @returns [unitsLP, _inputSparta]
 */
export const bondLiq = (inputToken, pool, feeOnTsf) => {
  const _bondToken = BN(inputToken) // TOKEN received by DAO
  const _bondSparta = BN(calcSwapOutput(_bondToken, pool, true)) // SPARTA bonded in
  const _spartaRec = minusFeeBurn(_bondSparta) // SPARTA received by ROUTER (feeBurn)
  const [unitsLP, _inputSparta] = addLiq(inputToken, pool, feeOnTsf, _spartaRec) // LP units received by BondVault
  return [unitsLP, _inputSparta]
}

/**
 * Calculate the user's current total claimable incentive
 * @param {number} reserveBal @param {number} daoClaim
 * @param {number} memberWeight @param {number} totalWeight
 * @returns {number} claimAmount
 */
export const calcReward = (reserveBal, daoClaim, memberWeight, totalWeight) => {
  const _reserve = BN(reserveBal) // Aim to deplete reserve over a number of days
  const daoReward = _reserve.times(daoClaim).div(10000) // Get the DAO's share of that
  return calcShare(memberWeight, totalWeight, daoReward) // Get users's share of that (1 era worth)
}

/**
 * Calculate the user's current incentive-claim per era
 * @param {object} pools @param {object} bond @param {object} dao
 * @param {number} secsPerEra @param {number} reserveBal
 * @returns {number} claimAmount
 */
export const calcCurrentReward = (pools, bond, dao, secsPerEra, reserveBal) => {
  const _memberW = getVaultWeights(pools)
  const _totalW = BN(bond.totalWeight).plus(dao.totalWeight)
  const _secsSinceClaim = getSecsSince(dao.member.lastHarvest)
  const share = calcReward(reserveBal, dao.global.daoClaim, _memberW, _totalW)
  const reward = share.times(_secsSinceClaim).div(secsPerEra)
  return reward
}
