import * as Types from './types'
import {
  getBondVaultContract,
  getDaoContract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses, getProviderGasPrice, parseTxn } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

export const bondLoading = () => ({
  type: Types.BOND_LOADING,
})

/**
 * Get the global bond details *VIEW*
 * @returns globalDetails
 */
export const bondGlobalDetails = () => async (dispatch) => {
  dispatch(bondLoading())
  const addr = getAddresses()
  const contract = getSpartaV2Contract()
  try {
    let awaitArray = []
    awaitArray.push(contract ? contract.callStatic.balanceOf(addr?.dao) : '0')
    awaitArray = await Promise.all(awaitArray)
    const global = {
      spartaRemaining: awaitArray[0].toString(), // Bond allocation left
    }
    dispatch(payloadToDispatch(Types.BOND_GLOBAL, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get the member bond details *VIEW*
 * @param listedPools @param wallet
 * @returns bondDetails
 */
export const getBondDetails = (listedPools, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract()
  try {
    let awaitArray = []
    for (let i = 0; i < listedPools.length; i++) {
      if (!wallet.account || listedPools[i].baseAmount <= 0) {
        awaitArray.push({
          isMember: false,
          bondedLP: '0',
          claimRate: '0',
          lastBlockTime: '0',
        })
      } else {
        awaitArray.push(
          contract.callStatic.getMemberDetails(
            wallet.account,
            listedPools[i].address,
          ),
        )
      }
    }
    awaitArray = await Promise.all(awaitArray)
    const bondDetails = []
    for (let i = 0; i < awaitArray.length; i++) {
      bondDetails.push({
        tokenAddress: listedPools[i].tokenAddress,
        address: listedPools[i].address,
        isMember: awaitArray[i].isMember,
        staked: awaitArray[i].bondedLP.toString(),
        claimRate: awaitArray[i].claimRate.toString(),
        lastBlockTime: awaitArray[i].lastBlockTime.toString(),
      })
    }
    dispatch(payloadToDispatch(Types.BOND_DETAILS, bondDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get the current bondVault's total weight *VIEW*
 * @param poolDetails
 * @returns spartaWeight
 */
export const bondVaultWeight = (poolDetails) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract()
  try {
    let totalWeight = BN(0)
    const vaultPools = poolDetails.filter((x) => x.curated && !x.hide)
    if (vaultPools.length > 0) {
      const awaitArray = []
      for (let i = 0; i < vaultPools.length; i++) {
        awaitArray.push(
          contract.callStatic.mapTotalPool_balance(vaultPools[i].address),
        )
      }
      const totalBonded = await Promise.all(awaitArray)
      for (let i = 0; i < totalBonded.length; i++) {
        totalWeight = totalWeight.plus(
          getPoolShareWeight(
            totalBonded[i].toString(),
            vaultPools[i].poolUnits,
            vaultPools[i].baseAmount,
          ),
        )
      }
    }
    dispatch(payloadToDispatch(Types.BOND_TOTAL_WEIGHT, totalWeight.toString()))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get all current bond listed assets *VIEW*
 * @returns count
 */
export const allListedAssets = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract()
  try {
    const listedAssets = await contract.callStatic.getBondedAssets()
    dispatch(payloadToDispatch(Types.BOND_LISTED_ASSETS, listedAssets))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Perform a Bond txn; mints LP tokens and stakes them in the BondVault (Called via DAO contract) *STATE*
 * @param tokenAddr @param amount @param wallet
 */
export const bondDeposit = (tokenAddr, amount, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const _value = tokenAddr === getAddresses().bnb ? amount : null
    const ORs = { value: _value, gasPrice: gPrice }
    let txn = await contract.bond(tokenAddr, amount, ORs)
    txn = await parseTxn(txn, 'bondDeposit')
    dispatch(payloadToDispatch(Types.BOND_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Claim a Bond assets by poolAddress *STATE*
 * @param tokenAddr @param wallet
 */
export const claimBond = (tokenAddr, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.claim(tokenAddr, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'bondClaim')
    dispatch(payloadToDispatch(Types.BOND_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}
