import * as Types from './types'

const initialState = {
  contract: {},
  loading: false,
  error: null,
}

export const web3AllReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_CONTRACT: {
      return {
        ...state,
        contract: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.WEB3ALL_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.WEB3ALL_ERROR: {
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
