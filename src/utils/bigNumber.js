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
export const formatFromWei = (weiString, decs) => {
  let decimals = decs || 4
  let units = BN(weiString).shiftedBy(-18)
  if (units < 0.1 && decimals < 3) {
    decimals = 3
  }
  if (units < 0.01 && decimals < 4) {
    decimals = 4
  }
  if (units < 0.001 && decimals < 5) {
    decimals = 5
  }
  if (units < 0.0001 && decimals < 6) {
    decimals = 6
  }
  if (units <= 0) {
    decimals = 2
  }
  units = BN(units).toFormat(decimals)
  return units
}

/**
 * Format using globalFormatting
 * @param {string} unitString
 * @param {unit} formatDecimals
 * @returns {string} units
 */
export const formatFromUnits = (unitString, formatDecimals) => {
  let decimals = formatDecimals || 0
  if (unitString < 0.1 && decimals < 3) {
    decimals = 3
  }
  if (unitString < 0.01 && decimals < 4) {
    decimals = 4
  }
  if (unitString < 0.001 && decimals < 5) {
    decimals = 5
  }
  if (unitString < 0.0001 && decimals < 6) {
    decimals = 6
  }
  if (unitString <= 0) {
    decimals = 2
  }
  const units = BN(unitString).toFormat(decimals)
  return units
}
