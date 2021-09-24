import * as Types from './types'
import { getAddresses, getProviderGasPrice, parseTxn } from '../../utils/web3'
import { getRouterContract } from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const routerLoading = () => ({
  type: Types.ROUTER_LOADING,
})

/**
 * Add Liquidity to a pool symmetrically
 * @param inputToken @param inputBase @param token @param wallet
 */
export const addLiquidity =
  (inputToken, inputBase, token, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const addr = getAddresses()
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = {
        value: token === addr.bnb ? inputToken : null,
        gasPrice: gPrice,
      }
      let txn = await contract.addLiquidity(inputToken, inputBase, token, ORs)
      txn = await parseTxn(txn, 'addLiq')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Add liquidity asymmetrically
 * @param input @param fromBase @param token @param wallet
 */
export const addLiquiditySingle =
  (input, fromBase, token, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const addr = getAddresses()
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = {
        value: token === addr.bnb && fromBase !== true ? input : null,
        gasPrice: gPrice,
      }
      let txn = await contract.addLiquidityAsym(input, fromBase, token, ORs)
      txn = await parseTxn(txn, 'addLiqSingle')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Swap LP tokens for other LP tokens
 * @param unitsInput @param fromPool @param toPool @param wallet
 */
export const zapLiquidity =
  (unitsInput, fromPool, toPool, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = { gasPrice: gPrice }
      let txn = await contract.zapLiquidity(unitsInput, fromPool, toPool, ORs)
      txn = await parseTxn(txn, 'zapLiq')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Remove liquidity symmetrically
 * @param units @param token @param wallet
 */
export const removeLiquidityExact =
  (units, token, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = { gasPrice: gPrice }
      let txn = await contract.removeLiquidityExact(units, token, ORs)
      txn = await parseTxn(txn, 'remLiq')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Remove liquidity asymmetrically
 * @param units @param toBase @param token @param wallet
 */
export const removeLiquiditySingle =
  (units, toBase, token, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      let txn = await contract.removeLiquidityExactAsym(units, toBase, token, {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'remLiqSingle')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

// --------------------------------------- SWAP FUNCTIONS ---------------------------------------

/**
 * Swap BEP20 assets
 * @param inputAmount @param fromToken @param toToken @param wallet
 */
export const swap =
  (inputAmount, fromToken, toToken, minAmount, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const addr = getAddresses()
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = {
        value: fromToken === addr.bnb ? inputAmount : null,
        gasPrice: gPrice,
      }
      let txn = await contract.swap(
        inputAmount,
        fromToken,
        toToken,
        minAmount,
        ORs,
      )
      txn = await parseTxn(txn, 'swapped')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Swap BEP20 for synthetic assets
 * @param inputAmount @param fromToken @param toSynth @param wallet
 */
export const swapAssetToSynth =
  (inputAmount, fromToken, toSynth, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const addr = getAddresses()
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = {
        value: fromToken === addr.bnb ? inputAmount : null,
        gasPrice: gPrice,
      }
      let txn = await contract.swapAssetToSynth(
        inputAmount,
        fromToken,
        toSynth,
        ORs,
      )
      txn = await parseTxn(txn, 'mintSynth')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Swap synthetic assets for SPARTA
 * @param inputAmount @param fromSynth @param toToken @param wallet
 */
export const swapSynthToAsset =
  (inputAmount, fromSynth, toToken, wallet) => async (dispatch) => {
    dispatch(routerLoading())
    const contract = getRouterContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      let txn = await contract.swapSynthToAsset(
        inputAmount,
        fromSynth,
        toToken,
        { gasPrice: gPrice },
      )
      txn = await parseTxn(txn, 'burnSynth')
      dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
    }
  }

/**
 * Attempt to unfreeze the protocol
 */
export const updatePoolStatus = (wallet) => async (dispatch) => {
  dispatch(routerLoading())
  const contract = getRouterContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.updatePoolStatus({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'unfreeze')
    dispatch(payloadToDispatch(Types.ROUTER_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.ROUTER_ERROR, `${error}.`))
  }
}
