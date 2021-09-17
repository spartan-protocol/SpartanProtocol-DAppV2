import { BN } from '../bigNumber'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate basis points (10,000 basis points = 100.00%)
 * @param input @param balance
 * @returns BN(basisPoints)
 */
export const calcBasisPoints = (input, balance) => {
  const part1 = BN(input).div(BN(balance))
  const basisPoints = part1.times('10000')
  return basisPoints
}

/**
 * Calculate share | share = amount * part/total
 * @param part @param total @param amount
 * @returns BN(share)
 */
export const calcShare = (part, total, amount) => {
  const _part = BN(part)
  const _total = BN(total)
  const _amount = BN(amount)
  const share = _amount.times(_part).div(_total)
  return share
}

/**
 * Calculate Part (10,000 basis points = 100.00%)
 * @param basisPoints @param totalAmnt
 * @returns BN(part)
 */
export const calcPart = (bp, total) => {
  let part = BN(0)
  if (bp <= 10000 && bp > 0) {
    part = calcShare(bp, 10000, total)
  }
  return part
}

/** @returns BN(spartaWeight) */
export const getPoolShareWeight = (units, totalSupply, totalAmount) => {
  const _units = BN(units)
  const _totalSupply = BN(totalSupply)
  const _totalAmount = BN(totalAmount)
  const weight = calcShare(_units, _totalSupply, _totalAmount)
  return weight
}

/** @returns tokenDetails item || false (boolean) */
export const getToken = (tokenAddr, tokenDetails) => {
  const _token = tokenDetails.filter((i) => i.address === tokenAddr)[0]
  if (_token !== '') {
    return _token
  }
  return false
}

/** @returns poolDetails item || false (boolean) */
export const getPool = (tokenAddr, poolDetails) => {
  const _pool = poolDetails.filter((i) => i.tokenAddress === tokenAddr)[0]
  if (_pool !== '') {
    return _pool
  }
  return false
}

/** @returns synthDetails item || false (boolean) */
export const getSynth = (tokenAddr, synthDetails) => {
  const _synth = synthDetails.filter((i) => i.tokenAddress === tokenAddr)[0]
  if (_synth !== '') {
    return _synth
  }
  return false
}

/** @returns daoDetails item || false (boolean) */
export const getDao = (tokenAddr, daoDetails) => {
  const _dao = daoDetails.filter((i) => i.tokenAddress === tokenAddr)[0]
  if (_dao !== '') {
    return _dao
  }
  return false
}

/** @returns bondDetails item || false (boolean) */
export const getBond = (tokenAddr, bondDetails) => {
  const _bond = bondDetails.filter((i) => i.tokenAddress === tokenAddr)[0]
  if (_bond !== '') {
    return _bond
  }
  return false
}

/**
 * Get spot value of TOKEN in SPARTA units
 * @param inputAmount @param poolDetails
 * @returns BN(spartaValue)
 */
export const calcSpotValueInBase = (inputAmount, poolDetails) => {
  const _input = BN(inputAmount)
  const _spartaDepth = BN(poolDetails.baseAmount)
  const _tokenDepth = BN(poolDetails.tokenAmount)
  const spartaValue = _input.times(_spartaDepth).div(_tokenDepth)
  return spartaValue
}

/**
 * Get spot value of SPARTA in TOKEN units
 * @param inputAmount @param poolDetails
 * @returns BN(tokenValue)
 */
export const calcSpotValueInToken = (inputAmount, poolDetails) => {
  const _input = BN(inputAmount)
  const _spartaDepth = BN(poolDetails.baseAmount)
  const _tokenDepth = BN(poolDetails.tokenAmount)
  const tokenValue = _input.times(_tokenDepth).div(_spartaDepth)
  return tokenValue
}

/**
 * Get half-SPARTA value of synths (for using in realise)
 * @param pool @param amount
 * @returns BN(spartaValue)
 */
export const calcActualSynthUnits = (pool, amount) => {
  const _amount = BN(amount)
  const _baseAmount = BN(pool.baseAmount)
  const _tokenAmount = BN(pool.tokenAmount)
  const numerator = _amount.times(_baseAmount)
  const denominator = BN(2).times(_tokenAmount)
  return numerator.div(denominator)
}

/**
 * Get slip adjustment (Protects capital erosion from asymmetrical liq-adds)
 * @param spartaInput @param tokenInput @param poolDetailsItem
 * @returns percentageAdjustment (in wei)
 */
export const calcSlipAdjustment = (spartaInput, tokenInput, poolDetails) => {
  const b = BN(spartaInput)
  const B = BN(poolDetails.baseAmount)
  const t = BN(tokenInput)
  const T = BN(poolDetails.tokenAmount)
  const part1 = B.times(t) // baseDepth * tokenInput
  const part2 = b.times(T) // baseInput * tokenDepth
  const part3 = BN(2).times(b).plus(B) // 2 * baseInput + baseDepth (Modified to reduce slip adjustment)
  const part4 = t.plus(T) // tokenInput + tokenDepth
  let numerator = BN(0)
  if (part1.isGreaterThan(part2)) {
    numerator = part1.minus(part2)
  } else {
    numerator = part2.minus(part1)
  }
  const denominator = part3.times(part4)
  return BN(one.minus(numerator.times(one).div(denominator)).toFixed(0, 1))
}

/**
 * Calculate redemption value of LP tokens
 * @param spartaInput @param tokenInput @param poolDetails
 * @returns [poolUnitOutput, slipRevert]
 */
export const calcLiquidityUnits = (spartaInput, tokenInput, poolDetails) => {
  const b = BN(spartaInput)
  const B = BN(poolDetails.baseAmount)
  const t = BN(tokenInput)
  const T = BN(poolDetails.tokenAmount)
  const P = BN(poolDetails.poolUnits)
  if (P <= 0) {
    return b
  }
  const slipAdjustment = calcSlipAdjustment(
    spartaInput,
    tokenInput,
    poolDetails,
  )
  const slipRevert = slipAdjustment.isLessThan(one.times(0.98))
  const part1 = t.times(B) // tokenInput * baseDepth
  const part2 = T.times(b) // tokenDepth * baseInput
  const part3 = T.times(B).times(2) // tokenDepth * baseDepth * 2
  const part4 = P.times(part1.plus(part2)).div(part3) // P == totalSupply
  const result = BN(part4).times(slipAdjustment).div(one)
  return [result.toFixed(0, 1), slipRevert]
}

/**
 * Calculate redemption value of LP tokens
 * @param inputLP uints @param poolDetails item
 * @returns [spartaValue, tokenValue]
 */
export const calcLiqValue = (inputLP, poolDetails) => {
  const _inputLP = BN(inputLP)
  const _spartaDepth = BN(poolDetails.baseAmount)
  const _tokenDepth = BN(poolDetails.tokenAmount)
  const _totalSupply = BN(poolDetails.poolUnits)
  const spartaValue = _spartaDepth.times(_inputLP).div(_totalSupply)
  const tokenValue = _tokenDepth.times(_inputLP).div(_totalSupply)
  return [spartaValue, tokenValue]
}

/**
 * Calculate swap fee in *output* TOKEN (use calcSwapOutput to get it in SPARTA value)
 * @param inputAmount @param poolDetails @param toBase
 * @returns swapFee (In output token)
 */
export const calcSwapFee = (inputAmount, poolDetails, toBase) => {
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(poolDetails.tokenAmount) : BN(poolDetails.baseAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(poolDetails.baseAmount) : BN(poolDetails.tokenAmount) // if toBase; baseAmount
  const numerator = x.times(x).times(Y)
  const denominator = x.plus(X).times(x.plus(X))
  const swapFee = numerator.div(denominator)
  return swapFee
}

/**
 * calcSwapOutput inc fee
 * @param inputAmount @param poolDetails @param toBase
 * @returns [swapOutput, swapFeeInSparta]
 */
export const calcSwapOutput = (inputAmount, poolDetails, toBase) => {
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(poolDetails.tokenAmount) : BN(poolDetails.baseAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(poolDetails.baseAmount) : BN(poolDetails.tokenAmount) // if toBase; baseAmount
  const swapNumerator = x.times(X).times(Y)
  const swapDenominator = x.plus(X).times(x.plus(X))
  const swapOutput = swapNumerator.div(swapDenominator)
  const swapFee = calcSwapFee(inputAmount, poolDetails, toBase)
  const swapFeeInBase = !toBase
    ? calcSpotValueInBase(swapFee, poolDetails)
    : swapFee
  return [swapOutput, swapFeeInBase]
}

/**
 * LP Units minted from forged Synth
 * @param inputAmount @param poolDetails
 * @returns BN(poolUnits)
 */
export const calcLiquidityUnitsAsym = (inputAmount, poolDetails) => {
  const _input = BN(inputAmount)
  const _spartaDepth = BN(poolDetails.baseAmount)
  const _totalSupply = BN(poolDetails.poolUnits)
  const numerator = _totalSupply.times(_input)
  const denominator = _input.plus(_spartaDepth).times(2)
  const poolUnits = numerator.div(denominator)
  return poolUnits
}
