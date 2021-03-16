import { ethers } from 'ethers'
import { getAbis, getWalletProvider, SPARTA_ADDR } from './web3'

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET ROUTER CONTRACT
export const getSpartaContract = () => {
  const abiBase = getAbis().base
  const provider = getWalletProvider()
  const contract = new ethers.Contract(SPARTA_ADDR, abiBase, provider)
  return contract
}
