import axios from 'axios'
import * as Types from './types'
import { getPoolContract, getPoolFactoryContract } from '../../utils/web3Pool'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getUtilsContract } from '../../utils/web3Utils'
import { getRouterContract } from '../../utils/web3Router'
import { getDaoVaultContract } from '../../utils/web3Dao'
import fallbackImg from '../../assets/icons/Logo-unknown.svg'

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

// /**
//  * Get listed pools count
//  * @returns {uint} poolCount
//  */
// export const getPoolFactoryCount = () => async (dispatch) => {
//   dispatch(poolFactoryLoading())
//   const contract = getPoolFactoryContract()

//   try {
//     const poolCount = await contract.callStatic.poolCount()
//     dispatch(payloadToDispatch(Types.POOLFACTORY_GET_COUNT, poolCount))
//   } catch (error) {
//     dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
//   }
// }

// /**
//  * Get listed tokens count
//  * @returns {uint} tokenCount
//  */
// export const getPoolFactoryTokenCount = () => async (dispatch) => {
//   dispatch(poolFactoryLoading())
//   const contract = getPoolFactoryContract()

//   try {
//     const tokenCount = await contract.callStatic.tokenCount()
//     dispatch(payloadToDispatch(Types.POOLFACTORY_GET_TOKEN_COUNT, tokenCount))
//   } catch (error) {
//     dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
//   }
// }

/**
 * Get array of all listed token addresses
 * @param {address} wbnbAddr
 * @returns {array} tokenArray
 */
export const getPoolFactoryTokenArray = (wbnbAddr) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const tokenCount = await contract.callStatic.tokenCount()
    const tempArray = []
    for (let i = 0; i < tokenCount; i++) {
      tempArray.push(contract.callStatic.getToken(i))
    }
    const tokenArray = await Promise.all(tempArray)
    const wbnbIndex = tokenArray.findIndex((i) => i === wbnbAddr)
    if (wbnbIndex > -1)
      tokenArray[wbnbIndex] = '0x0000000000000000000000000000000000000000'
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_TOKEN_ARRAY, tokenArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

// /**
//  * Get curated pools count
//  * @returns {uint} curatedPoolCount
//  */
// export const getPoolFactoryCuratedCount = () => async (dispatch) => {
//   dispatch(poolFactoryLoading())
//   const contract = getPoolFactoryContract()

//   try {
//     const curatedPoolCount = await contract.callStatic.getCuratedPoolsLength()
//     dispatch(
//       payloadToDispatch(Types.POOLFACTORY_GET_CURATED_COUNT, curatedPoolCount),
//     )
//   } catch (error) {
//     dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
//   }
// }

/**
 * Get array of curated pool addresses
 * @returns {array} curatedPoolArray
 */
export const getPoolFactoryCuratedArray = () => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getPoolFactoryContract()

  try {
    const curatedPoolCount = await contract.callStatic.getCuratedPoolsLength()
    const tempArray = []
    for (let i = 0; i < curatedPoolCount; i++) {
      tempArray.push(contract.callStatic.getCuratedPool(i))
    }
    const curatedPoolArray = await Promise.all(tempArray)
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_CURATED_ARRAY, curatedPoolArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}

// /**
//  * Get array of tokenAddresses grouped with poolAddresses
//  * @param {array} tokenArray
//  * @returns {array} poolArray
//  */
// export const getPoolFactoryArray = (tokenArray) => async (dispatch) => {
//   dispatch(poolFactoryLoading())
//   const contract = getPoolFactoryContract()

//   try {
//     const tempArray = await Promise.all(
//       tokenArray.map((token) => contract.callStatic.getPool(token)),
//     )
//     const poolArray = []
//     for (let i = 0; i < tokenArray.length; i++) {
//       const tempItem = {
//         tokenAddress: tokenArray[i],
//         poolAddress: tempArray[i],
//       }
//       poolArray.push(tempItem)
//     }
//     dispatch(payloadToDispatch(Types.POOLFACTORY_GET_ARRAY, poolArray))
//   } catch (error) {
//     dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
//   }
// }

/**
 * Get detailed array of token/pool information
 * @param {array} poolArray
 * @returns {array} detailedArray
 */
export const getPoolFactoryDetailedArray = (
  tokenArray,
  spartaAddr,
  wallet,
) => async (dispatch) => {
  dispatch(poolFactoryLoading())
  const contract = getUtilsContract()
  const trustWalletIndex = await axios.get(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/allowlist.json',
  )

  try {
    if (tokenArray[0] !== spartaAddr) {
      tokenArray.unshift(spartaAddr)
    }
    const tempArray = await Promise.all(
      tokenArray.map((i) =>
        contract.callStatic.getTokenDetailsWithMember(
          i,
          wallet || '0x0000000000000000000000000000000000000000',
        ),
      ),
    )
    const detailedArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      const url = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${tokenArray[i]}/logo.png`
      const tempItem = {
        // Layer1 Asset Details
        tokenAddress: tokenArray[i],
        balanceTokens: wallet ? tempArray[i].balance.toString() : '0',
        name: tempArray[i].name,
        symbol: tempArray[i].symbol,
        decimals: tempArray[i].decimals.toString(),
        totalSupply: tempArray[i].totalSupply.toString(),
        curated: '',
        symbolUrl:
          trustWalletIndex.data.filter((asset) => asset === tokenArray[i])
            .length > 0
            ? url
            : fallbackImg,
        // SP-pTOKEN Details
        poolAddress: '',
        balanceLPs: '0',
        lockedLPs: '0',
        baseAmount: '',
        tokenAmount: '',
        poolUnits: '',
        recentFees: '',
        lastMonthFees: '',
        recentDivis: '',
        lastMonthDivis: '',
        genesis: '',
        // SP-sTOKEN Details
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
    const finalArray = detailedArray
    for (let i = 0; i < detailedArray.length; i++) {
      finalArray[i].poolAddress = tempArray[i].poolAddress
      finalArray[i].genesis = tempArray[i].genesis.toString()
      finalArray[i].baseAmount = tempArray[i].baseAmount.toString()
      finalArray[i].tokenAmount = tempArray[i].tokenAmount.toString()
      finalArray[i].poolUnits = tempArray[i].poolUnits.toString()
      finalArray[i].curated =
        curatedArray.find((item) => item === tempArray[i].poolAddress) > 0
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
    let tempArray = []
    for (let i = 0; i < finalArray.length; i++) {
      const routerContract = getRouterContract()
      const daoVaultContract = getDaoVaultContract()
      const contract =
        finalArray[i].symbol === 'SPARTA'
          ? null
          : getPoolContract(finalArray[i].poolAddress)
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : routerContract.callStatic.map30DPoolRevenue(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : routerContract.callStatic.mapPast30DPoolRevenue(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : contract.callStatic.map30DPoolRevenue(),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : contract.callStatic.mapPast30DPoolRevenue(),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA' || !walletAddress
          ? '0'
          : contract.callStatic.balanceOf(walletAddress),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA' || !walletAddress
          ? '0'
          : daoVaultContract.callStatic.mapMemberPool_balance(
              walletAddress,
              finalArray[i].poolAddress,
            ),
      )
    }
    tempArray = await Promise.all(tempArray)
    const finalLpArray = finalArray
    for (let i = 0; i < tempArray.length - 5; i += 6) {
      finalLpArray[i / 6].recentDivis = tempArray[i].toString()
      finalLpArray[i / 6].lastMonthDivis = tempArray[i + 1].toString()
      finalLpArray[i / 6].recentFees = tempArray[i + 2].toString()
      finalLpArray[i / 6].lastMonthFees = tempArray[i + 3].toString()
      finalLpArray[i / 6].balanceLPs = tempArray[i + 4].toString()
      finalLpArray[i / 6].lockedLPs = tempArray[i + 5].toString()
    }
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_FINAL_LP_ARRAY, finalLpArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}
