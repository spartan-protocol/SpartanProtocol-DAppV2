import { ethers } from "ethers";
import { useWallet } from '@binance-chain/bsc-use-wallet'

import CURATED from '../config/ABI/Curated.json'
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR, getWalletProvider } from "./web3"

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES

// CURRENT CONTRACT ADDRESSES
export const CURATED_ADDR = net === 'testnet' ? '0x9894FBC249b0245Bab6740c52579a26dB8BeB0Bb' : ''

// ABI
export const CURATED_ABI = CURATED.abi

// POOLS - Create Pool
export const createPool = async (token) => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(CURATED_ADDR, CURATED_ABI, provider)
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.createPool(token)
    const result = await contract.createPool(token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// // CONNECT ROUTER CONTRACT WITH PROVIDER (READ-ONLY; NOT SIGNER)
// const provROUTER = () => {
//     const contract = new ethers.Contract(ROUTER_ADDR, ROUTER_ABI, provider)
//     console.log(contract)
//     return contract
// }

// // CONNECT ROUTER CONTRACT WITH SIGNER
// const signContract = (contract, account) => {
//     const signed = contract.connect(account)
//     return signed
// }

// function createPool(address token) public onlyDAO payable returns(address pool){
//     require(getPool(token) == address(0));
//     require(token != BASE && iBEP20(token).decimals() == 18);
//     Pool newPool; address _token = token;
//     newPool = new Pool(BASE, _token); 
//     pool = address(newPool);
//     addPool(_token, pool);
//     return pool;
// }