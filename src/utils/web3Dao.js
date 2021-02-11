import { ethers } from "ethers";
import { useWallet } from '@binance-chain/bsc-use-wallet'

import DAO from '../config/ABI/Dao.json'
import DAOVAULT from '../config/ABI/DaoVault.json'
import { BNB_ADDR, WBNB_ADDR, SPARTA_ADDR } from "./web3"

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const DAOv1_ADDR = net === 'testnet' ? '0x1b83a813045165c81d84b9f5d6916067b57FF9C0' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// CURRENT CONTRACT ADDRESSES
export const DAO_ADDR = net === 'testnet' ? '0x9329F46b82B34703b0a584e6A48A0445f6eedC53' : ''
export const DAOVAULT_ADDR = net === 'testnet' ? '0xF629B3079584c736366b472a55f06b2ad457695A' : ''

// ABI
export const DAO_ABI = DAO.abi
export const DAOVAULT_ABI = DAOVAULT.abi

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