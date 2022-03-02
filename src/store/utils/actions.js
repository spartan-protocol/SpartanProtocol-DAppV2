import * as Types from './types'
import { getUtilsContract } from '../../utils/getContracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const utilsLoading = () => ({
  type: Types.UTILS_LOADING,
})

/**
 * UTILS HELPER -
 * Returns the pool's details
 * @returns [ tokenAddress | poolAddress | genesis | baseAmount | tokenAmount | baseAmountPooled | tokenAmountPooled | fees | volume | txCount | poolUnits ]
 */
export const getPoolDetails = (pool, wallet, rpcUrls) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet, rpcUrls)

  try {
    const poolDetails = await contract.callStatic.getPoolData(pool)
    dispatch(payloadToDispatch(Types.GET_POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get a pool address from the token address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} pool
 */
export const getPool = (token, wallet, rpcUrls) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet, rpcUrls)

  try {
    const pool = await contract.callStatic.getPool(token)
    dispatch(payloadToDispatch(Types.GET_POOL, pool))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} synth
 */
export const getSynth = (token, wallet, rpcUrls) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet, rpcUrls)

  try {
    const synth = await contract.callStatic.getSynth(token)
    dispatch(payloadToDispatch(Types.GET_SYNTH, synth))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}
