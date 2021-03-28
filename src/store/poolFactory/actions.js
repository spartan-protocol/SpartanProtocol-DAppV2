import * as Types from './types'
import { getPoolFactoryContract } from '../../utils/web3PoolFactory'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getUtilsContract } from '../../utils/web3Utils'
import { getTokenContract } from '../../utils/web3'

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
 * Get listed tokens count
 * @returns {uint} tokenCount
 */
export const getPoolFactoryTokenCount = () => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tokenCount = await contract.callStatic.tokenCount()
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_TOKEN_COUNT, tokenCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get array of all listed token addresses
 * @param {uint} tokenCount
 * @returns {array} tokenArray
 */
export const getPoolFactoryTokenArray = (tokenCount) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tempArray = []
    for (let i = 0; i < tokenCount; i++) {
      tempArray.push(i)
    }
    const tokenArray = await Promise.all(
      tempArray.map((token) => contract.callStatic.getToken(token)),
    )
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_TOKEN_ARRAY, tokenArray))
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
 * @param {uint} curatedPoolCount
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

/**
 * Get array of tokenAddresses grouped with poolAddresses
 * @param {array} tokenArray
 * @returns {array} poolArray
 */
export const getPoolFactoryArray = (tokenArray) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tempArray = await Promise.all(
      tokenArray.map((token) => contract.callStatic.getPool(token)),
    )
    const poolArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      const tempItem = {
        tokenAddress: tokenArray[i],
        poolAddress: tempArray[i],
      }
      poolArray.push(tempItem)
    }
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_ARRAY, poolArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get detailed array of token/pool information
 * @param {array} poolArray
 * @returns {array} detailedArray
 */
export const getPoolFactoryDetailedArray = (
  tokenArray,
  wbnbAddr,
  spartaAddr,
) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getUtilsContract()

  try {
    if (tokenArray[0] !== spartaAddr) {
      tokenArray.unshift(spartaAddr)
    }
    const tempArray = await Promise.all(
      tokenArray.map((i) =>
        i === wbnbAddr
          ? contract.callStatic.getTokenDetails(
              '0x0000000000000000000000000000000000000000',
            )
          : contract.callStatic.getTokenDetails(i),
      ),
    )
    const detailedArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      const tempItem = {
        tokenAddress: tokenArray[i],
        name: tempArray[i].name,
        symbol: tempArray[i].symbol,
        decimals: tempArray[i].decimals.toString(),
        totalSupply: tempArray[i].totalSupply.toString(),
        balance: tempArray[i].balance.toString(),
      }
      detailedArray.push(tempItem)
    }
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_DETAILED_ARRAY, detailedArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Get finalised/useable array of token/pool information
 * @param {array} detailedArray
 * @param {array} curatedArray
 * @returns {array} finalArray
 */
export const getPoolFactoryFinalArray = (detailedArray, curatedArray) => async (
  dispatch,
) => {
  dispatch(poolFactoryLoading())
  const contract = getUtilsContract()

  try {
    const tempArray = await Promise.all(
      detailedArray.map((i) =>
        i.symbol === 'SPARTA'
          ? {
              genesis: '0',
              baseAmount: '0',
              tokenAmount: '0',
              poolUnits: '0',
            }
          : contract.callStatic.getPoolData(i.tokenAddress),
      ),
    )
    const finalArray = []
    for (let i = 0; i < detailedArray.length; i++) {
      const tokenAddr = detailedArray[i].tokenAddress
      const tempItem = {
        tokenAddress: tokenAddr,
        balanceTokens: detailedArray[i].balance,
        name: detailedArray[i].name,
        symbol: detailedArray[i].symbol,
        decimals: detailedArray[i].decimals,
        totalSupply: detailedArray[i].totalSupply,
        poolAddress: tempArray[i].poolAddress,
        balanceLPs: 'placehodler wallet holdings of LP tokens',
        lockedLPs: 'placehodler LP tokens locked in DAO?',
        genesis: tempArray[i].genesis.toString(),
        baseAmount: tempArray[i].baseAmount.toString(),
        tokenAmount: tempArray[i].tokenAmount.toString(),
        poolUnits: tempArray[i].poolUnits.toString(),
        curated: curatedArray.find((item) => item === tokenAddr) > 0,
        symbolUrl: 'placeholder for icon',
      }
      finalArray.push(tempItem)
    }
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_FINAL_ARRAY, finalArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

/**
 * Add LP holdings to final array (maybe add the other LP calls here too?)
 * @param {array} finalArray
 * @returns {array} finalLpArray
 */
export const getPoolFactoryFinalLpArray = (finalArray, walletAddress) => async (
  dispatch,
) => {
  dispatch(poolFactoryLoading())

  try {
    const tempArray = await Promise.all(
      finalArray.map((i) => {
        const contract =
          i.symbol === 'SPARTA' ? null : getTokenContract(i.poolAddress)

        return i.symbol === 'SPARTA' ? '0' : contract.balanceOf(walletAddress)
      }),
    )
    const finalLpArray = []
    for (let i = 0; i < finalArray.length; i++) {
      const tempItem = {
        tokenAddress: finalArray[i].tokenAddress,
        balanceTokens: finalArray[i].balanceTokens,
        name: finalArray[i].name,
        symbol: finalArray[i].symbol,
        decimals: finalArray[i].decimals,
        totalSupply: finalArray[i].totalSupply,
        poolAddress: finalArray[i].poolAddress,
        balanceLPs: tempArray[i].toString(),
        lockedLPs: 'placehodler LP tokens locked in DAO?',
        genesis: finalArray[i].genesis,
        baseAmount: finalArray[i].baseAmount,
        tokenAmount: finalArray[i].tokenAmount,
        poolUnits: finalArray[i].poolUnits,
        curated: finalArray[i].curated,
        symbolUrl: 'placeholder for icon',
      }
      finalLpArray.push(tempItem)
    }
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_FINAL_LP_ARRAY, finalLpArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}
