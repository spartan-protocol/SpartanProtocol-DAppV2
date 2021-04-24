import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/web3Contracts'
import { getProviderGasPrice } from '../../utils/web3'

export const synthLoading = () => ({
  type: Types.SYNTH_LOADING,
})

/**
 * Get the array of synthAddresses
 * @returns {array} synthArray
 */
export const getSynthArray = (tokenArray) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthFactoryContract()

  try {
    let tempArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      tempArray.push(contract.callStatic.getSynth(tokenArray[i]))
    }
    const synthArray = []
    tempArray = await Promise.all(tempArray)
    for (let i = 0; i < tempArray.length; i++) {
      synthArray.push({
        tokenAddress: tokenArray[i],
        synthAddress:
          tempArray[i] === '0x0000000000000000000000000000000000000000'
            ? false
            : tempArray[i],
        lastHarvest: '0',
      })
    }
    dispatch(payloadToDispatch(Types.GET_SYNTH_ARRAY, synthArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the array of synthAddresses
 * @param {array} synthArray
 * @param {address} memberAddr
 * @returns {array} synthArrayFinal
 */
export const getSynthArrayFinal = (synthArray, memberAddr) => async (
  dispatch,
) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    let awaitArray = []
    for (let i = 0; i < synthArray.length; i++) {
      if (synthArray[i].synthAddress !== false) {
        awaitArray.push(
          contract.callStatic.getMemberLastSynthTime(
            synthArray[i].synthAddress,
            memberAddr,
          ),
        )
      } else awaitArray.push('0')
    }
    const synthArrayFinal = synthArray
    console.log(awaitArray)
    awaitArray = await Promise.all(awaitArray)
    console.log(awaitArray)
    for (let i = 0; i < awaitArray.length; i++) {
      synthArrayFinal[i].lastHarvest = awaitArray[i].toString()
    }
    dispatch(payloadToDispatch(Types.SYNTH_ARRAY_FINAL, synthArrayFinal))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

// --------------------------------------- SYNTH VAULT FUNCTIONS ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param {address} synth
 * @param {uint256} amount
 * @returns {uint256} depositAmount
 */
export const synthDeposit = (synth, amount) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const gPrice = await getProviderGasPrice()
    // const gLimit = await contract.estimateGas.deposit(asset, amount)
    const depositAmount = await contract.deposit(synth, amount, {
      gasPrice: gPrice,
      // gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.DEPOSIT_AMOUNT, depositAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Harvest synths from synthVault
 * @param {address} synth
 * @returns {uint256} harvestAmount
 */
export const synthHarvest = () => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const gPrice = await getProviderGasPrice()
    // const gLimit = await contract.estimateGas.deposit(asset, amount)
    const harvestAmount = await contract.harvest({
      gasPrice: gPrice,
      // gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.HARVEST_AMOUNT, harvestAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Withdraw synths from synthVault
 * @param {address} synth
 * @param {uint256} basisPoints
 * @returns {uint256} withdrawAmount
 */
export const synthWithdraw = (synth, basisPoints) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const gPrice = await getProviderGasPrice()
    // const gLimit = await contract.estimateGas.deposit(asset, amount)
    const withdrawAmount = await contract.withdraw(synth, basisPoints, {
      gasPrice: gPrice,
      // gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.WITHDRAW_AMOUNT, withdrawAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

// --------------------------------------- SYNTH VAULT HELPERS ---------------------------------------

/**
 * Returns the member's deposit / stake details (via helper)
 * @param {address} synth
 * @param {address} member
 * @returns {uint}
 */
export const getSynthMemberStaked = (synth, member) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const memberStaked = await contract.callStatic.getMemberDeposit(
      synth,
      member,
    )
    dispatch(payloadToDispatch(Types.MEMBER_STAKED, memberStaked))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Returns the member's last synthVault harvest (via helper)
 * @param {address} synth
 * @param {address} member
 * @returns {uint}
 */
export const getSynthMemberLastHarvest = (synth, member) => async (
  dispatch,
) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const memberLastHarvest = await contract.callStatic.getMemberLastTime(
      synth,
      member,
    )
    dispatch(payloadToDispatch(Types.MEMBER_LAST_HARVEST, memberLastHarvest))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Returns the member's weight in the DAO (via helper)
 * @param {address} member
 * @returns {uint}
 */
export const getSynthMemberWeight = (member) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const memberWeight = await contract.callStatic.getMemberWeight(member)
    dispatch(payloadToDispatch(Types.MEMBER_WEIGHT, memberWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Returns the total weight in the synthVault (via mapping)
 * @returns {uint}
 */
export const getSynthTotalWeight = () => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const totalWeight = await contract.callStatic.totalWeight()
    dispatch(payloadToDispatch(Types.TOTAL_WEIGHT, totalWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}
