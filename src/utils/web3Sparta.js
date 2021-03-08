import { ethers } from "ethers";

import BASE from '../config/ABI/Base.json'
import { getWalletProvider, SPARTA_ADDR } from "./web3"

// ABI
export const BASE_ABI = BASE.abi

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET ROUTER CONTRACT
export const getSpartaContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(SPARTA_ADDR, BASE_ABI, provider)
    return contract
}
