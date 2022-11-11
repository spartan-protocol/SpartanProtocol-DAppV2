import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getDaoContract, getSSUtilsContract } from '../../utils/getContracts'
import { parseTxn } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import { getPool, getPoolShareWeight } from '../../utils/math/utils'

export const useBond = () => useSelector((state) => state.bond)

export const bondSlice = createSlice({
  name: 'bond',
  initialState: {
    loading: false,
    error: null,
    bondDetails: false,
    totalWeight: false,
    txn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateBondDetails: (state, action) => {
      state.bondDetails = action.payload
    },
    updateTotalWeight: (state, action) => {
      state.totalWeight = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateBondDetails,
  updateTotalWeight,
  updateTxn,
} = bondSlice.actions

/**
 * Get the current bondVault's total weight *VIEW*
 * @returns spartaWeight
 */
export const bondVaultWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails, curatedPools } = getState().pool
  const { bondDetails } = getState().bond
  try {
    // UPDATE TOTAL WEIGHT
    if (curatedPools.length > 0) {
      let totalWeight = BN(0)
      const vaultPools = bondDetails.filter(
        (x) => curatedPools.includes(x.address), // A bond asset can exist but *not* be currently Curated, so we must filter accordingly here
      )
      if (vaultPools.length > 0) {
        for (let i = 0; i < vaultPools.length; i++) {
          totalWeight = totalWeight.plus(
            getPoolShareWeight(
              vaultPools[i].bondedTotal,
              getPool(vaultPools[i].address, poolDetails)?.poolUnits,
              getPool(vaultPools[i].address, poolDetails)?.baseAmount,
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
 * Get the member bond details *VIEW*
 * Also updateds the BondVaults total weight figure
 * @returns bondDetails
 */
export const getBondDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails } = getState().pool
  try {
    if (poolDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getSSUtilsContract(null, rpcs)
      const awaitArray = await contract.callStatic.getBondDetails(walletAddr)
      const bondDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        bondDetails.push({
          tokenAddress: getPool(awaitArray[i].poolAddress, poolDetails)
            .tokenAddress,
          address: awaitArray[i].poolAddress,
          bondedTotal: awaitArray[i].bondedTotal.toString(), // New addition
          staked: awaitArray[i].bondedMember.toString(),
          lastBlockTime: awaitArray[i].lastBlockTime.toString(),
          claimRate: awaitArray[i].claimRate.toString(),
          isMember: awaitArray[i].isMember,
        })
      }
      dispatch(updateBondDetails(bondDetails))
      dispatch(bondVaultWeight()) // Weight changing function, so we need to update weight calculations
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Claim a Bond asset by poolAddress *STATE*
 */
export const claimBond = (tokenAddr, wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    // const gPrice = await getProviderGasPrice(rpcs)
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    let txn = await contract.claim(tokenAddr, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'bondClaim', rpcs)
    dispatch(updateTxn(txn))
    dispatch(getBondDetails(wallet.account)) // Update bondDetails
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default bondSlice.reducer
