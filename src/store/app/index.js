/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { defaultSettings } from '../../components/Settings/options'
import { getNetwork } from '../../utils/web3'

export const useApp = () => useSelector((state) => state.app)

const tryParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return false
  }
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loading: false,
    error: null,
    // assetSelected1: window.localStorage.getItem('assetSelected1'),
    // assetType1: window.localStorage.getItem('assetSelected1'),
    // assetSelected2: window.localStorage.getItem('assetSelected1'),
    // assetType2: window.localStorage.getItem('assetSelected1'),
    // assetSelected3: window.localStorage.getItem('assetSelected1'),
    // assetType3: window.localStorage.getItem('assetSelected1'),
    // assetSelected4: window.localStorage.getItem('assetSelected1'),
    // assetType4: window.localStorage.getItem('assetSelected1'),
    // lastWallet: window.localStorage.getItem('lastWallet'),
    // disableWallet: window.localStorage.getItem('disableWallet'),
    // network: window.localStorage.getItem('network'),
    // txnArray: window.localStorage.getItem('txnArray'),
    // sp_positions: window.localStorage.getItem('sp_positions'),
    // sp_synthpositions: window.localStorage.getItem('sp_synthpositions'),
    settings:
      tryParse(window.localStorage.getItem('sp_settings')) ?? defaultSettings,
    // addresses: window.localStorage.getItem('addresses'),
    // abis: window.localStorage.getItem('abis'),
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateSettings: (state, action) => {
      state.settings = action.payload
      window.localStorage.setItem('sp_settings', JSON.stringify(action.payload))
    },
  },
})

export const { updateLoading, updateError, updateSettings } = appSlice.actions

/** Update app settings (slip etc) */
export const appSettings =
  (gasRate, slipTolerance) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { settings } = getState().app
    try {
      const isMN = getNetwork().chainId === 56
      const currentSetts = {
        gasRateMN: isMN ? gasRate : settings.gasRateMN,
        gasRateTN: isMN ? settings.gasRateTN : gasRate,
        slipTol: slipTolerance,
      }
      dispatch(updateSettings(currentSetts))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

export default appSlice.reducer
