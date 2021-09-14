import { calcLiqValue, calcLiquidityUnits, calcSwapOutput } from './utils'
import { BN } from '../bigNumber'
import { getAddresses } from '../web3'
import { getSecsSince, minusFeeBurn } from './nonContract'

export const one = BN(1).times(10).pow(18)

/**
 * Calculate LP tokens from liquidity-add
 * @param inputToken @param pool @param feeOnTsf
 * @returns [unitsLP, slipRevert, capRevert]
 */
export const addLiq = (inputToken, pool, feeOnTsf, inputSparta) => {
  if (pool) {
    const _baseAmount = BN(pool.baseAmount) // TOKEN received by pool
    const _inputToken = BN(inputToken) // TOKEN received by pool
    const _inputSparta = BN(inputSparta) // SPARTA sent to pool
    const _recSparta = minusFeeBurn(_inputSparta, feeOnTsf) // SPARTA received by pool
    const capRevert = _baseAmount.plus(_recSparta).isGreaterThan(pool.baseCap)
    const [unitsLP, slipRevert] = calcLiquidityUnits(
      _recSparta,
      _inputToken,
      pool,
    ) // Calc LP units
    return [unitsLP, slipRevert, capRevert]
  }
  return ['0.00', false, false]
}

/**
 * Calculate LP tokens from asym-liquidity-add
 * @param input @param pool @param fromBase @param feeOnTsf
 * @returns [unitsLP, swapFee, slipRevert, capRevert]
 */
export const addLiqAsym = (input, pool, fromBase, feeOnTsf) => {
  if (pool) {
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
    // Update pools balances
    let baseAmnt = BN(pool.baseAmount)
    let tokenAmnt = BN(pool.tokenAmount)
    const totSupp = pool.poolUnits
    baseAmnt = fromBase ? baseAmnt.plus(_swapInRec) : baseAmnt.minus(_swapOut)
    tokenAmnt = fromBase
      ? tokenAmnt.minus(_swapOut)
      : tokenAmnt.plus(_swapInRec)
    const _pool = {
      baseAmount: baseAmnt,
      tokenAmount: tokenAmnt,
      poolUnits: totSupp,
    }
    const [unitsLP, slipRevert] = calcLiquidityUnits(
      _recSparta,
      _recToken,
      _pool,
    ) // Calc LP units
    const capRevert = baseAmnt.plus(_recSparta).isGreaterThan(pool.baseCap)
    return [unitsLP, swapFee, slipRevert, capRevert]
  }
  return ['0.00', '0.00', false, false]
}

/**
 * Calculate SPARTA & TOKEN output from liquidity-remove **NEED TO ADD CHECK FOR ADDRESS; 1 LESS FEEBURN IF NOT BNB
 * @param inputLP @param pool @param feeOnTsf
 * @returns [_recSparta, _tokenOut, _baseOut]
 */
export const removeLiq = (inputLP, pool, feeOnTsf) => {
  const addr = getAddresses()
  const isBNB =
    pool.tokenAddress === addr.bnb || pool.tokenAddress === addr.wbnb
  const _inputLP = BN(inputLP) // LP units received by pool
  const [_baseOut, _tokenOut] = calcLiqValue(_inputLP, pool) // Get redemption value of the LP units
  let _recSparta = minusFeeBurn(_baseOut, feeOnTsf) // SPARTA received by user
  _recSparta = isBNB ? minusFeeBurn(_recSparta, feeOnTsf) : _recSparta // If BNB pool; another feeBurn via Router (unwrap)
  return [_recSparta, _tokenOut, _baseOut]
}

/**
 * Calculate SPARTA & TOKEN output from a one-sided liquidity-remove
 * @param inputLP @param pool @param toBase @param feeOnTsf
 * @returns [tokensOut, swapFee, divi]
 */
export const removeLiqAsym = (inputLP, pool, toBase, feeOnTsf) => {
  const _inputLP = BN(inputLP) // LP units received by pool
  const [_baseOut, _tokenOut] = calcLiqValue(_inputLP, pool) // SPARTA & TOKEN sent out from pool
  const _recSparta = minusFeeBurn(_baseOut, feeOnTsf) // SPARTA received by router
  const _recSparta1 = minusFeeBurn(_recSparta, feeOnTsf) // SPARTA received by pool
  const _baseAmount = BN(pool.baseAmount).minus(_baseOut) // Update pool's SPARTA balance
  const _tokenAmount = BN(pool.tokenAmount).minus(_tokenOut) // Update pool's TOKEN balance
  const _pool = {
    baseAmount: _baseAmount,
    tokenAmount: _tokenAmount,
  }
  const [_swapOut, swapFee] = toBase
    ? calcSwapOutput(_tokenOut, _pool, toBase) // SPARTA output from swap
    : calcSwapOutput(_recSparta1, _pool, toBase) // TOKEN output from swap
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
 * @param input @param pool1 @param pool2 @param feeOnTsf
 * @returns [unitsLP, swapFee, slipRevert, capRevert]
 */
export const zapLiq = (input, pool1, pool2, feeOnTsf) => {
  const _input = BN(input) // LP1 received by pool1
  const [_sparta, _token, _spartaOut] = removeLiq(_input, pool1, feeOnTsf) // TOKEN & SPARTA leaving pool1 (after feeBurn)
  let _baseAmount = BN(pool1.baseAmount).minus(_spartaOut) // Updated pool1 SPARTA balance
  let _tokenAmount = BN(pool1.tokenAmount).minus(_token) // Updated pool1 TOKEN balance
  const _pool1 = {
    baseAmount: _baseAmount,
    tokenAmount: _tokenAmount,
  }
  const [_sparta1, fee1] = calcSwapOutput(_token, _pool1, true) // TOKEN goes to _pool1 & swap for SPARTA
  const _spartaRec1 = minusFeeBurn(_sparta1, feeOnTsf) // SPARTA received by Router (after feeBurn)
  const _spartaHalf = _sparta.plus(_spartaRec1).div(2) // SPARTA sent from Router (half of balance)
  const _spartaHalfRec = minusFeeBurn(_spartaHalf, feeOnTsf) // SPARTA received by pool2 (after feeBurn)
  const [_token2, fee2] = calcSwapOutput(_spartaHalfRec, pool2, false) // SPARTA swapped for token2
  const _poolUnits = BN(pool2.poolUnits)
  _baseAmount = BN(pool2.baseAmount).plus(_spartaHalfRec) // Updated pool2 SPARTA balance
  _tokenAmount = BN(pool2.tokenAmount).minus(_token2) // Updated pool2 TOKEN balance
  const _pool2 = {
    poolUnits: _poolUnits,
    baseAmount: _baseAmount,
    tokenAmount: _tokenAmount,
  }
  const [unitsLP, slipR, capR] = addLiq(_token2, _pool2, feeOnTsf, _spartaHalf) // Calc LP units
  const swapFee = fee1.plus(fee2)
  return [unitsLP, swapFee, slipR, capR]
}

/**
 * Get the details of a swap | output, slipFee, dividends
 * Make sure to handle dividend checks on other side (ie. [reserve.emissions === true] etc)
 * @param input @param inPool @param outPool
 * @param feeOnTsf @param toBase @param fromBase
 * @returns [output, swapFee, divi1, divi2, spartaOut]
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
    return [_tokenOut, swapFee, divi1, divi2, '0']
  }
  if (toBase) {
    // Simple swap TOKEN -> SPARTA
    const [spartaOut, swapFee] = calcSwapOutput(input, inPool, true) // Tsf & Swap TOKEN to SPARTA (User -> Pool1 -> User)
    const _spartaRec = minusFeeBurn(spartaOut, feeOnTsf) // SPARTA received (User) (feeBurn)
    divi1 = inPool.curated && swapFee.isGreaterThan(one) && swapFee
    return [_spartaRec, swapFee, divi1, divi2, spartaOut]
  }
  // Double swap TOKEN1 -> TOKEN2
  const [spartaOut, swapFee1] = calcSwapOutput(input, inPool, true) // Tsf & Swap TOKEN to SPARTA (User -> Pool1 -> Pool2)
  divi1 = inPool.curated && swapFee1.isGreaterThan(one) && swapFee1
  const _spartaOut = minusFeeBurn(spartaOut, feeOnTsf) // SPARTA received (Pool2) (feeBurn)
  const [_tokenOut, swapFee2] = calcSwapOutput(_spartaOut, outPool, false) // Swap SPARTA to TOKEN (Pool2 -> Router -> User)
  const swapFee = swapFee1.plus(swapFee2)
  divi2 = outPool.curated && swapFee2.isGreaterThan(one) && swapFee2
  return [_tokenOut, swapFee, divi1, divi2, spartaOut]
}

/**
 *
 * @param synthPoolSynthCap @param synthPoolTokenAmnt @param synth
 * @returns steamedSynths
 */
export const stirCauldron = (synthPoolSynthCap, synthPoolTokenAmnt, synth) => {
  const oneWeek = BN(604800) // this is 1 on testnet; 604800 on mainnet
  const totalSup = BN(synth.totalSupply)
  const _lastStirred = BN(synth.lastStirred)
  let _stirRate = BN(synth.stirRate)
  const _tokenAmount = BN(synthPoolTokenAmnt)
  const _cap = BN(synthPoolSynthCap)
  const synthsCap = _tokenAmount.times(_cap).div(10000)
  let liquidSynths = BN(0)
  let steamedSynths = BN(0)
  if (synthsCap.isGreaterThanOrEqualTo(totalSup)) {
    liquidSynths = synthsCap.minus(totalSup)
  }
  if (_lastStirred.isGreaterThan(0)) {
    const secsSinceStir = getSecsSince(_lastStirred) // Get time passed since stirred
    steamedSynths = secsSinceStir.times(_stirRate) // time since last minted
  } else {
    _stirRate = liquidSynths.div(oneWeek)
    steamedSynths = BN(14400).times(_stirRate) // 4hrs
  }
  return steamedSynths
}

/**
 * Calculate mint-synth txn details
 * @param input @param swapPool @param synthPool
 * @param synth @param feeOnTsf @param fromBase
 * @returns [synthOut, synthFee, diviSynth, diviSwap, baseCapped, synthCapped]
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
  const _totalSupply = BN(synth.totalSupply)
  // Simple mint SPARTA -> SYNTH ------------------------------------------------------------
  if (fromBase) {
    const _spartaRec = minusFeeBurn(input, feeOnTsf) // Pool receives SPARTA (feeBurn)
    baseCapped = baseAmount.plus(_spartaRec).isGreaterThan(synthPool.baseCap) // Check if this will exceed the base cap
    const [synthOut, synthFee] = calcSwapOutput(_spartaRec, synthPool, false) // Swap SPARTA for SYNTH (Pool -> User)
    const _synthRec = BN(synthOut.times(0.99).toFixed(0)) // Synths after 1% slip
    synthCapped = _totalSupply
      .plus(synthOut)
      .isGreaterThan(stirCauldron(synthPool.synthCap, tokenAmount, synth)) // Check if this will exceed the dynamic synth cap
    diviSynth = synthFee.isGreaterThan(one) && synthFee
    return [_synthRec, synthFee, diviSynth, diviSwap, baseCapped, synthCapped]
  }
  // Swap & mint TOKEN -> SPARTA -> SYNTH ---------------------------------------------------
  const [_spartaSwap, swapFee, _diviSwap, , spartaOut] = swapTo(
    input,
    swapPool,
    swapPool,
    feeOnTsf,
    true,
    false,
  ) // Swap TOKEN to SPARTA (User -> Pool -> Router)
  if (swapPool.tokenAddress === synthPool.tokenAddress) {
    baseAmount = baseAmount.minus(spartaOut)
    tokenAmount = tokenAmount.plus(input)
  }
  const _spartaRec1 = minusFeeBurn(_spartaSwap, feeOnTsf) // Pool receives SPARTA (feeBurn)
  baseCapped = baseAmount.plus(_spartaRec1).isGreaterThan(synthPool.baseCap) // Check if this will exceed the base cap
  const [synthOut, synthFee] = calcSwapOutput(_spartaRec1, synthPool, false) // Swap SPARTA for SYNTH (Pool -> User)
  const _synthRec = BN(synthOut.times(0.99).toFixed(0)) // Synths after 1% slip
  synthCapped = _totalSupply
    .plus(synthOut)
    .isGreaterThan(stirCauldron(synthPool.synthCap, tokenAmount, synth)) // Check if this will exceed the dynamic synth cap
  const slipFee = swapFee.plus(synthFee)
  diviSwap = _diviSwap
  diviSynth = synthFee.isGreaterThan(one) && synthFee
  return [_synthRec, slipFee, diviSynth, diviSwap, baseCapped]
}

/**
 * Calculate burn-synth txn details
 * @param input @param swapPool @param synthPool
 * @param feeOnTsf @param toBase
 * @returns [tokenOut, slipFee, diviSynth, diviSwap]
 */
export const burnSynth = (
  input,
  swapPool,
  synthPool,
  feeOnTsf,
  toBase = false,
) => {
  let diviSynth = BN(0)
  let diviSwap = BN(0)
  const baseAmount = BN(synthPool.baseAmount)
  if (toBase) {
    // Simple burn SYNTH -> SPARTA -> USER
    const [spartaOut, synthFee] = calcSwapOutput(input, synthPool, true) // Swap SYNTH for SPARTA (Pool -> User)
    const _spartaRec = BN(spartaOut.times(0.95).toFixed(0)) // SPARTA after 5% slip
    const tokenOut = minusFeeBurn(_spartaRec, feeOnTsf) // User receives SPARTA (feeBurn)
    diviSynth = synthFee.isGreaterThan(one) && synthFee
    return [tokenOut, synthFee, diviSynth, diviSwap]
  }
  // Burn SYNTH -> TOKEN -> ROUTER -> USER
  const [spartaOut, synthFee] = calcSwapOutput(input, synthPool, true) // Swap SYNTH for SPARTA (Pool -> Router)
  const _spartaRec = BN(spartaOut.times(0.95).toFixed(0)) // SPARTA after 5% slip
  const _spartaRec0 = minusFeeBurn(_spartaRec, feeOnTsf) // Router receives SPARTA (feeBurn)
  diviSynth = synthFee.isGreaterThan(one) && synthFee
  const _spartaRec1 = minusFeeBurn(_spartaRec0, feeOnTsf) // Pool receives SPARTA (feeBurn)
  const updatedPool = {}
  updatedPool.curated = swapPool.curated
  updatedPool.baseAmount = swapPool.baseAmount
  updatedPool.tokenAmount = swapPool.tokenAmount
  if (swapPool.tokenAddress === synthPool.tokenAddress) {
    updatedPool.baseAmount = baseAmount.minus(_spartaRec)
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
