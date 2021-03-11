import { ethers } from 'ethers'

import ERC20 from '../config/ABI/ERC20.json'

export const getNetwork = () => window.sessionStorage.getItem('network')

// RPC NETWORK CONSTANTS
export const BSC_RPCS =
  getNetwork === 'testnet'
    ? [
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
        'https://data-seed-prebsc-2-s2.binance.org:8545/',
        'https://data-seed-prebsc-1-s3.binance.org:8545/',
        'https://data-seed-prebsc-2-s3.binance.org:8545/',
      ]
    : [
        'https://bsc-dataseed.binance.org/',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/',
      ]

// TOKEN ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR =
  getNetwork === 'testnet'
    ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870'
    : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR =
  getNetwork === 'testnet'
    ? '0x6e812dD5B642334bbd17636d3865CE82C3D4d7eB'
    : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'

// ADDRESSES FOR TESTS
export const TEST_WALLET = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
export const TEST_TOKEN =
  getNetwork === 'testnet'
    ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870'
    : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const TEST_POOL =
  getNetwork === 'testnet'
    ? '0xA2C646CF5F55657EC0ecee5b8d2fCcb4cA843bd3'
    : '0x3de669c4F1f167a8aFBc9993E4753b84b576426f'

// ABI
export const ERC20_ABI = ERC20.abi

// Get RPC URL
export const getRpcUrl = () => {
  const rpcIndex = Math.random() * (BSC_RPCS.length + 1)
  const rpcUrl = BSC_RPCS[rpcIndex]
  console.log(rpcUrl)
  return rpcUrl
}

// Get Chain ID
export const getChainId = (network) => {
  const chainId = network === 'testnet' ? 97 : 56
  return chainId
}

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = () => {
  let provider = new ethers.providers.JsonRpcProvider(getRpcUrl())
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

// GET allowance APPROVAL FOR ASSET TO INTERACT WITH CONTRACT VIA WALLET
export const newApproval = async (tokenAddress, contractAddress) => {
  const provider = getWalletProvider()
  let contract = getTokenContract(tokenAddress)
  const supply = await contract.totalSupply()
  const gPrice = await provider.getGasPrice()
  const gLimit = await contract.estimateGas.approve(contractAddress, supply)
  contract = await contract.approve(contractAddress, supply, {
    gasPrice: gPrice,
    gasLimit: gLimit,
  })
  console.log(contract)
  return contract
}

// Check approval allowance
export const getApprovalAllowance = async (
  tokenAddress,
  userAddress,
  contractAddress,
) => {
  const contract = getTokenContract(tokenAddress)
  const result = await contract.allowance(userAddress, contractAddress)
  console.log(result)
  return result
}

// ADD TOKEN INFO TO WALLET
export const watchAsset = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
) => {
  let connectedWalletType = ''
  if (window.sessionStorage.getItem('lastWallet') === 'BC') {
    connectedWalletType = window.BinanceChain
  } else {
    connectedWalletType = window.ethereum
  }
  if (window.sessionStorage.getItem('walletConnected')) {
    try {
      const wasAdded = await connectedWalletType.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      })
      if (wasAdded) {
        console.log('Token added to wallet watch list')
      } else {
        console.log('Token not added to wallet watch list')
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('Please connect your wallet first')
  }
}
