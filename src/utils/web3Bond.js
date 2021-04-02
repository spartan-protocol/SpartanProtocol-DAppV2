import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET OLDER BOND CONTRACT (v1, v2, v3)
export const getOldBondContract = (bondAddress) => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(bondAddress, abiBond, provider)
  return contract
}

// GET CURRENT BOND CONTRACT
export const getBondContract = () => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bond, abiBond, provider)
  return contract
}

// GET CURRENT BONDVAULT CONTRACT
export const getBondVaultContract = () => {
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bondVault, abiBondVault, provider)
  return contract
}
