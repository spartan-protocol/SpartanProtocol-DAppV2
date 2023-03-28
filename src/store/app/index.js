import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { defaultSettings } from '../../components/Settings/options'
import { BN } from '../../utils/bigNumber'
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

const defaultAsset1 = {
  id: '1',
  addr: addressesMN.bnb,
  type: 'token',
}

const defaultAsset2 = {
  id: '2',
  addr: addressesMN.spartav2,
  type: 'token',
}

const defaultAsset3 = {
  id: '3',
  addr: addressesMN.bnb,
  type: 'token',
}

const defaultAsset4 = {
  id: '4',
  addr: addressesMN.spartav2,
  type: 'token',
}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loading: false,
    error: null,
    asset1: tryParse(window.localStorage.getItem('sp_asset1')) ?? defaultAsset1,
    asset2: tryParse(window.localStorage.getItem('sp_asset2')) ?? defaultAsset2,
    asset3: tryParse(window.localStorage.getItem('sp_asset3')) ?? defaultAsset3,
    asset4: tryParse(window.localStorage.getItem('sp_asset4')) ?? defaultAsset4,
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
    alertTimestamp:
      tryParse(window.localStorage.getItem('sp_alerttimestamp')) ?? '0',
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateAsset: (state, action) => {
      if ([1, '1'].includes(action.payload.id)) {
        state.asset1 = action.payload
        window.localStorage.setItem('sp_asset1', JSON.stringify(action.payload))
      } else if ([2, '2'].includes(action.payload.id)) {
        state.asset2 = action.payload
        window.localStorage.setItem('sp_asset2', JSON.stringify(action.payload))
      } else if ([3, '3'].includes(action.payload.id)) {
        state.asset3 = action.payload
        window.localStorage.setItem('sp_asset3', JSON.stringify(action.payload))
      } else if ([4, '4'].includes(action.payload.id)) {
        state.asset4 = action.payload
        window.localStorage.setItem('sp_asset4', JSON.stringify(action.payload))
      }
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
    updateAlertTimestamp: (state, action) => {
      state.alertTimestamp = action.payload
      window.localStorage.setItem(
        'sp_alerttimestamp',
        JSON.stringify(action.payload),
      )
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateAsset,
  updateChainId,
  updateSettings,
  updateAlertTimestamp,
} = appSlice.actions

/** Update selected asset address && type */
export const appAsset = (id, addr, type) => async (dispatch) => {
  dispatch(updateLoading(true))
  if (id && addr && type) {
    try {
      dispatch(updateAsset({ id, addr, type }))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
  }
  dispatch(updateLoading(false))
}

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

/** Update alert timestamp */
export const appAlertTimestamp = () => async (dispatch) => {
  dispatch(updateLoading(true))
  try {
    const timeNow = BN(Date.now()).div(1000).toString()
    dispatch(updateAlertTimestamp(timeNow))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default appSlice.reducer
