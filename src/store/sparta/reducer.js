import * as Types from './types'

const initialState = {
  globalDetails: [],
  claimCheck: '0',
  txn: [],
  feeBurnTally: '0',
  feeBurnRecent: '0',
  error: null,
  loading: false,
}

export const spartaReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SPARTA_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.FALLENSPARTA_CHECK: {
      return {
        ...state,
        claimCheck: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_TXN: {
      return {
        ...state,
        txn: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_FEEBURN_TALLY: {
      return {
        ...state,
        feeBurnTally: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_FEEBURN_RECENT: {
      return {
        ...state,
        feeBurnRecent: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_COMMUNITY_WALLET: {
      return {
        ...state,
        communityWallet: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SPARTA_LOADING: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }

    case Types.SPARTA_ERROR: {
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
