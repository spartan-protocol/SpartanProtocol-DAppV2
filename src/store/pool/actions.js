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
import {
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from '../../utils/web3'

export const poolLoading = () => ({
  type: Types.POOL_LOADING,
})

export const poolDetailsLoading = () => ({
  type: Types.POOL_DETAILS_LOADING,
})

/**
 * Get array of all listed token addresses
 * @param wallet
 * @returns tokenArray
 */
export const getListedTokens = (wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const addr = getAddresses()
  const check = ethers.utils.isAddress(addr.poolFactory)
  const contract = check === true ? getPoolFactoryContract(wallet) : ''

  try {
    const listedTokens = []
    if (check === true) {
      const _listedTokens = await contract.callStatic.getTokenAssets()
      for (let i = 0; i < _listedTokens.length; i++) {
        listedTokens.push(_listedTokens[i])
      }
      const wbnbIndex = listedTokens.findIndex((i) => i === addr.wbnb)
      if (wbnbIndex > -1) {
        listedTokens[wbnbIndex] = addr.bnb
      }
    }
    listedTokens.push(addr.spartav1, addr.spartav2)
    dispatch(payloadToDispatch(Types.POOL_LISTED_TOKENS, listedTokens))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
  }
}

/**
 * Get detailed array of token information
 * @param listedTokens @param wallet
 * @returns tokenDetails
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
      if (wallet.account) {
        if (listedTokens[i] === addr.bnb) {
          tempArray.push(wallet.library.getBalance(wallet.account))
        } else {
          tempArray.push(contract.callStatic.balanceOf(wallet?.account)) // TOKEN BALANCE (2)
        }
      } else {
        tempArray.push('0')
      }
      if (listedTokens[i] === addr.bnb) {
        tempArray.push('BNB')
        tempArray.push(`${window.location.origin}/images/icons/BNB.svg`)
      } else if (listedTokens[i] === addr.spartav1) {
        tempArray.push('SPARTA (old)')
        tempArray.push(`${window.location.origin}/images/icons/SPARTA1.svg`)
      } else if (listedTokens[i] === addr.spartav2) {
        tempArray.push('SPARTA')
        tempArray.push(`${window.location.origin}/images/icons/SPARTA2.svg`)
      } else {
        tempArray.push(contract.callStatic.symbol()) // TOKEN SYMBOL (3)
        tempArray.push(
          trustWalletIndex.data.filter((asset) => asset === listedTokens[i])
            .length > 0
            ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${listedTokens[i]}/logo.png`
            : `${window.location.origin}/images/icons/Fallback.svg`,
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
 * Return array of curated pool addresses
 * @param wallet
 * @returns curatedPools
 */
export const getCuratedPools = (wallet) => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getPoolFactoryContract(wallet)
  try {
    const curatedPools = await contract.callStatic.getVaultAssets()
    dispatch(payloadToDispatch(Types.POOL_CURATED_POOLS, curatedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error} `))
  }
}

/**
 * Get LP token addresses and setup the object
 * @param tokenDetails @param wallet
 * @returns listedPools
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
          genesis: '0',
          baseAmount: '0',
          tokenAmount: '0',
          poolUnits: '0',
          synthCap: '0',
          baseCap: '0',
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
        baseAmount: tempArray[i].baseAmount.toString(),
        tokenAmount: tempArray[i].tokenAmount.toString(),
        poolUnits: tempArray[i].poolUnits.toString(),
        synthCap: tempArray[i].synthCap.toString(),
        baseCap: tempArray[i].baseCap.toString(),
        genesis: tempArray[i].genesis.toString(),
        // newPool:                                                             // Uncomment this line for mainnet
        //   Date.now() / 1000 - tempArray[i].genesis.toString() * 1 < 604800,  // Uncomment this line for mainnet
        newPool: false, // Remove this line for mainnet
        hide:
          tokenDetails[i].address !== addr.spartav2 &&
          tempArray[i].baseAmount.toString() <= 0,
      })
    }
    dispatch(payloadToDispatch(Types.POOL_LISTED_POOLS, listedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, `${error} `))
  }
}

/**
 * Add LP wallet-details to final array
 * @param listedPools @param curatedPools @param wallet
 * @returns poolDetails
 */
export const getPoolDetails =
  (listedPools, curatedPools, wallet) => async (dispatch) => {
    dispatch(poolDetailsLoading())
    try {
      let tempArray = []
      for (let i = 0; i < listedPools.length; i++) {
        const routerContract = getRouterContract(wallet)
        const daoVaultContract = getDaoVaultContract(wallet)
        const bondVaultContract = getBondVaultContract(wallet)
        const poolContract =
          listedPools[i].poolUnits <= 0
            ? null
            : getPoolContract(listedPools[i].address, wallet)
        tempArray.push(
          listedPools[i].poolUnits <= 0 || !wallet.account
            ? '0'
            : poolContract.callStatic.balanceOf(wallet.account),
        ) // balance
        tempArray.push(
          listedPools[i].poolUnits <= 0 || !wallet.account
            ? '0'
            : daoVaultContract.callStatic.getMemberPoolBalance(
                listedPools[i].address,
                wallet.account,
              ),
        ) // staked
        tempArray.push(
          listedPools[i].poolUnits <= 0
            ? '0'
            : poolContract.callStatic.map30DPoolRevenue(),
        ) // recentFees
        tempArray.push(
          listedPools[i].poolUnits <= 0
            ? '0'
            : poolContract.callStatic.mapPast30DPoolRevenue(),
        ) // lastMonthFees
        tempArray.push(
          listedPools[i].poolUnits <= 0
            ? '0'
            : routerContract.callStatic.mapAddress_30DayDividends(
                listedPools[i].address,
              ),
        ) // recentDivis
        tempArray.push(
          listedPools[i].poolUnits <= 0
            ? '0'
            : routerContract.callStatic.mapAddress_Past30DayPoolDividends(
                listedPools[i].address,
              ),
        ) // lastMonthDivis
        tempArray.push(
          listedPools[i].poolUnits <= 0 || !wallet.account
            ? {
                isMember: false,
                bondedLP: '0',
                claimRate: '0',
                lastBlockTime: '0',
              }
            : bondVaultContract.callStatic.getMemberDetails(
                wallet.account,
                listedPools[i].address,
              ),
        ) // bondDetails - isMember, bondedLP, claimRate, lastBlockTime
        tempArray.push(
          listedPools[i].poolUnits > 0
            ? curatedPools.includes(listedPools[i].address)
            : false,
        ) // check if pool is curated
        tempArray.push(
          listedPools[i].poolUnits > 0
            ? poolContract.callStatic.freeze()
            : false,
        ) // check if pool is frozen
      }
      tempArray = await Promise.all(tempArray)
      const poolDetails = listedPools
      const varCount = 9
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
        poolDetails[ii].bondLastClaim =
          tempArray[i + 6].lastBlockTime.toString()
        poolDetails[ii].curated = tempArray[i + 7]
        poolDetails[ii].frozen = tempArray[i + 8]
      }
      dispatch(payloadToDispatch(Types.POOL_DETAILS, poolDetails))
    } catch (error) {
      dispatch(errorToDispatch(Types.POOL_ERROR, `${error}.`))
    }
  }

/**
 * Create a new pool
 * @param {uint} inputBase
 * @param {uint} inputToken
 * @param {address} token
 * @param {object} wallet
 */
export const createPoolADD =
  (inputBase, inputToken, token, wallet) => async (dispatch) => {
    dispatch(poolLoading())
    const addr = getAddresses()
    const contract = getPoolFactoryContract(wallet)
    let provider = getWalletProvider(wallet?.library)
    if (provider._isSigner === true) {
      provider = provider.provider
    }
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = {
        value: token === addr.bnb ? inputToken : null,
        gasPrice: gPrice,
      }
      let newPool = await contract.createPoolADD(
        inputBase,
        inputToken,
        token,
        ORs,
      )
      newPool = await provider.waitForTransaction(newPool.hash, 1)
      dispatch(payloadToDispatch(Types.POOL_NEW_POOL, newPool))
    } catch (error) {
      dispatch(
        errorToDispatch(Types.POOL_ERROR, `${error} - ${error.data?.message}.`),
      )
    }
  }
