import * as Types from './types'

const initialState = {
  addedNetworkMM: {},
  addedNetworkBC: {},
  approval: false,
  allowance1: {},
  allowance2: {},
  watchingAsset: false,
  spartaPrice: 0,
  eventArray: {},
  loading: false,
  error: null,
}

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ADD_NETWORK_MM: {
      return {
        ...state,
        addedNetworkMM: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.ADD_NETWORK_BC: {
      return {
        ...state,
        addedNetworkBC: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_APPROVAL: {
      return {
        ...state,
        approval: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_ALLOWANCE1: {
      return {
        ...state,
        allowance1: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_ALLOWANCE2: {
      return {
        ...state,
        allowance2: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.WATCH_ASSET: {
      return {
        ...state,
        watchingAsset: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.SPARTA_PRICE: {
      return {
        ...state,
        spartaPrice: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.EVENT_ARRAY: {
      return {
        ...state,
        eventArray: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.WEB3_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.WEB3_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    }
    default:
      return state
  }
}
