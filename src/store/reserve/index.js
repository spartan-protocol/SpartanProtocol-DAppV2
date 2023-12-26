import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getSSUtilsContract } from '../../utils/getContracts'

export const useReserve = () => useSelector((state) => state.reserve)

export const reserveSlice = createSlice({
  name: 'reserve',
  initialState: {
    loading: false,
    error: null,
    polDetails: false,
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updatePolDetails: (state, action) => {
      state.polDetails = action.payload
    },
  },
})

export const { updateLoading, updateError, updatePolDetails } =
  reserveSlice.actions

/**
 * Get the Reserve POL details
 * @returns {object}
 */
export const getReservePOLDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getSSUtilsContract(null, rpcs)
      const awaitArray = (await contract.simulate.getReserveHoldings()).result
      const polDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        polDetails.push({
          address: awaitArray[i].poolAddress,
          resBalance: awaitArray[i].resBalance.toString(), // New addition: LP units held by Res
          spartaLocked: awaitArray[i].resSparta.toString(), // Sparta units underlying Res held LP tokens
          tokensLocked: awaitArray[i].resTokens.toString(), // New addition: Token units underlying Res held LP tokens
          poolTotalSupply: awaitArray[i].poolTotalSupply.toString(), // New addition: Total LP token supply of this pool
          poolBaseAmount: awaitArray[i].poolBaseAmount.toString(), // New addition: Total SPARTA held by the pool
          poolTokenAmount: awaitArray[i].poolTokenAmount.toString(), // New addition: Total tokens held by the pool
        })
      }
      dispatch(updatePolDetails(polDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

export default reserveSlice.reducer
