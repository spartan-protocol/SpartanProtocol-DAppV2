import { BN, formatFromUnits } from '../bigNumber'
import {
  calcPart,
  getPoolShareWeight,
  calcSpotValueInBase,
  getPool,
  getDao,
} from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate feeBurn basis points (0 - 100 ie. 0% to 1%)
 * Uses the feeOnTransfer if already called
 * @param feeOnTransfer @param amount
 * @returns fee
 */
export const calcFeeBurn = (feeOnTransfer, amount) => {
  const fee = calcPart(feeOnTransfer, amount)
  return fee
}

/**
 * Return SPARTA after feeBurn
 * @param amount @param feeOnTsf
 * @returns fee
 */
export const minusFeeBurn = (amount, feeOnTsf) => {
  const _amount = BN(amount)
  const burnFee = calcFeeBurn(feeOnTsf, _amount)
  const afterFeeBurn = _amount.minus(burnFee)
  return afterFeeBurn
}

/**
 * Get member's total SPARTA value of all LP tokens attributable to them
 * @param poolDetails @param daoDetails @param bondDetails
 * @returns memberWeight
 */
export const getLPWeights = (poolDetails, daoDetails, bondDetails) => {
  let memberWeight = BN(0)
  for (let i = 0; i < poolDetails.length; i++) {
    if (poolDetails[i].baseAmount > 0) {
      const dao = getDao(poolDetails[i].tokenAddress, daoDetails)
      const bond = getDao(poolDetails[i].tokenAddress, bondDetails)
      memberWeight = memberWeight.plus(
        getPoolShareWeight(
          BN(poolDetails[i].balance).plus(dao?.staked).plus(bond?.staked),
          poolDetails[i].poolUnits,
          poolDetails[i].baseAmount,
        ),
      )
    }
  }
  return memberWeight
}

/**
 * Get members actual vault weights (Members SPARTA value of curated assets in the vaults)
 * @param poolDetails @param daoDetails @param bondDetails
 * @returns memberWeight
 */
export const getVaultWeights = (poolDetails, daoDetails, bondDetails) => {
  let memberWeight = BN(0)
  if (poolDetails && daoDetails && bondDetails) {
    const _poolDetails = poolDetails.filter((x) => x.curated && !x.hide)
    for (let i = 0; i < _poolDetails.length; i++) {
      const dao = getDao(poolDetails[i].tokenAddress, daoDetails)
      const bond = getDao(poolDetails[i].tokenAddress, bondDetails)
      memberWeight = memberWeight.plus(
        getPoolShareWeight(
          BN(dao.staked).plus(bond.staked),
          _poolDetails.poolUnits,
          _poolDetails.baseAmount,
        ),
      )
    }
  }
  if (memberWeight > 0) {
    return memberWeight
  }
  return '0.00'
}

/**
 * Get the member's weight of a staked synthVault asset
 * @param synth @param pool
 * @returns memberWeight
 */
export const getSynthWeight = (synth, pool) => {
  const memberWeight = calcSpotValueInBase(synth.staked, pool)
  return memberWeight
}

/**
 * Get the member's SPARTA value of all held/staked synths
 * @param synthDetails @param poolDetails
 * @returns memberWeight
 */
export const getSynthWeights = (synthDetails, poolDetails) => {
  let memberWeight = BN(0)
  for (let i = 0; i < synthDetails.length; i++) {
    if (synthDetails[i].address) {
      const _total = BN(synthDetails[i].staked).plus(synthDetails[i].balance)
      memberWeight = memberWeight.plus(
        calcSpotValueInBase(
          _total,
          getPool(synthDetails[i].tokenAddress, poolDetails),
        ),
      )
    }
  }
  return memberWeight
}

/**
 * Return time in block.timeStamp format
 * @returns timeStamp
 */
export const getBlockTimestamp = () => {
  const timeNow = BN(Date.now()).div(1000).toFixed(0)
  return timeNow
}

/**
 * Return seconds/minutes/hours/days
 * @param {uint} seconds uint seconds to convert
 * @param {uint} t hand in the {t} translation obj
 * @returns [string, string] [0 = time] [1 = string label ie. 'seconds' 'minutes']
 */
export const convertTimeUnits = (seconds, t) => {
  if (seconds > 86400) {
    return [
      formatFromUnits(seconds.div(60).div(60).div(24), 2),
      ` ${t('days')}`,
    ]
  }
  if (seconds > 3600) {
    return [formatFromUnits(seconds.div(60).div(60), 2), ` ${t('hours')}`]
  }
  if (seconds > 60) {
    return [formatFromUnits(seconds.div(60), 2), ` ${t('minutes')}`]
  }
  if (seconds > 0) {
    return [formatFromUnits(seconds, 0), ` ${t('seconds')}`]
  }
  return [0, ` ${t('seconds')} (now)`]
}

/**
 * Return time left until a timestamp
 * @param {uint} timestamp to compare current time to
 * @param {uint} t hand in the {t} translation obj
 * @returns [string, string] [0 = time uints] [1 = string label ie. 'seconds' 'minutes']
 */
export const getTimeUntil = (timestamp, t) => {
  const _timeStamp = BN(timestamp)
  const timeNow = BN(getBlockTimestamp())
  const secondsUntil = _timeStamp.minus(timeNow)
  return convertTimeUnits(secondsUntil, t)
}

/**
 * Return time passed since a timestamp
 * @param {uint} timestamp to compare current time to
 * @param {uint} t hand in the {t} translation obj
 * @returns [string, string] [0 = time uints] [1 = string label ie. 'seconds' 'minutes']
 */
export const getTimeSince = (timestamp, t) => {
  const _timeStamp = BN(timestamp)
  const timeNow = BN(getBlockTimestamp())
  const secondsSince = timeNow.minus(_timeStamp)
  return convertTimeUnits(secondsSince, t)
}

/**
 * Return time passed since a timestamp
 * @param {uint} timestamp to compare current time to
 * @returns secsSince
 */
export const getSecsSince = (timestamp) => {
  const _timeStamp = BN(timestamp)
  const timeNow = BN(getBlockTimestamp())
  const secondsSince = timeNow.minus(_timeStamp)
  return secondsSince
}

/**
 * Return formatted date
 * @param {number} timestamp
 * @returns formattedDate
 */
export const formatDate = (unixTime) => {
  const date = new Date(unixTime * 1000)
  return date.toLocaleDateString()
}

/**
 * Calculate APY using full month divis + fees and pool's depth *** UPDATE WITH GENESIS/LASTMONTH ***
 * @param {object} pool
 * @returns {number} apy
 */
export const calcAPY = (pool) => {
  let apy = '0'
  const actualDepth = BN(pool.baseAmount).times(2)
  const _divis = BN(pool.recentDivis)
  const _prevDivis = BN(pool.lastMonthDivis)
  const monthFraction = BN(getBlockTimestamp()).minus(pool.genesis).div(2592000)
  if (monthFraction > 1) {
    apy = BN(_prevDivis.isGreaterThan(_divis) ? _prevDivis : _divis)
      .plus(pool.fees)
      .times(12)
      .div(actualDepth)
      .times(100)
  } else {
    apy = BN(_divis)
      .plus(pool.fees)
      .times(12 / monthFraction)
      .div(actualDepth)
      .times(100)
  }
  if (apy > 0) {
    return apy
  }
  return '0.00'
}
