import * as Types from './types'

const initialState = {
  globalDetails: [],
  adjustedClaimRate: {},
  claim: {},
  error: null,
  loading: false,
}

export const spartaReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SPARTA_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_ADJUSTED_CLAIM_RATE: {
      return {
        ...state,
        adjustedClaimRate: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_CLAIM: {
      return {
        ...state,
        claim: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_LOADING: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }

    case Types.SPARTA_ERROR: {
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
