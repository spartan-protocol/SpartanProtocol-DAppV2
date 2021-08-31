import {
  calcLiqValue,
  calcLiquidityUnits,
  calcSpotValueInBase,
  calcSwapOutput,
} from './utils'
import { BN } from '../bigNumber'
import { getAddresses } from '../web3'
import { minusFeeBurn } from './nonContract'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate LP tokens from liquidity-add
 * @param inputToken @param pool poolDetails @param feeOnTsf
 * @param inputSparta optional; if omitted will calc spotValue
 * @returns [unitsLP, _inputSparta]
 */
export const addLiq = (inputToken, pool, feeOnTsf, inputSparta) => {
  const _inputToken = BN(inputToken) // TOKEN received by pool
  let _inputSparta = calcSpotValueInBase(_inputToken, pool)
  if (inputSparta) {
    _inputSparta = inputSparta // SPARTA sent to pool
  }
  const _recSparta = minusFeeBurn(_inputSparta, feeOnTsf) // SPARTA received by pool
  const unitsLP = calcLiquidityUnits(_recSparta, _inputToken, pool) // Calc LP units
  return [unitsLP, _inputSparta]
}

/**
 * Calculate LP tokens from asym-liquidity-add
 * @param input
 * @param pool poolDetails
 * @param fromBase
 * @param feeOnTsf
 * @returns [unitsLP, swapFee]
 */
export const addLiqAsym = (input, pool, fromBase, feeOnTsf) => {
  const _input = BN(input) // TOKEN1 sent to Router
  const _received = fromBase ? minusFeeBurn(_input, feeOnTsf) : _input // TOKEN1 received by Router (after feeBurn)
  const _swapIn = _input.div(2) // TOKEN1 leaving the Router
  const _swapInRec = fromBase ? minusFeeBurn(_swapIn, feeOnTsf) : _swapIn // TOKEN1 received by Pool (after feeBurn)
  const [_swapOut, swapFee] = calcSwapOutput(_swapInRec, pool, !fromBase) // TOKEN2 leaving the Pool
  const _swapOutRec = fromBase ? _swapOut : minusFeeBurn(_swapOut, feeOnTsf) // TOKEN2 received by Router (after feeBurn)
  const _recSparta = fromBase
    ? _received.minus(_swapIn)
    : minusFeeBurn(_swapOutRec, feeOnTsf) // SPARTA received by Pool
  const _recToken = fromBase ? _swapOutRec : _received.minus(_swapIn) // TOKEN received by Pool
  const unitsLP = calcLiquidityUnits(_recSparta, _recToken, pool) // Calc LP units
  return [unitsLP, swapFee]
}

/**
 * Calculate SPARTA & TOKEN output from liquidity-remove **NEED TO ADD CHECK FOR ADDRESS; 1 LESS FEEBURN IF NOT BNB
 * @param inputLP
 * @param pool poolDetails
 * @param feeOnTsf
 * @returns [spartaOutput, tokenOutput]
 */
export const removeLiq = (inputLP, pool, feeOnTsf) => {
  const addr = getAddresses()
  const isBNB =
    pool.tokenAddress === addr.bnb || pool.tokenAddress === addr.wbnb
  const _inputLP = BN(inputLP) // LP units received by pool
  const [_baseOut, _tokenOut] = calcLiqValue(_inputLP, pool) // Get redemption value of the LP units
  let _recSparta = minusFeeBurn(_baseOut, feeOnTsf) // SPARTA received by user
  _recSparta = isBNB ? minusFeeBurn(_recSparta, feeOnTsf) : _recSparta // If BNB pool; another feeBurn via Router (unwrap)
  return [_recSparta, _tokenOut]
}

/**
 * Calculate SPARTA & TOKEN output from a one-sided liquidity-remove
 * @param inputLP
 * @param pool poolDetails
 * @param toBase
 * @param feeOnTsf
 * @returns [tokensOut, swapFee, divi]
 */
export const removeLiqAsym = (inputLP, pool, toBase, feeOnTsf) => {
  const _inputLP = BN(inputLP) // LP units received by pool
  const [_baseOut, _tokenOut] = calcLiqValue(_inputLP, pool) // SPARTA & TOKEN sent out from pool
  const _recSparta = minusFeeBurn(_baseOut, feeOnTsf) // SPARTA received by router
  const _recSparta1 = minusFeeBurn(_recSparta, feeOnTsf) // SPARTA received by pool
  const [_swapOut, swapFee] = toBase
    ? calcSwapOutput(_tokenOut, pool, toBase) // SPARTA output from swap
    : calcSwapOutput(_recSparta1, pool, toBase) // TOKEN output from swap
  const _swapOutRec = toBase
    ? minusFeeBurn(_swapOut, feeOnTsf).plus(_recSparta)
    : _swapOut.plus(_tokenOut) // Swap output + previous received by Router (after feeBurn)
  const tokensOut = toBase ? minusFeeBurn(_swapOutRec, feeOnTsf) : _swapOutRec // Swap output received by User (after feeBurn)
  const divi =
    pool.curated && swapFee.isGreaterThanOrEqualTo(one) ? swapFee : BN(0)
  return [tokensOut, swapFee, divi]
}

/**
 * Calculate LP tokens from zapping LPs from one pool to another
 * @param input
 * @param pool1 poolDetails of fromPool
 * @param pool2 poolDetails of toPool
 * @param feeOnTsf
 * @returns [unitsLP, swapFee]
 */
export const zapLiq = (input, pool1, pool2, feeOnTsf) => {
  const _input = BN(input) // LP1 received by pool1
  const [_sparta, _token] = removeLiq(_input, pool1, feeOnTsf) // TOKEN & SPARTA leaving pool1
  const _spartaRec = minusFeeBurn(_sparta, feeOnTsf) // SPARTA received by Router (after feeBurn)
  const [_sparta1, fee1] = calcSwapOutput(_token, pool1, true) // TOKEN goes to pool1 & swap for SPARTA
  const _spartaRec1 = minusFeeBurn(_sparta1, feeOnTsf) // SPARTA received by Router (after feeBurn)
  const _spartaHalf = _spartaRec.plus(_spartaRec1).div(2) // SPARTA sent from Router (half of balance)
  const _spartaHalfRec = minusFeeBurn(_spartaHalf, feeOnTsf) // SPARTA received by pool2 (after feeBurn)
  const [_token2, fee2] = calcSwapOutput(_spartaHalfRec, pool2, false) // SPARTA swapped for token2
  const _spartaRec2 = _spartaHalfRec // SPARTA received by pool2 (other half after feeBurn)
  const unitsLP = calcLiquidityUnits(_spartaRec2, _token2, pool2) // Calc LP units
  const swapFee = fee1.plus(fee2)
  return [unitsLP, swapFee]
}

/**
 * Get the details of a swap | output, slipFee, dividends
 * Make sure to handle dividend checks on other side (ie. [reserve.emissions === true] etc)
 * @param input @param inPool @param outPool
 * @param feeOnTsf @param toBase @param fromBase
 * @returns [output, swapFee, divi1, divi2]
 */
export const swapTo = (
  input,
  inPool,
  outPool,
  feeOnTsf,
  toBase = false,
  fromBase = false,
) => {
  let divi1 = BN(0)
  let divi2 = BN(0)
  if (fromBase) {
    // Simple swap SPARTA -> TOKEN
    const _spartaRec = minusFeeBurn(input, feeOnTsf) // Tsf SPARTA in (User -> outPool) (feeBurn)
    const [_tokenOut, swapFee] = calcSwapOutput(_spartaRec, outPool, false) // Swap SPARTA to TOKEN (outPool -> User)
    divi2 = outPool.curated && swapFee.isGreaterThan(one) && swapFee
    return [_tokenOut, swapFee, divi1, divi2]
  }
  if (toBase) {
    // Simple swap TOKEN -> SPARTA
    const [spartaOut, swapFee] = calcSwapOutput(input, inPool, true) // Tsf & Swap TOKEN to SPARTA (User -> Pool1 -> User)
    const _spartaOut = minusFeeBurn(spartaOut, feeOnTsf) // SPARTA received (User) (feeBurn)
    divi1 = inPool.curated && swapFee.isGreaterThan(one) && swapFee
    return [_spartaOut, swapFee, divi1, divi2]
  }
  // Double swap TOKEN1 -> TOKEN2
  const [spartaOut, swapFee1] = calcSwapOutput(input, inPool, true) // Tsf & Swap TOKEN to SPARTA (User -> Pool1 -> Pool2)
  divi1 = inPool.curated && swapFee1.isGreaterThan(one) && swapFee1
  const _spartaOut = minusFeeBurn(spartaOut, feeOnTsf) // SPARTA received (Pool2) (feeBurn)
  const [_tokenOut, swapFee2] = calcSwapOutput(_spartaOut, outPool, false) // Swap SPARTA to TOKEN (Pool2 -> Router -> User)
  const swapFee = swapFee1.plus(swapFee2)
  divi2 = outPool.curated && swapFee2.isGreaterThan(one) && swapFee2
  return [_tokenOut, swapFee, divi1, divi2]
}

/**
 * Calculate mint-synth txn details
 * @param input @param swapPool @param synthPool
 * @param synth @param feeOnTsf @param fromBase
 * @returns [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
 */
export const mintSynth = (
  input,
  swapPool,
  synthPool,
  synth,
  feeOnTsf,
  fromBase = false,
) => {
  let diviSynth = BN(0)
  let diviSwap = BN(0)
  let baseCapped = false
  let synthCapped = false
  let baseAmount = BN(synthPool.baseAmount)
  let tokenAmount = BN(synthPool.tokenAmount)
  const minSynth = BN(synthPool.minSynth)
  const collateral = BN(synthPool.collateral)
  const synthSupply = BN(synth.totalSupply)
  let synthCap = tokenAmount.times(synthPool.synthCap).div(10000)
  let minDebt = minSynth.times(tokenAmount).div(10000)
  let minCollat = minSynth.times(baseAmount).div(10000)
  let collat = collateral > minCollat ? collateral : minCollat
  let debt = synthSupply > minDebt ? synthSupply : minDebt
  let virtualPool = {
    baseAmount: baseAmount.plus(collat),
    tokenAmount: tokenAmount.minus(debt),
  }
  if (fromBase) {
    // Simple mint SPARTA -> SYNTH
    const _spartaRec = minusFeeBurn(input, feeOnTsf) // Pool receives SPARTA (feeBurn)
    baseCapped = baseAmount.plus(_spartaRec).isGreaterThan(synthPool.baseCap) // Check if this will exceed the base cap
    const [synthOut, synthFee] = calcSwapOutput(_spartaRec, virtualPool, false) // Swap SPARTA for SYNTH (Pool -> User)
    synthCapped = synthSupply.plus(synthOut).isGreaterThan(synthCap) // Check if this will exceed the synth cap
    diviSynth = synthFee.isGreaterThan(one) && synthFee
    return [synthOut, synthFee, diviSynth, diviSwap, baseCapped, synthCapped]
  }
  // Swap & mint TOKEN -> SPARTA -> SYNTH
  const [_spartaSwap, swapFee, _diviSwap] = swapTo(
    input,
    swapPool,
    swapPool,
    feeOnTsf,
    true,
    false,
  ) // Swap TOKEN to SPARTA (User -> Pool -> Router)
  if (swapPool.tokenAddress === synthPool.tokenAddress) {
    baseAmount = baseAmount.minus(_spartaSwap)
    tokenAmount = tokenAmount.plus(input)
    synthCap = tokenAmount.times(synthPool.synthCap).div(10000)
    minDebt = minSynth.times(tokenAmount).div(10000)
    minCollat = minSynth.times(baseAmount).div(10000)
    collat = collateral.isGreaterThan(minCollat) ? collateral : minCollat
    debt = synthSupply.isGreaterThan(minDebt) ? synthSupply : minDebt
    virtualPool = {
      baseAmount: baseAmount.plus(collat),
      tokenAmount: tokenAmount.minus(debt),
    }
  }
  const _spartaRec = minusFeeBurn(_spartaSwap, feeOnTsf) // Router receives SPARTA (feeBurn)
  const _spartaRec1 = minusFeeBurn(_spartaRec, feeOnTsf) // Pool receives SPARTA (feeBurn)
  baseCapped = baseAmount.plus(_spartaRec1).isGreaterThan(synthPool.baseCap) // Check if this will exceed the base cap
  const [synthOut, synthFee] = calcSwapOutput(_spartaRec1, virtualPool, false) // Swap SPARTA for SYNTH (Pool -> User)
  synthCapped = synthSupply.plus(synthOut).isGreaterThan(synthCap) // Check if this will exceed the synth cap
  const slipFee = swapFee.plus(synthFee)
  diviSwap = _diviSwap
  diviSynth = synthFee.isGreaterThan(one) && synthFee
  return [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
}

/**
 * Calculate burn-synth txn details
 * @param input @param swapPool @param synthPool
 * @param synth @param feeOnTsf @param toBase
 * @returns [tokenOut, slipFee, diviSynth, diviSwap]
 */
export const burnSynth = (
  input,
  swapPool,
  synthPool,
  synth,
  feeOnTsf,
  toBase = false,
) => {
  let diviSynth = BN(0)
  let diviSwap = BN(0)
  const baseAmount = BN(synthPool.baseAmount)
  const tokenAmount = BN(synthPool.tokenAmount)
  const minSynth = BN(synthPool.minSynth)
  const collateral = BN(synthPool.collateral)
  const synthSupply = BN(synth.totalSupply)
  const minDebt = minSynth.times(tokenAmount).div(10000)
  const minCollat = minSynth.times(baseAmount).div(10000)
  const collat = collateral.isGreaterThan(minCollat) ? collateral : minCollat
  const debt = synthSupply.isGreaterThan(minDebt) ? synthSupply : minDebt
  const virtualPool = {
    baseAmount: baseAmount.plus(collat),
    tokenAmount: tokenAmount.minus(debt),
  }
  if (toBase) {
    // Simple burn SYNTH -> SPARTA -> USER
    const [spartaOut, synthFee] = calcSwapOutput(input, virtualPool, true) // Swap SPARTA for SYNTH (Pool -> User)
    const tokenOut = minusFeeBurn(spartaOut, feeOnTsf) // User receives SPARTA (feeBurn)
    diviSynth = synthFee.isGreaterThan(one) && synthFee
    return [tokenOut, synthFee, diviSynth, diviSwap]
  }
  // Burn SYNTH -> TOKEN -> ROUTER -> USER
  const [spartaOut, synthFee] = calcSwapOutput(input, virtualPool, true) // Swap SPARTA for SYNTH (Pool -> Router)
  const _spartaRec = minusFeeBurn(spartaOut, feeOnTsf) // Router receives SPARTA (feeBurn)
  diviSynth = synthFee.isGreaterThan(one) && synthFee
  const _spartaRec1 = minusFeeBurn(_spartaRec, feeOnTsf) // Pool receives SPARTA (feeBurn)
  const updatedPool = {}
  updatedPool.curated = swapPool.curated
  updatedPool.baseAmount = swapPool.baseAmount
  updatedPool.tokenAmount = swapPool.tokenAmount
  if (swapPool.tokenAddress === synthPool.tokenAddress) {
    updatedPool.baseAmount = baseAmount.plus(_spartaRec1)
  }
  const [tokenOut, swapFee, , _diviSwap] = swapTo(
    _spartaRec1,
    updatedPool,
    updatedPool,
    feeOnTsf,
    false,
    true,
  ) // Swap SPARTA to TOKEN (Pool -> User)
  const slipFee = synthFee.plus(swapFee)
  diviSynth = synthFee.isGreaterThan(one) && synthFee
  diviSwap = _diviSwap
  return [tokenOut, slipFee, diviSynth, diviSwap]
}
