import * as Types from './types'

const initialState = {
  part: {},
  share: {},
  shareOutput: {},
  swapFee: {},
  liquidityUnits: {},
  slipAdustment: {},
  asymmetricShare: {},
  units: {},
  cdpValue: {},
  loading: false,
  error: null,
}

export const utilsMathReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_PART: {
      return {
        ...state,
        part: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SHARE: {
      return {
        ...state,
        share: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SWAP_OUTPUT: {
      return {
        ...state,
        shareOutput: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SWAP_FEE: {
      return {
        ...state,
        swapFee: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_LIQUIDITY_UNITS: {
      return {
        ...state,
        liquidityUnits: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_LIQUIDITY_SHARE: {
      return {
        ...state,
        slipAdustment: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_ASYMMETRICS_SHARE: {
      return {
        ...state,
        asymmetricShare: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_SYNTHS_VALUE: {
      return {
        ...state,
        units: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_CDP_VALUE: {
      return {
        ...state,
        cdpValue: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.UTILS_MATH_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.UTILS_MATH_ERROR: {
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
