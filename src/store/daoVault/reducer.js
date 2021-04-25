import * as Types from './types'

const initialState = {
  globalDetails: {},
  memberDetails: {},
  error: null,
  loading: false,
}

export const daoVaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.MEMBER_DETAILS: {
      return {
        ...state,
        memberDetails: action.payload,
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
