import { ethers } from "ethers";
import { useWallet } from '@binance-chain/bsc-use-wallet'

import UTILS from '../config/ABI/Utils.json'
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR } from "./web3"

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const UTILSv1_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// CURRENT CONTRACT ADDRESSES
export const UTILS_ADDR = net === 'testnet' ? '0x0A88158fD6A748AEDa7191416bA5AD1fb6245B00' : ''

// ABI
export const UTILS_ABI = UTILS.abi

const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

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