import * as Types from './types'

const initialState = {
  global: [],
  member: [],
  proposal: [],
  deposit: {},
  withdraw: {},
  harvest: {},
  newProp: {},
  propVote: 0,
  propRemoveVote: 0,
  propCancel: 0,
  propFinalise: 0,
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

    case Types.DAO_MEMBER_DETAILS: {
      return {
        ...state,
        member: action.payload,
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

    case Types.DAO_NEW_ACTION: {
      return {
        ...state,
        newProp: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_NEW_PARAM: {
      return {
        ...state,
        newProp: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_NEW_ADDRESS: {
      return {
        ...state,
        newProp: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_NEW_GRANT: {
      return {
        ...state,
        newProp: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_VOTE: {
      return {
        ...state,
        propVote: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_REMOTE_VOTE: {
      return {
        ...state,
        propRemoveVote: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_CANCEL: {
      return {
        ...state,
        propCancel: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_FINALISE: {
      return {
        ...state,
        propFinalise: action.payload,
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
