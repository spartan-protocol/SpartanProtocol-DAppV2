import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

const BN = ethers.BigNumber.from

// GET UTILS CONTRACT
export const getUtilsContract = () => {
  const abiUtils = getAbis().utils
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.utils, abiUtils, provider)
  return contract
}

// ************** CORE MATHEMATICS (USE THESE IN UI WHERE NEAR-INSTANT-RETURN IS REQUIRED) ************** //

// Calculate share
export const calcShare = (part, total, amount) => {
  // share = amount * part/total
  const _part = BN(part)
  const _total = BN(total)
  const _amount = BN(amount)
  const result = _amount.mul(_part).div(_total)
  console.log(result.toString())
  return result
}

// Calculate asymmetric share
export const calcAsymmetricShare = (input, pool, toBase) => {
  // share = (u * U * (2 * A^2 - 2 * U * u + U^2))/U^3
  // (part1 * (part2 - part3 + part4)) / part5
  const u = BN(input) // UNITS (SPARTA == toToken || TOKEN == toBase)
  const U = BN(pool.poolUnits) // TOTAL SUPPLY OF LP TOKEN
  const A = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // TOKEN IN POOL (if !toBase) || SPARTA IN POOL (if toBase)
  const part1 = u.mul(A)
  const part2 = U.mul(U).mul(2)
  const part3 = U.mul(u).mul(2)
  const part4 = u.mul(u)
  const numerator = part1.mul(part2.sub(part3).add(part4))
  const part5 = U.mul(U).mul(U)
  const globalDetails = numerator.div(part5)
  console.log(globalDetails.toString())
  return globalDetails
}

// Calculate liquidity share
export const calcLiquidityShare = (input, pool) => {
  // share = amount * part/total
  const _input = BN(input)
  const amount = BN(pool.tokenAmount)
  const totalSupply = BN(pool.poolUnits)
  const result = amount.mul(_input).div(totalSupply)
  console.log(result.toString())
  return result
}

export const calcSlipAdjustment = (b, B, t, T) => {
  // slipAdjustment = (1 - ABS((B t - b T)/((2 b + B) (t + T))))
  // 1 - ABS(part1 - part2)/(part3 * part4))
  const part1 = BN(B).mul(t)
  const part2 = BN(b).mul(T)
  const part3 = BN(b).mul(2).add(B)
  const part4 = BN(t).add(T)
  let numerator = ''
  if (part1.lt(part2) === true) {
    numerator = part1.sub(part2)
  } else {
    numerator = part2.sub(part1)
  }
  const denominator = part3.mul(part4)
  const result = BN(1).sub(numerator.div(denominator))
  console.log(result.toString())
  return result.mul(BN(1).pow(18))
}

// Calculate liquidity units
export const calcLiquidityUnits = (stake, pool) => {
  // units = ((P (t B + T b))/(2 T B)) * slipAdjustment
  // P * (part1 + part2) / (part3) * slipAdjustment
  const b = BN(stake.baseAmount) // b = _actualInputBase
  const B = BN(pool.baseAmount) // B = baseAmount
  const t = BN(stake.tokenAmount) // t = _actualInputToken
  const T = BN(pool.tokenAmount) // T = tokenAmount
  const P = BN(pool.units) // P = LP Token TotalSupply
  if (P === 0) {
    console.log(b.toString())
    return b
  }
  const slipAdjustment = calcSlipAdjustment(b, B, t, T)
  const part1 = t.mul(B)
  const part2 = T.mul(b)
  const part3 = T.mul(B).mul(2)
  const result = P.mul(part1.add(part2)).div(part3).mul(slipAdjustment)
  console.log(result.toString())
  return result
}

// Calculate part
export const calcPart = (bp, total) => {
  // 10,000 basis points = 100.00%
  let part = 0
  if (bp <= 10000 && bp > 0) {
    part = calcShare(bp, 10000, total)
    console.log(part.toString())
  }
  console.log('Must be valid basis points')
  return part
}

// Calculate swap fee
export const calcSwapFee = (inputAmount, pool, toBase) => {
  // y = (x * x * Y) / (x + X)^2
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // if toBase; baseAmount
  const numerator = x.mul(x.mul(Y))
  const denominator = x.add(X).mul(x.add(X))
  const result = numerator.div(denominator)
  console.log(result)
  return result
}

// Calculate swap output
export const calcSwapOutput = (inputAmount, pool, toBase) => {
  // y = (x * X * Y )/(x + X)^2
  const x = BN(inputAmount) // Input amount
  const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
  const Y = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // if toBase; baseAmount
  const numerator = x.mul(X.mul(Y))
  const denominator = x.add(X).mul(x.add(X))
  const result = numerator.div(denominator)
  console.log(result)
  return result
}

// Calculate value in token
export const calcValueInToken = (pool, amount) => {
  const _baseAmount = pool.baseAmount
  const _tokenAmount = pool.tokenAmount
  const result = BN(amount).mul(BN(_tokenAmount)).div(BN(_baseAmount))
  console.log(result)
  return result
}

// Calculate double-swap fee
export const calcDoubleSwapFee = (inputAmount, pool1, pool2) => {
  // formula: getSwapFee1 + getSwapFee2
  const fee1 = calcSwapFee(inputAmount, pool1, true)
  const x = calcSwapOutput(inputAmount, pool1, true)
  const fee2 = calcSwapFee(x, pool2, false)
  const fee1Token = calcValueInToken(pool2, fee1)
  const result = fee2.add(fee1Token)
  console.log(result)
  return result
}

// Calculate double-swap output
export const calcDoubleSwapOutput = (inputAmount, pool1, pool2) => {
  // formula: calcSwapOutput(pool1) => calcSwapOutput(pool2)
  const x = calcSwapOutput(inputAmount, pool1, true)
  const output = calcSwapOutput(x, pool2, false)
  console.log(output)
  return output
}

// Calculate swap slippage
export const calcSwapSlip = (inputAmount, pool, toBase) => {
  // formula: (x) / (x + X)
  const x = BN(inputAmount) // input amount
  const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
  const result = x.div(x.add(X))
  console.log(result.toString())
  return result
}

// Calculate double-swap slippage
export const calcDoubleSwapSlip = (inputAmount, pool1, pool2) => {
  // formula: getSwapSlip1(input1) + getSwapSlip2(getSwapOutput1 => input2)
  const swapSlip1 = calcSwapSlip(inputAmount, pool1, true)
  const x = calcSwapOutput(inputAmount, pool1, true)
  const swapSlip2 = calcSwapSlip(x, pool2, false)
  const result = swapSlip1.add(swapSlip2)
  console.log(result.toString())
  return result
}

// // Calculate swap input
// export const getSwapInput = (outputAmount, pool, toBase) => {
//     // formula: (((X*Y)/y - 2*X) - sqrt(((X*Y)/y - 2*X)^2 - 4*X^2))/2
//     // (part1 - sqrt(part1 - part2))/2
//     const y = BN(outputAmount) // Output amount
//     const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
//     const Y = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // if toBase; baseAmount
//     const part1 = X.mul(Y).div(y).sub(X.mul(2))
//     const part2 = X.pow(2).mul(4)
//     const result = part1.minus(part1.pow(2).sub(part2).redSqrt()).div(2) // BN.JS PROVIDE SQRT???***
//     return result
// }

// ---------------- HELPER ASYNC FUNCTIONS FOR STORE ---------------

/**
 * Get a pool address from the token address
 * @param {address} token
 * @returns {address} pool
 */
export const getPool = async (token) => {
  const contract = getUtilsContract()
  const pool = await contract.callStatic.getPool(token)
  return pool
}

/**
 * Get count of all pools
 * @returns {uint256} count
 */
export const getPoolCount = async () => {
  const contract = getUtilsContract()
  const count = await contract.callStatic.poolCount()
  return count
}

/**
 * Get share of pool by member (using poolAddr)
 * (doesn't include LP tokens locked in DAO)
 * @param {address} pool
 * @param {address} member
 * @returns {uint} baseAmount
 * @returns {uint} tokenAmount
 */
export const getMemberPoolShare = async (pool, member) => {
  const contract = getUtilsContract()
  const outputAmount = await contract.callStatic.getMemberPoolShare(
    pool,
    member,
  )
  return outputAmount
}

/**
 * Get weight of pool by LP units
 * @param {address} token
 * @param {uint} units
 * @returns {uint} weight
 */
export const getPoolShareWeight = async (tokens, units) => {
  const contract = getUtilsContract()
  const weight = await contract.callStatic.getPoolShareWeight(tokens, units)
  return weight
}

/**
 * Get depth of pool in SPARTA
 * Multiply this by 2 and then by SPARTA's USD price to get rough actual all-asset depth in USD
 * @param {address} pool
 * @returns {uint} baseAmount
 */
export const getDepth = async (pool) => {
  const contract = getUtilsContract()
  const baseAmount = await contract.callStatic.getDepth(pool)
  return baseAmount
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @returns {address} synth
 */
export const getSynth = async (token) => {
  const contract = getUtilsContract()
  const synth = await contract.callStatic.getSynth(token)
  return synth
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @returns {object} synthAddress, tokenAddress, genesis, totalDebt
 */
export const getSynthData = async (token) => {
  const contract = getUtilsContract()
  const synthData = await contract.callStatic.getSynthData(token)
  return synthData
}

/**
 * Get share of debt
 * share = amount * part/total
 * @param {uint} units
 * @param {uint} totalSupply
 * @param {address} lpToken
 * @param {address} synth
 * @returns {uint} share
 */
export const getDebtShare = async (units, totalSupply, lpToken, synth) => {
  const contract = getUtilsContract()
  const synthData = await contract.callStatic.calcDebtShare(
    units,
    totalSupply,
    lpToken,
    synth,
  )
  return synthData
}

/**
 * Get count of curated pools
 * @returns {uint} count
 */
 export const getCuratedPoolCount = async () => {
  const contract = getUtilsContract()
  const count = await contract.callStatic.curatedPoolCount()
  return count
}

/**
 * Get all curated pools
 * @returns {aray} curatedPools
 */
 export const getCuratedPools = async () => {
  const contract = getUtilsContract()
  const curatedPools = await contract.callStatic.allCuratedPools()
  return curatedPools
}

/**
 * Get curated pools in range
 * @param {uint} start
 * @param {uint} count
 * @returns {aray} curatedPools
 */
 export const getCuratedPoolsInRange = async (start, count) => {
  const contract = getUtilsContract()
  const curatedPools = await contract.callStatic.curatedPoolsInRange(start, count)
  return curatedPools
}