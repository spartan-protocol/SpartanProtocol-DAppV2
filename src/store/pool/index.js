import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getPoolFactoryContract,
  getSSUtilsContract,
} from '../../utils/getContracts'
import { oneWeek, parseTxn } from '../../utils/web3'
import { getSecsSince } from '../../utils/math/nonContract'
import { BN } from '../../utils/bigNumber'
// import { getPoolIncentives } from '../../utils/extCalls'
import { getBondDetails } from '../bond'
import { getDaoDetails } from '../dao'
import { getSymbolUrl } from '../../utils/helpers.ts'
// eslint-disable-next-line import/no-cycle
import { getSynthDetails } from '../synth'
import { getSpartaPriceInternal } from '../web3'

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
  updatePoolDetails,
  updateTxn,
  updateIncentives,
} = poolSlice.actions

// /**
//  * Add rolling 30d incentives to store
//  * @returns {array} eventArray
//  */
// export const getMonthIncentives = () => async (dispatch, getState) => {
//   dispatch(updateLoading(true))
//   const { poolDetails } = getState().pool
//   try {
//     if (poolDetails.length > 0) {
//       let _poolArray = poolDetails.filter((x) => x.baseAmount > 0)
//       _poolArray = _poolArray.sort((a, b) => b.baseAmount - a.baseAmount)
//       const incentives = []
//       const _incentives = await getPoolIncentives(_poolArray)
//       for (let i = 0; i < _poolArray.length; i++) {
//         const index = _incentives.findIndex(
//           (x) => x.pool.id === _poolArray[i].address.toString().toLowerCase(),
//         )
//         incentives.push({
//           address: _poolArray[i].address,
//           timestamp: index > -1 ? _incentives[index].timestamp : '0',
//           incentives: index > -1 ? _incentives[index].incentives30Day : '0',
//           fees: index > -1 ? _incentives[index].fees30Day : '0',
//           volume: index > -1 ? _incentives[index].volRollingUSD : '0',
//         })
//       }
//       // console.log('debug success', incentives)
//       dispatch(updateIncentives(incentives))
//     }
//   } catch (error) {
//     dispatch(updateError(error.reason ?? error.message ?? error))
//   }
//   dispatch(updateLoading(false))
// }

/**
 * Add LP wallet-details to final array
 */
export const getPoolDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoadingFinal(true))
  const { listedTokens, curatedPools } = getState().pool
  try {
    if (listedTokens.length > 0) {
      const { rpcs } = getState().web3
      const { addresses } = getState().app
      const contract = getSSUtilsContract(null, rpcs)

      const excludedArray = [addresses.spartav1, addresses.spartav2]
      const _listedTokens = listedTokens.filter(
        (x) => !excludedArray.includes(x),
      )
      const awaitArray = (
        await contract.simulate.getPoolDetails([
          walletAddr ?? addresses.bnb,
          _listedTokens,
        ])
      ).result

      const poolDetails = []

      for (let i = 0; i < awaitArray.length; i++) {
        const _base = awaitArray[i].baseAmount.toString()
        const newRate =
          _base > 0
            ? BN(10)
                .pow(18)
                .times(_base)
                .div(awaitArray[i].tokenAmount.toString())
                .toFixed(0)
            : '0'
        const oldRate = awaitArray[i].oldRate.toString()
        const safety =
          _base > 0
            ? BN(newRate.toString()).isGreaterThan(oldRate)
              ? BN(1).minus(BN(oldRate).div(newRate.toString())).toString()
              : BN(1).minus(BN(newRate.toString()).div(oldRate)).toString()
            : '0'
        poolDetails.push({
          tokenAddress: _listedTokens[i],
          address: awaitArray[i].poolAddress,
          baseAmount: awaitArray[i].baseAmount.toString(),
          tokenAmount: awaitArray[i].tokenAmount.toString(),
          poolUnits: awaitArray[i].totalSupply.toString(),
          baseCap: awaitArray[i].baseCap.toString(),
          genesis: awaitArray[i].genesis.toString(),
          newPool: getSecsSince(awaitArray[i].genesis.toString()) < oneWeek,
          hide: awaitArray[i].baseAmount.toString() <= 0,
          balance: awaitArray[i].balance.toString(),
          curated: curatedPools.includes(awaitArray[i].poolAddress),
          frozen: awaitArray[i].frozen,
          oldRate,
          newRate: newRate.toString(),
          safety: safety.toString(),
        })
      }

      // Add a dummy pool object for SpartaV2
      poolDetails.push({
        tokenAddress: addresses.spartav2,
        address: null,
        baseAmount: '0',
        tokenAmount: '0',
        poolUnits: '0',
        baseCap: '0',
        genesis: '0',
        newPool: false,
        hide: false,
        balance: '0',
        curated: false,
        frozen: false,
        oldRate: '0',
        newRate: '0',
        safety: '0',
      })

      dispatch(updatePoolDetails(poolDetails))
      dispatch(getBondDetails(walletAddr)) // Update bondDetails -> bondVaultWeight
      dispatch(getDaoDetails(walletAddr)) // Update daoDetails -> daoVaultWeight
      // dispatch(getMonthIncentives()) // Update the incentive metrics
      dispatch(getSpartaPriceInternal()) // Update internally derived SPARTA price
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoadingFinal(false))
}

/**
 * Get detailed array of token information
 */
export const getTokenDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { listedTokens } = getState().pool
  try {
    if (listedTokens.length > 0) {
      const { rpcs } = getState().web3
      const { addresses, chainId } = getState().app
      const contract = getSSUtilsContract(null, rpcs)
      const tempArray = await contract.simulate.getTokenDetails([
        walletAddr ?? addresses.bnb,
        listedTokens,
      ])
      const awaitArray = tempArray.result

      let symbUrls = []
      for (let i = 0; i < listedTokens.length; i++) {
        symbUrls.push(getSymbolUrl(addresses, listedTokens[i], chainId))
      }
      symbUrls = await Promise.all(symbUrls)

      const tokenDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        tokenDetails.push({
          address: listedTokens[i],
          balance: awaitArray[i].balance.toString(),
          symbol:
            listedTokens[i] !== addresses.bnb
              ? awaitArray[i].symbol.toUpperCase()
              : 'BNB',
          symbolUrl: symbUrls[i],
        })
      }
      dispatch(updatetokenDetails(tokenDetails))
      dispatch(getPoolDetails(walletAddr)) // Update poolDetails
      dispatch(getSynthDetails(walletAddr)) // Update synthDetails
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get array of all listed token addresses
 */
export const getListedTokens = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const { addresses } = getState().app
      const contract = getSSUtilsContract(null, rpcs)
      const listedTokens = []
      const _listedTokens = (await contract.simulate.getListedTokens()).result
      for (let i = 0; i < _listedTokens.length; i++) {
        listedTokens.push(_listedTokens[i])
      }
      const wbnbIndex = listedTokens.findIndex((i) => i === addresses.wbnb)
      if (wbnbIndex > -1) {
        listedTokens[wbnbIndex] = addresses.bnb
      }
      listedTokens.push(addresses.spartav1, addresses.spartav2)
      dispatch(updateListedTokens(listedTokens))
      dispatch(getTokenDetails(walletAddr)) // Update tokenDetails
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
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
      const contract = getSSUtilsContract(null, rpcs)
      const curatedPools = (await contract.simulate.getCuratedPools()).result
      dispatch(updateCuratedPools(curatedPools))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Create a new pool
 * @param inputBase @param inputToken @param token @param wallet
 */
export const createPoolADD =
  (inputBase, inputToken, token, walletAddr, signer) =>
  async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getPoolFactoryContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId, addresses } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = {
        value: token === addresses.bnb ? inputToken : undefined,
        gasPrice: gPrice,
      }
      let txn = await contract.write.createPoolADD(
        [inputBase, inputToken, token],
        ORs,
      )
      txn = await parseTxn(txn, 'createPool', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getListedTokens(walletAddr)) // Update listedTokens -> poolDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

export default poolSlice.reducer
