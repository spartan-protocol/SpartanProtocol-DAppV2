import BigNumber from 'bignumber.js'

export const BN = (x) => new BigNumber(x)
export const one = BN('1000000000000000000')

/**
 * Shift units from wei string without formatting
 * @param {string} units
 * @returns {string} weiString
 */
export const convertFromWei = (units) => {
  const weiString = BN(units).shiftedBy(-18).toFixed(18)
  return weiString
}

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
  const decimals = formatDecimals || 0
  const units = BN(unitString).toFormat(decimals)
  return units
}
