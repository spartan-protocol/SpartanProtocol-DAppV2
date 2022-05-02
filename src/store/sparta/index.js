/* eslint-disable no-param-reassign */
import { ethers } from 'ethers'
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getFallenSpartansContract,
  getSpartaV2Contract,
} from '../../utils/getContracts'
import {
  addressesMN,
  bscRpcsMN,
  deadAddress,
  getAbis,
  getProviderGasPrice,
  parseTxn,
} from '../../utils/web3'

export const useSparta = () => useSelector((state) => state.sparta)

export const spartaSlice = createSlice({
  name: 'sparta',
  initialState: {
    loading: false,
    error: null,
    globalDetails: false,
    claimCheck: '0',
    txn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload.toString()
    },
    updateGlobalDetails: (state, action) => {
      state.globalDetails = action.payload
    },
    updateClaimCheck: (state, action) => {
      state.claimCheck = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
    updateCommunityWallet: (state, action) => {
      state.communityWallet = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateGlobalDetails,
  updateClaimCheck,
  updateTxn,
  updateCommunityWallet,
} = spartaSlice.actions

export const getSpartaGlobalDetails = (rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  // const contract1 = getSpartaV1Contract(null, rpcUrls)
  const contract2 = getSpartaV2Contract(null, rpcUrls)

  try {
    let awaitArray = [
      contract2.callStatic.emitting(),
      // contract.callStatic.minting(),
      '0', // contract2.callStatic.feeOnTransfer()
      // contract.callStatic.emissionCurve(),
      contract2.callStatic.totalSupply(),
      contract2.callStatic.secondsPerEra(),
      // contract.callStatic.nextEraTime(),
      // contract1.callStatic.secondsPerEra(),
      // contract1.callStatic.totalSupply(),
      contract2.callStatic.balanceOf(deadAddress),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emitting: awaitArray[0],
      // minting: awaitArray[],
      feeOnTransfer: awaitArray[1].toString(),
      // emissionCurve: awaitArray[],
      totalSupply: awaitArray[2].toString(),
      secondsPerEra: awaitArray[3].toString(),
      // nextEraTime: awaitArray[],
      // oldSecondsPerEra: awaitArray[].toString(),
      // oldTotalSupply: awaitArray[].toString(),
      deadSupply: awaitArray[4].toString(),
    }
    dispatch(updateGlobalDetails(globalDetails))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Check if your wallet was affected by the attacks and your SPARTA amount available to claim
 * @param {object} wallet
 * @returns {uint} claimAmount
 */
export const fallenSpartansCheck = (wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getFallenSpartansContract(wallet, rpcUrls)
  try {
    const claimCheck = await contract.callStatic.getClaim(wallet.account)
    dispatch(updateClaimCheck(claimCheck.toString()))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Upgrade SPARTA(old V1) to SPARTA(New V2)
 */
export const spartaUpgrade = (wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getSpartaV2Contract(wallet, rpcUrls)
  try {
    const gPrice = await getProviderGasPrice(rpcUrls)
    let txn = await contract.upgrade({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'upgrade', rpcUrls)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Claim your wallet portion from the fallenSparta fund
 */
export const fallenSpartansClaim = (wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getFallenSpartansContract(wallet, rpcUrls)
  try {
    const gPrice = await getProviderGasPrice(rpcUrls)
    let txn = await contract.claim({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'fsClaim', rpcUrls)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Community wallet holdings
 */
export const communityWalletHoldings = (wallet) => async (dispatch) => {
  dispatch(updateLoading(true))
  const comWal = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
  const abiErc20 = getAbis().erc20
  const provider = new ethers.providers.JsonRpcProvider(bscRpcsMN[0])
  const spartaCont = new ethers.Contract(
    addressesMN.spartav2,
    abiErc20,
    provider,
  )
  const busdCont = new ethers.Contract(
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    abiErc20,
    provider,
  )
  const usdtCont = new ethers.Contract(
    '0x55d398326f99059ff775485246999027b3197955',
    abiErc20,
    provider,
  )
  try {
    let awaitArray = [
      spartaCont.callStatic.balanceOf(comWal),
      busdCont.callStatic.balanceOf(comWal),
      usdtCont.callStatic.balanceOf(comWal),
      wallet ? spartaCont.callStatic.balanceOf(wallet.account) : '0',
      wallet?.account ? busdCont.callStatic.balanceOf(wallet.account) : '0',
      wallet?.account ? usdtCont.callStatic.balanceOf(wallet.account) : '0',
    ]
    awaitArray = await Promise.all(awaitArray)
    const communityWallet = {
      bnb: (await provider.getBalance(comWal)).toString(),
      sparta: awaitArray[0].toString(),
      busd: awaitArray[1].toString(),
      usdt: awaitArray[2].toString(),
      userSparta: awaitArray[3].toString(),
      userBnb: wallet?.account
        ? (await provider.getBalance(wallet.account)).toString()
        : '0',
      userBusd: awaitArray[4].toString(),
      userUsdt: awaitArray[5].toString(),
    }
    dispatch(updateCommunityWallet(communityWallet))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

export default spartaSlice.reducer
