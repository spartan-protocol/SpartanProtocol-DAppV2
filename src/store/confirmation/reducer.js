import * as Types from './types'

const initialState = {
  contract: {},
  loading: false,
  error: null,
}

export const confirmationReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_CONTRACT: {
      return {
        ...state,
        contract: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.CONFIRMATION_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.CONFIRMATION_ERROR: {
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
