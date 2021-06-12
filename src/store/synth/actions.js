import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getSynthContract,
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/web3Contracts'
import {
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from '../../utils/web3'

export const synthLoading = () => ({
  type: Types.SYNTH_LOADING,
})

// --------------------------------------- SYNTH Calls ---------------------------------------

/**
 * Get the global synth details
 * @param {object} wallet
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

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
    dispatch(payloadToDispatch(Types.SYNTH_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Get the synth addresses and setup the object
 * @param {array} tokenArray
 * @param {object} wallet
 * @returns {array} synthArray
 */
export const getSynthArray = (tokenArray, wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const addr = getAddresses()
  const contract = getSynthFactoryContract(wallet)

  try {
    let tempArray = []
    for (let i = 0; i < tokenArray.length; i++) {
      if (tokenArray[i] === addr.spartav1 || tokenArray[i] === addr.spartav2) {
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
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Get the member's general synth details
 * @param {address} wallet
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthMemberDetails = (wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

  try {
    let awaitArray = [contract.callStatic.getMemberWeight(wallet.account)]
    awaitArray = await Promise.all(awaitArray)
    const memberDetails = {
      totalWeight: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.SYNTH_MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Get the synth details relevant to the member
 * @param {object} synthArray
 * @param {object} listedPools
 * @param {object} wallet
 * @returns {array} synthDetails
 */
export const getSynthDetails = (synthArray, listedPools, wallet) => async (
  dispatch,
) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

  try {
    let tempArray = []
    for (let i = 0; i < synthArray.length; i++) {
      if (wallet.account === null || synthArray[i].address === false) {
        tempArray.push('0') // balance
        tempArray.push('0') // staked
        tempArray.push('0') // synthWeight
        tempArray.push('0') // lastHarvest
      } else {
        const synthContract = getSynthContract(synthArray[i].address, wallet)
        tempArray.push(synthContract.callStatic.balanceOf(wallet.account)) // balance
        tempArray.push(
          contract.callStatic.getMemberDeposit(
            synthArray[i].address,
            wallet.account,
          ),
        ) // staked
        tempArray.push(
          contract.callStatic.getMemberSynthWeight(
            synthArray[i].address,
            wallet.account,
          ),
        ) // synthWeight
        tempArray.push(
          contract.callStatic.getMemberLastSynthTime(
            synthArray[i].address,
            wallet.account,
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
        const synthContract = getSynthContract(synthArray[i].address, wallet)
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
    const varCount = 6
    for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
      synthDetails[i / varCount].balance = tempArray[i].toString()
      synthDetails[i / varCount].staked = tempArray[i + 1].toString()
      synthDetails[i / varCount].weight = tempArray[i + 2].toString()
      synthDetails[i / varCount].lastHarvest = tempArray[i + 3].toString()
      synthDetails[i / varCount].lpBalance = tempArray[i + 4].toString()
      synthDetails[i / varCount].lpDebt = tempArray[i + 5].toString()
    }
    dispatch(payloadToDispatch(Types.SYNTH_DETAILS, synthDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

// --------------------------------------- SYNTH Actions ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param {address} synth
 * @param {uint256} amount
 * @param {object} wallet
 * @returns {TBA} TBA
 */
export const synthDeposit = (synth, amount, wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)
  let provider = getWalletProvider(wallet?.ethereum)
  if (provider._isSigner === true) {
    provider = provider.provider
  }

  try {
    const gPrice = await getProviderGasPrice()
    let deposit = await contract.deposit(synth, amount, {
      gasPrice: gPrice,
    })
    deposit = await provider.waitForTransaction(deposit.hash, 1)
    dispatch(payloadToDispatch(Types.SYNTH_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Harvest synths from synthVault
 * @param {object} wallet
 * @returns {bool}
 */
export const synthHarvest = (wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const harvest = await contract.harvestAll({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.SYNTH_HARVEST, harvest))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Harvest a single synthetic stake position from synthVault
 * @param {address} synth
 * @param {object} wallet
 * @returns {bool}
 */
export const synthHarvestSingle = (synth, wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const harvestSingle = await contract.harvestSingle(synth, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.SYNTH_HARVEST_SINGLE, harvestSingle))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Withdraw synths from synthVault
 * @param {address} synth
 * @param {uint256} basisPoints
 * @param {object} wallet
 * @returns {uint256} withdrawAmount
 */
export const synthWithdraw = (synth, basisPoints, wallet) => async (
  dispatch,
) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const withdrawAmount = await contract.withdraw(synth, basisPoints, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.SYNTH_WITHDRAW_AMOUNT, withdrawAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}

/**
 * Deploy synthetic BEP20 asset
 * @param {address} token
 * @returns {address} synth
 */
export const createSynth = (token, wallet) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthFactoryContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const newSynth = await contract.createSynth(token, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.SYNTH_CREATE, newSynth))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, `${error}.`))
  }
}
