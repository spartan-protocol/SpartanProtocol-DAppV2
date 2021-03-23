import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { getRouterContract } from '../../utils/web3Router'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const routerLoading = () => ({
  type: Types.ROUTER_LOADING,
})

export const routerAddLiq = (inputBase, inputToken, token, justCheck) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    let liquidity = {}
    if (justCheck) {
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
    if (justCheck) {
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
    if (justCheck) {
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

/**
 * Add liquidity asymmetrically
 * @param {uint} inputToken
 * @param {bool} fromBase
 * @param {address} token
 * @returns {unit} units
 */
export const routerAddLiqAsym = (inputToken, fromBase, token) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidityAsym(
      inputToken,
      fromBase,
      token,
    )
    const units = await contract.addLiquidityAsym(inputToken, fromBase, token, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.ROUTER_ADD_LIQ_ASYM, units))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

/**
 * Swap LP tokens for other LP tokens
 * @param {uint} unitsLP
 * @param {address} fromToken
 * @param {address} toToken
 * @returns {unit} units
 * @returns {unit} fee
 */
export const routerZapLiquidity = (unitsLP, fromToken, toToken) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.zapLiquidity(
      unitsLP,
      fromToken,
      toToken,
    )
    const proposalID = await contract.zapLiquidity(
      unitsLP,
      fromToken,
      toToken,
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )
    dispatch(payloadToDispatch(Types.ROUTER_ZAP_LIQUIDITY, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

/**
 * Remove liquidity asymmetrically
 * @param {uint} units
 * @param {bool} toBase
 * @param {address} token
 * @returns {unit} outputAmount
 * @returns {unit} fee
 */
export const routerRemoveLiqAsym = (units, toBase, token) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.removeLiquidityAsym(
      units,
      toBase,
      token,
    )
    const liquidity = await contract.removeLiquidityAsym(units, toBase, token, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.ROUTER_REMOVE_LIQ_ASYM, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

/**
 * Swap SPARTA for synthetic assets
 * @param {uint} inputAmount
 * @param {address} synthOut
 * @returns {unit} outputSynth
 */
export const routerSwapBaseToSynth = (inputAmount, synthOut) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.swapBaseToSynth(
      inputAmount,
      synthOut,
    )
    const outputSynth = await contract.swapBaseToSynth(inputAmount, synthOut, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.ROUTER_SWAP_BASE_TO_SYNTH, outputSynth))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}

/**
 * Swap synthetic assets for SPARTA
 * @param {uint} inputAmount
 * @param {address} synthIn
 * @returns {unit} output
 */
export const routerSwapSynthToBase = (inputAmount, synthIn) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.swapSynthToBase(
      inputAmount,
      synthIn,
    )
    const output = await contract.swapSynthToBase(inputAmount, synthIn, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.ROUTER_SWAP_SYNTH_TO_BASE, output))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, error))
  }
}
