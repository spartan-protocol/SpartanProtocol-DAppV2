import * as Types from './types'

const initialState = {
  listedTokens: [],
  tokenDetails: [],
  curatedPools: [],
  listedPools: [],
  poolDetails: [],
  newPool: {},
  loading: false,
  error: null,
  loadingFinal: false,
}

export const poolReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.POOL_LISTED_TOKENS: {
      return {
        ...state,
        listedTokens: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOL_TOKEN_DETAILS: {
      return {
        ...state,
        tokenDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOL_CURATED_POOLS: {
      return {
        ...state,
        curatedPools: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOL_LISTED_POOLS: {
      return {
        ...state,
        listedPools: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOL_DETAILS: {
      return {
        ...state,
        poolDetails: action.payload,
        error: null,
        loadingFinal: false,
      }
    }

    case Types.POOL_NEW_POOL: {
      return {
        ...state,
        newPool: action.payload,
        error: null,
        loadingFinal: false,
      }
    }

    case Types.POOL_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.POOL_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    }

    case Types.POOL_DETAILS_LOADING: {
      return {
        ...state,
        loadingFinal: true,
        error: null,
      }
    }
    default:
      return state
  }
}
