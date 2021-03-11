import * as Types from './types'

const initialState = {
  pools: [],
  assets: [],
  globalDetails: [],
  tokenDetails: [],
  poolDetails: [],
  memberShare: {},
  poolShare: {},
  shareOfBaseAmount: {},
  shareOfTokenAmount: {},
  poolShareAssym: {},
  poolAge: {},
  poolROI: {},
  poolAPY: {},
  isMember: false,
  error: null,
  loading: false,
}

export const utilsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_LISTED_POOLS: {
      return {
        ...state,
        pools: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_LISTED_POOLS_RANGE: {
      return {
        ...state,
        pools: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_LISTED_ASSETS: {
      return {
        ...state,
        assets: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_LISTED_ASSETS_RANGE: {
      return {
        ...state,
        assets: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_GLOBAL_DETAILS: {
      return {
        ...state,
        globalDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_TOKEN_DETAILS: {
      return {
        ...state,
        tokenDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_DETAILS: {
      return {
        ...state,
        poolDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_MEMBER_SHARE: {
      return {
        ...state,
        memberShare: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_SHARE: {
      return {
        ...state,
        poolShare: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_SHARE_OF_BASE_AMAOUNT: {
      return {
        ...state,
        shareOfBaseAmount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_SHARE_OF_TOKEN_AMAOUNT: {
      return {
        ...state,
        shareOfTokenAmount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_SHARE_ASSYM: {
      return {
        ...state,
        poolShareAssym: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_AGE: {
      return {
        ...state,
        poolAge: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_ROI: {
      return {
        ...state,
        poolROI: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_POOL_APY: {
      return {
        ...state,
        poolAPY: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.IS_MEMBER: {
      return {
        ...state,
        isMember: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.UTILS_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case Types.UTILS_ERROR: {
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
