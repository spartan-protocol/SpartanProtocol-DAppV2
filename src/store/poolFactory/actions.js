import axios from 'axios'
import * as Types from './types'
import {
  getPoolContract,
  getPoolFactoryContract,
  getUtilsContract,
  getRouterContract,
  getDaoVaultContract,
  getSynthContract,
  getBondVaultContract,
  getSynthVaultContract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import fallbackImg from '../../assets/icons/Logo-unknown.svg'
import { getAddresses } from '../../utils/web3'

export const poolFactoryLoading = () => ({
  type: Types.POOLFACTORY_LOADING,
})

export const poolFactoryFinalArrayLoading = () => ({
  type: Types.POOLFACTORY_FINALARRAY_LOADING,
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
  const addr = getAddresses()
  const trustWalletIndex = await axios.get(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/allowlist.json',
  )

  try {
    if (tokenArray[0] !== spartaAddr) {
      tokenArray.unshift(spartaAddr)
    }
    const tempArray = await Promise.all(
      tokenArray.map((i) =>
        contract.callStatic.getTokenDetailsWithMember(i, wallet || addr.bnb),
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
        // symbolUrl: listedTokensTN.filter(
        //   (asset) => asset.address === tokenArray[i],
        // )[0].icon,
        symbolUrl:
          trustWalletIndex.data.filter((asset) => asset === tokenArray[i])
            .length > 0
            ? url
            : fallbackImg,
        // SP-pTOKEN Details
        poolAddress: '',
        balanceLPs: '0',
        stakedLPs: '0',
        baseAmount: '',
        tokenAmount: '',
        poolUnits: '',
        recentFees: '',
        lastMonthFees: '',
        recentDivis: '',
        lastMonthDivis: '',
        genesis: '',
        // SP-sTOKEN Details
        synthAddress: false,
        balanceSynths: '',
        stakedSynths: '',
        synthLpBalance: '',
        synthLpDebt: '',
        // Bond Details
        bondMember: false,
        bondedLPs: '0',
        bondClaimRate: '0',
        bondLastClaim: '0',
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
export const getPoolFactoryFinalArray = (
  detailedArray,
  curatedArray,
  synthArray,
) => async (dispatch) => {
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
      const synthAddr =
        synthArray?.length > 0 &&
        synthArray?.filter(
          (synth) => synth.tokenAddress === detailedArray[i].tokenAddress,
        )[0]?.Address
      finalArray[i].poolAddress = tempArray[i].poolAddress
      finalArray[i].genesis = tempArray[i].genesis.toString()
      finalArray[i].baseAmount = tempArray[i].baseAmount.toString()
      finalArray[i].tokenAmount = tempArray[i].tokenAmount.toString()
      finalArray[i].poolUnits = tempArray[i].poolUnits.toString()
      finalArray[i].curated =
        curatedArray.find((item) => item === tempArray[i].poolAddress) > 0
      finalArray[i].synthAddress = synthAddr || false
    }
    dispatch(payloadToDispatch(Types.POOLFACTORY_GET_FINAL_ARRAY, finalArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, `${error} `))
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
  dispatch(poolFactoryFinalArrayLoading())

  try {
    let tempArray = []
    for (let i = 0; i < finalArray.length; i++) {
      const routerContract = getRouterContract()
      const daoVaultContract = getDaoVaultContract()
      const bondVaultContract = getBondVaultContract()
      const poolContract =
        finalArray[i].symbol === 'SPARTA'
          ? null
          : getPoolContract(finalArray[i].poolAddress)
      const synthContract =
        finalArray[i].synthAddress === false
          ? null
          : getSynthContract(finalArray[i].synthAddress)
      const synthVaultContract =
        finalArray[i].synthAddress === false
          ? null
          : getSynthVaultContract(finalArray[i].synthAddress)
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : routerContract.callStatic.currentPoolRevenue(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : routerContract.callStatic.pastPoolRevenue(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : poolContract.callStatic.map30DPoolRevenue(),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA'
          ? '0'
          : poolContract.callStatic.mapPast30DPoolRevenue(),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA' || walletAddress === null
          ? '0'
          : poolContract.callStatic.balanceOf(walletAddress),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA' || walletAddress === null
          ? '0'
          : daoVaultContract.callStatic.mapMemberPool_balance(
              walletAddress,
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].synthAddress === false || walletAddress === null
          ? '0'
          : synthContract.callStatic.balanceOf(walletAddress),
      )
      tempArray.push(
        finalArray[i].synthAddress === false || walletAddress === null
          ? '0'
          : synthVaultContract.callStatic.getMemberDeposit(
              finalArray[i].synthAddress,
              walletAddress,
            ),
      )
      tempArray.push(
        finalArray[i].synthAddress === false
          ? '0'
          : synthContract.callStatic.getmapAddress_LPBalance(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].synthAddress === false
          ? '0'
          : synthContract.callStatic.getmapAddress_LPDebt(
              finalArray[i].poolAddress,
            ),
      )
      tempArray.push(
        finalArray[i].symbol === 'SPARTA' || walletAddress === null
          ? {
              isMember: false,
              bondedLP: '0',
              claimRate: '0',
              lastBlockTime: '0',
            }
          : bondVaultContract.callStatic.getMemberDetails(
              walletAddress,
              finalArray[i].tokenAddress,
            ),
      )
    }
    tempArray = await Promise.all(tempArray)
    const finalLpArray = finalArray
    for (let i = 0; i < tempArray.length - 10; i += 11) {
      const bondDetails = tempArray[i + 10]
      finalLpArray[i / 11].recentDivis = tempArray[i].toString()
      finalLpArray[i / 11].lastMonthDivis = tempArray[i + 1].toString()
      finalLpArray[i / 11].recentFees = tempArray[i + 2].toString()
      finalLpArray[i / 11].lastMonthFees = tempArray[i + 3].toString()
      finalLpArray[i / 11].balanceLPs = tempArray[i + 4].toString()
      finalLpArray[i / 11].stakedLPs = tempArray[i + 5].toString()
      finalLpArray[i / 11].balanceSynths = tempArray[i + 6].toString()
      finalLpArray[i / 11].stakedSynths = tempArray[i + 7].toString()
      finalLpArray[i / 11].synthLpBalance = tempArray[i + 8].toString()
      finalLpArray[i / 11].synthLpDebt = tempArray[i + 9].toString()
      finalLpArray[i / 11].bondMember = bondDetails.isMember
      finalLpArray[i / 11].bondedLPs = bondDetails.bondedLP.toString()
      finalLpArray[i / 11].bondClaimRate = bondDetails.claimRate.toString()
      finalLpArray[i / 11].bondLastClaim = bondDetails.lastBlockTime.toString()
    }
    dispatch(
      payloadToDispatch(Types.POOLFACTORY_GET_FINAL_LP_ARRAY, finalLpArray),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.POOLFACTORY_ERROR, error))
  }
}
