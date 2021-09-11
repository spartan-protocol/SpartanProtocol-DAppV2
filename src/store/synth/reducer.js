import * as Types from './types'

const initialState = {
  globalDetails: [],
  synthArray: [],
  synthDetails: [],
  txn: [],
  newSynth: {},
  totalWeight: '0',
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

    case Types.SYNTH_TXN: {
      return {
        ...state,
        txn: action.payload,
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

    case Types.SYNTH_WEIGHT: {
      return {
        ...state,
        totalWeight: action.payload,
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
