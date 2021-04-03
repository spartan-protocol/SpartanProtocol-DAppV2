import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const BigNumber = require('bignumber.js')

const addr = getAddresses()

export const BN = (x) => new BigNumber(x)

// GET UTILS CONTRACT
export const getUtilsContract = () => {
  const abiUtils = getAbis().utils
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.utils, abiUtils, provider)
  return contract
}

// ************** CORE MATHEMATICS (USE THESE IN UI WHERE NEAR-INSTANT-RETURN IS REQUIRED) ************** //

/**
 * Calculate basis points (10,000 basis points = 100.00%)
 * @param {uint} input
 * @param {uint} balance
 * @returns {uint} part
 */
export const calcBasisPoints = (input, balance) => {
  const part1 = BN(input).div(BN(balance))
  const part = part1.times('10000')
  // console.log(part.toFixed())
  return part
}

/**
 * Calculate redemption value of LP token (only one-side i.e. SPARTA or TOKEN)
 * @param tokensInPool uint - amount of TOKENS or SPARTA held by the pool
 * @param units uint - amount of LP TOKENS being calculated from (input)
 * @param poolTotalSupply uint - total supply of LP tokens
 * @returns {uint} share
 */
export const calcLiquidityHoldings = (tokensInPool, units, poolTotalSupply) => {
  const part = BN(tokensInPool).times(BN(units)).div(BN(poolTotalSupply))
  return part
}

// Calculate share
export const calcShare = (part, total, amount) => {
  // share = amount * part/total
  const _part = BN(part)
  const _total = BN(total)
  const _amount = BN(amount)
  const result = _amount.times(_part).div(_total)
  return result
}

// Calculate asymmetric share
export const calcAsymmetricShare = (input, pool, toBase) => {
  // share = (u * U * (2 * A^2 - 2 * U * u + U^2))/U^3
  // (part1 * (part2 - part3 + part4)) / part5
  const u = BN(input) // UNITS (SPARTA == toToken || TOKEN == toBase)
  const U = BN(pool.poolUnits) // TOTAL SUPPLY OF LP TOKEN
  const A = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // TOKEN IN POOL (if !toBase) || SPARTA IN POOL (if toBase)
  const part1 = u.times(A)
  const part2 = U.times(U).times(2)
  const part3 = U.times(u).times(2)
  const part4 = u.times(u)
  const numerator = part1.times(part2.minus(part3).plus(part4))
  const part5 = U.times(U).times(U)
  const globalDetails = numerator.div(part5)
  return globalDetails
}

// Calculate liquidity share
export const calcLiquidityShare = (input, pool) => {
  // share = amount * part/total
  const _input = BN(input)
  const amount = BN(pool.tokenAmount)
  const totalSupply = BN(pool.poolUnits)
  const result = amount.times(_input).div(totalSupply)
  return result
}

export const calcSlipAdjustment = (b, B, t, T) => {
  // slipAdjustment = (1 - ABS((B t - b T)/((2 b + B) (t + T))))
  // 1 - ABS(part1 - part2)/(part3 * part4))
  const part1 = BN(B).times(t)
  const part2 = BN(b).times(T)
  const part3 = BN(b).times(2).plus(B)
  const part4 = BN(t).plus(T)
  let numerator = ''
  if (part1.lt(part2) === true) {
    numerator = part1.minus(part2)
  } else {
    numerator = part2.minus(part1)
  }
  const denominator = part3.times(part4)
  const result = BN(1).minus(numerator.div(denominator))
  return result.times(BN(1).pow(18))
}

// Calculate liquidity units
export const calcLiquidityUnits = (
  spartaInput,
  tokenInput,
  spartaInPool,
  tokensInPool,
  poolTotalSupply,
) => {
  // units = ((P (t B + T b))/(2 T B)) * slipAdjustment
  // P * (part1 + part2) / (part3) * slipAdjustment
  const b = BN(spartaInput) // b = _actualInputBase
  const B = BN(spartaInPool) // B = baseAmount
  const t = BN(tokenInput) // t = _actualInputToken
  const T = BN(tokensInPool) // T = tokenAmount
  const P = BN(poolTotalSupply) // P = LP Token TotalSupply
  if (P === 0) {
    return b
  }
  const slipAdjustment = calcSlipAdjustment(b, B, t, T)
  const part1 = t.times(B)
  const part2 = T.times(b)
  const part3 = T.times(B).times(2)
  const result = P.times(part1.plus(part2)).div(part3).times(slipAdjustment)
  return result
}

/**
 * Calculate Part (10,000 basis points = 100.00%)
 * @param {uint} bp
 * @param {uint} total
 * @returns {uint} part
 */
export const calcPart = (bp, total) => {
  let part = 0
  if (bp <= 10000 && bp > 0) {
    part = calcShare(bp, 10000, total)
    console.log('part:', part.toFixed())
  } else console.log('Must be valid basis points')
  return part
}

// Calculate swap fee
export const calcSwapFee = (
  inputAmount,
  poolTokenAmount,
  poolSpartaAmount,
  toBase,
) => {
  // y = (x * x * Y) / (x + X)^2
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(poolTokenAmount) : BN(poolSpartaAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(poolSpartaAmount) : BN(poolTokenAmount) // if toBase; baseAmount
  const numerator = x.times(x.times(Y))
  const denominator = x.plus(X).times(x.plus(X))
  const result = numerator.div(denominator)
  return result
}

// Calculate swap output
export const calcSwapOutput = (
  inputAmount,
  tokensInPool,
  spartaInPool,
  toBase,
) => {
  // y = (x * X * Y )/(x + X)^2
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(tokensInPool) : BN(spartaInPool) // if toBase; tokenAmount
  const Y = toBase ? BN(spartaInPool) : BN(tokensInPool) // if toBase; baseAmount
  const numerator = x.times(X.times(Y))
  const denominator = x.plus(X).times(x.plus(X))
  const result = numerator.div(denominator)
  return result
}

/**
 * Calculate value of synthetic assets
 * @param amount uint - amount of TOKENS or SPARTA held by the pool
 * @param pool uint - amount of TOKENS or SPARTA held by the pool
 * @param pool uint - amount of TOKENS or SPARTA held by the pool
 * @param pool uint - amount of TOKENS or SPARTA held by the pool
 * @param pool uint - amount of TOKENS or SPARTA held by the pool
 * @param units uint - amount of LP TOKENS being calculated from (input)
 * @param poolTotalSupply uint - total supply of LP tokens
 * @returns {uint} share
 */
export const calcSynthsValue = (
  amount,
  tokensInPool,
  spartaInPool,
  poolTotalSupply,
) => {
  const amountHalved = BN(amount).div(2) // AMOUNT HALVED
  const spartaSwapValue = calcSwapOutput(
    amountHalved,
    tokensInPool,
    spartaInPool,
    true,
  ) // BASE SWAPPED VALUE
  const units = calcLiquidityUnits(
    spartaSwapValue,
    spartaInPool,
    amountHalved,
    tokensInPool,
    poolTotalSupply,
  )
  console.log(units.toFixed())
  return units
}

// Calculate value in token
export const calcValueInToken = (poolTokenAmount, poolSpartaAmount, amount) => {
  const _baseAmount = poolSpartaAmount
  const _tokenAmount = poolTokenAmount
  const result = BN(amount).times(BN(_tokenAmount)).div(BN(_baseAmount))
  return result
}

// Calculate value in token
export const calcValueInBase = (poolTokenAmount, poolSpartaAmount, amount) => {
  const _baseAmount = poolSpartaAmount
  const _tokenAmount = poolTokenAmount
  const result = BN(amount).times(BN(_baseAmount)).div(BN(_tokenAmount))
  return result
}

// Calculate double-swap fee
export const calcDoubleSwapFee = (
  inputAmount,
  pool1TokenAmount,
  pool1BaseAmount,
  pool2TokenAmount,
  pools2BaseAmount,
) => {
  // formula: getSwapFee1 + getSwapFee2
  const fee1 = calcSwapFee(inputAmount, pool1TokenAmount, pool1BaseAmount, true) // Fee in SPARTA
  const x = calcSwapOutput(inputAmount, pool1TokenAmount, pool1BaseAmount, true) // Output in SPARTA
  const fee2 = calcSwapFee(x, pool2TokenAmount, pools2BaseAmount, false) // Fee in targetToken
  const fee2Sparta = calcValueInBase(pool2TokenAmount, pools2BaseAmount, fee2) // targetToken fee converted to SPARTA
  const result = fee1.plus(fee2Sparta) // Total fee in SPARTA
  return result
}

// Calculate double-swap output
export const calcDoubleSwapOutput = (
  inputAmount,
  pool1Token,
  pool1Sparta,
  pool2Token,
  pool2Sparta,
) => {
  // formula: calcSwapOutput(pool1) => calcSwapOutput(pool2)
  const x = calcSwapOutput(inputAmount, pool1Token, pool1Sparta, false)
  const output = calcSwapOutput(x, pool2Token, pool2Sparta, true)
  return output
}

// Calculate swap slippage
export const calcSwapSlip = (inputAmount, pool, toBase) => {
  // formula: (x) / (x + X)
  const x = BN(inputAmount) // input amount
  const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
  const result = x.div(x.plus(X))
  console.log(result.toFixed())
  return result
}

// Calculate double-swap slippage
export const calcDoubleSwapSlip = (inputAmount, pool1, pool2) => {
  // formula: getSwapSlip1(input1) + getSwapSlip2(getSwapOutput1 => input2)
  const swapSlip1 = calcSwapSlip(inputAmount, pool1, true)
  const x = calcSwapOutput(inputAmount, pool1, true)
  const swapSlip2 = calcSwapSlip(x, pool2, false)
  const result = swapSlip1.plus(swapSlip2)
  console.log(result.toFixed())
  return result
}

// Calculate swap input
export const getSwapInput = (outputAmount, tokenAmount, baseAmount, toBase) => {
  // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
  // (part1 - sqrt(part1 - part2))/2
  const y = BN(outputAmount) // Output amount
  const X = toBase ? BN(tokenAmount) : BN(baseAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(baseAmount) : BN(tokenAmount) // if toBase; baseAmount
  const part1 = X.times(Y).div(y).minus(X.times(2))
  const part2 = X.pow(2).times(4)
  const result = part1.minus(part1.pow(2).minus(part2).sqrt()).div(2)
  return result
}

// Calculate double-swap input
export const calcDoubleSwapInput = (
  outputAmount,
  pool1Token,
  pool1Sparta,
  pool2Token,
  pool2Sparta,
) => {
  // formula: calcSwapOutput(pool1) => calcSwapOutput(pool2)
  const x = getSwapInput(outputAmount, pool1Token, pool1Sparta, true)
  const output = getSwapInput(x, pool2Token, pool2Sparta, false)
  return output
}

/**
 * Calculate APY using full month divis + fees and pool's depth
 * @param {uint} dividends
 * @param {uint} fees
 * @param {uint} baseDepth
 * @returns {uint} apy
 */
export const calcAPY = (dividends, fees, baseDepth) => {
  const actualDepth = BN(baseDepth).times(2)
  const apy = BN(dividends).plus(fees).times(12).div(actualDepth).times(100)
  return apy
}
