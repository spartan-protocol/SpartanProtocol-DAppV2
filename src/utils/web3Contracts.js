import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

/**
 * Get the Reserve contract with signer/provider injected
 * @returns {uint} loanAssets
 */
export const getReserveContract = () => {
  const abiReserve = getAbis().reserve
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.reserve, abiReserve, provider)
  return contract
}
