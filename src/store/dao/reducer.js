import * as Types from './types'

const initialState = {
  memberCount: 0,
  memberDetails: {},
  daoTotalWeight: 0,
  memberWeight: 0,
  harvestAmount: 0,
  harvestEraAmount: 0,
  deposit: {},
  withdraw: {},
  harvest: {},
  error: null,
  loading: false,
}

export const daoReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_DAO_MEMBER_COUNT: {
      return {
        ...state,
        memberCount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_MEMBER_DETAILS: {
      return {
        ...state,
        memberDetails: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_TOTAL_WEIGHT: {
      return {
        ...state,
        daoTotalWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_MEMBER_WEIGHT: {
      return {
        ...state,
        memberWeight: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_HARVEST_AMOUNT: {
      return {
        ...state,
        harvestAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.GET_DAO_HARVEST_ERA_AMOUNT: {
      return {
        ...state,
        harvestEraAmount: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_DEPOSIT: {
      return {
        ...state,
        deposit: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_WITHDRAW: {
      return {
        ...state,
        withdraw: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_HARVEST: {
      return {
        ...state,
        harvest: action.payload,
        error: null,
        loading: false,
      }
    }

    case Types.DAO_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.DAO_ERROR: {
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
