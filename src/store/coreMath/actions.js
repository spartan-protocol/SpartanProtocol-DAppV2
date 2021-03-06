import * as Types from "./types";
import {getUtilsContract} from "../../utils/web3Utils";
import {payloadToDispatch, errorToDispatch} from "../helpers";

export const coreMathLoading = () => ({
    type: Types.CORE_MATH_LOADING
});

export const getPart = (basisPoints, total) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let part = await contract.callStatic.calcPart(basisPoints, total);
        dispatch(payloadToDispatch(Types.GET_PART, part));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getLiquidityShare = (units, token, pool, member) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let liquidityShare = await contract.callStatic.calcLiquidityShare(units, token, pool, member);
        dispatch(payloadToDispatch(Types.GET_LIQUIDITY_SHARE, liquidityShare));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getShare = (part, total, amount) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let share = await contract.callStatic.calcShare(part, total, amount);
        dispatch(payloadToDispatch(Types.GET_SHARE, share));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getSwapFee = (x, X, Y) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let swapFee = await contract.callStatic.calcSwapFee(x, X, Y);
        dispatch(payloadToDispatch(Types.GET_SWAP_FEE, swapFee));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getLiquidityUnits = (b, B, t, T, P) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let liquidityUnits = await contract.callStatic.calcLiquidityUnits(b, B, t, T, P);
        dispatch(payloadToDispatch(Types.GET_LIQUIDITY_UNITS, liquidityUnits));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getSlipAdustment = (b, B, t, T) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let slipAdustment = await contract.callStatic.getSlipAdustment(b, B, t, T);
        dispatch(payloadToDispatch(Types.GET_SLIP_ADUSTMENT, slipAdustment));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}

export const getAsymmetricShare = (u, U, A) => async dispatch => {
    dispatch(coreMathLoading());
    let contract = getUtilsContract();

    try {
        let asymmetricShare = await contract.callStatic.getAsymmetricShare(u, U, A);
        dispatch(payloadToDispatch(Types.GET_ASYMMETRICS_SHARE, asymmetricShare));
    } catch (error) {
        dispatch(errorToDispatch(Types.CORE_MATH_ERROR, error));
    }
}