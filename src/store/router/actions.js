import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { getRouterContract } from '../../utils/web3Router'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const routerLoading = () => ({
  type: Types.ROUTER_LOADING,
})

export const getPool = (token) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const pool = await contract.callStatic.getPool(token)
    dispatch(payloadToDispatch(Types.GET_POOL, pool))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

export const getTokenCount = () => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const tokenCount = await contract.callStatic.tokenCount()
    dispatch(payloadToDispatch(Types.GET_TOKEN_COUNT, tokenCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

export const getTotalPooledValue = () => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const totalPooled = await contract.callStatic.totalPooled()
    dispatch(payloadToDispatch(Types.GET_TOTAL_POOLED_VALUE, totalPooled))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

export const routerAddLiq = (inputBase, inputToken, token, justCheck) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    let liquidity = {}
    if (justCheck === true) {
      liquidity = await contract.callStatic.addLiquidity(
        inputBase,
        inputToken,
        token,
      )
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.addLiquidity(
        inputBase,
        inputToken,
        token,
      )
      liquidity = await contract.addLiquidity(inputBase, inputToken, token, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.ROUTER_ADD_LIQ, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

export const routerRemoveLiq = (basisPoints, token, justCheck) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    let liquidity = {}
    if (justCheck === true) {
      liquidity = await contract.callStatic.removeLiquidity(basisPoints, token)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.removeLiquidity(
        basisPoints,
        token,
      )
      liquidity = await contract.removeLiquidity(basisPoints, token, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.ROUTER_REMOVE_LIQ, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

export const routerSwapAssets = (
  inputAmount,
  fromToken,
  toToken,
  justCheck,
) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    let assetsSwapped = {}
    if (justCheck === true) {
      assetsSwapped = await contract.callStatic.swap(
        inputAmount,
        fromToken,
        toToken,
      )
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.swap(
        inputAmount,
        fromToken,
        toToken,
      )
      assetsSwapped = await contract.swap(inputAmount, fromToken, toToken, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.ROUTER_SWAP_ASSETS, assetsSwapped))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}
