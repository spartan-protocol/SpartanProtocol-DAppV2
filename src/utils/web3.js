import { ethers } from 'ethers'

// Testnet ABI Imports
import abiTnBase from '../ABI/TN/Base.json'
import abiTnBond from '../ABI/TN/Bond.json'
import abiTnDao from '../ABI/TN/Dao.json'
import abiTnErc20 from '../ABI/TN/ERC20.json'
import abiTnLock from '../ABI/TN/Lock.json'
import abiTnPool from '../ABI/TN/Pool.json'
import abiTnRecover from '../ABI/TN/Recover.json'
import abiTnRouter from '../ABI/TN/Router.json'
import abiTnSynthetics from '../ABI/TN/Synthetics.json'
import abiTnUtils from '../ABI/TN/Utils.json'
import abiTnWbnb from '../ABI/TN/WBNB.json'

// Mainnet ABI Imports
import abiMnBase from '../ABI/MN/Base.json'
import abiMnBond from '../ABI/MN/Bond.json'
import abiMnDao from '../ABI/MN/Dao.json'
import abiMnErc20 from '../ABI/MN/ERC20.json'
import abiMnLock from '../ABI/MN/Lock.json'
import abiMnPool from '../ABI/MN/Pool.json'
import abiMnRecover from '../ABI/MN/Recover.json'
import abiMnRouter from '../ABI/MN/Router.json'
import abiMnSynthetics from '../ABI/MN/Synthetics.json'
import abiMnUtils from '../ABI/MN/Utils.json'
import abiMnWbnb from '../ABI/MN/WBNB.json'

const net = process.env.REACT_APP_NET

// TOKEN ADDRESSES (REMOVE ONCE COMPLETELY UNLINKED FROM ALL TESTS/FUNCTIONS)
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR =
  net === 'testnet'
    ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870'
    : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR =
  net === 'testnet'
    ? '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB'
    : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'

export const abisTN = {
  base: abiTnBase.abi,
  bond: abiTnBond.abi,
  dao: abiTnDao.abi,
  erc20: abiTnErc20.abi,
  lock: abiTnLock.abi, // Confirm this one?
  pool: abiTnPool.abi, // Confirm this one?
  recover: abiTnRecover.abi, // Confirm this one?
  router: abiTnRouter.abi,
  synthetics: abiTnSynthetics.abi, // Confirm this one?
  utils: abiTnUtils.abi,
  wbnb: abiTnWbnb.abi, // Confirm this one?
}

export const abisMN = {
  base: abiMnBase.abi,
  bond: abiMnBond.abi,
  dao: abiMnDao.abi,
  erc20: abiMnErc20.abi,
  lock: abiMnLock.abi, // Confirm this one?
  pool: abiMnPool.abi, // Confirm this one?
  recover: abiMnRecover.abi, // Confirm this one?
  router: abiMnRouter.abi,
  synthetics: abiMnSynthetics.abi, // Confirm this one?
  utils: abiMnUtils.abi,
  wbnb: abiMnWbnb.abi, // Confirm this one?
}

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

export const addressesTN = {
  // TOKEN ADDRESSES
  bnb: '0x0000000000000000000000000000000000000000',
  wbnb: '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870',
  sparta: '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB',
  // CURRENT ADDRESSES
  bond: '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836',
  dao: '0xbC6134840a2604D00222F276c16d143dd3666dA3',
  router: '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50',
  utils: '0x4029A4173F9431763Ee68F5BfCF0C6aA703B1653',
  // OLD ADDRESSES
  bondv1: '0x4551457647f6810a917AF70Ca47252BbECD2A36c',
  bondv2: '0x2021047F7E3F8c9882e502A63eF036daEFA0B5f6',
  bondv3: '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836',
  daov1: '0xbC6134840a2604D00222F276c16d143dd3666dA3',
  incentivev1: '0xc241d694d51db9e934b147130cfefe8385813b86',
  routerv1: '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3',
  routerv2a: '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35',
  routerv2b: '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50',
  routerv2c: '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50',
  utilsv1: '0x4029A4173F9431763Ee68F5BfCF0C6aA703B1653',
}

// List of BSC Mainnet Addresses
export const addressesMN = {
  // TOKEN ADDRESSES
  bnb: '0x0000000000000000000000000000000000000000',
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  sparta: '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C',
  // CURRENT ADDRESSES
  bond: '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43',
  dao: '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0',
  router: '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D',
  utils: '0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91',
  // OLD ADDRESSES
  bondv1: '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da',
  bondv2: '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf',
  bondv3: '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43',
  daov1: '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0',
  incentivev1: '0xdbe936901aeed4718608d0574cbaab01828ae016',
  routerv1: '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5',
  routerv2a: '0xDbe936901aeed4718608D0574cbAAb01828AE016',
  routerv2b: '0x9dB88952380c0E35B95e7047E5114971dFf20D07',
  routerv2c: '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D',
  utilsv1: '0xCaF0366aF95E8A03E269E52DdB3DbB8a00295F91',
}

export const bscRpcsTN = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://data-seed-prebsc-1-s3.binance.org:8545/',
  'https://data-seed-prebsc-2-s3.binance.org:8545/',
]

export const bscRpcsMN = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed1.ninicoin.io/',
]

/**
 * Trigger change between Addresses
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} Relevant list of addresses
 */
export const changeAddresses = (_network) => {
  const addresses = _network === 'testnet' ? addressesTN : addressesMN
  window.localStorage.setItem('addresses', JSON.stringify(addresses))
  return addresses
}

/**
 * Check localStorage for addresses and set default if missing
 * @returns {Object} Relevant list of addresses
 */
export const getAddresses = () => {
  const addresses = JSON.parse(window.localStorage.getItem('addresses'))
    ? JSON.parse(window.localStorage.getItem('addresses'))
    : changeAddresses('mainnet')
  return addresses
}

/**
 * Trigger change between ABIs
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} Relevant list of ABIs
 */
export const changeAbis = (_network) => {
  const abis = _network === 'testnet' ? abisTN : abisMN
  window.localStorage.setItem('abis', JSON.stringify(abis))
  return abis
}

/**
 * Check localStorage for ABIs and set default if missing
 * @returns {Object} Relevant list of ABIs
 */
export const getAbis = () => {
  const abis = JSON.parse(window.localStorage.getItem('abis'))
    ? JSON.parse(window.localStorage.getItem('abis'))
    : changeAbis('mainnet')
  return abis
}

/**
 * Trigger random selection of a relevant RPC URL
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} RPC URL
 */
export const changeRpc = (_network) => {
  const rpcUrls = _network === 'testnet' ? bscRpcsTN : bscRpcsMN
  const rpcIndex = Math.floor(Math.random() * rpcUrls.length)
  const rpcUrl = rpcUrls[rpcIndex]
  return rpcUrl
}

/**
 * Trigger change between mainnet and testnet
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const changeNetwork = (_network) => {
  const rpcUrl = changeRpc(_network)
  changeAbis(_network)
  changeAddresses(_network)
  const network =
    _network === 'testnet'
      ? { chainId: 97, net: 'testnet', chain: 'BSC', rpc: rpcUrl }
      : { chainId: 56, net: 'mainnet', chain: 'BSC', rpc: rpcUrl }
  window.localStorage.setItem('network', JSON.stringify(network))
  return network
}

/**
 * Check localStorage for net and set default if missing
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const getNetwork = () => {
  const network = JSON.parse(window.localStorage.getItem('network'))
    ? JSON.parse(window.localStorage.getItem('network'))
    : changeNetwork('mainnet')
  return network
}

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = () => {
  const network = getNetwork()
  let provider = new ethers.providers.JsonRpcProvider(network.rpc)
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
  const abi = getAbis().erc20
  const provider = getWalletProvider()
  const contract = new ethers.Contract(tokenAddress, abi, provider)
  return contract
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
