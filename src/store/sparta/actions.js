import axios from 'axios'
import * as Types from './types'
import {
  getFallenSpartansContract,
  getSpartaV1Contract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses, getProviderGasPrice } from '../../utils/web3'
import { apiUrlBQ, headerBQ } from '../../utils/extCalls'

export const spartaLoading = () => ({
  type: Types.SPARTA_LOADING,
})

export const getSpartaGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract1 = getSpartaV1Contract(wallet)
  const contract2 = getSpartaV2Contract(wallet)

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
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
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
    const upgrade = await contract.upgrade({
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.SPARTA_UPGRADE, upgrade))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
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
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
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
    const claim = await contract.claim({
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.FALLENSPARTA_CLAIM, claim))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}

/**
 * Claim your wallet portion from the fallenSparta fund
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
        feeBurnTally.data.data.ethereum.transfers[0],
      ),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}
