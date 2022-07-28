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
 * @param {string || BigNumber || Number} weiString
 * @returns {string} units
 */
export const formatFromWei = (weiString, decs = 4) => {
  let decimals = decs
  let units = BN(weiString).shiftedBy(-18)
  const isNeg = units.isLessThan(0) // Check if we are dealing with a negative number
  units = units.absoluteValue() // Make sure we only apply rounding logic to a non-negative number
  if (units.isLessThan(0.1) && decimals < 3) {
    decimals = 3
  }
  if (units.isLessThan(0.01) && decimals < 4) {
    decimals = 4
  }
  if (units.isLessThan(0.001) && decimals < 5) {
    decimals = 5
  }
  if (units.isLessThan(0.0001) && decimals < 6) {
    decimals = 6
  }
  if (units.isLessThanOrEqualTo(0)) {
    decimals = 2
  }
  if (isNeg) {
    units.times(-1) // Re-apply the negative value (if applicable) before handing back
  }
  units = BN(units).toFormat(decimals)
  return units
}

/**
 * Format using globalFormatting
 * @param {string || BigNumber || Number} unitString
 * @param {unit} formatDecimals
 * @returns {string} units
 */
export const formatFromUnits = (unitString, formatDecimals = 0) => {
  let decimals = formatDecimals
  let units = BN(unitString)
  const isNeg = units.isLessThan(0) // Check if we are dealing with a negative number
  units = units.absoluteValue() // Make sure we only apply rounding logic to a non-negative number
  if (units.isLessThan(0.1) && decimals < 3) {
    decimals = 3
  }
  if (units.isLessThan(0.01) && decimals < 4) {
    decimals = 4
  }
  if (units.isLessThan(0.001) && decimals < 5) {
    decimals = 5
  }
  if (units.isLessThan(0.0001) && decimals < 6) {
    decimals = 6
  }
  if (units.isLessThanOrEqualTo(0)) {
    decimals = 2
  }
  if (isNeg) {
    units.times(-1) // Re-apply the negative value (if applicable) before handing back
  }
  units = units.toFormat(decimals)
  return units
}

/**
 * Format to short number + letter (ie. 1,000,000 = 1M)
 * @param {string} unitString
 * @returns {string} units
 */
export const formatShortNumber = (unitString) => {
  let letterLabel = ''
  let shortNumb = unitString
  if (unitString >= 1000000000) {
    letterLabel = 'B'
    shortNumb = unitString / 1000000000
  } else if (unitString >= 1000000) {
    letterLabel = 'M'
    shortNumb = unitString / 1000000
  } else if (unitString >= 1000) {
    letterLabel = 'K'
    shortNumb = unitString / 1000
  }
  shortNumb = BN(shortNumb).toFormat(2)
  return [shortNumb, letterLabel]
}
