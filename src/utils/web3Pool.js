import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getPoolContract = () => {
  const abiPool = getAbis().pool
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.pool, abiPool, provider)
  return contract
}