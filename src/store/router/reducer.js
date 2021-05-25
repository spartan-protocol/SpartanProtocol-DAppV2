import * as Types from './types'

const initialState = {
  addLiq: {},
  zapLiq: {},
  addLiqSingle: {},
  remLiq: {},
  remLiqSingle: {},
  swapped: 0,
  mintSynth: 0,
  burnSynth: 0,
  loading: false,
  error: null,
}

export const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ROUTER_ADD_LIQ: {
      return {
        ...state,
        addLiq: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_ZAP_LIQ: {
      return {
        ...state,
        zapLiq: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_ADD_LIQ_SINGLE: {
      return {
        ...state,
        addLiqSingle: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_REMOVE_LIQ: {
      return {
        ...state,
        remLiq: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_REMOVE_LIQ_SINGLE: {
      return {
        ...state,
        remLiqSingle: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_SWAP: {
      return {
        ...state,
        swapped: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_MINT_SYNTH: {
      return {
        ...state,
        mintSynth: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.ROUTER_BURN_SYNTH: {
      return {
        ...state,
        burnSynth: action.payload,
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
