import { ethers } from "ethers";

import UTILS from '../config/ABI/Utils.json'
import { BNB_ADDR, getWalletProvider, getTokenContract } from "./web3"
import { getPool } from "./web3Router";

const net = process.env.REACT_APP_NET
const BN = ethers.BigNumber.from

// OLD CONTRACT ADDRESSES
export const UTILSv1_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// CURRENT CONTRACT ADDRESSES
export const UTILS_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// FUTURE CONTRACT ADDRESSES
// export const UTILSv2_ADDR = net === 'testnet' ? '' : ''

// ABI
export const UTILS_ABI = UTILS.abi

// GET UTILS CONTRACT
export const getUtilsContract = async () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(UTILS_ADDR, UTILS_ABI, provider)
    console.log(contract)
    return contract
}

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getListedPools = async () => {
    let contract = await getUtilsContract()
    const result = await contract.allPools()
    console.log(result)
    return result
}

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getListedAssets = async () => {
    let contract = await getUtilsContract()
    const result = await contract.allTokens()
    console.log(result)
    return result
}

// Get global details *** INVALID OUTPUT DUE TO ROUTERv2 ***
export const getGlobalDetails = async () => {
    let contract = await getUtilsContract()
    let globalDetails = await contract.getGlobalDetails()
    console.log(globalDetails)
    return globalDetails;
}

// ************** INTERNAL PRICING VIA POOLS FUNCTIONS ************** //

// Calculate sparta purchasing power in token (accounts for slippage)
export const calcBasePPinToken = async (token, amount) => {
    let contract = await getUtilsContract()
    let result = await contract.calcBasePPinToken(token, amount)
    console.log(result.toString())
    return result;
}

// Calculate token purchasing power in sparta (accounts for slippage)
export const calcTokenPPinBase = async (token, amount) => {
    let contract = await getUtilsContract()
    let result = await contract.calcTokenPPinBase(token, amount)
    console.log(result.toString())
    return result;
}

// Calculate value in token (uses spot price; no slippage)
export const calcValueInToken = async (token, amount) => {
    let contract = await getUtilsContract()
    let result = await contract.calcValueInToken(token, amount)
    console.log(result.toString())
    return result;
}

// Calculate value of token in sparta (uses spot price; no slippage)
export const calcValueInBase = async (token, amount) => {
    let contract = await getUtilsContract()
    let result = await contract.calcValueInBase(token, amount)
    console.log(result.toString())
    return result;
}

// ************** CORE MATHEMATICS ************** //

// Calculate asymmetric share
export const calcAsymmetricShare = async (u, U, A) => {
    // share = (u * U * (2 * A^2 - 2 * U * u + U^2))/U^3
    // (part1 * (part2 - part3 + part4)) / part5
    // COMPARE ABOVE TO MANUAL CALC BELOW
    u = BN(u) // UNITS (SPARTA == toToken || TOKEN == toBase)
    U = BN(U) // TOTAL SUPPLY OF LP TOKEN
    A = BN(A) // TOKEN IN POOL (if toToken) || SPARTA IN POOL (if toBase)
    let part1 = u.mul(A);
    let part2 = U.mul(U).mul(2);
    let part3 = U.mul(u).mul(2);
    let part4 = u.mul(u);
    let numerator = part1.mul(part2.sub(part3).add(part4));
    let part5 = U.mul(U).mul(U);
    let globalDetails = numerator.div(part5);
    console.log(globalDetails.toString())
    return globalDetails
}

// Calculate liquidity share

// Calculate liquidity units

// Calculate part
export const calcPart = (bp, total) => {
    // 10,000 basis points = 100.00%
    let part = 0
    if (bp <= 10000 && bp > 0) {
        part = calcShare(bp, 10000, total);
        console.log(part.toString())
        return part
    }
    else console.log("Must be valid basis points")
}

// Calculate share
export const calcShare = (part, total, amount) => {
    // share = amount * part/total
    part = BN(part)
    total = BN(total)
    amount = BN(amount)
    let result = amount.mul(part).div(total)
    return result;
}

// Calculate swap fee
export const calcSwapFee = (inputAmount, pool, toBase) => {
    // y = (x * x * Y) / (x + X)^2
    const x = BN(inputAmount) // Input amount
    const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
    const Y = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // if toBase; baseAmount
    const numerator = x.mul(x.mul(Y));
    const denominator = (x.add(X)).mul(x.add(X));
    const result = numerator.div(denominator);
    console.log(result)
    return result
}

// Calculate double-swap fee
export const calcDoubleSwapFee = (inputAmount, pool1, pool2) => {
    // formula: getSwapFee1 + getSwapFee2
    const fee1 = calcSwapFee(inputAmount, pool1, true)
    const x = calcSwapOutput(inputAmount, pool1, true)
    const fee2 = calcSwapFee(x, pool2, false)
    const fee1Token = calcValueInToken(fee1, pool2) // need token address instead of pool probably??***
    const result = fee2.add(fee1Token)
    console.log(result)
    return result
}

// Calculate swap output
export const calcSwapOutput = (inputAmount, pool, toBase) => {
    // y = (x * X * Y )/(x + X)^2
    const x = BN(inputAmount) // Input amount
    const X = toBase ? BN(pool.tokenAmount) : BN(pool.baseAmount) // if toBase; tokenAmount
    const Y = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // if toBase; baseAmount
    const numerator = x.mul(X.mul(Y));
    const denominator = (x.add(X)).mul(x.add(X));
    const result = numerator.div(denominator);
    console.log(result)
    return result;
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
    return result
}

// Calculate double-swap slippage
export const calcDoubleSwapSlip = (inputAmount, pool1, pool2) => {
    // formula: getSwapSlip1(input1) + getSwapSlip2(getSwapOutput1 => input2)
    const swapSlip1 = calcSwapSlip(inputAmount, pool1, true)
    const x = calcSwapOutput(inputAmount, pool1, true)
    const swapSlip2 = calcSwapSlip(x, pool2, false)
    const result = swapSlip1.add(swapSlip2)
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

// Get member share
// Get pool
// Get pool APY
// Get pool age
// Get pool data
// Get pool ROI
// Get pool share
// Get pool share asym
// Get share of sparta amount
// Get share of token amount
// Get slip adjustment

// Get token details without member (with member if wallet connected)
// .balance .decimals .name .symbol .tokenAddress .totalSupply
export const getTokenDetails = async (token) => {
    const contract = await getUtilsContract()
    const tokenDetails = await contract.getTokenDetails(token)
    console.log(tokenDetails)
    return tokenDetails;
}

// Get unclaimed asset with balance (NOT REQUIRED? FOR BURN PHASE?)
// Check if isMember
// Get pools in range
// Get token count
// Get tokens in range