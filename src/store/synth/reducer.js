import * as Types from './types'

const initialState = {
  globalDetails: [],
  memberDetails: [],
  synthArray: [],
  synthDetails: [],
  deposit: '0',
  harvest: '0',
  withdrawAmount: '0',
}

export const synthReducer = (state = initialState, action) => {
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

    case Types.SYNTH_ARRAY: {
      return {
        ...state,
        synthArray: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_DETAILS: {
      return {
        ...state,
        synthDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DEPOSIT: {
      return {
        ...state,
        deposit: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.HARVEST: {
      return {
        ...state,
        harvest: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.WITHDRAW_AMOUNT: {
      return {
        ...state,
        withdrawAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_LOADING: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }

    case Types.SYNTH_ERROR: {
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
