import { BN } from './bigNumber'
import {
  calcFeeBurn,
  calcLiquidityHoldings,
  calcLiquidityUnits,
  calcSpotValueInBase,
  calcSwapOutput,
} from './web3Utils'

export const one = BN(1).times(10).pow(18)

// ////////////// ROUTER CALCS //////////////////////////

/**
 * Calculate LP tokens from liquidity-add
 * @param inputToken
 * @param poolDetails
 * @param feeOnTsf
 * @returns [unitsLP, _inputSparta]
 */
export const addLiquidityForMember = (inputToken, poolDetails, feeOnTsf) => {
  const _inputToken = BN(inputToken) // TOKEN received by pool
  const _inputSparta = calcSpotValueInBase(_inputToken, poolDetails) // SPARTA sent to pool
  const _recSparta = calcFeeBurn(feeOnTsf, _inputSparta) // SPARTA received by pool
  const unitsLP = calcLiquidityUnits(_recSparta, _inputToken, poolDetails) // Calc LP units
  return [unitsLP, _inputSparta]
}

/**
 * Calculate SPARTA & TOKEN output from liquidity-remove
 * @param inputLP
 * @param poolDetails
 * @param feeOnTsf
 * @returns [spartaOutput, tokenOutput]
 */
export const removeForMember = (inputLP, poolDetails, feeOnTsf) => {
  const _inputLP = BN(inputLP) // LP units received by pool
  const [_baseOut, _tokenOut] = calcLiquidityHoldings(_inputLP, poolDetails) // Get redemption value of the LP units
  const _recSparta = calcFeeBurn(feeOnTsf, _baseOut) // SPARTA received by user
  return [_recSparta, _tokenOut]
}

/**
 * Calculate LP tokens from asym-liquidity-add
 * @param input
 * @param pool poolDetails
 * @param fromBase
 * @param feeOnTsf
 * @returns [unitsLP, swapFee]
 */
export const addLiquidityAsymForMember = (input, pool, fromBase, feeOnTsf) => {
  const _input = BN(input) // TOKEN1 sent to Router
  const _received = fromBase ? calcFeeBurn(feeOnTsf, _input) : _input // TOKEN1 received by Router (after feeBurn)
  const _swapIn = _input.div(2) // TOKEN1 leaving the Router
  const _swapInRec = fromBase ? calcFeeBurn(feeOnTsf, _swapIn) : _swapIn // TOKEN1 received by Pool (after feeBurn)
  const [_swapOut, swapFee] = calcSwapOutput(_swapInRec, pool, !fromBase) // TOKEN2 leaving the Pool
  const _swapOutRec = fromBase ? _swapOut : calcFeeBurn(feeOnTsf, _swapOut) // TOKEN2 received by Router (after feeBurn)
  const _recSparta = fromBase
    ? _received.minus(_swapIn)
    : calcFeeBurn(feeOnTsf, _swapOutRec) // SPARTA received by Pool
  const _recToken = fromBase ? _swapOutRec : _received.minus(_swapIn) // TOKEN received by Pool
  const unitsLP = calcLiquidityUnits(_recSparta, _recToken, pool) // Calc LP units
  return [unitsLP, swapFee]
}
