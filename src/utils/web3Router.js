import { ethers } from 'ethers'

import {
  getAbis,
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET ROUTER CONTRACT
export const getRouterContract = () => {
  const abiRouter = getAbis().router
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.router, abiRouter, provider)
  return contract
}
