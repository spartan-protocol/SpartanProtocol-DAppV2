import { ethers } from 'ethers'

import { getAbis, getWalletProvider } from './web3'

const net = process.env.REACT_APP_NET

console.log(getAbis.bond)

// OLD CONTRACT ADDRESSES
// eslint-disable-next-line camelcase
export const BONDv1_ADDR =
  net === 'testnet'
    ? '0x4551457647f6810a917AF70Ca47252BbECD2A36c'
    : '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
// eslint-disable-next-line camelcase
export const BONDv2_ADDR =
  net === 'testnet'
    ? '0x2021047F7E3F8c9882e502A63eF036daEFA0B5f6'
    : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'
// eslint-disable-next-line camelcase
export const BONDv3_ADDR =
  net === 'testnet'
    ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836'
    : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// CURRENT CONTRACT ADDRESSES
export const BOND_ADDR =
  net === 'testnet'
    ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836'
    : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

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
