/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getBondVaultContract,
  getDaoContract,
  getSpartaV2Contract,
} from '../../utils/getContracts'
import { getAddresses, getProviderGasPrice, parseTxn } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

export const useBond = () => useSelector((state) => state.bond)

export const bondSlice = createSlice({
  name: 'bond',
  initialState: {
    loading: false,
    error: null,
    global: false,
    bondDetails: false,
    totalWeight: false,
    listedAssets: false,
    txn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateGlobal: (state, action) => {
      state.global = action.payload
    },
    updateBondDetails: (state, action) => {
      state.bondDetails = action.payload
    },
    updateTotalWeight: (state, action) => {
      state.totalWeight = action.payload
    },
    updateListedAssets: (state, action) => {
      state.listedAssets = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateGlobal,
  updateBondDetails,
  updateTotalWeight,
  updateListedAssets,
  updateTxn,
} = bondSlice.actions

/**
 * Get the global bond details *VIEW*
 * @returns globalDetails
 */
export const bondGlobalDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const addr = getAddresses()
      const contract = getSpartaV2Contract(null, rpcs)
      let awaitArray = []
      awaitArray.push(contract ? contract.callStatic.balanceOf(addr?.dao) : '0')
      awaitArray = await Promise.all(awaitArray)
      const global = {
        spartaRemaining: awaitArray[0].toString(), // Bond allocation left
      }
      dispatch(updateGlobal(global))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the member bond details *VIEW*
 * @returns bondDetails
 */
export const getBondDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { listedPools } = getState().pool
  try {
    if (listedPools.length > 0) {
      const { rpcs } = getState().web3
      const contract = getBondVaultContract(null, rpcs)
      let awaitArray = []
      for (let i = 0; i < listedPools.length; i++) {
        if (!walletAddr || listedPools[i].baseAmount <= 0) {
          awaitArray.push({
            isMember: false,
            bondedLP: '0',
            claimRate: '0',
            lastBlockTime: '0',
          })
        } else {
          awaitArray.push(
            contract.callStatic.getMemberDetails(
              walletAddr,
              listedPools[i].address,
            ),
          )
        }
      }
      awaitArray = await Promise.all(awaitArray)
      const bondDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        bondDetails.push({
          tokenAddress: listedPools[i].tokenAddress,
          address: listedPools[i].address,
          isMember: awaitArray[i].isMember,
          staked: awaitArray[i].bondedLP.toString(),
          claimRate: awaitArray[i].claimRate.toString(),
          lastBlockTime: awaitArray[i].lastBlockTime.toString(),
        })
      }
      dispatch(updateBondDetails(bondDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the current bondVault's total weight *VIEW*
 * @returns spartaWeight
 */
export const bondVaultWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails } = getState().pool
  try {
    if (poolDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getBondVaultContract(null, rpcs)
      let totalWeight = BN(0)
      const vaultPools = poolDetails.filter((x) => x.curated && !x.hide)
      if (vaultPools.length > 0) {
        const awaitArray = []
        for (let i = 0; i < vaultPools.length; i++) {
          awaitArray.push(
            contract.callStatic.mapTotalPool_balance(vaultPools[i].address),
          )
        }
        const totalBonded = await Promise.all(awaitArray)
        for (let i = 0; i < totalBonded.length; i++) {
          totalWeight = totalWeight.plus(
            getPoolShareWeight(
              totalBonded[i].toString(),
              vaultPools[i].poolUnits,
              vaultPools[i].baseAmount,
            ),
          )
        }
      }
      dispatch(updateTotalWeight(totalWeight.toString()))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get all current bond listed assets *VIEW*
 * @returns count
 */
export const allListedAssets = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getBondVaultContract(null, rpcs)
      const listedAssets = await contract.callStatic.getBondedAssets()
      dispatch(updateListedAssets(listedAssets))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Claim a Bond assets by poolAddress *STATE*
 */
export const claimBond = (tokenAddr, wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.claim(tokenAddr, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'bondClaim', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default bondSlice.reducer
