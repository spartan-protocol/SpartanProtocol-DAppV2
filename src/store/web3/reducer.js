import * as Types from './types'

const initialState = {
  contract: {},
  loading: false,
  error: null,
}

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_APPROVAL: {
      return {
        ...state,
        approval: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_ALLOWANCE: {
      return {
        ...state,
        allowance: action.payload,
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
