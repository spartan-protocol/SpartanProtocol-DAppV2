import * as Types from './types'
import { getUtilsContract } from '../../utils/web3Utils'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const utilsPricingLoading = () => ({
  type: Types.UTILSPRICING_LOADING,
})

export const getBasePPinToken = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const basePPinToken = await contract.callStatic.calcBasePPinToken(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_BASE_P_PIN_TOKEN, basePPinToken))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

export const getTokenPPinBase = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const tokenPPinBase = await contract.callStatic.calcTokenPPinBase(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_TOKEN_P_PIN_BASE, tokenPPinBase))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

export const getValueInToken = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInToken = await contract.callStatic.calcValueInToken(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_VALUE_IN_TOKEN, valueInToken))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

export const getValueInBase = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInBase = await contract.callStatic.calcValueInBase(token, amount)
    dispatch(payloadToDispatch(Types.GET_VALUE_IN_BASE, valueInBase))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

// NEW ONES TO ADD:

/**
 * Calculate the spot value in SPARTA (No slip)
 * @param {address} token
 * @param {uint} amount
 * @returns {uint} value
 */
export const getSpotValueInBase = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInBase = await contract.callStatic.calcSpotValueInBase(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_SPOT_VALUE_IN_BASE, valueInBase))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

/**
 * Calculate the spot value in TOKEN (No slip)
 * @param {address} token
 * @param {uint} amount
 * @returns {uint} value
 */
export const getSpotValueInToken = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInToken = await contract.callStatic.calcSpotValueInToken(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_SPOT_VALUE_IN_TOKEN, valueInToken))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

/**
 * Calculate the swap value in SPARTA (Including slip)
 * @param {address} token
 * @param {uint} amount
 * @returns {uint} output
 */
export const getSwapValueInBase = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInBase = await contract.callStatic.calcSwapValueInBase(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_SWAP_VALUE_IN_BASE, valueInBase))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}

/**
 * Calculate the swap value in TOKEN (Including slip)
 * @param {address} token
 * @param {uint} amount
 * @returns {uint} output
 */
export const getSwapValueInToken = (token, amount) => async (dispatch) => {
  dispatch(utilsPricingLoading())
  const contract = getUtilsContract()

  try {
    const valueInToken = await contract.callStatic.calcSwapValueInToken(
      token,
      amount,
    )
    dispatch(payloadToDispatch(Types.GET_SWAP_VALUE_IN_TOKEN, valueInToken))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILSPRICING_ERROR, error))
  }
}
