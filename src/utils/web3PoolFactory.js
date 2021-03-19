import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getPoolFactoryContract = () => {
  const abiPoolFactory = getAbis().poolFactory
  const provider = getWalletProvider()
  const contract = new ethers.Contract(
    addr.poolFactory,
    abiPoolFactory,
    provider,
  )
  return contract
}
