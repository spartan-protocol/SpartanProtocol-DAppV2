/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getUtilsContract } from '../../utils/getContracts'

export const useUtils = () => useSelector((state) => state.utils)

export const utilsSlice = createSlice({
  name: 'utils',
  initialState: {
    loading: false,
    error: null,
    poolDetails: [],
    pool: {},
    synth: {},
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload.toString()
    },
    updatePoolDetails: (state, action) => {
      state.poolDetails = action.payload
    },
    updatePool: (state, action) => {
      state.pool = action.payload
    },
    updateSynth: (state, action) => {
      state.synth = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updatePoolDetails,
  updatePool,
  updateSynth,
} = utilsSlice.actions

/**
 * UTILS HELPER -
 * Returns the pool's details
 * @returns [ tokenAddress | poolAddress | genesis | baseAmount | tokenAmount | baseAmountPooled | tokenAmountPooled | fees | volume | txCount | poolUnits ]
 */
export const getPoolDetails = (pool, wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getUtilsContract(wallet, rpcUrls)
  try {
    const poolDetails = await contract.callStatic.getPoolData(pool)
    dispatch(updatePoolDetails(poolDetails))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get a pool address from the token address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} pool
 */
export const getPool = (token, wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getUtilsContract(wallet, rpcUrls)
  try {
    const pool = await contract.callStatic.getPool(token)
    dispatch(updatePool(pool))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} synth
 */
export const getSynth = (token, wallet, rpcUrls) => async (dispatch) => {
  dispatch(updateLoading(true))
  const contract = getUtilsContract(wallet, rpcUrls)
  try {
    const synth = await contract.callStatic.getSynth(token)
    dispatch(updateSynth(synth))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

export default utilsSlice.reducer
