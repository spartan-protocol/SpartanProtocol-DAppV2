import * as Types from './types'

const initialState = {
  poolDetails: [],
  pool: {},
  weight: {},
  synth: {},
  error: null,
  loading: false,
}

export const utilsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_POOL_DETAILS: {
      return {
        ...state,
        poolDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL: {
      return {
        ...state,
        pool: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_SHARE_WEIGHT: {
      return {
        ...state,
        weight: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_SYNTH: {
      return {
        ...state,
        synth: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.UTILS_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.UTILS_ERROR: {
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
