import { ethers } from 'ethers'

import DAO from '../config/ABI/Dao.json'
// import DAOVAULT from '../config/ABI/DaoVault.json'
import { getWalletProvider } from './web3'

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
// eslint-disable-next-line camelcase
export const DAOv1_ADDR =
  net === 'testnet'
    ? '0xbC6134840a2604D00222F276c16d143dd3666dA3'
    : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// CURRENT CONTRACT ADDRESSES
export const DAO_ADDR =
  net === 'testnet'
    ? '0xbC6134840a2604D00222F276c16d143dd3666dA3'
    : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// FUTURE CONTRACT ADDRESSES
// export const DAOv2_ADDR = net === 'testnet' ? '' : ''
// export const DAOVAULTv1_ADDR = net === 'testnet' ? '' : ''

// ABI
export const DAO_ABI = DAO.abi
// export const DAOVAULT_ABI = DAOVAULT.abi

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getDaoContract = () => {
  const provider = getWalletProvider()
  const contract = new ethers.Contract(DAO_ADDR, DAO_ABI, provider)
  console.log(contract)
  return contract
}
