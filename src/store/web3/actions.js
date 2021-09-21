import axios from 'axios'
import * as Types from './types'

import {
  bscRpcsMN,
  bscRpcsTN,
  getNetwork,
  getProviderGasPrice,
  getWalletWindowObj,
  parseTxn,
} from '../../utils/web3'
import { errorToDispatch, payloadToDispatch } from '../helpers'
import { getTokenContract } from '../../utils/web3Contracts'
import { convertToWei } from '../../utils/bigNumber'

export const web3Loading = () => ({
  type: Types.WEB3_LOADING,
})

/**
 * Check which network is selected in the MetaMask and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkMM = () => async (dispatch) => {
  dispatch(web3Loading())
  const providerETH = window.ethereum ? window.ethereum : null
  const network = getNetwork()
  const chainId = parseInt(network.chainId, 10)
  if (providerETH) {
    try {
      const addedNetworkMM = await providerETH.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `BSC ${network.net}`,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: network.chainId === 97 ? bscRpcsTN : bscRpcsMN,
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      })
      dispatch(payloadToDispatch(Types.ADD_NETWORK_MM, addedNetworkMM))
    } catch (error) {
      dispatch(errorToDispatch(Types.WEB3_ERROR, error))
    }
  } else {
    dispatch(
      errorToDispatch(
        Types.WEB3_ERROR,
        'There was an issue adding the network; do you have metamask installed?',
      ),
    )
  }
}

/**
 * Check which network is selected in BC-wallet and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkBC = () => async (dispatch) => {
  dispatch(web3Loading())
  const providerBC = window.BinanceChain ? window.BinanceChain : null
  const network = getNetwork()
  const chainId = parseInt(network.chainId, 10)
  if (providerBC && parseInt(providerBC?.chainId, 16) !== chainId) {
    const chainIdString = network.chainId === 97 ? 'bsc-testnet' : 'bsc-mainnet'
    try {
      const addedNetworkBC = await providerBC.switchNetwork(chainIdString)
      dispatch(payloadToDispatch(Types.ADD_NETWORK_BC, addedNetworkBC))
    } catch (error) {
      dispatch(errorToDispatch(Types.WEB3_ERROR, error))
    }
  } else {
    dispatch(
      errorToDispatch(
        Types.WEB3_ERROR,
        'Do you have BinanceChain wallet installed?',
      ),
    )
  }
}

/**
 * Get approval for a smart contract to handle transferring a token for the wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const getApproval =
  (tokenAddress, contractAddress, wallet) => async (dispatch) => {
    dispatch(web3Loading())
    const contract = getTokenContract(tokenAddress, wallet)
    try {
      const gPrice = await getProviderGasPrice()
      let txn = await contract.approve(
        contractAddress,
        convertToWei(1000000000),
        { gasPrice: gPrice },
      )
      txn = await parseTxn(txn, 'approval')
      dispatch(payloadToDispatch(Types.WEB3_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.WEB3_ERROR, error))
    }
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance1 =
  (tokenAddress, wallet, contractAddress) => async (dispatch) => {
    dispatch(web3Loading())
    const contract = getTokenContract(tokenAddress, wallet)
    try {
      const allowance1 = await contract.allowance(
        wallet.account,
        contractAddress,
      )
      dispatch(payloadToDispatch(Types.GET_ALLOWANCE1, allowance1.toString()))
    } catch (error) {
      dispatch(errorToDispatch(Types.WEB3_ERROR, error))
    }
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance2 =
  (tokenAddress, wallet, contractAddress) => async (dispatch) => {
    dispatch(web3Loading())
    const contract = getTokenContract(tokenAddress, wallet)
    try {
      const allowance2 = await contract.allowance(
        wallet.account,
        contractAddress,
      )
      dispatch(payloadToDispatch(Types.GET_ALLOWANCE2, allowance2.toString()))
    } catch (error) {
      dispatch(errorToDispatch(Types.WEB3_ERROR, error))
    }
  }

/**
 * Add a custom token to MetaMask including a custom icon if supplied
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const watchAsset =
  (tokenAddress, tokenSymbol, tokenDecimals, tokenImage, wallet) =>
  async (dispatch) => {
    dispatch(web3Loading())
    const connectedWalletType = getWalletWindowObj()
    if (wallet.account) {
      try {
        const watchingAsset = await connectedWalletType.request({
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
        if (watchingAsset) {
          console.log('Token added to wallet watch list')
        } else {
          console.log('Token not added to wallet watch list')
        }
        dispatch(payloadToDispatch(Types.WATCH_ASSET, watchingAsset))
      } catch (error) {
        dispatch(errorToDispatch(Types.WEB3_ERROR, error))
      }
    } else {
      dispatch(
        errorToDispatch(Types.WEB3_ERROR, 'Please connect your wallet first'),
      )
    }
  }

/**
 * Get price of SPARTA token via coinGecko API
 * @returns {uint} spartaPrice
 */
export const getSpartaPrice = () => async (dispatch) => {
  dispatch(web3Loading())
  try {
    const spartaPrice = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd',
    )
    dispatch(
      payloadToDispatch(
        Types.SPARTA_PRICE,
        spartaPrice.data['spartan-protocol-token'].usd,
      ),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.WEB3_ERROR, error))
  }
}

/**
 * Add the event txn array
 * @returns {array} eventArray
 */
export const getEventArray = (array) => async (dispatch) => {
  dispatch(web3Loading())
  try {
    const eventArray = array
    dispatch(payloadToDispatch(Types.EVENT_ARRAY, eventArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.WEB3_ERROR, error))
  }
}
