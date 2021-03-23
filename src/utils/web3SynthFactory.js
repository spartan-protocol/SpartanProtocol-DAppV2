import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getSynthFactoryContract = () => {
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider()
  const contract = new ethers.Contract(
    addr.synthFactory,
    abiSynthFactory,
    provider,
  )
  return contract
}
