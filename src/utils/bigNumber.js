import BigNumber from 'bignumber.js'

export const BN = (x) => new BigNumber(x)

/**
 * Shift Wei string to units. Format using globalFormatting
 * @param {string} weiString
 * @returns {string} units
 */
export const formatFromWei = (weiString) => {
  const units = BN(weiString).shiftedBy(-18).toFormat()
  return units
}
