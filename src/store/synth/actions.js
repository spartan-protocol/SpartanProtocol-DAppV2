import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import {
  getRouterContract,
  getSynthContract,
  getSynthFactoryContract,
  getSynthVaultContract,
} from '../../utils/web3Contracts'
import { getAddresses, getProviderGasPrice, parseTxn } from '../../utils/web3'
import { calcSpotValueInBase, getPool } from '../../utils/math/utils'
import { BN } from '../../utils/bigNumber'

export const synthLoading = () => ({
  type: Types.SYNTH_LOADING,
})

// --------------------------------------- SYNTH Calls ---------------------------------------

/**
 * Get the global synth details
 * @returns {object} minimumDepositTime, totalWeight, erasToEarn, blockDelay, vaultClaim, stakedSynthLength
 */
export const getSynthGlobalDetails = (rpcUrls) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(null, rpcUrls)
  try {
    let awaitArray = [
      contract.callStatic.minimumDepositTime(),
      contract.callStatic.erasToEarn(),
      contract.callStatic.vaultClaim(),
      contract.callStatic.genesis(),
      // contract.callStatic.map30DVaultRevenue(),
      // contract.callStatic.mapPast30DVaultRevenue(),
      getSynthFactoryContract(null, rpcUrls).callStatic.synthCount(),
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
    dispatch(payloadToDispatch(Types.SYNTH_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the member's synth details
 * @returns depositTime
 */
export const getSynthMemberDetails = (wallet, rpcUrls) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthVaultContract(null, rpcUrls)
  try {
    let awaitArray = [contract.callStatic.mapMember_depositTime(wallet.account)]
    awaitArray = await Promise.all(awaitArray)
    const member = {
      depositTime: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.SYNTH_MEMBER_DETAILS, member))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the global synthMinting bool (from router)
 * @returns {bool} synthMinting
 */
export const getSynthMinting = (rpcUrls) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getRouterContract(rpcUrls)
  try {
    const synthMinting = await contract.callStatic.synthMinting()
    dispatch(payloadToDispatch(Types.SYNTH_MINTING, synthMinting))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the synth addresses and setup the object
 * @param tokenArray
 * @returns synthArray
 */
export const getSynthArray = (tokenArray, rpcUrls) => async (dispatch) => {
  dispatch(synthLoading())
  const addr = getAddresses()
  const contract = getSynthFactoryContract(null, rpcUrls)
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
      })
    }
    dispatch(payloadToDispatch(Types.SYNTH_ARRAY, synthArray))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}

/**
 * Get the synth details relevant to the member
 * @param synthArray @param wallet
 * @returns [synthDetails]
 */
export const getSynthDetails =
  (synthArray, wallet, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(wallet, rpcUrls)
    try {
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
            rpcUrls,
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
            rpcUrls,
          )
          tempArray.push(synthContract.callStatic.collateral()) // lpBalance
          tempArray.push(synthContract.callStatic.totalSupply()) // totalSupply / debt
        }
      }
      const synthDetails = synthArray
      tempArray = await Promise.all(tempArray)
      const varCount = 5
      for (let i = 0; i < tempArray.length - (varCount - 1); i += varCount) {
        synthDetails[i / varCount].balance = tempArray[i].toString()
        synthDetails[i / varCount].staked = tempArray[i + 1].toString()
        synthDetails[i / varCount].lastHarvest = tempArray[i + 2].toString()
        synthDetails[i / varCount].lpBalance = tempArray[i + 3].toString()
        synthDetails[i / varCount].totalSupply = tempArray[i + 4].toString()
      }
      dispatch(payloadToDispatch(Types.SYNTH_DETAILS, synthDetails))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

/**
 * Get the current synthVault's total weight
 * @param synthDetails @param poolDetails
 * @returns spartaWeight
 */
export const synthVaultWeight =
  (synthDetails, poolDetails, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(null, rpcUrls)
    try {
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
      dispatch(payloadToDispatch(Types.SYNTH_WEIGHT, totalWeight))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

// --------------------------------------- SYNTH Actions ---------------------------------------

/**
 * Deposit synths to synthVault
 * @param synth @param amount @param wallet
 */
export const synthDeposit =
  (synth, amount, wallet, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(wallet, rpcUrls)
    try {
      const gPrice = await getProviderGasPrice(rpcUrls)
      let txn = await contract.deposit(synth, amount, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthDeposit', rpcUrls)
      dispatch(payloadToDispatch(Types.SYNTH_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

/**
 * Harvest synths from synthVault
 * @param {array} synthArray @param wallet
 */
export const synthHarvest =
  (synthArray, wallet, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(wallet, rpcUrls)
    try {
      const gPrice = await getProviderGasPrice(rpcUrls)
      let txn = await contract.harvestAll(synthArray, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthHarvest', rpcUrls)
      dispatch(payloadToDispatch(Types.SYNTH_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

/**
 * Harvest a single synthetic stake position from synthVault
 * @param synth @param wallet
 */
export const synthHarvestSingle =
  (synth, wallet, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(wallet, rpcUrls)

    try {
      const gPrice = await getProviderGasPrice(rpcUrls)
      let txn = await contract.harvestSingle(synth, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'synthHarvest', rpcUrls)
      dispatch(payloadToDispatch(Types.SYNTH_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

/**
 * Withdraw synths from synthVault
 * @param synth @param basisPoints @param wallet
 * @returns withdrawAmount
 */
export const synthWithdraw =
  (synth, basisPoints, wallet, rpcUrls) => async (dispatch) => {
    dispatch(synthLoading())
    const contract = getSynthVaultContract(wallet, rpcUrls)
    try {
      const gPrice = await getProviderGasPrice(rpcUrls)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.withdraw(synth, basisPoints, ORs)
      txn = await parseTxn(txn, 'synthWithdraw', rpcUrls)
      dispatch(payloadToDispatch(Types.SYNTH_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
    }
  }

/**
 * Deploy synthetic BEP20 asset
 * @param token
 * @returns synth
 */
export const createSynth = (token, wallet, rpcUrls) => async (dispatch) => {
  dispatch(synthLoading())
  const contract = getSynthFactoryContract(wallet, rpcUrls)
  try {
    const gPrice = await getProviderGasPrice(rpcUrls)
    let txn = await contract.createSynth(token, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'createSynth', rpcUrls)
    dispatch(payloadToDispatch(Types.SYNTH_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.SYNTH_ERROR, error))
  }
}
