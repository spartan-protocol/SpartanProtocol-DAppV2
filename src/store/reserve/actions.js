import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getReserveContract,
  getSpartaV2Contract,
  getTokenContract,
} from '../../utils/getContracts'
import { getAddresses, getNetwork, tempChains } from '../../utils/web3'
import { calcLiqValue } from '../../utils/math/utils'

export const reserveLoading = () => ({
  type: Types.RESERVE_LOADING,
})

/**
 * Get the Reserve contract details
 * @returns {object} emissions, spartaBalance
 */
export const getReserveGlobalDetails = (rpcUrls) => async (dispatch) => {
  dispatch(reserveLoading())
  const addr = getAddresses()
  const contract = getReserveContract(null, rpcUrls)
  const spartaContract = getSpartaV2Contract(null, rpcUrls)
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

/**
 * Get the Reserve POL details
 * @returns {object}
 */
export const getReservePOLDetails =
  (curatedPools, poolDetails, rpcUrls) => async (dispatch) => {
    dispatch(reserveLoading())
    const addr = getAddresses()
    let awaitArray = []
    for (let i = 0; i < curatedPools.length; i++) {
      const poolContract = getTokenContract(curatedPools[i], null, rpcUrls)
      awaitArray.push(poolContract.callStatic.balanceOf(addr.reserve))
    }
    try {
      awaitArray = await Promise.all(awaitArray)
      const polDetails = []
      for (let i = 0; i < curatedPools.length; i++) {
        const pool = poolDetails.filter((x) => x.address === curatedPools[i])[0]
        const lpsLocked = awaitArray[i].toString()
        const spartaLocked = calcLiqValue(lpsLocked, pool)[0]
        polDetails.push({
          tokenAddress: pool.tokenAddress,
          address: pool.address,
          spartaLocked: spartaLocked.toString(),
        })
      }

      dispatch(payloadToDispatch(Types.RESERVE_POL_DETAILS, polDetails))
    } catch (error) {
      dispatch(errorToDispatch(Types.RESERVE_ERROR, `${error}.`))
    }
  }
