import * as Types from './types'

const initialState = {
  listedTokens: [],
  curatedPools: [],
  tokenDetails: [],
  listedPools: [],
  poolDetails: [],
  loading: false,
  error: null,
  loadingFinal: false,
}

export const poolFactoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LISTED_TOKENS: {
      return {
        ...state,
        listedTokens: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.CURATED_POOLS: {
      return {
        ...state,
        curatedPools: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.TOKEN_DETAILS: {
      return {
        ...state,
        tokenDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.LISTED_POOLS: {
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
        loading: false,
      }
    }

    case Types.POOLFACTORY_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.POOLFACTORY_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    }

    case Types.POOLFACTORY_FINALARRAY_LOADING: {
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
