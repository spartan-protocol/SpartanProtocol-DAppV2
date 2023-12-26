import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { bsc, bscTestnet } from 'viem/chains'
import { createPublicClient, http } from 'viem'

import {
  bscRpcsMN,
  bscRpcsTN,
  getWalletWindowObj,
  parseTxn,
  stablecoinPools,
} from '../../utils/web3'
import { getTokenContract } from '../../utils/getContracts'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
} from '../../utils/bigNumber'
import { callGlobalMetrics, getSubGraphBlock } from '../../utils/extCalls'
import { checkResolved } from '../../utils/helpers.ts'
import { getPool } from '../../utils/math/utils'

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
    spartaPriceInternal: 0,
    eventArray: {},
    rpcs: false,
    metrics: false,
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
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
    updateSpartaPriceInternal: (state, action) => {
      state.spartaPriceInternal = action.payload
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
  updateSpartaPriceInternal,
  updateEventArray,
  updateRpcs,
  updateMetrics,
} = web3Slice.actions

/**
 * Check which network is selected in MetaMask and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkMM = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const providerETH = window.ethereum ?? null
  if (providerETH) {
    try {
      const { chainId } = getState().app
      const network = {
        chainId: `0x${chainId.toString(16)}`,
        chainName: chainId === 56 ? 'BNBChain Mainnet' : 'BNBChain Testnet',
        rpcUrls: chainId === 56 ? bscRpcsMN : bscRpcsTN,
        blockExplorerUrls:
          chainId === 97
            ? ['https://testnet.bscscan.com/']
            : ['https://bscscan.com/'],
      }
      const addedNetworkMM = await providerETH.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: network.chainId,
            chainName: network.chainName,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls,
          },
        ],
      })
      dispatch(updateAddedNetworkMM(addedNetworkMM))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
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
 * Check which network is selected in BinanceWallet and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetworkBC = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const providerBC = window.BinanceChain ?? null
  const { chainId } = getState().app
  if (providerBC && parseInt(providerBC?.chainId, 16) !== chainId) {
    try {
      const chainIdString = chainId === 97 ? 'bsc-testnet' : 'bsc-mainnet'
      const addedNetworkBC = await providerBC.switchNetwork(chainIdString)
      dispatch(updateAddedNetworkBC(addedNetworkBC))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
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
  (tokenAddress, contractAddress, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getTokenContract(tokenAddress, signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.approve(
        [contractAddress, convertToWei(1000000000)],
        { gasPrice: gPrice },
      )
      txn = await parseTxn(txn, 'approval', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance1 =
  (tokenAddress, walletAddr, contractAddress) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    try {
      if (rpcs.length > 0) {
        const contract = getTokenContract(tokenAddress, null, rpcs)
        const allowance1 = (
          await contract.simulate.allowance([walletAddr, contractAddress])
        ).result
        dispatch(updateAllowance1(allowance1.toString()))
      }
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behalf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance2 =
  (tokenAddress, walletAddr, contractAddress) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    try {
      if (rpcs.length > 0) {
        const contract = getTokenContract(tokenAddress, null, rpcs)
        const allowance2 = (
          await contract.simulate.allowance([walletAddr, contractAddress])
        ).result
        dispatch(updateAllowance2(allowance2.toString()))
      }
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
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
        dispatch(updateError(error.reason ?? error.message ?? error))
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
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get price of SPARTA token via deepest stablecoin pools (internally derived price)
 * @returns {uint} spartaPrice
 */
export const getSpartaPriceInternal = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails } = getState().pool
  if (poolDetails.length > 0) {
    const minAmount = 25000 // 25,000 stablecoin units min (ie ~$50k TVL min)
    try {
      const _pools = []
      for (let i = 0; i < stablecoinPools.length; i += 1) {
        const { tokenAmount, baseAmount } = getPool(
          stablecoinPools[i],
          poolDetails,
        )
        // Only include pools with $USD TVL > 2 x MinAmount (because we only check the token side which is half of TVL)
        if (convertFromWei(tokenAmount) > minAmount) {
          _pools.push({
            tokenAmount,
            baseAmount,
          })
        }
      }
      // Sort by lowest TVL first to give deepest pools the greatest weight in the avg calc
      _pools.sort(
        (a, b) => convertFromWei(a.tokenAmount) - convertFromWei(b.tokenAmount),
      )
      let spartaPrice = BN(_pools[0].tokenAmount).div(_pools[0].baseAmount) // Get first/lowest weight avg result
      for (let i = 1; i < _pools.length; i += 1) {
        // Skip first index and continue
        spartaPrice = BN(_pools[i].tokenAmount)
          .div(_pools[i].baseAmount)
          .plus(spartaPrice)
          .div(2)
      }
      spartaPrice = Number(formatFromUnits(spartaPrice, 6))
      dispatch(updateSpartaPriceInternal(spartaPrice))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
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
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the current blocks from all RPCs
 */
export const getRPCBlocks = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))

  const withTimeout = (millis, promise) => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(
        () => reject(new Error(`Timed out after ${millis} ms.`)),
        millis,
      )
    })
    return Promise.race([promise, timeout])
  }

  try {
    let awaitArray = []
    const { chainId } = getState().app
    const rpcUrls = chainId === 97 ? bscRpcsTN : bscRpcsMN
    for (let i = 0; i < rpcUrls.length; i++) {
      const provider = createPublicClient({
        chain: chainId === 97 ? bscTestnet : bsc,
        transport: http(rpcUrls[i]),
      })
      awaitArray.push(withTimeout(3000, provider.getBlockNumber()))
    }
    awaitArray = await Promise.allSettled(awaitArray)
    let rpcs = []
    for (let i = 0; i < rpcUrls.length; i++) {
      const block = checkResolved(awaitArray[i], 0).toString()
      rpcs.push({
        url: rpcUrls[i],
        block,
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
    dispatch(updateError(error.reason ?? error.message ?? error))
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
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

export default web3Slice.reducer
