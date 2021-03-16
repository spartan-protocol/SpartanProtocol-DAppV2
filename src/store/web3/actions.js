import * as Types from './types'

import {
  getTokenContract,
  getWalletWindowObj,
  bscRpcsMN,
  bscRpcsTN,
  getNetwork,
  getProviderGasPrice,
} from '../../utils/web3'
import { errorToDispatch, payloadToDispatch } from '../helpers'

export const web3Loading = () => ({
  type: Types.WEB3_LOADING,
})

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
/**
 * Check which network selected is selected in the wallet and prompt to add or change if available
 * @param {string} network - Whether it is 'mainnet' or 'testnet'
 * @returns {boolean} true if succeeds
 */
export const addNetwork = () => async (dispatch) => {
  dispatch(web3Loading())
  const provider = window.ethereum ? window.ethereum : window.BinanceChain
  const network = getNetwork()
  if (provider === window.ethereum) {
    const chainId = parseInt(network.chainId, 10)
    try {
      console.log(provider)
      const addedNetwork = await provider.request({
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
            rpcUrls: network.net === 'testnet' ? bscRpcsTN : bscRpcsMN,
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      })
      dispatch(payloadToDispatch(Types.ADD_NETWORK, addedNetwork))
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
 * Get approval for a smart contract to handle transferring a token for the wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const getApproval = (tokenAddress, contractAddress) => async (
  dispatch,
) => {
  dispatch(web3Loading())
  const contract = getTokenContract(tokenAddress)

  try {
    const supply = await contract.totalSupply()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.approve(contractAddress, supply)
    const approval = await contract.approve(contractAddress, supply, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.GET_APPROVAL, approval))
  } catch (error) {
    dispatch(errorToDispatch(Types.WEB3_ERROR, error))
  }
}

/**
 * Get the current allowance-limit for a smart contract to handle transferring a token on behlf of a wallet
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {BigNumber?}
 */
export const getAllowance = (
  tokenAddress,
  userAddress,
  contractAddress,
) => async (dispatch) => {
  dispatch(web3Loading())
  const contract = getTokenContract(tokenAddress)

  try {
    const allowance = await contract.allowance(userAddress, contractAddress)

    dispatch(payloadToDispatch(Types.GET_ALLOWANCE, allowance))
  } catch (error) {
    dispatch(errorToDispatch(Types.WEB3_ERROR, error))
  }
}

/**
 * Add a custom token to MetaMask including a custom icon if supplied
 * @param {string} address - Address of the token being transferred & the address of the smart contract handling the token
 * @returns {boolean} true if succeeds
 */
export const watchAsset = (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
) => async (dispatch) => {
  dispatch(web3Loading())
  const connectedWalletType = getWalletWindowObj()
  if (window.sessionStorage.getItem('walletConnected')) {
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
