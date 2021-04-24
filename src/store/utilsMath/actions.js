import * as Types from './types'
import { getUtilsContract } from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const utilsMathLoading = () => ({
  type: Types.UTILS_MATH_LOADING,
})

export const getPart = (basisPoints, total) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const part = await contract.callStatic.calcPart(basisPoints, total)
    dispatch(payloadToDispatch(Types.GET_PART, part))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getLiquidityShare = (units, token, pool, member) => async (
  dispatch,
) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const liquidityShare = await contract.callStatic.calcLiquidityShare(
      units,
      token,
      pool,
      member,
    )
    dispatch(payloadToDispatch(Types.GET_LIQUIDITY_SHARE, liquidityShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getShare = (part, total, amount) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const share = await contract.callStatic.calcShare(part, total, amount)
    dispatch(payloadToDispatch(Types.GET_SHARE, share))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getSwapOutput = (x, X, Y) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const swapOutput = await contract.callStatic.calcSwapOutput(x, X, Y)
    dispatch(payloadToDispatch(Types.GET_SWAP_OUTPUT, swapOutput))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getSwapFee = (x, X, Y) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const swapFee = await contract.callStatic.calcSwapFee(x, X, Y)
    dispatch(payloadToDispatch(Types.GET_SWAP_FEE, swapFee))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getLiquidityUnits = (b, B, t, T, P) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const liquidityUnits = await contract.callStatic.calcLiquidityUnits(
      b,
      B,
      t,
      T,
      P,
    )
    dispatch(payloadToDispatch(Types.GET_LIQUIDITY_UNITS, liquidityUnits))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getSlipAdustment = (b, B, t, T) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const slipAdustment = await contract.callStatic.getSlipAdustment(b, B, t, T)
    dispatch(payloadToDispatch(Types.GET_SLIP_ADUSTMENT, slipAdustment))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

export const getAsymmetricShare = (poolAddr, memberAddr) => async (
  dispatch,
) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const asymmetricShare = await contract.callStatic.calcAsymmetricShare(
      poolAddr,
      memberAddr,
    )
    dispatch(payloadToDispatch(Types.GET_ASYMMETRICS_SHARE, asymmetricShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

/**
 * Calculate the value of a synthetic asset
 * @param {address} pool
 * @param {uint} amount
 * @returns {uint} units
 */
export const getSynthsValue = (pool, amount) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const units = await contract.callStatic.calcSynthsValue(pool, amount)
    dispatch(payloadToDispatch(Types.GET_SYNTHS_VALUE, units))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}

/**
 * Calculate the value of a synthetic asset
 * @param {address} synth
 * @returns {uint} cdpValue
 */
export const getCDPValue = (synth) => async (dispatch) => {
  dispatch(utilsMathLoading())
  const contract = getUtilsContract()

  try {
    const cdpValue = await contract.callStatic.calcCDPValue(synth)
    dispatch(payloadToDispatch(Types.GET_CDP_VALUE, cdpValue))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_MATH_ERROR, error))
  }
}
