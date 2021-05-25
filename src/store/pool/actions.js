import axios from 'axios'
import { ethers } from 'ethers'
import * as Types from './types'
import {
  getPoolContract,
  getPoolFactoryContract,
  getUtilsContract,
  getRouterContract,
  getDaoVaultContract,
  getBondVaultContract,
  getTokenContract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import fallbackImg from '../../assets/icons/Logo-unknown.svg'
import bnbIcon from '../../assets/icons/BNB.svg'
import spartaIcon from '../../assets/icons/coin_sparta_black_bg.svg'
import oldSpartaIcon from '../../assets/icons/oldSparta.svg'
import { getAddresses } from '../../utils/web3'

export const poolLoading = () => ({
  type: Types.POOL_LOADING,
})

export const poolDetailsLoading = () => ({
  type: Types.POOL_DETAILS_LOADING,
})

/**
 * Get array of all listed token addresses
 * @param {object} wallet
 * @returns {array} tokenArray
 */
export const getListedTokens = (wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const addr = getAddresses()
  const check = ethers.utils.isAddress(addr.poolFactory)
  const contract = check === true ? getPoolFactoryContract(wallet) : ''

  try {
    let listedTokens = []
    if (check === true) {
      const tokenCount = await contract.callStatic.tokenCount()
      const tempArray = []
      for (let i = 0; i < tokenCount; i++) {
        tempArray.push(contract.callStatic.getToken(i))
      }
      listedTokens = await Promise.all(tempArray)
      const wbnbIndex = listedTokens.findIndex((i) => i === addr.wbnb)
      if (wbnbIndex > -1)
        listedTokens[wbnbIndex] = '0x0000000000000000000000000000000000000000'
    }
    listedTokens.push(addr.spartav1, addr.spartav2)
    dispatch(payloadToDispatch(Types.POOL_LISTED_TOKENS, listedTokens))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get array of curated pool addresses
 * @param {object} wallet
 * @returns {array} curatedPoolArray
 */
export const getCuratedPools = (wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const addr = getAddresses()
  const check = ethers.utils.isAddress(addr.poolFactory)
  const contract = check === true ? getPoolFactoryContract(wallet) : ''

  try {
    let curatedPools = []
    if (check === true) {
      const curatedPoolCount = await contract.callStatic.getCuratedPoolsLength()
      const tempArray = []
      for (let i = 0; i < curatedPoolCount; i++) {
        tempArray.push(contract.callStatic.getCuratedPool(i))
      }
      curatedPools = await Promise.all(tempArray)
    } else {
      curatedPools = []
    }
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
  const addr = getAddresses()
  const trustWalletIndex = await axios.get(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/allowlist.json',
  )

  try {
    let tempArray = []
    for (let i = 0; i < listedTokens.length; i++) {
      const contract = getTokenContract(listedTokens[i], wallet)
      tempArray.push(listedTokens[i]) // TOKEN ADDR (1)
      if (wallet.account !== null) {
        if (listedTokens[i] === addr.bnb) {
          tempArray.push(wallet.balance)
        } else {
          tempArray.push(contract.callStatic.balanceOf(wallet?.account)) // TOKEN BALANCE (2)
        }
      } else {
        tempArray.push('0')
      }
      if (listedTokens[i] === addr.bnb) {
        tempArray.push('BNB')
        tempArray.push(bnbIcon)
      } else if (listedTokens[i] === addr.spartav1) {
        tempArray.push('SPARTA (old)')
        tempArray.push(oldSpartaIcon)
      } else if (listedTokens[i] === addr.spartav2) {
        tempArray.push('SPARTA')
        tempArray.push(spartaIcon)
      } else {
        tempArray.push(contract.callStatic.symbol()) // TOKEN SYMBOL (3)
        tempArray.push(
          trustWalletIndex.data.filter((asset) => asset === listedTokens[i])
            .length > 0
            ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${listedTokens[i]}/logo.png`
            : fallbackImg,
        ) // SYMBOL URL (4)
      }
    }
    tempArray = await Promise.all(tempArray)
    const varCount = 4
    const tokenDetails = []
    for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
      tokenDetails.push({
        address: tempArray[i],
        balance: tempArray[i + 1].toString(),
        symbol: tempArray[i + 2],
        symbolUrl: tempArray[i + 3],
      })
    }
    dispatch(payloadToDispatch(Types.POOL_TOKEN_DETAILS, tokenDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get LP token addresses and setup the object
 * @param {array} tokenDetails
 * @param {object} wallet
 * @returns {array} listedPools
 */
export const getListedPools = (tokenDetails, wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getUtilsContract(wallet)
  const addr = getAddresses()
  try {
    let tempArray = []
    for (let i = 0; i < tokenDetails.length; i++) {
      if (
        tokenDetails[i].address === addr.spartav1 ||
        tokenDetails[i].address === addr.spartav2
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
        curated: false,
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
      const routerContract = getRouterContract(wallet)
      const daoVaultContract = getDaoVaultContract(wallet)
      const bondVaultContract = getBondVaultContract(wallet)
      const pfContract = getPoolFactoryContract(wallet)
      const poolContract =
        listedPools[i].tokenAddress === addr.spartav1 ||
        listedPools[i].tokenAddress === addr.spartav2
          ? null
          : getPoolContract(listedPools[i].address, wallet)
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2 ||
          wallet.account === null
          ? '0'
          : poolContract.callStatic.balanceOf(wallet.account),
      ) // balance
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2 ||
          wallet.account === null
          ? '0'
          : daoVaultContract.callStatic.getMemberPoolBalance(
              listedPools[i].address,
              wallet.account,
            ),
      ) // staked
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2
          ? '0'
          : poolContract.callStatic.map30DPoolRevenue(),
      ) // recentFees
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2
          ? '0'
          : poolContract.callStatic.mapPast30DPoolRevenue(),
      ) // lastMonthFees
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2
          ? '0'
          : routerContract.callStatic.currentPoolRevenue(
              listedPools[i].address,
            ),
      ) // recentDivis
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2
          ? '0'
          : routerContract.callStatic.pastPoolRevenue(listedPools[i].address),
      ) // lastMonthDivis
      tempArray.push(
        listedPools[i].tokenAddress === addr.spartav1 ||
          listedPools[i].tokenAddress === addr.spartav2 ||
          wallet.account === null
          ? {
              isMember: false,
              bondedLP: '0',
              claimRate: '0',
              lastBlockTime: '0',
            }
          : bondVaultContract.callStatic.getMemberDetails(
              wallet.account,
              listedPools[i].tokenAddress,
            ),
      ) // bondDetails - bondMember, bondClaimRate, bondLastClaim
      tempArray.push(
        listedPools[i].address !== ''
          ? pfContract.callStatic.isCuratedPool(listedPools[i].address)
          : false,
      ) // check if pool is curated
    }
    tempArray = await Promise.all(tempArray)
    const poolDetails = listedPools
    const varCount = 8
    for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
      const ii = i / varCount
      poolDetails[ii].balance = tempArray[i].toString()
      poolDetails[ii].staked = tempArray[i + 1].toString()
      poolDetails[ii].bonded = tempArray[i + 6].bondedLP.toString()
      poolDetails[ii].recentFees = tempArray[i + 2].toString()
      poolDetails[ii].lastMonthFees = tempArray[i + 3].toString()
      poolDetails[ii].recentDivis = tempArray[i + 4].toString()
      poolDetails[ii].lastMonthDivis = tempArray[i + 5].toString()
      poolDetails[ii].bondMember = tempArray[i + 6].isMember
      poolDetails[ii].bondClaimRate = tempArray[i + 6].claimRate.toString()
      poolDetails[ii].bondLastClaim = tempArray[i + 6].lastBlockTime.toString()
      poolDetails[ii].curated = tempArray[i + 7]
    }
    dispatch(payloadToDispatch(Types.POOL_DETAILS, poolDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}
