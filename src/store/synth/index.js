import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import {
  getRouterContract,
  getSynthContract,
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/getContracts'
import { parseTxn } from '../../utils/web3'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'
import { BN } from '../../utils/bigNumber'

export const useSynth = () => useSelector((state) => state.synth)

export const synthSlice = createSlice({
  name: 'synth',
  initialState: {
    loading: false,
    error: null,
    globalDetails: false,
    member: false,
    synthMinting: false,
    synthArray: false,
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
    updateMember: (state, action) => {
      state.member = action.payload
    },
    updateSynthMinting: (state, action) => {
      state.synthMinting = action.payload
    },
    updateSynthArray: (state, action) => {
      state.synthArray = action.payload
    },
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
  updateMember,
  updateSynthMinting,
  updateSynthArray,
  updateSynthDetails,
  updateTotalWeight,
  updateTxn,
} = synthSlice.actions

// --------------------------------------- SYNTH Calls ---------------------------------------

/**
 * Get the global synth details
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthGlobalDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getSynthVaultContract(null, rpcs)
      let awaitArray = [
        contract.callStatic.minimumDepositTime(),
        contract.callStatic.erasToEarn(),
        contract.callStatic.vaultClaim(),
        contract.callStatic.genesis(),
        // contract.callStatic.map30DVaultRevenue(),
        // contract.callStatic.mapPast30DVaultRevenue(),
        getSynthFactoryContract(null, rpcs).callStatic.synthCount(),
      ]
      awaitArray = await Promise.all(awaitArray)
      const globalDetails = {
        minTime: awaitArray[0].toString(),
        erasToEarn: awaitArray[1].toString(),
        vaultClaim: awaitArray[2].toString(),
        genesis: awaitArray[3].toString(),
        // recentRevenue: awaitArray[].toString(),
        // lastMonthRevenue: awaitArray[].toString(),
        synthCount: awaitArray[4].toString(),
      }
      dispatch(updateGlobalDetails(globalDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the member's synth details
 * @returns depositTime
 */
export const getSynthMemberDetails =
  (walletAddr) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    try {
      if (walletAddr && rpcs.length > 0) {
        const contract = getSynthVaultContract(null, rpcs)
        let awaitArray = [contract.callStatic.mapMember_depositTime(walletAddr)]
        awaitArray = await Promise.all(awaitArray)
        const member = {
          depositTime: awaitArray[0].toString(),
        }
        dispatch(updateMember(member))
      }
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the global synthMinting bool (from router)
 * @returns {bool} synthMinting
 */
export const getSynthMinting = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (rpcs.length > 0) {
      const contract = getRouterContract(rpcs)
      const synthMinting = await contract.callStatic.synthMinting()
      dispatch(updateSynthMinting(synthMinting))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the synth addresses and setup the object
 * @returns synthArray
 */
export const getSynthArray = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { addresses } = getState().app
  const { listedTokens } = getState().pool
  try {
    if (listedTokens.length > 0) {
      const { rpcs } = getState().web3
      const contract = getSynthFactoryContract(null, rpcs)
      let tempArray = []
      for (let i = 0; i < listedTokens.length; i++) {
        if (
          listedTokens[i] === addresses.spartav1 ||
          listedTokens[i] === addresses.spartav2
        ) {
          tempArray.push(addresses.bnb)
        } else {
          tempArray.push(contract.callStatic.getSynth(listedTokens[i]))
        }
      }
      const synthArray = []
      tempArray = await Promise.all(tempArray)
      for (let i = 0; i < tempArray.length; i++) {
        synthArray.push({
          tokenAddress: listedTokens[i],
          address: tempArray[i] === addresses.bnb ? false : tempArray[i],
        })
      }
      dispatch(updateSynthArray(synthArray))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the synth details relevant to the member
 * @returns [synthDetails]
 */
export const getSynthDetails = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { synthArray } = getState().synth
  try {
    if (synthArray.length > 0) {
      const { rpcs } = getState().web3
      const contract = getSynthVaultContract(wallet, rpcs)
      let tempArray = []
      for (let i = 0; i < synthArray.length; i++) {
        if (!wallet.account || synthArray[i].address === false) {
          tempArray.push('0') // balance
          tempArray.push('0') // staked
          tempArray.push('0') // lastHarvest
        } else {
          const synthContract = getSynthContract(
            synthArray[i].address,
            wallet,
            rpcs,
          )
          tempArray.push(synthContract.callStatic.balanceOf(wallet.account)) // balance
          tempArray.push(
            contract.callStatic.getMemberDeposit(
              wallet.account,
              synthArray[i].address,
            ),
          ) // staked
          tempArray.push(
            contract.callStatic.getMemberLastSynthTime(
              synthArray[i].address,
              wallet.account,
            ),
          ) // lastHarvest
        }
        if (synthArray[i].address === false) {
          tempArray.push('0') // lpBalance
          tempArray.push('0') // totalSupply / debt
        } else {
          const synthContract = getSynthContract(
            synthArray[i].address,
            wallet,
            rpcs,
          )
          tempArray.push(synthContract.callStatic.collateral()) // lpBalance
          tempArray.push(synthContract.callStatic.totalSupply()) // totalSupply / debt
        }
      }
      const synthDetails = []
      tempArray = await Promise.all(tempArray)
      const varCount = 5
      for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
        synthDetails.push({
          tokenAddress: synthArray[i / varCount].tokenAddress,
          address: synthArray[i / varCount].address,
          balance: tempArray[i].toString(),
          staked: tempArray[i + 1].toString(),
          lastHarvest: tempArray[i + 2].toString(),
          lpBalance: tempArray[i + 3].toString(),
          totalSupply: tempArray[i + 4].toString(),
        })
      }
      dispatch(updateSynthDetails(synthDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
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
            contract.callStatic.mapTotalSynth_balance(vaultPools[i].address),
          )
        }
        const totalStaked = await Promise.all(awaitArray)
        for (let i = 0; i < totalStaked.length; i++) {
          totalWeight = totalWeight.plus(
            calcSpotValueInBase(
              totalStaked[i].toString(),
              getPool(vaultPools[i].tokenAddress, poolDetails),
            ),
          )
        }
        totalWeight = totalWeight.toFixed(0).toString()
      }
      dispatch(updateTotalWeight(totalWeight))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

// --------------------------------------- SYNTH Actions ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param synth @param amount @param wallet
 */
export const synthDeposit =
  (synth, amount, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.deposit(synth, amount, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthDeposit', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Harvest synths from synthVault
 * @param {array} synthArray @param wallet
 */
export const synthHarvest =
  (synthArray, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.harvestAll(synthArray, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthHarvest', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Harvest a single synthetic stake position from synthVault
 * @param synth @param wallet
 */
export const synthHarvestSingle =
  (synth, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.harvestSingle(synth, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthHarvest', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Withdraw synths from synthVault
 * @param synth @param basisPoints @param wallet
 * @returns withdrawAmount
 */
export const synthWithdraw =
  (synth, basisPoints, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getSynthVaultContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.withdraw(synth, basisPoints, ORs)
      txn = await parseTxn(txn, 'synthWithdraw', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Deploy synthetic BEP20 asset
 * @param token
 * @returns synth
 */
export const createSynth = (token, wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getSynthFactoryContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.createSynth(token, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'createSynth', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default synthSlice.reducer
