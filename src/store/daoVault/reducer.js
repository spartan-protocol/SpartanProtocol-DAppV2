import * as Types from './types'

const initialState = {
  isMember: false,
  memberPoolWeight: 0,
  daoTotalWeight: 0,
  memberWeight: 0,
  error: null,
  loading: false,
}

export const daoVaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_DAOVAULT_IS_MEMBER: {
      return {
        ...state,
        isMember: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAOVAULT_MEMBER_POOL_WEIGHT: {
      return {
        ...state,
        memberPoolWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAOVAULT_TOTAL_WEIGHT: {
      return {
        ...state,
        daoTotalWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAOVAULT_MEMBER_WEIGHT: {
      return {
        ...state,
        memberWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAOVAULT_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.DAOVAULT_ERROR: {
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
