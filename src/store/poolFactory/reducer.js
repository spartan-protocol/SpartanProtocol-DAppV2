import * as Types from './types'

const initialState = {
  poolAddr: {},
  poolCount: 0,
  poolArray: {},
  curatedPoolCount: 0,
  curatedPoolArray: {},
  loading: false,
  error: null,
}

export const poolFactoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.POOLFACTORY_GET_POOL: {
      return {
        ...state,
        poolAddr: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOLFACTORY_GET_COUNT: {
      return {
        ...state,
        poolCount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOLFACTORY_GET_ARRAY: {
      return {
        ...state,
        poolArray: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOLFACTORY_GET_CURATED_COUNT: {
      return {
        ...state,
        curatedPoolCount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.POOLFACTORY_GET_CURATED_ARRAY: {
      return {
        ...state,
        curatedPoolArray: action.payload,
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
    default:
      return state
  }
}
