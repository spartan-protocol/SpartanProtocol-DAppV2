import { ethers } from 'ethers'
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { createPublicClient, http } from 'viem'
import { bsc } from 'viem/chains'
import {
  getFallenSpartansContract,
  getSpartaV2Contract,
  getSSUtilsContract,
} from '../../utils/getContracts'
import { addressesMN, bscRpcsMN, parseTxn } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import { getTokenDetails } from '../pool'

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
      state.error = action.payload
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

export const getSpartaGlobalDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getSSUtilsContract(null, rpcs)
      const awaitArray = (await contract.callStatic.getGlobalDetails())[0]
      const globalDetails = {
        emitting: awaitArray.emitting,
        totalSupply: awaitArray.totalSupply.toString(),
        secondsPerEra: awaitArray.secondsPerEra.toString(),
        deadSupply: awaitArray.deadSupply.toString(),
        feeOnTransfer: '0', // Const this for now, can probably remove later but will involve combing the codebase for deps of feeOnTransfer
        emissions: awaitArray.emissions, // Newly added, will need to change deps of its previous location: reserve.globalDetails.emissions
        spartaBalance: awaitArray.spartaBalance.toString(), // Newly added, will need to change deps of its previous location: reserve.globalDetails.spartaBalance
        globalFreeze: awaitArray.globalFreeze, // Newly added, will need to change deps of its previous location: reserve.globalDetails.globalFreeze
      }
      dispatch(updateGlobalDetails(globalDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Check if your wallet was affected by the attacks and your SPARTA amount available to claim
 * @param {object} wallet
 * @returns {uint} claimAmount
 */
export const fallenSpartansCheck = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getFallenSpartansContract(null, rpcs)
  try {
    const claimCheck = await contract.callStatic.getClaim(wallet.account)
    dispatch(updateClaimCheck(claimCheck.toString()))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Upgrade SPARTA(old V1) to SPARTA(New V2)
 */
export const spartaUpgrade =
  (walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSpartaV2Contract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.upgrade({ gasPrice: gPrice })
      txn = await parseTxn(txn, 'upgrade', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getTokenDetails(walletAddr)) // Update tokenDetails
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Claim your wallet portion from the fallenSparta fund
 */
export const fallenSpartansClaim = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getFallenSpartansContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.claim({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'fsClaim', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Community wallet holdings
 */
export const communityWalletHoldings =
  (walletAddr) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const comWal = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
    const { erc20 } = getState().app.abis
    const provider = createPublicClient({
      chain: bsc,
      transport: http(bscRpcsMN[0]),
    })
    const spartaCont = new ethers.Contract(
      addressesMN.spartav2,
      erc20,
      provider,
    )
    const busdCont = new ethers.Contract(
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      erc20,
      provider,
    )
    const usdtCont = new ethers.Contract(
      '0x55d398326f99059ff775485246999027b3197955',
      erc20,
      provider,
    )
    try {
      let awaitArray = [
        spartaCont.callStatic.balanceOf(comWal),
        busdCont.callStatic.balanceOf(comWal),
        usdtCont.callStatic.balanceOf(comWal),
        walletAddr ? spartaCont.callStatic.balanceOf(walletAddr) : '0',
        walletAddr ? busdCont.callStatic.balanceOf(walletAddr) : '0',
        walletAddr ? usdtCont.callStatic.balanceOf(walletAddr) : '0',
      ]
      awaitArray = await Promise.all(awaitArray)
      const communityWallet = {
        bnb: (await provider.getBalance(comWal)).toString(),
        sparta: awaitArray[0].toString(),
        busd: awaitArray[1].toString(),
        usdt: awaitArray[2].toString(),
        userSparta: awaitArray[3].toString(),
        userBnb: walletAddr
          ? (await provider.getBalance(walletAddr)).toString()
          : '0',
        userBusd: awaitArray[4].toString(),
        userUsdt: awaitArray[5].toString(),
      }
      dispatch(updateCommunityWallet(communityWallet))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

export default spartaSlice.reducer
