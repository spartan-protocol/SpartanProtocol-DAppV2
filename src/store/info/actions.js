import * as Types from './types'
import { getUtilsContract } from '../../utils/web3Utils'
import { payloadToDispatch, errorToDispatch } from '../helpers'

export const infoLoading = () => ({
  type: Types.INFO_LOADING,
})

export const getListedPools = () => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const pools = await contract.callStatic.allPools()
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getListedPoolsRange = (first, count) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const pools = await contract.callStatic.poolsInRange(first, count)
    dispatch(payloadToDispatch(Types.GET_LISTED_POOLS_RANGE, pools))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getListedAssets = () => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const assets = await contract.callStatic.allTokens()
    dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS, assets))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getListedAssetsRange = (first, count) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const assets = await contract.callStatic.tokensInRange(first, count)
    dispatch(payloadToDispatch(Types.GET_LISTED_ASSETS_RANGE, assets))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getGlobalDetails = () => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const globalDetails = await contract.callStatic.getGlobalDetails()
    dispatch(payloadToDispatch(Types.GET_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getTokenDetails = (token) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const tokenDetails = await contract.callStatic.getTokenDetails(token)
    dispatch(payloadToDispatch(Types.GET_TOKEN_DETAILS, tokenDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolDetails = (pool) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolDetails = await contract.callStatic.getPoolData(pool)
    dispatch(payloadToDispatch(Types.GET_POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getMemberShare = (token, member) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const memberShare = await contract.callStatic.getMemberShare(token, member)
    dispatch(payloadToDispatch(Types.GET_MEMBER_SHARE, memberShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolShare = (token, units) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolShare = await contract.callStatic.getPoolShare(token, units)
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE, poolShare))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getShareOfBaseAmount = (token, member) => async (dispatch) => {
  dispatch(infoLoading())
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
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getShareOfTokenAmount = (token, member) => async (dispatch) => {
  dispatch(infoLoading())
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
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolShareAssym = (token, units, toBase) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolShareAssym = await contract.callStatic.getPoolShareAssym(
      token,
      units,
      toBase,
    )
    dispatch(payloadToDispatch(Types.GET_POOL_SHARE_ASSYM, poolShareAssym))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolAge = (token) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolAge = await contract.callStatic.getPoolAge(token)
    dispatch(payloadToDispatch(Types.GET_POOL_AGE, poolAge))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolROI = (token) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolROI = await contract.callStatic.getPoolROI(token)
    dispatch(payloadToDispatch(Types.GET_POOL_ROI, poolROI))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const getPoolAPY = (token) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const poolAPY = await contract.callStatic.getPoolAPY(token)
    dispatch(payloadToDispatch(Types.GET_POOL_APY, poolAPY))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}

export const isMember = (token, member) => async (dispatch) => {
  dispatch(infoLoading())
  const contract = getUtilsContract()

  try {
    const result = await contract.callStatic.isMember(token, member)
    dispatch(payloadToDispatch(Types.IS_MEMBER, result))
  } catch (error) {
    dispatch(errorToDispatch(Types.INFO_ERROR, error))
  }
}
