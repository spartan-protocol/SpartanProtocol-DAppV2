import * as Types from './types'

const initialState = {
  pool: {},
  tokenCount: {},
  totalPooled: {},
  liquidity: {},
  assetsSwapped: {},
  liquidityAsym: 0,
  proposalID: 0,
  outputSynth: 0,
  output: 0,
  loading: false,
  error: null,
}

export const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_POOL: {
      return {
        ...state,
        pool: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_TOKEN_COUNT: {
      return {
        ...state,
        tokenCount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_TOTAL_POOLED_VALUE: {
      return {
        ...state,
        totalPooled: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_ADD_LIQ: {
      return {
        ...state,
        liquidity: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_REMOVE_LIQ: {
      return {
        ...state,
        liquidity: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_SWAP_ASSETS: {
      return {
        ...state,
        assetsSwapped: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_ADD_LIQ_ASYM: {
      return {
        ...state,
        liquidityAsym: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_ZAP_LIQUIDITY: {
      return {
        ...state,
        proposalID: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_REMOVE_LIQ_ASYM: {
      return {
        ...state,
        liquidity: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_SWAP_BASE_TO_SYNTH: {
      return {
        ...state,
        outputSynth: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.ROUTER_ERROR: {
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
