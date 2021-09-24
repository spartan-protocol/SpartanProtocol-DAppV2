import * as Types from './types'

const initialState = {
  global: false,
  totalWeight: '0',
  member: false,
  daoDetails: false,
  proposal: false,
  lastDeposits: false,
  proposalWeight: '0',
  txn: [],
  propTxn: [],
  error: null,
  loading: false,
}

export const daoReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.DAO_GLOBAL_DETAILS: {
      return {
        ...state,
        global: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_TOTAL_WEIGHT: {
      return {
        ...state,
        totalWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_MEMBER_DETAILS: {
      return {
        ...state,
        member: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_DETAILS: {
      return {
        ...state,
        daoDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_DETAILS: {
      return {
        ...state,
        proposal: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_LASTDEPOSITS: {
      return {
        ...state,
        lastDeposits: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_WEIGHT: {
      return {
        ...state,
        proposalWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_TXN: {
      return {
        ...state,
        txn: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.PROP_TXN: {
      return {
        ...state,
        propTxn: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.DAO_ERROR: {
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
