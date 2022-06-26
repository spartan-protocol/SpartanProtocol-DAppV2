/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getAddresses, getNetwork, parseTxn } from '../../utils/web3'
import { getRouterContract } from '../../utils/getContracts'
import { BN } from '../../utils/bigNumber'

export const useRouter = () => useSelector((state) => state.router)

export const routerSlice = createSlice({
  name: 'router',
  initialState: {
    loading: false,
    error: null,
    txn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
  },
})

export const { updateLoading, updateError, updateTxn } = routerSlice.actions

/**
 * Add Liquidity to a pool symmetrically
 * @param inputToken @param inputBase @param token @param wallet
 */
export const addLiquidity =
  (inputToken, inputBase, token, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const addr = getAddresses()
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = {
        value: token === addr.bnb ? inputToken : null,
        gasPrice: gPrice,
      }
      let txn = await contract.addLiquidity(inputToken, inputBase, token, ORs)
      txn = await parseTxn(txn, 'addLiq', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Add liquidity asymmetrically
 * @param input @param fromBase @param token @param wallet
 */
export const addLiquiditySingle =
  (input, fromBase, token, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const addr = getAddresses()
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = {
        value: token === addr.bnb && fromBase !== true ? input : null,
        gasPrice: gPrice,
      }
      let txn = await contract.addLiquidityAsym(input, fromBase, token, ORs)
      txn = await parseTxn(txn, 'addLiqSingle', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Swap LP tokens for other LP tokens
 * @param unitsInput @param fromPool @param toPool @param wallet
 */
export const zapLiquidity =
  (unitsInput, fromPool, toPool, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.zapLiquidity(unitsInput, fromPool, toPool, ORs)
      txn = await parseTxn(txn, 'zapLiq', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Remove liquidity symmetrically
 * @param units @param token @param wallet
 */
export const removeLiquidityExact =
  (units, token, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.removeLiquidityExact(units, token, ORs)
      txn = await parseTxn(txn, 'remLiq', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Remove liquidity asymmetrically
 * @param units @param toBase @param token @param wallet
 */
export const removeLiquiditySingle =
  (units, toBase, token, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.removeLiquidityExactAsym(units, toBase, token, {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'remLiqSingle', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

// --------------------------------------- SWAP FUNCTIONS ---------------------------------------

/**
 * Swap BEP20 assets
 * @param inputAmount @param fromToken @param toToken @param wallet
 */
export const swap =
  (inputAmount, fromToken, toToken, minAmount, wallet) =>
  async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const addr = getAddresses()
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
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
      txn = await parseTxn(txn, 'swapped', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Swap BEP20 for synthetic assets
 * @param inputAmount @param fromToken @param toSynth @param wallet
 */
export const swapAssetToSynth =
  (inputAmount, fromToken, toSynth, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const addr = getAddresses()
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
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
      txn = await parseTxn(txn, 'mintSynth', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Swap synthetic assets for SPARTA
 * @param inputAmount @param fromSynth @param toToken @param wallet
 */
export const swapSynthToAsset =
  (inputAmount, fromSynth, toToken, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getRouterContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.swapSynthToAsset(
        inputAmount,
        fromSynth,
        toToken,
        { gasPrice: gPrice },
      )
      txn = await parseTxn(txn, 'burnSynth', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Attempt to unfreeze the protocol
 */
export const updatePoolStatus = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getRouterContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    let gPrice = getNetwork().chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice()
    let txn = await contract.updatePoolStatus({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'unfreeze', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default routerSlice.reducer
