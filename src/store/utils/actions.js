import * as Types from './types'
import { getUtilsContract } from '../../utils/web3Utils'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const utilsLoading = () => ({
  type: Types.UTILS_LOADING,
})

// --------------------------------------- GENERAL UTILS HELPERS ---------------------------------------

/**
 * UTILS HELPER -
 * Returns an array of pool addresses
 */
export const getListedPools = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const pools = await contract.callStatic.allPools()
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns an array of pool addresses based on specified range
 */
export const getListedPoolsRange = (first, count) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const pools = await contract.callStatic.poolsInRange(first, count)
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS_RANGE, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns an array of listed token addresses
 */
export const getListedAssets = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const assets = await contract.callStatic.allTokens()
    dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS, assets))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns an array of listed token addresses by specified range
 */
export const getListedAssetsRange = (first, count) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const assets = await contract.callStatic.tokensInRange(first, count)
    dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS_RANGE, assets))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the global details/stats
 * @returns [ totalPooled | totalVolume | totalFees | removeLiquidityTx | addLiquidityTx | swapTx ]
 */
export const getGlobalDetails = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const globalDetails = await contract.callStatic.getGlobalDetails()
    dispatch(payloadToDispatch(Types.GET_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the token's contract details
 * @returns [ name | symbol | decimals | totalSupply | balance ]
 */
export const getTokenDetails = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const tokenDetails = await contract.callStatic.getTokenDetails(token)
    dispatch(payloadToDispatch(Types.GET_TOKEN_DETAILS, tokenDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the pool's details
 * @returns [ tokenAddress | poolAddress | genesis | baseAmount | tokenAmount | baseAmountPooled | tokenAmountPooled | fees | volume | txCount | poolUnits ]
 */
export const getPoolDetails = (pool) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolDetails = await contract.callStatic.getPoolData(pool)
    dispatch(payloadToDispatch(Types.GET_POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the share of a pool based on member's holdings (doesn't include LP tokens locked in DAO)
 * @returns [ uint baseAmount | uint tokenAmount ]
 */
export const getMemberShare = (token, member) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const memberShare = await contract.callStatic.getMemberShare(token, member)
    dispatch(payloadToDispatch(Types.GET_MEMBER_SHARE, memberShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the share of a pool based on input LP token units
 * @returns [ uint baseAmount | uint tokenAmount ]
 */
export const getPoolShare = (token, units) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolShare = await contract.callStatic.getPoolShare(token, units)
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE, poolShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the SPARTA share of a pool based on member's holdings (doesn't include LP tokens locked in DAO nor the TOKEN share)
 * @returns uint baseAmount
 */
export const getShareOfBaseAmount = (token, member) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const shareOfBaseAmount = await contract.callStatic.getShareOfBaseAmount(
      token,
      member,
    )
    dispatch(
      payloadToDispatch(Types.GET_SHARE_OF_BASE_AMAOUNT, shareOfBaseAmount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the TOKEN share of a pool based on member's holdings (doesn't include LP tokens locked in DAO nor the SPARTA share)
 * @returns uint tokenAmount
 */
export const getShareOfTokenAmount = (token, member) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const shareOfTokenAmount = await contract.callStatic.getShareOfTokenAmount(
      token,
      member,
    )
    dispatch(
      payloadToDispatch(Types.GET_SHARE_OF_TOKEN_AMAOUNT, shareOfTokenAmount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the asymmetric share of a pool based on input LP token units.
 * Works out what you would end up with if you removed the liquidity and then swapped it all to one asset.
 * @returns [ uint baseAmount | uint tokenAmount | uint outputAmt ]
 */
export const getPoolShareAssym = (token, units, toBase) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolShareAssym = await contract.callStatic.getPoolShareAssym(
      token,
      units,
      toBase,
    )
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE_ASSYM, poolShareAssym))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the ~days since the pools creation
 * @returns uint daysSinceGenesis
 */
export const getPoolAge = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolAge = await contract.callStatic.getPoolAge(token)
    dispatch(payloadToDispatch(Types.GET_POOL_AGE, poolAge))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the pools ROI calc
 * @returns uint roi
 */
export const getPoolROI = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolROI = await contract.callStatic.getPoolROI(token)
    dispatch(payloadToDispatch(Types.GET_POOL_ROI, poolROI))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns the pools APY calc
 * @returns uint apy
 */
export const getPoolAPY = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolAPY = await contract.callStatic.getPoolAPY(token)
    dispatch(payloadToDispatch(Types.GET_POOL_APY, poolAPY))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * UTILS HELPER -
 * Returns whether the wallet address is a member of the pool
 * @returns bool
 */
export const isMember = (token, member) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const result = await contract.callStatic.isMember(token, member)
    dispatch(payloadToDispatch(Types.IS_MEMBER, result))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}
