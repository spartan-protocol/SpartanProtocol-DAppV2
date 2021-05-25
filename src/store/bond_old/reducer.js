import * as Types from './types'

const initialState = {
  bondListed: [],
  bondListedAsset: false,
  bondClaimable: 0,
  bondSpartaRemaining: 0,
  bondBurnReady: 0,
  bondBurn: 0,
  bondClaimedAll: 0,
  bondClaimed: 0,
  bondCoolOffPeriod: {},
  bondListedCount: 0,
  bondMemberCount: 0,
  bondMembers: [],
  loading: false,
  error: null,
}

export const bondReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.BOND_LISTED: {
      return {
        ...state,
        bondListed: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_LISTED_ASSET: {
      return {
        ...state,
        bondListedAsset: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIMABLE: {
      return {
        ...state,
        bondClaimable: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_SPARTA_REMAINING: {
      return {
        ...state,
        bondSpartaRemaining: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_BURN_READY: {
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
        bondClaimedAll: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_CLAIM: {
      return {
        ...state,
        bondClaimed: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_LISTED_COUNT: {
      return {
        ...state,
        bondListedCount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_MEMBER_COUNT: {
      return {
        ...state,
        bondMemberCount: action.payload,
        loading: false,
        error: null,
      }
    }

    case Types.BOND_MEMBERS: {
      return {
        ...state,
        bondMembers: action.payload,
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
