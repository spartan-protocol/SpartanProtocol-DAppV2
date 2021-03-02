import * as Types from "./types";

const initialState = {
    contract: {},
    error: null
}

export const confirmationReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_CONTRACT: {
            return {
                ...state,
                contract: action.payload
            }
        }

        case Types.CONTRACT_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        default:
            return state;
    }
}