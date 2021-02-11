import { ethers } from "ethers";
import { useWallet } from '@binance-chain/bsc-use-wallet'

import CURATED from '../config/ABI/Curated.json'
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR } from "./web3"

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES

// CURRENT CONTRACT ADDRESSES
export const CURATED_ADDR = net === 'testnet' ? '0x99a7850553BE824109521b2140Ad6627510e65e7' : ''

// ABI
export const CURATED_ABI = CURATED.abi

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