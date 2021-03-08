import * as Types from "./types";
import {getSpartaContract} from "../../utils/web3Sparta";
import {payloadToDispatch, errorToDispatch} from "../helpers";
import {getWalletProvider} from '../../utils/web3';

export const spartaLoading = () => ({
    type: Types.SPARTA_LOADING
});

export const getEmitting = () => async dispatch => {
    dispatch(spartaLoading());
    let contract = getSpartaContract()

    try {
        let emitting = await contract.callStatic.emitting();
        dispatch(payloadToDispatch(Types.GET_EMTTING, emitting));
    } catch (error) {
        dispatch(errorToDispatch(Types.SPARTA_ERROR, error));
    }
}

export const getAdjustedClaimRate = (assetAddress) => async dispatch => {
    dispatch(spartaLoading());
    let contract = getSpartaContract()

    try {
        let adjustedClaimRate = await contract.callStatic.getAdjustedClaimRate(assetAddress);
        dispatch(payloadToDispatch(Types.GET_ADJUSTED_CLAIM_RATE, adjustedClaimRate));
    } catch (error) {
        dispatch(errorToDispatch(Types.SPARTA_ERROR, error));
    }
}

export const claim = (assetAddress, amount) => async dispatch => {
    dispatch(spartaLoading());
    let provider = getWalletProvider()
    let contract = getSpartaContract()

    try {
        const gPrice = await provider.getGasPrice()
        const gLimit = await contract.estimateGas.claim(assetAddress, amount)
        let claim = await contract.claim(assetAddress, amount, {
            gasPrice: gPrice,
            gasLimit: gLimit
        })
        dispatch(payloadToDispatch(Types.CLAIM, claim));
    } catch (error) {
        dispatch(errorToDispatch(Types.SPARTA_ERROR, error));
    }
}