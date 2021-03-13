import * as Types from './types'

const initialState = {
  bondListed: [],
  bondListedAsset: false,
  bondClaimable: 0,
  bondMemberDetails: {},
  bondSpartaRemaining: 0,
  bondBurnReady: 0,
  bondBurn: 0,
  bondClaimLock: 0,
  bondProposalCount: 0,
  bondProposal: {},
  bondProposals: [],
  bondCoolOffPeriod: {},
  bondProposalMintBond: {},
  bondProposalListAsset: [],
  bondProposalDelistAsset: [],
  bondProposalVote: {},
  bondProposalFinalize: {},
  bondProposalReplace: {},
  bondProposalRecount: {},
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
    // case Types.GET_BOND_DEPOSIT_ESTIMATED: {
    //   return {
    //     ...state,
    //     bondDepositEstimated: action.payload,
    //     loading: false,
    //     error: null,
    //   }
    // }
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
    case Types.BOND_CLAIM_LOCK: {
      return {
        ...state,
        bondClaimLock: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.GET_BOND_PROPOSAL_COUNT: {
      return {
        ...state,
        bondProposalCount: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.GET_BOND_PROPOSAL: {
      return {
        ...state,
        bondProposal: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.GET_BOND_PROPOSALS: {
      return {
        ...state,
        bondProposals: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.GET_BOND_COOL_OFF_PERIOD: {
      return {
        ...state,
        bondCoolOffPeriod: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_MINT_BOND: {
      return {
        ...state,
        bondProposalMintBond: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_LIST_ASSET: {
      return {
        ...state,
        bondProposalListAsset: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_DELIST_ASSET: {
      return {
        ...state,
        bondProposalDelistAsset: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_VOTE: {
      return {
        ...state,
        bondProposalVote: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_FINALIZE: {
      return {
        ...state,
        bondProposalFinalize: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_REPLACE: {
      return {
        ...state,
        bondProposalReplace: action.payload,
        loading: false,
        error: null,
      }
    }
    case Types.BOND_PROPOSAL_RECOUNT: {
      return {
        ...state,
        bondProposalRecount: action.payload,
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
