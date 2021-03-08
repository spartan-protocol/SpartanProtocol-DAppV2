import { act } from 'react-dom/test-utils';
import * as Types from './types';

const initialState = {
    emitting: {},
    adjustedClaimRate: {},
    claim: {}
}

export const spartaReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_EMTTING: {
            return {
                ...state,
                emiting: action.payload,
                error: null,
                loading: false
            }
        }

        case Types.GET_ADJUSTED_CLAIM_RATE: {
            return {
                ...state,
                adjustedClaimRate: action.payload,
                error: null,
                loading: false
            }
        }

        case Types.CLAIM: {
            return {
                ...state,
                claim: action.payload,
                error: null,
                loading: false,
            }
        }

        case Types.SPARTA_LOADING: {
            return {
                ...state,
                error: null,
                loading: true,
            }
        }

        case Types.SPARTA_ERROR: {
            return {
                ...state,
                error: action.error,
                loading: false
            }
        }
        default:
            return state;
    }
}