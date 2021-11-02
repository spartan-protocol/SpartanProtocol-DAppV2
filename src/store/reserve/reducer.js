import * as Types from './types'

const initialState = {
  globalDetails: false,
  polDetails: false,
  loading: false,
  error: null,
}

export const reserveReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.RESERVE_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.RESERVE_POL_DETAILS: {
      return {
        ...state,
        polDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.RESERVE_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.RESERVE_ERROR: {
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
