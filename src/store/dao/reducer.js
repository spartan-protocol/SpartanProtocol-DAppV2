import * as Types from './types'

const initialState = {
  memberCount: 0,
  memberDetails: {},
  daoTotalWeight: 0,
  memberWeight: 0,
  harvestAmount: 0,
  harvestEraAmount: 0,
  deposit: null,
  withdraw: null,
  harvest: null,
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

    default:
      return state
  }
}
