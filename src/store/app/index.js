import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { defaultSettings } from '../../components/Settings/options'
import {
  abisMN,
  abisTN,
  addressesMN,
  addressesTN,
  changeAbis,
  changeAddresses,
  changeChainId,
} from '../../utils/web3'

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
    chainId: changeChainId(
      window.localStorage.getItem('sp_chainId') > 56 ? 97 : 56,
    ),
    // txnArray: window.localStorage.getItem('txnArray'),
    // sp_positions: window.localStorage.getItem('sp_positions'),
    // sp_synthpositions: window.localStorage.getItem('sp_synthpositions'),
    settings:
      tryParse(window.localStorage.getItem('sp_settings')) ?? defaultSettings,
    addresses:
      tryParse(window.localStorage.getItem('sp_addresses')) ??
      changeAddresses(window.localStorage.getItem('sp_chainId') > 56 ? 97 : 56),
    abis:
      tryParse(window.localStorage.getItem('sp_abis')) ??
      changeAbis(window.localStorage.getItem('sp_chainId') > 56 ? 97 : 56),
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateChainId: (state, action) => {
      state.chainId = action.payload.chainId
      state.addresses = action.payload.addresses
      state.abis = action.payload.abis
      window.localStorage.setItem('sp_chainId', action.payload.chainId)
      window.localStorage.setItem('sp_addresses', action.payload.addresses)
      window.localStorage.setItem('sp_abis', action.payload.abis)
    },
    updateSettings: (state, action) => {
      state.settings = action.payload
      window.localStorage.setItem('sp_settings', JSON.stringify(action.payload))
    },
  },
})

export const { updateLoading, updateError, updateChainId, updateSettings } =
  appSlice.actions

/** Update chain ID (56 MN or 97 TN) */
export const appChainId = (chainId) => async (dispatch) => {
  dispatch(updateLoading(true))
  try {
    const addresses = chainId === 56 ? addressesMN : addressesTN
    const abis = chainId === 56 ? abisMN : abisTN
    dispatch(updateChainId({ chainId, addresses, abis }))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/** Update app settings (slip etc) */
export const appSettings =
  (gasRate, slipTolerance) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { settings, chainId } = getState().app
    try {
      const isMN = chainId === 56
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
