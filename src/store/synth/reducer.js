import * as Types from './types'

const initialState = {
  globalDetails: [],
  memberDetails: [],
  synthArray: [],
  synthDetails: [],
  deposit: '0',
  harvest: '0',
  harvestSingle: '0',
  withdrawAmount: '0',
  newSynth: {},
}

export const synthReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SYNTH_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_MEMBER_DETAILS: {
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

    case Types.SYNTH_DEPOSIT: {
      return {
        ...state,
        deposit: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_HARVEST: {
      return {
        ...state,
        harvest: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_HARVEST_SINGLE: {
      return {
        ...state,
        harvestSingle: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_WITHDRAW_AMOUNT: {
      return {
        ...state,
        withdrawAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.SYNTH_CREATE: {
      return {
        ...state,
        newSynth: action.payload,
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
