import * as Types from "./types";

const initialState = {
    pools: [],
    assets: [],
    globalDetails: [],
    tokenDetails: [],
    poolDetails: [],
    memberShare: null,
    poolShare: null,
    shareOfBaseAmount: null,
    shareOfTokenAmount: null,
    poolShareAssym: null,
    poolAge: null,
    poolROI: null,
    poolAPY: null,
    isMember: false,
}

export const infoReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_LISTED_POOLS: {
            return {
                ...state,
                pools: action.payload
            }
        }

        case Types.GET_LISTED_POOLS_RANGE: {
            return {
                ...state,
                pools: action.payload
            }
        }

        case Types.GET_LISTED_ASSETS: {
            return {
                ...state,
                assets: action.payload
            }
        }

        case Types.GET_LISTED_ASSETS_RANGE: {
            return {
                ...state,
                assets: action.payload
            }
        }

        case Types.GET_GLOBAL_DETAILS: {
            return {
                ...state,
                globalDetails: action.payload
            }
        }

        case Types.GET_TOKEN_DETAILS: {
            return {
                ...state,
                tokenDetails: action.payload
            }
        }

        case Types.GET_POOL_DETAILS: {
            return {
                ...state,
                poolDetails: action.payload
            }
        }

        case Types.GET_MEMBER_SHARE: {
            return {
                ...state,
                memberShare: action.payload
            }
        }

        case Types.GET_POOL_SHARE: {
            return {
                ...state,
                poolShare: action.payload
            }
        }

        case Types.GET_SHARE_OF_BASE_AMAOUNT: {
            return {
                ...state,
                shareOfBaseAmount: action.payload
            }
        }

        case Types.GET_SHARE_OF_TOKEN_AMAOUNT: {
            return {
                ...state,
                shareOfTokenAmount: action.payload
            }
        }

        case Types.GET_POOL_SHARE_ASSYM: {
            return {
                ...state,
                poolShareAssym: action.payload
            }
        }

        case Types.GET_POOL_AGE: {
            return {
                ...state,
                poolAge: action.payload
            }
        }

        case Types.GET_POOL_ROI: {
            return {
                ...state,
                poolROI: action.payload
            }
        }

        case Types.GET_POOL_APY: {
            return {
                ...state,
                poolAPY: action.payload
            }
        }

        case Types.IS_MEMBER: {
            return {
                ...state,
                isMember: action.payload
            }
        }

        case Types.INFO_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        default:
            return state;
    }
}