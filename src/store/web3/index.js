/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ethers } from 'ethers'

import {
  bscRpcsMN,
  bscRpcsTN,
  getNetwork,
  getProviderGasPrice,
  getWalletWindowObj,
  parseTxn,
} from '../../utils/web3'
import { getTokenContract } from '../../utils/getContracts'
import { convertToWei } from '../../utils/bigNumber'
import { callGlobalMetrics, getSubGraphBlock } from '../../utils/extCalls'
import { checkResolved } from '../../utils/helpers'

export const useWeb3 = () => useSelector((state) => state.web3)

export const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    loading: false,
    error: null,
    addedNetworkMM: {},
    addedNetworkBC: {},
    txn: [],
    allowance1: {},
    allowance2: {},
    watchingAsset: false,
    spartaPrice: 0,
    eventArray: {},
    rpcs: false,
    metrics: false,
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload.toString()
    },
    updateAddedNetworkMM: (state, action) => {
      state.addedNetworkMM = action.payload
    },
    updateAddedNetworkBC: (state, action) => {
      state.addedNetworkBC = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
    updateAllowance1: (state, action) => {
      state.allowance1 = action.payload
    },
    updateAllowance2: (state, action) => {
      state.allowance2 = action.payload
    },
    updateWatchingAsset: (state, action) => {
      state.watchingAsset = action.payload
    },
    updateSpartaPrice: (state, action) => {
      state.spartaPrice = action.payload
    },
    updateEventArray: (state, action) => {
      state.eventArray = action.payload
    },
    updateRpcs: (state, action) => {
      state.rpcs = action.payload
    },
    updateMetrics: (state, action) => {
      state.metrics = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateAddedNetworkMM,
  updateAddedNetworkBC,
  updateTxn,
  updateAllowance1,
  updateAllowance2,
  updateWatchingAsset,
  updateSpartaPrice,
  updateEventArray,
  updateRpcs,
  updateMetrics,
} = web3Slice.actions

/**
 * Check which network is selected in the MetaMask and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkMM = () => async (dispatch) => {
  dispatch(updateLoading(true))
  const providerETH = window.ethereum ? window.ethereum : null
  const network = getNetwork()
  if (network.chainId === 56) {
    network.net = 'Mainnet'
  } else {
    network.net = 'Testnet'
  }
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
      dispatch(updateAddedNetworkMM(addedNetworkMM))
    } catch (error) {
      dispatch(updateError(error))
    }
  } else {
    dispatch(
      updateError(
        'There was an issue adding the network; do you have metamask installed?',
      ),
    )
  }
  dispatch(updateLoading(false))
}

/**
 * Check which network is selected in BC-wallet and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkBC = () => async (dispatch) => {
  dispatch(updateLoading(true))
  const providerBC = window.BinanceChain ? window.BinanceChain : null
  const network = getNetwork()
  const chainId = parseInt(network.chainId, 10)
  if (providerBC && parseInt(providerBC?.chainId, 16) !== chainId) {
    const chainIdString = network.chainId === 97 ? 'bsc-testnet' : 'bsc-mainnet'
    try {
      const addedNetworkBC = await providerBC.switchNetwork(chainIdString)
      dispatch(updateAddedNetworkBC(addedNetworkBC))
    } catch (error) {
      dispatch(updateError(error))
    }
  } else {
    dispatch(updateError('Do you have BinanceChain wallet installed?'))
  }
  dispatch(updateLoading(false))
}

/**
 * Get approval for a smart contract to handle transferring a token for the wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const getApproval =
  (tokenAddress, contractAddress, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getTokenContract(tokenAddress, wallet, rpcs)
    try {
      const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.approve(
        contractAddress,
        convertToWei(1000000000),
        { gasPrice: gPrice },
      )
      txn = await parseTxn(txn, 'approval', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance1 =
  (tokenAddress, wallet, contractAddress) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getTokenContract(tokenAddress, wallet, rpcs)
    try {
      const allowance1 = await contract.allowance(
        wallet.account,
        contractAddress,
      )
      dispatch(updateAllowance1(allowance1.toString()))
    } catch (error) {
      dispatch(updateError(error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance2 =
  (tokenAddress, wallet, contractAddress) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getTokenContract(tokenAddress, wallet, rpcs)
    try {
      const allowance2 = await contract.allowance(
        wallet.account,
        contractAddress,
      )
      dispatch(updateAllowance2(allowance2.toString()))
    } catch (error) {
      dispatch(updateError(error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Add a custom token to MetaMask including a custom icon if supplied
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const watchAsset =
  (tokenAddress, tokenSymbol, tokenDecimals, tokenImage, walletAddr) =>
  async (dispatch) => {
    dispatch(updateLoading(true))
    const connectedWalletType = getWalletWindowObj()
    if (walletAddr) {
      try {
        const watchingAsset = await connectedWalletType.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol.substring(0, 11), // A ticker symbol or shorthand, up to 11 chars.
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
        dispatch(updateWatchingAsset(watchingAsset))
      } catch (error) {
        dispatch(updateError(error))
      }
    } else {
      dispatch(updateError('Please connect your wallet first'))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get price of SPARTA token via coinGecko API
 * @returns {uint} spartaPrice
 */
export const getSpartaPrice = () => async (dispatch) => {
  dispatch(updateLoading(true))
  try {
    const spartaPrice = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=spartan-protocol-token&vs_currencies=usd',
    )
    dispatch(updateSpartaPrice(spartaPrice.data['spartan-protocol-token'].usd))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Add the event txn array
 * @returns {array} eventArray
 */
export const getEventArray = (array) => async (dispatch) => {
  dispatch(updateLoading(true))
  try {
    const eventArray = array
    dispatch(updateEventArray(eventArray))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the current blocks from all RPCs
 */
export const getRPCBlocks = () => async (dispatch) => {
  dispatch(updateLoading(true))

  const withTimeout = (millis, promise) => {
    const timeout = new Promise((resolve, reject) =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(
        () => reject(new Error(`Timed out after ${millis} ms.`)),
        millis,
      ),
    )
    return Promise.race([promise, timeout])
  }

  try {
    let awaitArray = []
    const network = getNetwork()
    const rpcUrls = network.chainId === 97 ? bscRpcsTN : bscRpcsMN
    for (let i = 0; i < rpcUrls.length; i++) {
      const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrls[i]) // simple provider unsigned & cached chainId
      awaitArray.push(withTimeout(3000, provider.getBlockNumber()))
    }
    awaitArray = await Promise.allSettled(awaitArray)
    let rpcs = []
    for (let i = 0; i < rpcUrls.length; i++) {
      rpcs.push({
        url: rpcUrls[i],
        block: checkResolved(awaitArray[i], 0),
        good: awaitArray[i].status === 'fulfilled',
      })
    }
    const isEmpty = rpcs.filter((x) => x.good === true).length <= 0
    if (isEmpty) {
      rpcs[0].block = 100
      rpcs[0].good = true
    }
    rpcs = rpcs.sort((a, b) => b.block - a.block)
    // console.log(rpcs)
    dispatch(updateRpcs(rpcs))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

export const getGlobalMetrics = () => async (dispatch) => {
  dispatch(updateLoading(true))
  try {
    const block = await getSubGraphBlock()
    const global = await callGlobalMetrics()
    dispatch(updateMetrics({ global, block }))
  } catch (error) {
    dispatch(updateError(error))
  }
  dispatch(updateLoading(false))
}

export default web3Slice.reducer
