import * as Types from './types'

const initialState = {
  global: {},
  listedAssets: [],
  member: {},
  deposit: '0',
  bondClaim: '0',
  bondClaimAll: '0',
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

    case Types.BOND_LISTED_ASSETS: {
      return {
        ...state,
        listedAssets: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_MEMBER: {
      return {
        ...state,
        member: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_DEPOSIT: {
      return {
        ...state,
        deposit: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIM: {
      return {
        ...state,
        bondClaim: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIM_ALL: {
      return {
        ...state,
        bondClaimAll: action.payload,
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
