import { ethers } from "ethers";

import UTILS from '../config/ABI/Utils.json'
import { getWalletProvider } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const UTILSv1_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// CURRENT CONTRACT ADDRESSES
export const UTILS_ADDR = net === 'testnet' ? '0x0a30aF25e652354832Ec5695981F2ce8b594e8B3' :'0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91'

// FUTURE CONTRACT ADDRESSES
// export const UTILSv2_ADDR = net === 'testnet' ? '' : ''

// ABI
export const UTILS_ABI = UTILS.abi

// GET UTILS CONTRACT
export const getUtilsContract = async () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(UTILS_ADDR, UTILS_ABI, provider)
    console.log(contract)
    return contract
}

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getListedPools = async () => {
    let contract = await getUtilsContract()
    const result = await contract.allPools()
    console.log(result)
    return result
}

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getListedAssets = async () => {
    let contract = await getUtilsContract()
    const result = await contract.allTokens()
    console.log(result)
    return result
}