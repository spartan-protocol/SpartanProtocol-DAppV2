import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getSSUtilsContract,
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/getContracts'
import { getSynthTokens, parseTxn } from '../../utils/web3'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'
import { BN } from '../../utils/bigNumber'
// eslint-disable-next-line import/no-cycle
import { getTokenDetails } from '../pool'

export const useSynth = () => useSelector((state) => state.synth)

export const synthSlice = createSlice({
  name: 'synth',
  initialState: {
    loading: false,
    error: null,
    globalDetails: false,
    // member: false,
    // synthMinting: false,
    // synthArray: false,
    synthDetails: false,
    totalWeight: false,
    txn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateGlobalDetails: (state, action) => {
      state.globalDetails = action.payload
    },
    // updateMember: (state, action) => {
    //   state.member = action.payload
    // },
    // updateSynthMinting: (state, action) => {
    //   state.synthMinting = action.payload
    // },
    // updateSynthArray: (state, action) => {
    //   state.synthArray = action.payload
    // },
    updateSynthDetails: (state, action) => {
      state.synthDetails = action.payload
    },
    updateTotalWeight: (state, action) => {
      state.totalWeight = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateGlobalDetails,
  // updateMember,
  // updateSynthMinting,
  // updateSynthArray,
  updateSynthDetails,
  updateTotalWeight,
  updateTxn,
} = synthSlice.actions

// --------------------------------------- SYNTH Calls ---------------------------------------

/**
 * Get the global synth details *DEPRECATED: ONLY CALL THIS ACTION REACTIVELY (only SynthVault page i think), NOT PROACTIVELY, SAVE RPC CALLS*
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthGlobalDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getSynthVaultContract(null, rpcs)
      let awaitArray = [
        contract.simulate.minimumDepositTime(),
        contract.simulate.erasToEarn(),
        contract.simulate.vaultClaim(),
        contract.simulate.genesis(),
        // contract.simulate.map30DVaultRevenue(),
        // contract.simulate.mapPast30DVaultRevenue(),
        getSynthFactoryContract(null, rpcs).simulate.synthCount(),
      ]
      awaitArray = await Promise.all(awaitArray)
      const globalDetails = {
        minTime: awaitArray[0].result.toString(),
        erasToEarn: awaitArray[1].result.toString(),
        vaultClaim: awaitArray[2].result.toString(),
        genesis: awaitArray[3].result.toString(),
        // recentRevenue: awaitArray[].result.toString(),
        // lastMonthRevenue: awaitArray[].result.toString(),
        synthCount: awaitArray[4].result.toString(),
      }
      dispatch(updateGlobalDetails(globalDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the member's synth details *DEPRECATED: SHOULDNT NEED TO EVER CALL THIS*
 * @returns depositTime
 */
// export const getSynthMemberDetails =
//   (walletAddr) => async (dispatch, getState) => {
//     dispatch(updateLoading(true))
//     const { rpcs } = getState().web3
//     try {
//       if (walletAddr && rpcs.length > 0) {
//         const contract = getSynthVaultContract(null, rpcs)
//         let awaitArray = [contract.simulate.mapMember_depositTime({args:[walletAddr]})]
//         awaitArray = await Promise.all(awaitArray)
//         const member = {
//           depositTime: awaitArray[0].result.toString(),
//         }
//         dispatch(updateMember(member))
//       }
//     } catch (error) {
//       dispatch(updateError(error.reason ?? error.message ?? error))
//     }
//     dispatch(updateLoading(false))
//   }

/**
 * Get the global synthMinting bool (from router) *DEPRECATED: SHOULDNT NEED TO EVER CALL THIS*
 * @returns {bool} synthMinting
 */
// export const getSynthMinting = () => async (dispatch, getState) => {
//   dispatch(updateLoading(true))
//   const { rpcs } = getState().web3
//   try {
//     if (rpcs.length > 0) {
//       const contract = getRouterContract(null, rpcs)
//       const synthMinting = (await contract.simulate.synthMinting()).result
//       dispatch(updateSynthMinting(synthMinting))
//     }
//   } catch (error) {
//     dispatch(updateError(error.reason ?? error.message ?? error))
//   }
//   dispatch(updateLoading(false))
// }

/**
 * Get the synth details relevant to the member
 * @returns [synthDetails]
 */
export const getSynthDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { chainId, addresses } = getState().app
  const synthTokens = getSynthTokens(chainId)
  try {
    if (synthTokens.length > 0) {
      const { rpcs } = getState().web3
      const contract = getSSUtilsContract(null, rpcs)

      const awaitArray = await contract.simulate.getSynthDetails([
        walletAddr ?? addresses.bnb,
        synthTokens,
      ])
      const synthDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        synthDetails.push({
          tokenAddress: synthTokens[i],
          address: awaitArray[i].result.synthAddress,
          balance: awaitArray[i].result.balance.toString(),
          staked: awaitArray[i].result.staked.toString(),
          lastHarvest: '0', // awaitArray[i].toString(),
          lpBalance: awaitArray[i].result.collateral.toString(),
          totalSupply: awaitArray[i].result.totalSupply.toString(),
        })
      }
      dispatch(updateSynthDetails(synthDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the current synthVault's total weight
 * @returns spartaWeight
 */
export const synthVaultWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { synthDetails } = getState().synth
  const { poolDetails } = getState().pool
  try {
    if (synthDetails.length > 0 && poolDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getSynthVaultContract(null, rpcs)
      const vaultPools = synthDetails.filter(
        (x) => x.address && getPool(x.tokenAddress, poolDetails).curated,
      )
      let totalWeight = BN(0)
      if (vaultPools.length > 0) {
        const awaitArray = []
        for (let i = 0; i < vaultPools.length; i++) {
          awaitArray.push(
            contract.simulate.mapTotalSynth_balance([vaultPools[i].address]),
          )
        }
        const totalStaked = await Promise.all(awaitArray)
        for (let i = 0; i < totalStaked.length; i++) {
          totalWeight = totalWeight.plus(
            calcSpotValueInBase(
              totalStaked[i].result.toString(),
              getPool(vaultPools[i].tokenAddress, poolDetails),
            ),
          )
        }
        totalWeight = totalWeight.toFixed(0).toString()
      }
      dispatch(updateTotalWeight(totalWeight))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

// --------------------------------------- SYNTH Actions ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param synth @param amount @param wallet
 */
export const synthDeposit =
  (synth, amount, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.deposit([synth, amount], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'synthDeposit', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getSynthDetails(walletAddr)) // Update synthDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Harvest synths from synthVault
 * @param {array} synthArray @param wallet
 */
export const synthHarvest =
  (synthArray, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.harvestAll([synthArray], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'synthHarvest', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getTokenDetails(walletAddr)) // Update tokenDetails -> synthDetails -> poolDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Harvest a single synthetic stake position from synthVault
 * @param synth @param wallet
 */
export const synthHarvestSingle =
  (synth, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.harvestSingle([synth], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'synthHarvest', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getTokenDetails(walletAddr)) // Update tokenDetails -> synthDetails -> poolDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Withdraw synths from synthVault
 * @param synth @param basisPoints @param wallet
 * @returns withdrawAmount
 */
export const synthWithdraw =
  (synth, basisPoints, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.write.withdraw([synth, basisPoints], ORs)
      txn = await parseTxn(txn, 'synthWithdraw', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getSynthDetails(walletAddr)) // Update synthDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Deploy synthetic BEP20 asset
 * @param token
 * @returns synth
 */
export const createSynth = (token, signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getSynthFactoryContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.createSynth([token], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'createSynth', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

export default synthSlice.reducer
