import { ethers } from 'ethers'

import ERC20 from '../config/ABI/ERC20.json'

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// TOKEN ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR =
  net === 'testnet'
    ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870'
    : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR =
  net === 'testnet'
    ? '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB'
    : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'

// ADDRESSES FOR TESTS
export const TEST_WALLET = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
export const TEST_TOKEN =
  net === 'testnet'
    ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870'
    : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const TEST_POOL =
  net === 'testnet'
    ? '0xA2C646CF5F55657EC0ecee5b8d2fCcb4cA843bd3'
    : '0x3de669c4F1f167a8aFBc9993E4753b84b576426f'

// ABI
export const ERC20_ABI = ERC20.abi

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = () => {
  let provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  let connectedWalletType = ''
  if (window.sessionStorage.getItem('lastWallet') === 'BC') {
    connectedWalletType = window.BinanceChain
  } else {
    connectedWalletType = window.ethereum
  }
  if (window.sessionStorage.getItem('walletConnected')) {
    provider = new ethers.providers.Web3Provider(connectedWalletType)
    provider = provider.getSigner()
  }
  return provider
}

// GET GAS PRICE FROM PROVIDER
export const getProviderGasPrice = () => {
  const provider = getWalletProvider()
  const gasPrice = provider.getGasPrice()
  return gasPrice
}

// CONNECT TO CONTRACT WITH PROVIDER & SIGNER IF AVAILABLE
export const getTokenContract = (tokenAddress) => {
  const provider = getWalletProvider()
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
  return contract
}

/**
 * Trigger change between mainnet and testnet
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const changeNetwork = (_network) => {
  const network =
    _network === 'testnet'
      ? { chainId: 97, net: 'testnet', chain: 'BSC' }
      : { chainId: 56, net: 'mainnet', chain: 'BSC' }
  window.localStorage.setItem('network', JSON.stringify(network))
  return network
}

/**
 * Check localStorage for net and set default if missing
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const getNetwork = () => {
  const network = JSON.parse(window.sessionStorage.getItem('network'))
    ? JSON.parse(window.sessionStorage.getItem('network'))
    : changeNetwork('mainnet')
  return network
}

/**
 * Get the 'window' object of the connected walletType
 * @param {} - uses localStorage
 * @returns {Object} window.ethereum or BinanceChain
 */
export const getWalletWindowObj = () => {
  let connectedWalletType = ''
  if (window.sessionStorage.getItem('lastWallet') === 'BC') {
    connectedWalletType = window.BinanceChain
  } else {
    connectedWalletType = window.ethereum
  }
  return connectedWalletType
}
