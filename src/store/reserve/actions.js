import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getReserveContract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { getAddresses, getNetwork, tempChains } from '../../utils/web3'

export const reserveLoading = () => ({
  type: Types.RESERVE_LOADING,
})

/**
 * Get the Reserve contract details
 * @returns {object} emissions, spartaBalance
 */
export const getReserveGlobalDetails = () => async (dispatch) => {
  dispatch(reserveLoading())
  const addr = getAddresses()
  const contract = getReserveContract()
  const spartaContract = getSpartaV2Contract()
  // const busdpContract = getTokenContract(addr.busdp)
  try {
    let awaitArray = [
      contract.callStatic.emissions(),
      spartaContract.callStatic.balanceOf(addr.reserve),
      tempChains.includes(getNetwork().chainId)
        ? contract.callStatic.globalFreeze()
        : false,
      // busdpContract.callStatic.balanceOf(addr.reserve),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emissions: awaitArray[0],
      spartaBalance: awaitArray[1].toString(),
      globalFreeze: awaitArray[2],
      // busdpBalance: awaitArray[3].toString(),
    }
    dispatch(payloadToDispatch(Types.RESERVE_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.RESERVE_ERROR, `${error}.`))
  }
}
