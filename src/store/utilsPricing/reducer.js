import * as Types from './types'

const initialState = {
  basePPinToken: {},
  tokenPPinBase: {},
  valueInToken: {},
  valueInBase: {},
  loading: false,
  error: null,
}

export const utilsPricingReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_BASE_P_PIN_TOKEN: {
      return {
        ...state,
        basePPinToken: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_TOKEN_P_PIN_BASE: {
      return {
        ...state,
        tokenPPinBase: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_VALUE_IN_TOKEN: {
      return {
        ...state,
        valueInBase: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_VALUE_IN_BASE: {
      return {
        ...state,
        valueInToken: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SPOT_VALUE_IN_BASE: {
      return {
        ...state,
        valueInBase: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SPOT_VALUE_IN_TOKEN: {
      return {
        ...state,
        valueInToken: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SWAP_VALUE_IN_BASE: {
      return {
        ...state,
        valueInBase: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SWAP_VALUE_IN_TOKEN: {
      return {
        ...state,
        valueInToken: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.UTILSPRICING_LOADING: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }

    case Types.UTILSPRICING_ERROR: {
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
