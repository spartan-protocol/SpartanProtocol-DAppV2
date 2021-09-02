import { BN, formatFromUnits } from '../bigNumber'
import { calcPart, getPoolShareWeight } from './utils'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate feeBurn basis points (0 - 100 ie. 0% to 1%)
 * Uses the feeOnTransfer if already called
 * @param {number} feeOnTransfer @param {number} amount
 * @returns {number} fee
 */
export const calcFeeBurn = (feeOnTransfer, amount) => {
  const fee = calcPart(feeOnTransfer, amount)
  return fee
}

/**
 * Return SPARTA after feeBurn
 * @param {number} amount @param {number} feeOnTsf
 * @returns {number} fee
 */
export const minusFeeBurn = (amount, feeOnTsf) => {
  const _amount = BN(amount)
  const burnFee = calcFeeBurn(feeOnTsf, _amount)
  const afterFeeBurn = _amount.minus(burnFee)
  return afterFeeBurn
}

/**
 * Get all relevant weights from the PoolDetails object
 * @param {object} poolDetails
 * @returns {[number, number]} [memberWeight, totalWeight]
 */
export const getVaultWeights = (poolDetails) => {
  const _poolDetails = poolDetails.filter((x) => x.curated === true)
  let memberWeight = BN(0)
  let totalWeight = BN(0)
  for (let i = 0; i < _poolDetails.length; i++) {
    memberWeight = memberWeight.plus(
      getPoolShareWeight(
        BN(_poolDetails.staked).plus(_poolDetails.bonded),
        _poolDetails.poolUnits,
        _poolDetails.baseAmount,
      ),
    )
    totalWeight = totalWeight.plus(
      getPoolShareWeight(
        BN(_poolDetails.staked).plus(_poolDetails.bonded),
        _poolDetails.poolUnits,
        _poolDetails.baseAmount,
      ),
    )
  }
  return [memberWeight, totalWeight]
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
  const timeNow = BN(Date.now()).div(1000)
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
  const timeNow = BN(Date.now()).div(1000)
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
  const timeNow = BN(Date.now()).div(1000)
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
  const monthFraction = ((Date.now() / 1000).toFixed() - pool.genesis) / 2592000
  if (monthFraction > 1) {
    apy = BN(pool.lastMonthDivis > 0 ? pool.lastMonthDivis : pool.recentDivis)
      .plus(pool.lastMonthFees > 0 ? pool.lastMonthFees : pool.recentFees)
      .times(12)
      .div(actualDepth)
      .times(100)
  } else {
    apy = BN(pool.recentDivis)
      .plus(pool.recentFees)
      .times(12 / monthFraction)
      .div(actualDepth)
      .times(100)
  }
  return apy
}
