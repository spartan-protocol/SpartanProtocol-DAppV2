import axios from 'axios'
import { ethers } from 'ethers'
import * as Types from './types'
import {
  getPoolContract,
  getPoolFactoryContract,
  getUtilsContract,
  getRouterContract,
  getTokenContract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses, getProviderGasPrice, parseTxn } from '../../utils/web3'
import { getSecsSince } from '../../utils/math/nonContract'
import { BN } from '../../utils/bigNumber'

export const poolLoading = () => ({
  type: Types.POOL_LOADING,
})

export const poolDetailsLoading = () => ({
  type: Types.POOL_DETAILS_LOADING,
})

/**
 * Get array of all listed token addresses
 * @param wallet
 */
export const getListedTokens = () => async (dispatch) => {
  dispatch(poolLoading())
  const addr = getAddresses()
  const check = ethers.utils.isAddress(addr.poolFactory)
  const contract = check === true ? getPoolFactoryContract() : ''

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
    dispatch(errorToDispatch(Types.POOL_ERROR, error))
  }
}

/**
 * Get detailed array of token information
 * @param listedTokens @param wallet
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
    dispatch(errorToDispatch(Types.POOL_ERROR, error))
  }
}

/**
 * Return array of curated pool addresses
 * @param wallet
 */
export const getCuratedPools = () => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getPoolFactoryContract()
  try {
    const curatedPools = await contract.callStatic.getVaultAssets()
    dispatch(payloadToDispatch(Types.POOL_CURATED_POOLS, curatedPools))
  } catch (error) {
    dispatch(errorToDispatch(Types.POOL_ERROR, error))
  }
}

/**
 * Get LP token addresses and setup the object
 * @param tokenDetails
 */
export const getListedPools = (tokenDetails) => async (dispatch) => {
  dispatch(poolLoading())
  const contract = getUtilsContract()
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
    dispatch(errorToDispatch(Types.POOL_ERROR, error))
  }
}

/**
 * Add LP wallet-details to final array
 * @param listedPools @param curatedPools @param wallet
 */
export const getPoolDetails =
  (listedPools, curatedPools, wallet) => async (dispatch) => {
    dispatch(poolDetailsLoading())
    try {
      let tempArray = []
      for (let i = 0; i < listedPools.length; i++) {
        const ready = getSecsSince(
          listedPools[i].genesis.toString(),
        ).isGreaterThan(2592000)
        const validPool = listedPools[i].baseAmount.toString() > 0
        const curated = validPool
          ? curatedPools.includes(listedPools[i].address)
          : false
        const routerContract = getRouterContract(wallet)
        const poolContract = validPool
          ? getPoolContract(listedPools[i].address, wallet)
          : null
        tempArray.push(
          !validPool || !wallet.account
            ? '0'
            : poolContract.callStatic.balanceOf(wallet.account),
        ) // balance
        tempArray.push(
          !validPool
            ? '0'
            : !ready
            ? poolContract.callStatic.map30DPoolRevenue()
            : poolContract.callStatic.mapPast30DPoolRevenue(),
        ) // recentFees
        tempArray.push(
          !validPool || !curated
            ? '0'
            : routerContract.callStatic.mapAddress_30DayDividends(
                listedPools[i].address,
              ),
        ) // recentDivis
        tempArray.push(
          !validPool || !curated
            ? '0'
            : routerContract.callStatic.mapAddress_Past30DayPoolDividends(
                listedPools[i].address,
              ),
        ) // lastMonthDivis
        tempArray.push(curated) // check if pool is curated
        tempArray.push(validPool ? poolContract.callStatic.freeze() : false) // check if pool is frozen
        tempArray.push(validPool ? poolContract.callStatic.oldRate() : '0') // get pool safety zone
      }
      tempArray = await Promise.all(tempArray)
      const poolDetails = listedPools
      const varCount = 7
      for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
        const ii = i / varCount
        const _base = poolDetails[ii].baseAmount
        const newRate =
          _base > 0
            ? BN(10)
                .pow(18)
                .times(_base)
                .div(poolDetails[ii].tokenAmount)
                .toFixed(0)
            : '0'
        poolDetails[ii].balance = tempArray[i].toString()
        poolDetails[ii].fees = tempArray[i + 1].toString()
        poolDetails[ii].recentDivis = tempArray[i + 2].toString()
        poolDetails[ii].lastMonthDivis = tempArray[i + 3].toString()
        poolDetails[ii].curated = tempArray[i + 4]
        poolDetails[ii].frozen = tempArray[i + 5]
        const oldRate = tempArray[i + 6]
        poolDetails[ii].oldRate = oldRate.toString()
        poolDetails[ii].newRate = newRate.toString()
        const safety =
          _base > 0
            ? BN(1)
                .minus(BN(newRate.toString()).div(oldRate.toString()))
                .toString()
            : '0'
        poolDetails[ii].safety = safety.toString()
      }
      dispatch(payloadToDispatch(Types.POOL_DETAILS, poolDetails))
    } catch (error) {
      dispatch(errorToDispatch(Types.POOL_ERROR, error))
    }
  }

/**
 * Create a new pool
 * @param inputBase @param inputToken @param token @param wallet
 */
export const createPoolADD =
  (inputBase, inputToken, token, wallet) => async (dispatch) => {
    dispatch(poolLoading())
    const addr = getAddresses()
    const contract = getPoolFactoryContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const _value = token === addr.bnb ? inputToken : null
      const ORs = { value: _value, gasPrice: gPrice }
      let txn = await contract.createPoolADD(inputBase, inputToken, token, ORs)
      txn = await parseTxn(txn, 'createPool')
      dispatch(payloadToDispatch(Types.POOL_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.POOL_ERROR, error))
    }
  }
