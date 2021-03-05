import { act } from "react-dom/test-utils";
import * as Types from "./types";

const initialState = {
    basePPinToken: "",
    tokenPPinBase: "",
    valueInToken: "",
    valueInBase: "",
    error: null,
}

export const pricingReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_BASE_P_PIN_TOKEN: {
            return {
                ...state,
                basePPinToken: action.payload
            }
        }

        case Types.GET_TOKEN_P_PIN_BASE: {
            return {
                ...state,
                tokenPPinBase: action.payload
            }
        }

        case Types.GET_VALUE_IN_TOKEN: {
            return {
                ...state,
                valueInBase: action.payload
            }
        }

        case Types.GET_VALUE_IN_BASE: {
            return {
                ...state,
                valueInToken: action.payload
            }
        }

        case Types.PRICING_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
    }
}