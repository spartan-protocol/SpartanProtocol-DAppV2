import { ethers } from "ethers";

import UTILS from '../config/ABI/Utils.json'
import { getWalletProvider } from "./web3"

const net = process.env.REACT_APP_NET
const BN = ethers.BigNumber.from

// OLD CONTRACT ADDRESSES
export const UTILSv1_ADDR = net === 'testnet' ? '0x4029A4173F9431763Ee68F5BfCF0C6aA703B1653' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// CURRENT CONTRACT ADDRESSES
export const UTILS_ADDR = net === 'testnet' ? '0x4029A4173F9431763Ee68F5BfCF0C6aA703B1653' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// FUTURE CONTRACT ADDRESSES
// export const UTILSv2_ADDR = net === 'testnet' ? '' : ''

// ABI
export const UTILS_ABI = UTILS.abi

// GET UTILS CONTRACT
export const getUtilsContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(UTILS_ADDR, UTILS_ABI, provider)
    return contract
}

// ************** CORE MATHEMATICS (USE THESE IN UI WHERE NEAR-INSTANT-RETURN IS REQUIRED) ************** //

// Calculate share
export const calcShare = (part, total, amount) => {
    // share = amount * part/total
    part = BN(part)
    total = BN(total)
    amount = BN(amount)
    let result = amount.mul(part).div(total)
    console.log(result.toString())
    return result;
}

// Calculate asymmetric share
export const calcAsymmetricShare = (input, pool, toBase) => {
    // share = (u * U * (2 * A^2 - 2 * U * u + U^2))/U^3
    // (part1 * (part2 - part3 + part4)) / part5
    const u = BN(input) // UNITS (SPARTA == toToken || TOKEN == toBase)
    const U = BN(pool.poolUnits) // TOTAL SUPPLY OF LP TOKEN
    const A = toBase ? BN(pool.baseAmount) : BN(pool.tokenAmount) // TOKEN IN POOL (if !toBase) || SPARTA IN POOL (if toBase)
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
export const calcLiquidityShare = (input, pool) => {
    // share = amount * part/total
    input = BN(input)
    const amount = BN(pool.tokenAmount)
    const totalSupply = BN(pool.poolUnits)
    let result = (amount.mul(input)).div(totalSupply)
    console.log(result.toString())
    return result
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
        return b;
    } else {
        const slipAdjustment = calcSlipAdjustment(b, B, t, T)
        const part1 = t.mul(B)
        const part2 = T.mul(b)
        const part3 = T.mul(B).mul(2)
        const result = (P.mul(part1.add(part2))).div(part3).mul(slipAdjustment)
        console.log(result.toString())
        return result
    }
}

export const calcSlipAdjustment = (b, B, t, T) => {
    // slipAdjustment = (1 - ABS((B t - b T)/((2 b + B) (t + T))))
    // 1 - ABS(part1 - part2)/(part3 * part4))
    const part1 = BN(B).mul(t)
    const part2 = BN(b).mul(T)
    const part3 = BN(b).mul(2).add(B)
    const part4 = BN(t).add(T)
    let numerator = ''
    if(part1.lt(part2) === true){
        numerator = part1.sub(part2)
    } else {
        numerator = part2.sub(part1)
    }
    const denominator = part3.mul(part4)
    const result = BN(1).sub((numerator).div(denominator))
    console.log(result.toString())
    return result
}

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
    const fee1Token = calcValueInToken(pool2, fee1)
    const result = fee2.add(fee1Token)
    console.log(result)
    return result
}

// Calculate value in token
export const calcValueInToken = (pool, amount) => {
    const _baseAmount = pool.baseAmount
    const _tokenAmount = pool.tokenAmount
    const result = (BN(amount).mul(BN(_tokenAmount))).div(BN(_baseAmount));
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