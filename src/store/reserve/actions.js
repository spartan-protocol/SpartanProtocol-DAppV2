import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getReserveContract,
  getSpartaV2Contract,
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
  const spartaContract = getSpartaV2Contract(wallet)
  try {
    let awaitArray = [
      contract.callStatic.emissions(),
      contract.callStatic.globalFreeze(),
      spartaContract.callStatic.balanceOf(addr.reserve),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emissions: awaitArray[0],
      globalFreeze: awaitArray[1],
      spartaBalance: awaitArray[2].toString(),
    }
    dispatch(payloadToDispatch(Types.RESERVE_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.RESERVE_ERROR, `${error}.`))
  }
}
