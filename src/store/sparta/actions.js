import axios from 'axios'
import { ethers } from 'ethers'
import * as Types from './types'
import {
  getFallenSpartansContract,
  getSpartaV1Contract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  addressesMN,
  bscRpcsMN,
  getAbis,
  getAddresses,
  getProviderGasPrice,
  parseTxn,
} from '../../utils/web3'
import { apiUrlBQ, headerBQ } from '../../utils/extCalls'
import { convertToWei } from '../../utils/bigNumber'

export const spartaLoading = () => ({
  type: Types.SPARTA_LOADING,
})

export const getSpartaGlobalDetails = () => async (dispatch) => {
  dispatch(spartaLoading())
  const contract1 = getSpartaV1Contract()
  const contract2 = getSpartaV2Contract()

  try {
    let awaitArray = [
      contract2.callStatic.emitting(),
      // contract.callStatic.minting(),
      contract2.callStatic.feeOnTransfer(),
      // contract.callStatic.emissionCurve(),
      contract2.callStatic.totalSupply(),
      contract2.callStatic.secondsPerEra(),
      // contract.callStatic.nextEraTime(),
      // contract1.callStatic.secondsPerEra(),
      contract1.callStatic.totalSupply(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emitting: awaitArray[0],
      // minting: awaitArray[],
      feeOnTransfer: awaitArray[1].toString(),
      // emissionCurve: awaitArray[],
      totalSupply: awaitArray[2].toString(),
      secondsPerEra: awaitArray[3].toString(),
      // nextEraTime: awaitArray[],
      // oldSecondsPerEra: awaitArray[].toString(),
      oldTotalSupply: awaitArray[4].toString(),
    }
    dispatch(payloadToDispatch(Types.SPARTA_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Check if your wallet was affected by the attacks and your SPARTA amount available to claim
 * @param {object} wallet
 * @returns {uint} claimAmount
 */
export const fallenSpartansCheck = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getFallenSpartansContract(wallet)
  try {
    const claimCheck = await contract.callStatic.getClaim(wallet.account)
    dispatch(payloadToDispatch(Types.FALLENSPARTA_CHECK, claimCheck.toString()))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Upgrade SPARTA(old V1) to SPARTA(New V2)
 */
export const spartaUpgrade = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getSpartaV2Contract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.upgrade({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'upgrade')
    dispatch(payloadToDispatch(Types.SPARTA_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Claim your wallet portion from the fallenSparta fund
 */
export const fallenSpartansClaim = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getFallenSpartansContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.claim({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'fsClaim')
    dispatch(payloadToDispatch(Types.SPARTA_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Get the total feeBurn tally on dapp-load
 */
export const spartaFeeBurnTally = () => async (dispatch) => {
  dispatch(spartaLoading())
  const addr = getAddresses()
  const apiUrl = apiUrlBQ
  const header = headerBQ
  try {
    const options = {
      method: 'POST',
      url: apiUrl,
      headers: header,
      data: {
        query: `query ($network: EthereumNetwork!,
          $address: String!,
          $token: String!,
          $limit:Int,
          $offset:Int,
          $from: ISO8601DateTime,
          $till: ISO8601DateTime){
      ethereum(network: $network){
        transfers(currency: {is: $token}
        date: {since: $from till: $till}
        height:{gt: 1}
        amount: {gt: 0}
        options: {desc: "amount", limit:$limit, offset: $offset}
        receiver: {is: $address}
        ){
          amount
          max_amount: maximum(of: amount, get: amount)
        }
      }
    }`,
        variables: {
          limit: 1,
          offset: 0,
          network: 'bsc',
          token: '0x3910db0600ea925f63c36ddb1351ab6e2c6eb102',
          from: null,
          till: null,
          dateFormat: '%Y-%m-%d',
          address: addr.bnb,
        },
      },
    }

    const feeBurnTally = await axios.request(options)

    dispatch(
      payloadToDispatch(
        Types.SPARTA_FEEBURN_TALLY,
        convertToWei(feeBurnTally.data.data.ethereum.transfers[0].amount),
      ),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Update the feeBurn tally
 */
export const spartaFeeBurnRecent = (amount) => async (dispatch) => {
  dispatch(spartaLoading())
  try {
    const feeBurnRecent = amount
    dispatch(payloadToDispatch(Types.SPARTA_FEEBURN_RECENT, feeBurnRecent))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

/**
 * Community wallet holdings
 */
export const communityWalletHoldings = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const comWal = '0x588f82a66eE31E59B88114836D11e3d00b3A7916'
  const abiErc20 = getAbis().erc20
  const provider = new ethers.providers.JsonRpcProvider(bscRpcsMN[0])
  const spartaCont = new ethers.Contract(
    addressesMN.spartav2,
    abiErc20,
    provider,
  )
  const busdCont = new ethers.Contract(
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    abiErc20,
    provider,
  )
  const usdtCont = new ethers.Contract(
    '0x55d398326f99059ff775485246999027b3197955',
    abiErc20,
    provider,
  )
  try {
    let awaitArray = [
      spartaCont.callStatic.balanceOf(comWal),
      busdCont.callStatic.balanceOf(comWal),
      usdtCont.callStatic.balanceOf(comWal),
      wallet ? spartaCont.callStatic.balanceOf(wallet.account) : '0',
      wallet?.account ? busdCont.callStatic.balanceOf(wallet.account) : '0',
      wallet?.account ? usdtCont.callStatic.balanceOf(wallet.account) : '0',
    ]
    awaitArray = await Promise.all(awaitArray)
    const communityWallet = {
      bnb: (await provider.getBalance(comWal)).toString(),
      sparta: awaitArray[0].toString(),
      busd: awaitArray[1].toString(),
      usdt: awaitArray[2].toString(),
      userSparta: awaitArray[3].toString(),
      userBnb: wallet?.account
        ? (await provider.getBalance(wallet.account)).toString()
        : '0',
      userBusd: awaitArray[4].toString(),
      userUsdt: awaitArray[5].toString(),
    }
    dispatch(payloadToDispatch(Types.SPARTA_COMMUNITY_WALLET, communityWallet))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}
