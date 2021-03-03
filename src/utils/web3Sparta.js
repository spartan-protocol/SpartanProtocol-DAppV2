import { ethers } from "ethers";

import BASE from '../config/ABI/Base.json'
import { getWalletProvider, SPARTA_ADDR } from "./web3"

// ABI
export const BASE_ABI = BASE.abi

// GET ROUTER CONTRACT
export const getSpartaContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(SPARTA_ADDR, BASE_ABI, provider)
    console.log(contract)
    return contract
}

// Check whether the base contract is emitting 
export const getEmitting = async () => {
    let contract = getSpartaContract()
    const result = await contract.emitting()
    console.log(result)
    return result
}

// Get the 'burn' claim-rate of an asset (this should only be valid for BOND tokens now)
export const getAdjustedClaimRate = async (assetAddress) => {
    let contract = getSpartaContract()
    const result = await contract.getAdjustedClaimRate(assetAddress)
    console.log(result)
    return result
}

// Make a 'burn' claim (this should only be valid for BOND tokens now)
export const claim = async (assetAddress, amount) => {
    let provider = getWalletProvider()
    let contract = getSpartaContract()
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.claim(assetAddress, amount)
    let result = await contract.claim(assetAddress, amount, {
        gasPrice: gPrice,
        gasLimit: gLimit
    })
    console.log(result)
    return result
}