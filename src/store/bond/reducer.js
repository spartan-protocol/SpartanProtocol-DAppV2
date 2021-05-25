import * as Types from './types'

const initialState = {
  memberDetails: {},
}

export const bondReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.BOND_MEMBER_DETAILS: {
      return {
        ...state,
        memberDetails: action.payload,
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
