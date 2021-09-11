import * as Types from './types'

const initialState = {
  txn: [],
  loading: false,
  error: null,
}

export const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ROUTER_TXN: {
      return {
        ...state,
        txn: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_UNFREEZE: {
      return {
        ...state,
        unfreeze: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.ROUTER_ERROR: {
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
