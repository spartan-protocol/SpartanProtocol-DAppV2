import * as Types from './types'

const initialState = {
  // FINAL AND READY BELOW
  globalDetails: [],
  memberDetails: [],
  proposalDetails: [],
  // PENDING REFACTOR BELOW
  deposit: {},
  withdraw: {},
  harvest: {},
  grantDetails: {},
  proposalNewAction: 0,
  proposalNewParam: 0,
  proposalNewAddress: 0,
  proposalNewGrant: 0,
  proposalVote: 0,
  proposalRemoveVote: 0,
  proposalCancel: 0,
  proposalFinalise: 0,
  error: null,
  loading: false,
}

export const daoReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.DAO_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_MEMBER_DETAILS: {
      return {
        ...state,
        memberDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_DETAILS: {
      return {
        ...state,
        proposalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_DEPOSIT: {
      return {
        ...state,
        deposit: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_WITHDRAW: {
      return {
        ...state,
        withdraw: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_HARVEST: {
      return {
        ...state,
        harvest: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_GRANT_DETAILS: {
      return {
        ...state,
        grantDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_NEW_ACTION: {
      return {
        ...state,
        proposalNewAction: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_NEW_PARAM: {
      return {
        ...state,
        proposalNewParam: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_NEW_ADDRESS: {
      return {
        ...state,
        proposalNewAddress: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_NEW_GRANT: {
      return {
        ...state,
        proposalNewGrant: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_VOTE: {
      return {
        ...state,
        proposalVote: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_REMOTE_VOTE: {
      return {
        ...state,
        proposalRemoveVote: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_CANCEL: {
      return {
        ...state,
        proposalCancel: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_PROPOSAL_FINALISE: {
      return {
        ...state,
        proposalFinalise: action.payload,
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
