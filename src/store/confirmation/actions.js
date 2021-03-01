import * as Types from './types';

import ERC20 from '../../config/ABI/ERC20.json'
import { getWalletProvider, getTokenContract } from "../../utils/web3";
import {errorToDispatch, payloadToDispatch} from '../helpers';

// TOKEN ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xb58a43D2D9809ff4393193de536F242fefb03613' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'


// ABI
export const ERC20_ABI = ERC20.abi

export const getApproval = (tokenAddress, contractAddress) => async dispatch => {
    let provider = getWalletProvider()
    let contract = getTokenContract(tokenAddress)

    try {
        let supply = await contract.totalSupply();
        const gPrice = await provider.getGasPrice();
        const gLimit = await contract.estimateGas.approve(contractAddress, supply);
        contract = await contract.approve(contractAddress, supply, {
            gasPrice: gPrice,
            gasLimit: gLimit
        });
        
        dispatch(payloadToDispatch(Types.GET_CONTRACT, contract));
    } catch (error) {
        dispatch(errorToDispatch(Types.CONTRACT_ERROR, error));
    }
}
