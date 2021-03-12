import * as Types from './types'

import {
  getWalletProvider,
  getTokenContract,
  bscRpcsTN,
  bscRpcsMN,
  addressesTN,
  addressesMN,
} from '../../utils/web3'
import { errorToDispatch, payloadToDispatch } from '../helpers'

export const web3Loading = () => ({
  type: Types.WEB3_LOADING,
})

/**
 *
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} addresses - Returns a list of important addresses (testnet || mainnet)
 */
export const changeAddrList = (net) => (dispatch) => {
  dispatch(web3Loading())
  const addrList = net === 'testnet' ? addressesTN : addressesMN
  dispatch(payloadToDispatch(Types.CHANGE_ADDR_LIST, addrList))
}

/**
 *
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {String} rpcUrl - Returns a random RPC URL from the RPC array (testnet || mainnet)
 */
export const changeRpcUrl = (net) => (dispatch) => {
  dispatch(web3Loading())
  const rpcUrls = net === 'testnet' ? bscRpcsTN : bscRpcsMN
  const rpcIndex = Math.floor(Math.random() * rpcUrls.length)
  const rpcUrl = rpcUrls[rpcIndex]
  dispatch(payloadToDispatch(Types.CHANGE_RPC_URL, rpcUrl))
}

/**
 *
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const changeNetwork = (net) => (dispatch) => {
  dispatch(web3Loading())
  const network =
    net === 'testnet'
      ? { chainId: 97, net: 'testnet', chain: 'BSC' }
      : { chainId: 56, net: 'mainnet', chain: 'BSC' }
  dispatch(changeRpcUrl(network.net))
  dispatch(changeAddrList(network.net))
  window.localStorage.setItem('network', JSON.stringify(network))
  dispatch(payloadToDispatch(Types.CHANGE_NETWORK, network))
}

/**
 *
 * @param {string} net - 'mainnet' or 'testnet'
 * @returns {Object} chainId (56), net (mainnet), chain (BSC)
 */
export const changeNetworkWallet = (net) => (dispatch) => {
  dispatch(web3Loading())
  const network =
    net === 'testnet'
      ? { chainId: 97, net: 'testnet', chain: 'BSC' }
      : { chainId: 56, net: 'mainnet', chain: 'BSC' }
  window.localStorage.setItem('network', JSON.stringify(network))
  changeRpcUrl(network.net)
  dispatch(payloadToDispatch(Types.CHANGE_NETWORK, network))
}

export const getApproval = (tokenAddress, contractAddress) => async (
  dispatch,
) => {
  dispatch(web3Loading())
  const provider = getWalletProvider()
  let contract = getTokenContract(tokenAddress)

  try {
    const supply = await contract.totalSupply()
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.approve(contractAddress, supply)
    contract = await contract.approve(contractAddress, supply, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.GET_CONTRACT, contract))
  } catch (error) {
    dispatch(errorToDispatch(Types.WEB3_ERROR, error))
  }
}
