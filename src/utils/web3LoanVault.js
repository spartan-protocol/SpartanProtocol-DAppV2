import { ethers } from 'ethers'
import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getLoanVaultContract = () => {
  const abiLoanVault = getAbis().daoLoanVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.loanVault, abiLoanVault, provider)
  return contract
}
