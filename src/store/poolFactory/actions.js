import * as Types from './types'
import { getPoolFactoryContract } from '../../utils/web3PoolFactory'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const poolFactoryLoading = () => ({
  type: Types.POOLFACTORY_LOADING,
})

/**
 * Get address of pool via token address
 * @param {address} tokenAddr
 * @returns {address} poolAddr
 */
export const getPoolFactoryPool = (tokenAddr) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const poolAddr = await contract.callStatic.getPool(tokenAddr)
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_POOL, poolAddr))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get listed pools count
 * @returns {uint} poolCount
 */
export const getPoolFactoryCount = () => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const poolCount = await contract.callStatic.poolCount()
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_COUNT, poolCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get array of pool addresses
 * @param {uint} i
 * @returns {array} poolArray
 */
export const getPoolFactoryArray = (poolCount) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tempArray = []
    for (let i = 0; i < poolCount; i++) {
      tempArray.push(i)
    }
    const poolArray = await Promise.all(
      tempArray.map((pool) => contract.callStatic.getPoolArray(pool)),
    )
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_ARRAY, poolArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get curated pools count
 * @returns {uint} curatedPoolCount
 */
export const getPoolFactoryCuratedCount = () => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const curatedPoolCount = await contract.callStatic.getCuratedPoolsLength()
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_CURATED_COUNT, curatedPoolCount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get array of curated pool addresses
 * @param {uint} i
 * @returns {array} curatedPoolArray
 */
export const getPoolFactoryCuratedArray = (curatedPoolCount) => async (
  dispatch,
) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tempArray = []
    for (let i = 0; i < curatedPoolCount; i++) {
      tempArray.push(i)
    }
    const curatedPoolArray = await Promise.all(
      tempArray.map((pool) => contract.callStatic.getCuratedPool(pool)),
    )
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_CURATED_ARRAY, curatedPoolArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}
