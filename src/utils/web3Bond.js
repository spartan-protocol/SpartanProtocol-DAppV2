import { ethers } from "ethers";
import { useWallet } from '@binance-chain/bsc-use-wallet'

import BOND from '../config/ABI/Bond.json'
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR } from "./web3"

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const BONDv1_ADDR = net === 'testnet' ? '0x4551457647f6810a917AF70Ca47252BbECD2A36c' : '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
export const BONDv2_ADDR = net === 'testnet' ? '0x7e44b5461A50adB15329895b80866275192a54f6' : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'
export const BONDv3_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// CURRENT CONTRACT ADDRESSES
export const BOND_ADDR = net === 'testnet' ? '' : ''

// ABI
export const BOND_ABI = BOND.abi

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