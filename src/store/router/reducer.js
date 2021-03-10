import * as Types from './types'

const initialState = {
  pool: {},
  tokenCount: {},
  totalPooled: {},
  liquidity: {},
  assetsSwapped: {},
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
    default:
      return state
  }
}
