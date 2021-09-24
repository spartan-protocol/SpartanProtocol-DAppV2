import * as Types from './types'

const initialState = {
  global: false,
  bondDetails: false,
  totalWeight: '0',
  listedAssets: false,
  member: false,
  txn: [],
}

export const bondReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.BOND_GLOBAL: {
      return {
        ...state,
        global: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_DETAILS: {
      return {
        ...state,
        bondDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_TOTAL_WEIGHT: {
      return {
        ...state,
        totalWeight: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_LISTED_ASSETS: {
      return {
        ...state,
        listedAssets: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_TXN: {
      return {
        ...state,
        txn: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.BOND_ERROR: {
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
