import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET CURRENT BONDVAULT CONTRACT
export const getBondVaultContract = () => {
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bondVault, abiBondVault, provider)
  return contract
}
