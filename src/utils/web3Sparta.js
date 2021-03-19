import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// GET ROUTER CONTRACT
export const getSpartaContract = () => {
  const abiBase = getAbis().base
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.sparta, abiBase, provider)
  return contract
}
