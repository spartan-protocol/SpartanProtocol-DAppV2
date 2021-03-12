import { ethers } from 'ethers'

import ERC20 from '../config/ABI/ERC20.json'

export const getNetwork = () => window.sessionStorage.getItem('network')

// RPC NETWORK CONSTANTS
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

// List of BSC Testnet Addresses
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

// List of variables for tests
export const TEST_WALLET = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
export const TEST_TOKEN = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const TEST_POOL = '0x3de669c4F1f167a8aFBc9993E4753b84b576426f'

// ABI
export const ERC20_ABI = ERC20.abi

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = (rpcUrl) => {
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
