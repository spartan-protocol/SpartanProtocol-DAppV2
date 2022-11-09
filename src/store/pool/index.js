import { ethers } from 'ethers'
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getPoolContract,
  getPoolFactoryContract,
  getUtilsContract,
  getTokenContract,
} from '../../utils/getContracts'
import { getTwTokenLogo, oneWeek, parseTxn } from '../../utils/web3'
import { getSecsSince } from '../../utils/math/nonContract'
import { BN } from '../../utils/bigNumber'
import { getPoolIncentives } from '../../utils/extCalls'
import { bondVaultWeight } from '../bond'
import { daoVaultWeight } from '../dao'

export const usePool = () => useSelector((state) => state.pool)

export const poolSlice = createSlice({
  name: 'pool',
  initialState: {
    loading: false,
    loadingFinal: false,
    error: null,
    listedTokens: false,
    tokenDetails: false,
    curatedPools: false,
    listedPools: false,
    poolDetails: false,
    txn: [],
    incentives: false,
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateLoadingFinal: (state, action) => {
      state.loadingFinal = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateListedTokens: (state, action) => {
      state.listedTokens = action.payload
    },
    updatetokenDetails: (state, action) => {
      state.tokenDetails = action.payload
    },
    updateCuratedPools: (state, action) => {
      state.curatedPools = action.payload
    },
    updateListedPools: (state, action) => {
      state.listedPools = action.payload
    },
    updatePoolDetails: (state, action) => {
      state.poolDetails = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
    updateIncentives: (state, action) => {
      state.incentives = action.payload
    },
  },
})

export const {
  updateLoading,
  updateLoadingFinal,
  updateError,
  updateListedTokens,
  updatetokenDetails,
  updateCuratedPools,
  updateListedPools,
  updatePoolDetails,
  updateTxn,
  updateIncentives,
} = poolSlice.actions

/**
 * Get array of all listed token addresses
 */
export const getListedTokens = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const { addresses } = getState().app
      const check = ethers.utils.isAddress(addresses.poolFactory)
      const contract = check ? getPoolFactoryContract(null, rpcs) : ''
      const listedTokens = []
      if (check) {
        const _listedTokens = await contract.callStatic.getTokenAssets()
        for (let i = 0; i < _listedTokens.length; i++) {
          listedTokens.push(_listedTokens[i])
        }
        const wbnbIndex = listedTokens.findIndex((i) => i === addresses.wbnb)
        if (wbnbIndex > -1) {
          listedTokens[wbnbIndex] = addresses.bnb
        }
      }
      listedTokens.push(addresses.spartav1, addresses.spartav2)
      dispatch(updateListedTokens(listedTokens))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get detailed array of token information
 */
export const getTokenDetails =
  (wallet, chainId) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { listedTokens } = getState().pool
    try {
      if (listedTokens.length > 0) {
        const { rpcs } = getState().web3
        const { addresses } = getState().app
        let tempArray = []
        for (let i = 0; i < listedTokens.length; i++) {
          const contract = getTokenContract(listedTokens[i], null, rpcs)
          tempArray.push(listedTokens[i]) // TOKEN ADDR (1)
          if (wallet.account) {
            if (listedTokens[i] === addresses.bnb) {
              tempArray.push(wallet.library.getBalance(wallet.account))
            } else {
              tempArray.push(contract.callStatic.balanceOf(wallet?.account)) // TOKEN BALANCE (2)
            }
          } else {
            tempArray.push('0')
          }
          if (listedTokens[i] === addresses.bnb) {
            tempArray.push('BNB')
            tempArray.push(`${window.location.origin}/images/icons/BNB.svg`)
          } else if (listedTokens[i] === addresses.spartav1) {
            tempArray.push('SPARTA (old)')
            tempArray.push(`${window.location.origin}/images/icons/SPARTA1.svg`)
          } else if (listedTokens[i] === addresses.spartav2) {
            tempArray.push('SPARTA')
            tempArray.push(`${window.location.origin}/images/icons/SPARTA2.svg`)
          } else {
            tempArray.push(contract.callStatic.symbol()) // TOKEN SYMBOL (3)
            tempArray.push(getTwTokenLogo(listedTokens[i], chainId)) // SYMBOL URL (4)
          }
        }
        tempArray = await Promise.all(tempArray)
        const varCount = 4
        const tokenDetails = []
        for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
          tokenDetails.push({
            address: tempArray[i],
            balance: tempArray[i + 1].toString(),
            symbol: tempArray[i + 2].toUpperCase(),
            symbolUrl: tempArray[i + 3],
          })
        }
        dispatch(updatetokenDetails(tokenDetails))
      }
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Return array of curated pool addresses
 */
export const getCuratedPools = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getPoolFactoryContract(null, rpcs)
      const curatedPools = await contract.callStatic.getVaultAssets()
      dispatch(updateCuratedPools(curatedPools))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get LP token addresses and setup the object
 */
export const getListedPools = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { tokenDetails } = getState().pool
  try {
    if (tokenDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getUtilsContract(null, rpcs)
      const { addresses } = getState().app
      let tempArray = []
      for (let i = 0; i < tokenDetails.length; i++) {
        if (
          tokenDetails[i].address === addresses.spartav1 ||
          tokenDetails[i].address === addresses.spartav2
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
          tempArray.push(
            contract.callStatic.getPoolData(tokenDetails[i].address),
          )
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
          synthCapBPs: tempArray[i].synthCap.toString(),
          baseCap: tempArray[i].baseCap.toString(),
          genesis: tempArray[i].genesis.toString(),
          newPool: getSecsSince(tempArray[i].genesis.toString()) < oneWeek,
          hide:
            tokenDetails[i].address !== addresses.spartav2 &&
            tempArray[i].baseAmount.toString() <= 0,
        })
      }
      dispatch(updateListedPools(listedPools))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Add LP wallet-details to final array
 */
export const getPoolDetails = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoadingFinal(true))
  const { listedPools, curatedPools } = getState().pool
  try {
    if (listedPools.length > 0) {
      const { rpcs } = getState().web3
      let tempArray = []
      for (let i = 0; i < listedPools.length; i++) {
        const validPool = listedPools[i].baseAmount.toString() > 0
        const curated = validPool
          ? curatedPools.includes(listedPools[i].address)
          : false
        const poolContract = validPool
          ? getPoolContract(listedPools[i].address, null, rpcs)
          : null
        tempArray.push(
          !validPool || !wallet.account
            ? '0'
            : poolContract.callStatic.balanceOf(wallet.account),
        ) // balance
        tempArray.push(curated) // check if pool is curated
        tempArray.push(validPool ? poolContract.callStatic.freeze() : false) // check if pool is frozen
        tempArray.push(validPool ? poolContract.callStatic.oldRate() : '0') // get pool safety zone
        tempArray.push(validPool ? poolContract.callStatic.stirRate() : '0') // stirRate
        tempArray.push(validPool ? poolContract.callStatic.lastStirred() : '0') // lastStirred
      }
      tempArray = await Promise.all(tempArray)
      const poolDetails = []
      const varCount = 6
      for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
        const ii = i / varCount
        const _base = listedPools[ii].baseAmount
        const newRate =
          _base > 0
            ? BN(10)
                .pow(18)
                .times(_base)
                .div(listedPools[ii].tokenAmount)
                .toFixed(0)
            : '0'
        const oldRate = tempArray[i + 3].toString()
        const safety =
          _base > 0
            ? BN(newRate.toString()).isGreaterThan(oldRate)
              ? BN(1).minus(BN(oldRate).div(newRate.toString())).toString()
              : BN(1).minus(BN(newRate.toString()).div(oldRate)).toString()
            : '0'
        poolDetails.push({
          // Pre-Obj
          tokenAddress: listedPools[ii].tokenAddress,
          address: listedPools[ii].address,
          baseAmount: listedPools[ii].baseAmount,
          tokenAmount: listedPools[ii].tokenAmount,
          poolUnits: listedPools[ii].poolUnits,
          synthCapBPs: listedPools[ii].synthCapBPs,
          baseCap: listedPools[ii].baseCap,
          genesis: listedPools[ii].genesis,
          newPool: listedPools[ii].newPool,
          hide: listedPools[ii].hide,
          // Post-Obj
          balance: tempArray[i].toString(),
          curated: tempArray[i + 1],
          frozen: tempArray[i + 2],
          oldRate,
          newRate: newRate.toString(),
          safety: safety.toString(),
          stirRate: tempArray[i + 4].toString(),
          lastStirred: tempArray[i + 5].toString(),
        })
      }
      dispatch(updatePoolDetails(poolDetails))
      dispatch(bondVaultWeight()) // Weight changing function, so we need to update weight calculations
      dispatch(daoVaultWeight()) // Weight changing function, so we need to update weight calculations
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoadingFinal(false))
}

/**
 * Create a new pool
 * @param inputBase @param inputToken @param token @param wallet
 */
export const createPoolADD =
  (inputBase, inputToken, token, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getPoolFactoryContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId, addresses } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const _value = token === addresses.bnb ? inputToken : null
      const ORs = { value: _value, gasPrice: gPrice }
      let txn = await contract.createPoolADD(inputBase, inputToken, token, ORs)
      txn = await parseTxn(txn, 'createPool', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Add rolling 30d incentives to store
 * @returns {array} eventArray
 */
export const getMonthIncentives = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { listedPools } = getState().pool
  try {
    if (listedPools.length > 0) {
      let _poolArray = listedPools.filter((x) => x.baseAmount > 0)
      _poolArray = _poolArray.sort((a, b) => b.baseAmount - a.baseAmount)
      const incentives = []
      const _incentives = await getPoolIncentives(_poolArray)
      for (let i = 0; i < _poolArray.length; i++) {
        const index = _incentives.findIndex(
          (x) => x.pool.id === _poolArray[i].address.toString().toLowerCase(),
        )
        incentives.push({
          address: _poolArray[i].address,
          timestamp: index > -1 ? _incentives[index].timestamp : '0',
          incentives: index > -1 ? _incentives[index].incentives30Day : '0',
          fees: index > -1 ? _incentives[index].fees30Day : '0',
          volume: index > -1 ? _incentives[index].volRollingUSD : '0',
        })
      }
      // console.log('debug success', incentives)
      dispatch(updateIncentives(incentives))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default poolSlice.reducer
