import * as Types from "./types";
import {getUtilsContract} from '../../utils/web3Utils';
import {payloadToDispatch, errorToDispatch} from "../helpers";

export const getBasePPinToken = (token, amount) => async dispatch => {
    let contract = getUtilsContract()

    try {
        let basePPinToken = await contract.callStatic.calcBasePPinToken(token, amount);
        dispatch(payloadToDispatch(Types.GET_BASE_P_PIN_TOKEN, basePPinToken));
    } catch (error) {
        dispatch(errorToDispatch(Types.PRICING_ERROR, error));
    }
}

export const getTokenPPinBase = (token, amount) => async dispatch => {
    let contract = getUtilsContract()

    try {
        let tokenPPinBase = await contract.callStatic.calcTokenPPinBase(token, amount);
        dispatch(payloadToDispatch(Types.GET_TOKEN_P_PIN_BASE, tokenPPinBase));
    } catch (error) {
        dispatch(errorToDispatch(Types.PRICING_ERROR, error));
    }
}

export const getValueInToken = (token, amount) => async dispatch => {
    let contract = getUtilsContract()

    try {
        let valueInToken = await contract.callStatic.calcValueInToken(token, amount);
        dispatch(payloadToDispatch(Types.GET_VALUE_IN_TOKEN, valueInToken));
    } catch (error) {
        dispatch(errorToDispatch(Types.PRICING_ERROR, error));
    }
}

export const getValueInBase = (token, amount) => async dispatch => {
    let contract = getUtilsContract()

    try {
        let valueInBase = await contract.callStatic.calcValueInBase(token, amount);
        dispatch(payloadToDispatch(Types.GET_VALUE_IN_BASE, valueInBase));
    } catch (error) {
        dispatch(errorToDispatch(Types.PRICING_ERROR, error));
    }
}