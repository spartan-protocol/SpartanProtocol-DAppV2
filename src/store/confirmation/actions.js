import * as Types from './types';

import { getWalletProvider, getTokenContract } from "../../utils/web3";
import {errorToDispatch, payloadToDispatch} from '../helpers';

export const confirmationLoading = () => ({
    type: Types.CONFIRMATION_LOADING
});

export const getApproval = (tokenAddress, contractAddress) => async dispatch => {
    dispatch(confirmationLoading());
    const provider = getWalletProvider()
    let contract = getTokenContract(tokenAddress)

    try {
        let provider = getWalletProvider()
        let contract = getTokenContract(tokenAddress)
        let supply = await contract.totalSupply()
        const gPrice = await provider.getGasPrice()
        const gLimit = await contract.estimateGas.approve(contractAddress, supply)
        contract = await contract.approve(contractAddress, supply, {
            gasPrice: gPrice,
            gasLimit: gLimit
        })
        
        dispatch(payloadToDispatch(Types.GET_CONTRACT, contract));
    } catch (error) {
        dispatch(errorToDispatch(Types.CONFIRMATION_ERROR, error));
    }
}
