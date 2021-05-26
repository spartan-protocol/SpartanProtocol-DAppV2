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
export const getListedPools = (wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const pools = await contract.callStatic.allPools()
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns an array of pool addresses based on specified range
 */
export const getListedPoolsRange = (first, count, wallet) => async (
  dispatch,
) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const pools = await contract.callStatic.poolsInRange(first, count)
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS_RANGE, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the global details/stats
 * @returns [ totalPooled | totalVolume | totalFees | removeLiquidityTx | addLiquidityTx | swapTx ]
 */
export const getGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const globalDetails = await contract.callStatic.getGlobalDetails()
    dispatch(payloadToDispatch(Types.GET_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the token's contract details
 * @returns [ name | symbol | decimals | totalSupply | balance ]
 */
export const getTokenDetails = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const tokenDetails = await contract.callStatic.getTokenDetails(token)
    dispatch(payloadToDispatch(Types.GET_TOKEN_DETAILS, tokenDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the pool's details
 * @returns [ tokenAddress | poolAddress | genesis | baseAmount | tokenAmount | baseAmountPooled | tokenAmountPooled | fees | volume | txCount | poolUnits ]
 */
export const getPoolDetails = (pool, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const poolDetails = await contract.callStatic.getPoolData(pool)
    dispatch(payloadToDispatch(Types.GET_POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get share of pool by member (using tokenAddr) (doesn't include LP tokens staked in DAO)
 * @returns [ uint baseAmount | uint tokenAmount ]
 */
export const getMemberShare = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const memberShare = await contract.callStatic.getMemberShare(
      token,
      wallet?.account,
    )
    dispatch(payloadToDispatch(Types.GET_MEMBER_SHARE, memberShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the share of a pool based on input LP token units
 * @returns [ uint baseAmount | uint tokenAmount ]
 */
export const getPoolShare = (token, units, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const poolShare = await contract.callStatic.getPoolShare(token, units)
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE, poolShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the SPARTA share of a pool based on member's holdings (doesn't include LP tokens staked in DAO nor the TOKEN share)
 * @returns uint baseAmount
 */
export const getShareOfBaseAmount = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const shareOfBaseAmount = await contract.callStatic.getShareOfBaseAmount(
      token,
      wallet?.account,
    )
    dispatch(
      payloadToDispatch(Types.GET_SHARE_OF_BASE_AMAOUNT, shareOfBaseAmount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the TOKEN share of a pool based on member's holdings (doesn't include LP tokens staked in DAO nor the SPARTA share)
 * @returns uint tokenAmount
 */
export const getShareOfTokenAmount = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const shareOfTokenAmount = await contract.callStatic.getShareOfTokenAmount(
      token,
      wallet?.account,
    )
    dispatch(
      payloadToDispatch(Types.GET_SHARE_OF_TOKEN_AMAOUNT, shareOfTokenAmount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the asymmetric share of a pool based on input LP token units.
 * Works out what you would end up with if you removed the liquidity and then swapped it all to one asset.
 * @returns [ uint baseAmount | uint tokenAmount | uint outputAmt ]
 */
export const getPoolShareAssym = (token, wallet, toBase) => async (
  dispatch,
) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const poolShareAssym = await contract.callStatic.getPoolShareAssym(
      token,
      wallet?.account,
      toBase,
    )
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE_ASSYM, poolShareAssym))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns the ~days since the pools creation
 * @returns uint daysSinceGenesis
 */
export const getPoolAge = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const poolAge = await contract.callStatic.getPoolAge(token)
    dispatch(payloadToDispatch(Types.GET_POOL_AGE, poolAge))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * UTILS HELPER -
 * Returns whether the wallet address is a member of the pool
 * @returns bool
 */
export const isMember = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const result = await contract.callStatic.isMember(token, wallet?.account)
    dispatch(payloadToDispatch(Types.IS_MEMBER, result))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

// NEW ONES - ADD TO REDUCER ETC BELOW

/**
 * Get a pool address from the token address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} pool
 */
export const getPool = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const pool = await contract.callStatic.getPool(token)
    dispatch(payloadToDispatch(Types.GET_POOL, pool))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get count of all pools
 * @param {object} wallet
 * @returns {uint256} count
 */
export const getPoolCount = (wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const count = await contract.callStatic.poolCount()
    dispatch(payloadToDispatch(Types.GET_POOL_COUNT, count))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get share of pool by member (using poolAddr)
 * (doesn't include LP tokens staked in DAO)
 * @param {address} pool
 * @param {object} wallet
 * @returns {uint} baseAmount
 * @returns {uint} tokenAmount
 */
export const getMemberPoolShare = (pool, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const outputAmount = await contract.callStatic.getMemberPoolShare(
      pool,
      wallet?.account,
    )
    dispatch(payloadToDispatch(Types.GET_MEMBER_POOL_SHARE, outputAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get weight of pool by LP units
 * @param {address} token
 * @param {uint} units
 * @param {object} wallet
 * @returns {uint} weight
 */
export const getPoolShareWeight = (tokens, units, wallet) => async (
  dispatch,
) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const weight = await contract.callStatic.getPoolShareWeight(tokens, units)
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE_WEIGHT, weight))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get depth of pool in SPARTA
 * Multiply this by 2 and then by SPARTA's USD price to get rough actual all-asset depth in USD
 * @param {address} pool
 * @param {object} wallet
 * @returns {uint} baseAmount
 */
export const getDepth = (pool, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const baseAmount = await contract.callStatic.getDepth(pool)
    dispatch(payloadToDispatch(Types.GET_DEPTH, baseAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @param {object} wallet
 * @returns {address} synth
 */
export const getSynth = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const synth = await contract.callStatic.getSynth(token)
    dispatch(payloadToDispatch(Types.GET_SYNTH, synth))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get synthetic asset address via the base token's address
 * @param {address} token
 * @param {object} wallet
 * @returns {object} synthAddress, tokenAddress, genesis, totalDebt
 */
export const getSynthData = (token, wallet) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const synthData = await contract.callStatic.getSynthData(token)
    dispatch(payloadToDispatch(Types.GET_SYNTH_DATA, synthData))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}

/**
 * Get share of debt
 * share = amount * part/total
 * @param {uint} units
 * @param {uint} totalSupply
 * @param {address} lpToken
 * @param {address} synth
 * @param {object} wallet
 * @returns {uint} share
 */
export const getDebtShare = (
  units,
  totalSupply,
  lpToken,
  synth,
  wallet,
) => async (dispatch) => {
  dispatch(utilsLoading())
  const contract = getUtilsContract(wallet)

  try {
    const share = await contract.callStatic.calcDebtShare(
      units,
      totalSupply,
      lpToken,
      synth,
    )
    dispatch(payloadToDispatch(Types.GET_DEBT_SHARE, share))
  } catch (error) {
    dispatch(errorToDispatch(Types.UTILS_ERROR, `${error}.`))
  }
}
