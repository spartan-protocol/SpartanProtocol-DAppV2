import * as Types from './types'

const initialState = {
  bondListed: [],
  bondListedAsset: false,
  bondClaimable: 0,
  bondMemberDetails: {},
  bondSpartaRemaining: 0,
  bondBurnReady: 0,
  bondBurn: 0,
  bondClaimAll: 0,
  bondCoolOffPeriod: {},
  bondListedCount: 0,
  bondMemberCount: 0,
  bondMembers: [],
  bondClaimAsset: false,
  loading: false,
  error: null,
}

export const bondReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_BOND_LISTED: {
      return {
        ...state,
        bondListed: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_LISTED_ASSET: {
      return {
        ...state,
        bondListedAsset: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_CLAIMABLE: {
      return {
        ...state,
        bondClaimable: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_MEMBER_DETAILS: {
      return {
        ...state,
        bondMemberDetails: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_SPARTA_REMAINING: {
      return {
        ...state,
        bondSpartaRemaining: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_BURN_READY: {
      return {
        ...state,
        bondBurnReady: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_BURN: {
      return {
        ...state,
        bondBurn: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_DEPOSIT: {
      return {
        ...state,
        bondDeposit: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIM_ALL: {
      return {
        ...state,
        bondClaimAll: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_LISTED_COUNT: {
      return {
        ...state,
        bondListedCount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_MEMBER_COUNT: {
      return {
        ...state,
        bondMemberCount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.GET_BOND_MEMBERS: {
      return {
        ...state,
        bondMembers: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIM_ASSET: {
      return {
        ...state,
        bondClaimAsset: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case Types.BOND_ERROR: {
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
