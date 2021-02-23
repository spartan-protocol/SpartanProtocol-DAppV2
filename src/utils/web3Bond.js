import { ethers } from "ethers";

import BOND from '../config/ABI/Bond.json'
import { getWalletProvider } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const BONDv1_ADDR = net === 'testnet' ? '0x4551457647f6810a917AF70Ca47252BbECD2A36c' : '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
export const BONDv2_ADDR = net === 'testnet' ? '0x7e44b5461A50adB15329895b80866275192a54f6' : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'
export const BONDv3_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// CURRENT CONTRACT ADDRESSES
export const BOND_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// FUTURE CONTRACT ADDRESSES
// export const BONDv4_ADDR = net === 'testnet' ? '' : ''

// ABI
export const BOND_ABI = BOND.abi

// GET BOND CONTRACT
export const getBondContract = async () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(BOND_ADDR, BOND_ABI, provider)
    console.log(contract)
    return contract
}

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getListedBond = async () => {
    let contract = await getBondContract()
    const result = await contract.allListedAssets()
    console.log(result)
    return result
}