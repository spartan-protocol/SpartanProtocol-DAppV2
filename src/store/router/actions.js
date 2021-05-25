import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { getRouterContract } from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const routerLoading = () => ({
  type: Types.ROUTER_LOADING,
})

/**
 * Get last full month's dividends revenue by pool (not fees; just divis)
 * @param {address} tokenAddress
 * @param {object} wallet
 * @returns {unit} lastMonthDivis
 */
export const getPastMonthDivis = (tokenAddress, wallet) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const lastMonthDivis = await contract.callStatic.mapPast30DPoolRevenue(
      tokenAddress,
    )

    dispatch(payloadToDispatch(Types.ROUTER_LAST_MONTH_DIVIS, lastMonthDivis))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Get the current month's dividends revenue by pool (not fees; just divis)
 * THIS IS NOT ROLLING; ONLY PARTIAL-MONTH UNTIL THE ARRAY IS COMPLETE THEN PURGES
 * @param {address} tokenAddress
 * @param {object} wallet
 * @returns {unit} thisMonthDivis
 */
export const getThisMonthDivis = (tokenAddress, wallet) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const thisMonthDivis = await contract.callStatic.map30DPoolRevenue(
      tokenAddress,
    )

    dispatch(payloadToDispatch(Types.ROUTER_THIS_MONTH_DIVIS, thisMonthDivis))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

export const routerAddLiq = (inputBase, inputToken, token, wallet) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value:
        token === '0x0000000000000000000000000000000000000000'
          ? inputToken
          : null,
      gasPrice: gPrice,
    }
    const liquidity = await contract.addLiquidity(
      inputBase,
      inputToken,
      token,
      ORs,
    )

    dispatch(payloadToDispatch(Types.ROUTER_ADD_LIQ, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

export const removeLiquidityExact = (units, token, wallet, justCheck) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    let liquidity = {}
    if (justCheck) {
      liquidity = await contract.callStatic.removeLiquidityExact(units, token)
    } else {
      const gPrice = await getProviderGasPrice()

      liquidity = await contract.removeLiquidityExact(units, token, {
        gasPrice: gPrice,
      })
    }
    dispatch(payloadToDispatch(Types.ROUTER_REMOVE_LIQ, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

export const routerSwapAssets = (
  inputAmount,
  fromToken,
  toToken,
  wallet,
) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value:
        fromToken === '0x0000000000000000000000000000000000000000'
          ? inputAmount
          : null,
      gasPrice: gPrice,
    }
    const assetsSwapped = await contract.swap(
      inputAmount,
      fromToken,
      toToken,
      ORs,
    )

    dispatch(payloadToDispatch(Types.ROUTER_SWAP_ASSETS, assetsSwapped))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Add liquidity asymmetrically
 * @param {uint} input
 * @param {bool} fromBase
 * @param {address} token
 * @param {object} wallet
 * @returns {unit} units
 */
export const addLiquiditySingle = (input, fromBase, token, wallet) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value:
        token === '0x0000000000000000000000000000000000000000' &&
        fromBase !== true
          ? input
          : null,
      gasPrice: gPrice,
    }
    const units = await contract.addLiquiditySingle(input, fromBase, token, ORs)
    dispatch(payloadToDispatch(Types.ROUTER_ADD_LIQ_SINGLE, units))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Swap LP tokens for other LP tokens
 * @param {uint} unitsLP
 * @param {address} fromToken
 * @param {address} toToken
 * @param {object} wallet
 * @returns {unit} units
 * @returns {unit} fee
 */
export const routerZapLiquidity = (
  unitsLP,
  fromToken,
  toToken,
  wallet,
) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const proposalID = await contract.zapLiquidity(
      unitsLP,
      fromToken,
      toToken,
      {
        gasPrice: gPrice,
      },
    )
    dispatch(payloadToDispatch(Types.ROUTER_ZAP_LIQUIDITY, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Remove liquidity asymmetrically
 * @param {uint} units
 * @param {bool} toBase
 * @param {address} token
 * @param {object} wallet
 * @returns {unit} outputAmount
 * @returns {unit} fee
 */
export const removeLiquiditySingle = (units, toBase, token, wallet) => async (
  dispatch,
) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const liquidity = await contract.removeLiquiditySingle(
      units,
      toBase,
      token,
      {
        gasPrice: gPrice,
      },
    )

    dispatch(payloadToDispatch(Types.ROUTER_REMOVE_LIQ_ASYM, liquidity))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Swap BEP20 for synthetic assets
 * @param {uint} inputAmount
 * @param {address} fromToken
 * @param {address} synthOut
 * @param {object} wallet
 * @returns {unit} outputSynth
 */
export const swapAssetToSynth = (
  inputAmount,
  fromToken,
  synthOut,
  wallet,
) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value:
        fromToken === '0x0000000000000000000000000000000000000000'
          ? inputAmount
          : null,
      gasPrice: gPrice,
    }
    const outputSynth = await contract.swapAssetToSynth(
      inputAmount,
      fromToken,
      synthOut,
      ORs,
    )

    dispatch(payloadToDispatch(Types.ROUTER_SWAP_ASSET_TO_SYNTH, outputSynth))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}

/**
 * Swap synthetic assets for SPARTA
 * @param {uint} inputAmount
 * @param {address} fromSynth
 * @param {address} toToken
 * @param {object} wallet
 * @returns {unit} output
 */
export const swapSynthToAsset = (
  inputAmount,
  fromSynth,
  toToken,
  wallet,
) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const output = await contract.swapSynthToAsset(
      inputAmount,
      fromSynth,
      toToken,
      {
        gasPrice: gPrice,
      },
    )

    dispatch(payloadToDispatch(Types.ROUTER_SWAP_SYNTH_TO_ASSET, output))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}
