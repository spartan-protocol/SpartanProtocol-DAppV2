import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getDaoVaultContract = () => {
  const abiDaoVault = getAbis().daoVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.daoVault, abiDaoVault, provider)
  return contract
}
