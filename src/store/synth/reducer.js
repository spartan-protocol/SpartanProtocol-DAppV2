import * as Types from './types'

const initialState = {
  synthArray: [],
}

export const synthReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_SYNTH_ARRAY: {
      return {
        ...state,
        synthArray: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DEPOSIT_AMOUNT: {
      return {
        ...state,
        depositAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.HARVEST_AMOUNT: {
      return {
        ...state,
        harvestAmount: action.payload,
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

    case Types.MEMBER_STAKED: {
      return {
        ...state,
        memberStaked: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.MEMBER_WEIGHT: {
      return {
        ...state,
        memberWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.TOTAL_WEIGHT: {
      return {
        ...state,
        totalWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.MEMBER_LAST_HARVEST: {
      return {
        ...state,
        memberLastHarvest: action.payload,
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
