import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getMigrateContract = () => {
  const abiMigrate = getAbis().migrate
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.migrate, abiMigrate, provider)
  return contract
}
