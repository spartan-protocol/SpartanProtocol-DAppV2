import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getReserveContract,
  getSpartaContract,
} from '../../utils/web3Contracts'
import { getAddresses } from '../../utils/web3'

export const reserveLoading = () => ({
  type: Types.RESERVE_LOADING,
})

/**
 * Get the Reserve contract details
 * @returns {object} emissions, spartaBalance
 */
export const getReserveGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(reserveLoading())
  const addr = getAddresses()
  const contract = getReserveContract(wallet)
  const spartaContract = getSpartaContract(wallet)

  try {
    let awaitArray = [
      contract.callStatic.emissions(),
      spartaContract.callStatic.balanceOf(addr.reserve),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emissions: awaitArray[0],
      spartaBalance: awaitArray[1].toString(),
    }
    dispatch(payloadToDispatch(Types.RESERVE_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.RESERVE_ERROR, `${error}.`))
  }
}
