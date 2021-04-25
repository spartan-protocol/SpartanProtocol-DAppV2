import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getSynthContract,
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/web3Contracts'
import { getAddresses, getProviderGasPrice } from '../../utils/web3'

export const synthLoading = () => ({
  type: Types.SYNTH_LOADING,
})

// --------------------------------------- SYNTH Calls ---------------------------------------

/**
 * Get the global synth details
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthGlobalDetails = () => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    let awaitArray = [
      contract.callStatic.minimumDepositTime(),
      contract.callStatic.totalWeight(),
      contract.callStatic.erasToEarn(),
      contract.callStatic.blockDelay(),
      contract.callStatic.vaultClaim(),
      // contract.callStatic.getStakeSynthLength(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      minTime: awaitArray[0].toString(),
      totalWeight: awaitArray[1].toString(),
      erasToEarn: awaitArray[2].toString(),
      blockDelay: awaitArray[3].toString(),
      vaultClaim: awaitArray[4].toString(),
      // stakedSynthLength: awaitArray[5].toString(),
    }
    dispatch(payloadToDispatch(Types.GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the synth addresses and setup the object
 * @param {array} tokenArray
 * @returns {array} synthArray
 */
export const getSynthArray = (tokenArray) => async (dispatch) => {
  dispatch(synthLoading())
  const addr = getAddresses()
  const contract = getSynthFactoryContract()

  try {
    let tempArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      if (tokenArray[i] === addr.sparta) {
        tempArray.push(addr.bnb)
      } else {
        tempArray.push(contract.callStatic.getSynth(tokenArray[i]))
      }
    }
    const synthArray = []
    tempArray = await Promise.all(tempArray)
    for (let i = 0; i < tempArray.length; i++) {
      synthArray.push({
        tokenAddress: tokenArray[i],
        address: tempArray[i] === addr.bnb ? false : tempArray[i],
        balance: '0',
        staked: '0',
        weight: '0',
        lastHarvest: '0',
        lpBalance: '0',
        lpDebt: '0',
      })
    }
    dispatch(payloadToDispatch(Types.SYNTH_ARRAY, synthArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the member's general synth details
 * @param {address} wallet
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthMemberDetails = (wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    let awaitArray = [contract.callStatic.getMemberWeight(wallet)]
    awaitArray = await Promise.all(awaitArray)
    const memberDetails = {
      totalWeight: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the synth details relevant to the member
 * @param {object} synthArray
 * @param {object} listedPools
 * @param {address} wallet
 * @returns {array} synthDetails
 */
export const getSynthDetails = (synthArray, listedPools, wallet) => async (
  dispatch,
) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    let tempArray = []
    for (let i = 0; i < synthArray.length; i++) {
      if (wallet === null || synthArray[i].address === false) {
        tempArray.push('0') // balance
        tempArray.push('0') // staked
        // tempArray.push('0') // synthWeight ADD HERE ONCE MEMBER-SYNTH-WEIGHT IS ADDED TO CONTRACT
        tempArray.push('0') // lastHarvest
      } else {
        const synthContract = getSynthContract(synthArray[i].address)
        tempArray.push(synthContract.callStatic.balanceOf(wallet)) // balance
        tempArray.push(
          contract.callStatic.getMemberDeposit(synthArray[i].address, wallet),
        ) // staked
        // tempArray.push(
        //   contract.callStatic.getMappedMemberSynthWeight(synthArray[i].address, wallet),
        // ) // ADD HERE ONCE MEMBER-SYNTH-WEIGHT IS ADDED TO CONTRACT
        tempArray.push(
          contract.callStatic.getMemberLastSynthTime(
            synthArray[i].address,
            wallet,
          ),
        ) // lastHarvest
      }
      if (synthArray[i].address === false) {
        tempArray.push('0') // lpBalance
        tempArray.push('0') // lpDebt
      } else {
        const pool = listedPools.filter(
          (lp) => lp.tokenAddress === synthArray[i].tokenAddress,
        )[0]
        const synthContract = getSynthContract(synthArray[i].address)
        tempArray.push(
          synthContract.callStatic.getmapAddress_LPBalance(pool.address),
        ) // lpBalance
        tempArray.push(
          synthContract.callStatic.getmapAddress_LPDebt(pool.address),
        ) // lpDebt
      }
    }
    const synthDetails = synthArray
    tempArray = await Promise.all(tempArray)
    const varCount = 5
    for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
      synthDetails[i / varCount].balance = tempArray[i].toString()
      synthDetails[i / varCount].staked = tempArray[i + 1].toString()
      // synthDetails[i].weight = tempArray[i + 2].toString()
      synthDetails[i / varCount].lastHarvest = tempArray[i + 2].toString()
      synthDetails[i / varCount].lpBalance = tempArray[i + 3].toString()
      synthDetails[i / varCount].lpDebt = tempArray[i + 4].toString()
    }
    dispatch(payloadToDispatch(Types.SYNTH_DETAILS, synthDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

// --------------------------------------- SYNTH Actions ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param {address} synth
 * @param {uint256} amount
 * @returns {TBA} TBA
 */
export const synthDeposit = (synth, amount) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const gPrice = await getProviderGasPrice()
    const deposit = await contract.deposit(synth, amount, {
      gasPrice: gPrice,
    })
    // Trace txnHash to get something relevant to dispatch
    dispatch(payloadToDispatch(Types.DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Harvest synths from synthVault
 * @returns {bool}
 */
export const synthHarvest = () => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract()

  try {
    const gPrice = await getProviderGasPrice()
    const harvest = await contract.harvest({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.HARVEST, harvest))
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
    const withdrawAmount = await contract.withdraw(synth, basisPoints, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.WITHDRAW_AMOUNT, withdrawAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}
