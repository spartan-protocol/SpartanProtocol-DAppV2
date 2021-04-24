import * as Types from './types'
import { getUtilsContract } from '../../utils/web3Contracts'
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
 * Get share of pool by member (using tokenAddr) (doesn't include LP tokens staked in DAO)
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
 * Returns the SPARTA share of a pool based on member's holdings (doesn't include LP tokens staked in DAO nor the TOKEN share)
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
 * Returns the TOKEN share of a pool based on member's holdings (doesn't include LP tokens staked in DAO nor the SPARTA share)
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
export const getPoolShareAssym = (token, member, toBase) => async (
  dispatch,
) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const poolShareAssym = await contract.callStatic.getPoolShareAssym(
      token,
      member,
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

// NEW ONES - ADD TO REDUCER ETC BELOW

/**
 * Get a pool address from the token address
 * @param {address} token
 * @returns {address} pool
 */
export const getPool = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const pool = await contract.callStatic.getPool(token)
    dispatch(payloadToDispatch(Types.GET_POOL, pool))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get count of all pools
 * @returns {uint256} count
 */
export const getPoolCount = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const count = await contract.callStatic.poolCount()
    dispatch(payloadToDispatch(Types.GET_POOL_COUNT, count))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get share of pool by member (using poolAddr)
 * (doesn't include LP tokens staked in DAO)
 * @param {address} pool
 * @param {address} member
 * @returns {uint} baseAmount
 * @returns {uint} tokenAmount
 */
export const getMemberPoolShare = (pool, member) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const outputAmount = await contract.callStatic.getMemberPoolShare(
      pool,
      member,
    )
    dispatch(payloadToDispatch(Types.GET_MEMBER_POOL_SHARE, outputAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get weight of pool by LP units
 * @param {address} token
 * @param {uint} units
 * @returns {uint} weight
 */
export const getPoolShareWeight = (tokens, units) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const weight = await contract.callStatic.getPoolShareWeight(tokens, units)
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE_WEIGHT, weight))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get depth of pool in SPARTA
 * Multiply this by 2 and then by SPARTA's USD price to get rough actual all-asset depth in USD
 * @param {address} pool
 * @returns {uint} baseAmount
 */
export const getDepth = (pool) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const baseAmount = await contract.callStatic.getDepth(pool)
    dispatch(payloadToDispatch(Types.GET_DEPTH, baseAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @returns {address} synth
 */
export const getSynth = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const synth = await contract.callStatic.getSynth(token)
    dispatch(payloadToDispatch(Types.GET_SYNTH, synth))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @returns {object} synthAddress, tokenAddress, genesis, totalDebt
 */
export const getSynthData = (token) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const synthData = await contract.callStatic.getSynthData(token)
    dispatch(payloadToDispatch(Types.GET_SYNTH_DATA, synthData))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get share of debt
 * share = amount * part/total
 * @param {uint} units
 * @param {uint} totalSupply
 * @param {address} lpToken
 * @param {address} synth
 * @returns {uint} share
 */
export const getDebtShare = (units, totalSupply, lpToken, synth) => async (
  dispatch,
) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const share = await contract.callStatic.calcDebtShare(
      units,
      totalSupply,
      lpToken,
      synth,
    )
    dispatch(payloadToDispatch(Types.GET_DEBT_SHARE, share))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get count of curated pools
 * @returns {uint} count
 */
export const getCuratedPoolCount = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const count = await contract.callStatic.curatedPoolCount()
    dispatch(payloadToDispatch(Types.GET_CURATED_POOL_COUNT, count))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get all curated pools
 * @returns {aray} curatedPools
 */
export const getCuratedPools = () => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const curatedPools = await contract.callStatic.allCuratedPools()
    dispatch(payloadToDispatch(Types.GET_CURATED_POOLS, curatedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}

/**
 * Get curated pools in range
 * @param {uint} start
 * @param {uint} count
 * @returns {aray} curatedPools
 */
export const getCuratedPoolsInRange = (start, count) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract()

  try {
    const curatedPools = await contract.callStatic.curatedPoolsInRange(
      start,
      count,
    )
    dispatch(payloadToDispatch(Types.GET_CURATED_POOLS_IN_RANGE, curatedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, error))
  }
}
