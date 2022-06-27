import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getReserveContract,
  getSpartaV2Contract,
  getTokenContract,
} from '../../utils/getContracts'
import { tempChains } from '../../utils/web3'
import { calcLiqValue } from '../../utils/math/utils'

export const useReserve = () => useSelector((state) => state.reserve)

export const reserveSlice = createSlice({
  name: 'reserve',
  initialState: {
    loading: false,
    error: null,
    globalDetails: false,
    polDetails: false,
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
    updatePolDetails: (state, action) => {
      state.polDetails = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateGlobalDetails,
  updatePolDetails,
} = reserveSlice.actions

/**
 * Get the Reserve contract details
 * @returns {object} emissions, spartaBalance
 */
export const getReserveGlobalDetails = () => async (dispatch, getState) => {
  const { loading } = getState().reserve
  if (!loading) {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    try {
      if (rpcs.length > 0) {
        const { chainId, addresses } = getState().app
        const contract = getReserveContract(null, rpcs)
        const spartaContract = getSpartaV2Contract(null, rpcs)
        let awaitArray = [
          contract.callStatic.emissions(),
          spartaContract.callStatic.balanceOf(addresses.reserve),
          tempChains.includes(chainId)
            ? contract.callStatic.globalFreeze()
            : false,
        ]
        awaitArray = await Promise.all(awaitArray)
        const globalDetails = {
          emissions: awaitArray[0],
          spartaBalance: awaitArray[1].toString(),
          globalFreeze: awaitArray[2],
        }
        dispatch(updateGlobalDetails(globalDetails))
      }
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }
}

/**
 * Get the Reserve POL details
 * @returns {object}
 */
export const getReservePOLDetails = () => async (dispatch, getState) => {
  const { loading } = getState().reserve
  if (!loading) {
    dispatch(updateLoading(true))
    const { curatedPools, poolDetails } = getState().pool
    try {
      if (poolDetails.length > 0 && curatedPools.length > 0) {
        const { rpcs } = getState().web3
        const { addresses } = getState().app
        let awaitArray = []
        for (let i = 0; i < curatedPools.length; i++) {
          const poolContract = getTokenContract(curatedPools[i], null, rpcs)
          awaitArray.push(poolContract.callStatic.balanceOf(addresses.reserve))
        }
        awaitArray = await Promise.all(awaitArray)
        const polDetails = []
        for (let i = 0; i < curatedPools.length; i++) {
          const pool = poolDetails.filter(
            (x) => x.address === curatedPools[i],
          )[0]
          const lpsLocked = awaitArray[i].toString()
          const spartaLocked = calcLiqValue(lpsLocked, pool)[0]
          polDetails.push({
            tokenAddress: pool.tokenAddress,
            address: pool.address,
            spartaLocked: spartaLocked.toString(),
          })
        }
        dispatch(updatePolDetails(polDetails))
      }
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }
}

export default reserveSlice.reducer
