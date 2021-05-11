import axios from 'axios'
import * as Types from './types'
import {
  getPoolContract,
  getPoolFactoryContract,
  getUtilsContract,
  getRouterContract,
  getDaoVaultContract,
  getBondVaultContract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import fallbackImg from '../../assets/icons/Logo-unknown.svg'
import { getAddresses } from '../../utils/web3'

export const poolLoading = () => ({
  type: Types.POOL_LOADING,
})

export const poolDetailsLoading = () => ({
  type: Types.POOL_DETAILS_LOADING,
})

/**
 * Get array of all listed token addresses
 * @returns {array} tokenArray
 */
export const getListedTokens = () => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getPoolFactoryContract()
  const addr = getAddresses()

  try {
    const tokenCount = await contract.callStatic.tokenCount()
    const tempArray = []
    for (let i = 0; i < tokenCount; i++) {
      tempArray.push(contract.callStatic.getToken(i))
    }
    const listedTokens = await Promise.all(tempArray)
    const wbnbIndex = listedTokens.findIndex((i) => i === addr.wbnb)
    if (wbnbIndex > -1)
      listedTokens[wbnbIndex] = '0x0000000000000000000000000000000000000000'
    listedTokens.push(addr.sparta, addr.oldSparta)
    dispatch(payloadToDispatch(Types.POOL_LISTED_TOKENS, listedTokens))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get array of curated pool addresses
 * @returns {array} curatedPoolArray
 */
export const getCuratedPools = () => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getPoolFactoryContract()

  try {
    const curatedPoolCount = await contract.callStatic.getCuratedPoolsLength()
    const tempArray = []
    for (let i = 0; i < curatedPoolCount; i++) {
      tempArray.push(contract.callStatic.getCuratedPool(i))
    }
    const curatedPools = await Promise.all(tempArray)
    dispatch(payloadToDispatch(Types.POOL_CURATED_POOLS, curatedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get detailed array of token information
 * @param {array} tokenArray
 * @returns {array} tokenDetails
 */
export const getTokenDetails = (listedTokens, wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getUtilsContract()
  const addr = getAddresses()
  const trustWalletIndex = await axios.get(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/allowlist.json',
  )

  try {
    const tempArray = await Promise.all(
      listedTokens.map((i) =>
        contract.callStatic.getTokenDetailsWithMember(
          i,
          wallet !== null ? wallet : addr.bnb,
        ),
      ),
    )
    const tokenDetails = []
    for (let i = 0; i < listedTokens.length; i++) {
      const url = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${listedTokens[i]}/logo.png`
      const symbol = () => {
        if (listedTokens[i] === addr.sparta) {
          return `${tempArray[i].symbol}`
        }
        if (listedTokens[i] === addr.oldSparta) {
          return `${tempArray[i].symbol} (old)`
        }
        return tempArray[i].symbol
      }

      const tempItem = {
        address: listedTokens[i],
        balance: wallet !== null ? tempArray[i].balance.toString() : '0',
        name: tempArray[i].name,
        symbol: symbol(),
        decimals: tempArray[i].decimals.toString(),
        totalSupply: tempArray[i].totalSupply.toString(),
        symbolUrl:
          trustWalletIndex.data.filter((asset) => asset === listedTokens[i])
            .length > 0
            ? url
            : fallbackImg,
      }
      tokenDetails.push(tempItem)
    }
    dispatch(payloadToDispatch(Types.POOL_TOKEN_DETAILS, tokenDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get LP token addresses and setup the object
 * @param {array} tokenDetails
 * @param {array} curatedArray
 * @returns {array} listedPools
 */
export const getListedPools = (tokenDetails, curatedArray) => async (
  dispatch,
) => {
  dispatch(poolLoading())
  const contract = getUtilsContract()
  const addr = getAddresses()
  try {
    let tempArray = []
    for (let i = 0; i < tokenDetails.length; i++) {
      if (
        tokenDetails[i].address === addr.sparta ||
        tokenDetails[i].address === addr.oldSparta
      ) {
        tempArray.push({
          poolAddress: '',
          baseAmount: '0',
          tokenAmount: '0',
          poolUnits: '0',
          genesis: '0',
        })
      } else {
        tempArray.push(contract.callStatic.getPoolData(tokenDetails[i].address))
      }
    }
    tempArray = await Promise.all(tempArray)
    const listedPools = []
    for (let i = 0; i < tempArray.length; i++) {
      listedPools.push({
        tokenAddress: tokenDetails[i].address,
        address: tempArray[i].poolAddress,
        curated:
          curatedArray.find((item) => item === tempArray[i].poolAddress) > 0,
        balance: '0',
        staked: '0',
        bonded: '0',
        baseAmount: tempArray[i].baseAmount.toString(),
        tokenAmount: tempArray[i].tokenAmount.toString(),
        poolUnits: tempArray[i].poolUnits.toString(),
        recentFees: '0',
        lastMonthFees: '0',
        recentDivis: '0',
        lastMonthDivis: '0',
        genesis: tempArray[i].genesis.toString(),
        bondMember: false,
        bondClaimRate: '0',
        bondLastClaim: '0',
      })
    }
    dispatch(payloadToDispatch(Types.POOL_LISTED_POOLS, listedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error} `))
  }
}

/**
 * Add LP holdings to final array (maybe add the other LP calls here too?)
 * @param {array} listedPools
 * @param {array} wallet
 * @returns {array} poolDetails
 */
export const getPoolDetails = (listedPools, wallet) => async (dispatch) => {
  dispatch(poolDetailsLoading())
  const addr = getAddresses()

  try {
    let tempArray = []
    for (let i = 0; i < listedPools.length; i++) {
      const routerContract = getRouterContract()
      const daoVaultContract = getDaoVaultContract()
      const bondVaultContract = getBondVaultContract()
      const poolContract =
        listedPools[i].tokenAddress === addr.sparta ||
        listedPools[i].tokenAddress === addr.oldSparta
          ? null
          : getPoolContract(listedPools[i].address)
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta ||
          wallet === null
          ? '0'
          : poolContract.callStatic.balanceOf(wallet),
      ) // balance
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta ||
          wallet === null
          ? '0'
          : daoVaultContract.callStatic.getMemberPoolBalance(
              listedPools[i].address,
              wallet,
            ),
      ) // staked
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta
          ? '0'
          : poolContract.callStatic.map30DPoolRevenue(),
      ) // recentFees
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta
          ? '0'
          : poolContract.callStatic.mapPast30DPoolRevenue(),
      ) // lastMonthFees
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta
          ? '0'
          : routerContract.callStatic.currentPoolRevenue(
              listedPools[i].address,
            ),
      ) // recentDivis
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta
          ? '0'
          : routerContract.callStatic.pastPoolRevenue(listedPools[i].address),
      ) // lastMonthDivis
      tempArray.push(
        listedPools[i].tokenAddress === addr.sparta ||
          listedPools[i].tokenAddress === addr.oldSparta ||
          wallet === null
          ? {
              isMember: false,
              bondedLP: '0',
              claimRate: '0',
              lastBlockTime: '0',
            }
          : bondVaultContract.callStatic.getMemberDetails(
              wallet,
              listedPools[i].tokenAddress,
            ),
      ) // bondDetails - bondMember, bondClaimRate, bondLastClaim
    }
    tempArray = await Promise.all(tempArray)
    const poolDetails = listedPools
    const varCount = 7
    for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
      const bondDetails = tempArray[i + 6]
      poolDetails[i / varCount].balance = tempArray[i].toString()
      poolDetails[i / varCount].staked = tempArray[i + 1].toString()
      poolDetails[i / varCount].bonded = bondDetails.bondedLP.toString()
      poolDetails[i / varCount].recentFees = tempArray[i + 2].toString()
      poolDetails[i / varCount].lastMonthFees = tempArray[i + 3].toString()
      poolDetails[i / varCount].recentDivis = tempArray[i + 4].toString()
      poolDetails[i / varCount].lastMonthDivis = tempArray[i + 5].toString()
      poolDetails[i / varCount].bondMember = bondDetails.isMember
      poolDetails[i / varCount].bondClaimRate = bondDetails.claimRate.toString()
      poolDetails[
        i / varCount
      ].bondLastClaim = bondDetails.lastBlockTime.toString()
    }
    dispatch(payloadToDispatch(Types.POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}
