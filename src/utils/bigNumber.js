import BigNumber from 'bignumber.js'

export const BN = (x) => new BigNumber(x)

/**
 * Shift units to wei string
 * @param {string} units
 * @returns {string} weiString
 */
export const convertToWei = (units) => {
  const weiString = BN(units).shiftedBy(18).toFixed(0)
  return weiString
}

/**
 * Shift Wei string to units. Format using globalFormatting
 * @param {string} weiString
 * @returns {string} units
 */
export const formatFromWei = (weiString, decs = 4) => {
  const units = BN(weiString).shiftedBy(-18).toFormat(decs)
  return units
}

/**
 * Format using globalFormatting
 * @param {string} unitString
 * @param {unit} formatDecimals
 * @returns {string} units
 */
export const formatFromUnits = (unitString, formatDecimals) => {
  const decimals = formatDecimals || 2
  const units = BN(unitString).toFormat(decimals)
  return units
}
