import * as Types from './types'

const initialState = {
  lastHarvest: '0',
  isMember: false,
  memberCount: 0,
  harvestAmount: 0,
  harvestEraAmount: 0,
  deposit: {},
  withdraw: {},
  harvest: {},
  proposalMajority: false,
  proposalQuorum: false,
  proposalMinority: false,
  proposalDetails: {},
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
    case Types.LAST_HARVEST: {
      return {
        ...state,
        lastHarvest: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_IS_MEMBER: {
      return {
        ...state,
        isMember: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_MEMBER_COUNT: {
      return {
        ...state,
        memberCount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_HARVEST_AMOUNT: {
      return {
        ...state,
        harvestAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_HARVEST_ERA_AMOUNT: {
      return {
        ...state,
        harvestEraAmount: action.payload,
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

    case Types.GET_DAO_PROPOSAL_QUORUM: {
      return {
        ...state,
        proposalQuorum: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_PROPOSAL_MAJORITY: {
      return {
        ...state,
        proposalMajority: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_PROPOSAL_MINORITY: {
      return {
        ...state,
        proposalMinority: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_PROPOSAL_DETAILS: {
      return {
        ...state,
        proposalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_GRANT_DETAILS: {
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
