import * as Types from './types'

const initialState = {
  memberDetails: {},
}

export const bondVaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_BONDVAULT_MEMBER_DETAILS: {
      return {
        ...state,
        memberDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BONDVAULT_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.BONDVAULT_ERROR: {
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
