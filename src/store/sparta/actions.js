import { ethers } from 'ethers'
import * as Types from './types'
import { BASE_ABI } from '../../utils/web3Sparta'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getWalletProvider } from '../../utils/web3'
import { useWeb3 } from '../web3/selector'

export const spartaLoading = () => ({
  type: Types.SPARTA_LOADING,
})

export const getSpartaContract = () => (dispatch) => {
  dispatch(spartaLoading())
  const web3 = useWeb3()
  const provider = getWalletProvider()

  try {
    const contract = new ethers.Contract(
      web3.addrList.sparta,
      BASE_ABI,
      provider,
    )
    dispatch(payloadToDispatch(Types.GET_SPARTA_CONTRACT, contract))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

export const getEmitting = () => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getSpartaContract()

  try {
    const emitting = await contract.callStatic.emitting()
    dispatch(payloadToDispatch(Types.GET_EMTTING, emitting))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

export const getAdjustedClaimRate = (assetAddress) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getSpartaContract()

  try {
    const adjustedClaimRate = await contract.callStatic.getAdjustedClaimRate(
      assetAddress,
    )
    dispatch(
      payloadToDispatch(Types.GET_ADJUSTED_CLAIM_RATE, adjustedClaimRate),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}

export const claim = (assetAddress, amount, justCheck) => async (dispatch) => {
  dispatch(spartaLoading())
  dispatch(getSpartaContract())
  const web3 = useWeb3()
  const provider = getWalletProvider()
  const { contract } = web3

  try {
    let claimed = {}
    if (justCheck) {
      claimed = await contract.callStatic.claim(assetAddress, amount)
    } else {
      const gPrice = await provider.getGasPrice()
      const gLimit = await contract.estimateGas.claim(assetAddress, amount)
      claimed = await contract.claim(assetAddress, amount, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.CLAIM, claimed))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, error))
  }
}
