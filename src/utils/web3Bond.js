import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

// eslint-disable-next-line camelcase
export const BONDv1_ADDR = getAddresses().bondv1
// eslint-disable-next-line camelcase
export const BONDv2_ADDR = getAddresses().bondv2
// eslint-disable-next-line camelcase
export const BONDv3_ADDR = getAddresses().bondv3

// CURRENT CONTRACT ADDRESSES
export const BOND_ADDR = getAddresses().bond

// FUTURE CONTRACT ADDRESSES
// export const BONDv4_ADDR = net === 'testnet' ? '' : ''

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
  const contract = new ethers.Contract(BOND_ADDR, abiBond, provider)
  return contract
}
