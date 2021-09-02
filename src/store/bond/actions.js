import * as Types from './types'
import {
  getBondVaultContract,
  getDaoContract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses, getProviderGasPrice } from '../../utils/web3'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

export const bondLoading = () => ({
  type: Types.BOND_LOADING,
})

// --------------------------------------- BOND GLOBAL SCOPE ---------------------------------------

/**
 * Get the global bond details
 * @returns {object} globalDetails
 */
export const bondGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const addr = getAddresses()
  const contract = getSpartaV2Contract(wallet)
  const bondContract = getBondVaultContract(wallet)
  try {
    let awaitArray = []
    awaitArray.push(contract ? contract.callStatic.balanceOf(addr?.dao) : '0')
    awaitArray.push(bondContract ? bondContract.callStatic.totalWeight() : '0') // remove after next testnet deploy
    awaitArray = await Promise.all(awaitArray)
    const global = {
      spartaRemaining: awaitArray[0].toString(), // Bond allocation left
      weight: awaitArray[1].toString(), // BondVault totalWeight // remove after next testnet deploy
    }
    dispatch(payloadToDispatch(Types.BOND_GLOBAL, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get the current bondVault's total weight
 * @param {[string]} poolDetails @param {object} wallet
 * @returns {number} spartaWeight
 */
export const bondVaultWeight = (poolDetails, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract(wallet)
  try {
    const vaultPools = poolDetails.filter((x) => x.curated === true)
    if (vaultPools.length > 0) {
      const awaitArray = []
      for (let i = 0; i < vaultPools.length; i++) {
        awaitArray.push(
          contract.callStatic.mapTotalPool_balance(vaultPools[i].address),
        )
      }
      const totalBonded = await Promise.all(awaitArray)
      let totalWeight = BN(0)
      for (let i = 0; i < totalBonded.length; i++) {
        totalWeight = totalWeight.plus(
          getPoolShareWeight(
            totalBonded[i],
            vaultPools[i].poolUnits,
            vaultPools[i].baseAmount,
          ),
        )
      }
      dispatch(payloadToDispatch(Types.BOND_TOTAL_WEIGHT, totalWeight))
    }
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get all current bond listed assets
 * @returns {number} count
 */
export const allListedAssets = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const listedAssets = await contract.callStatic.allListedAssets()
    dispatch(payloadToDispatch(Types.BOND_LISTED_ASSETS, listedAssets))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

// --------------------------------------- BOND MEMBER SCOPE ---------------------------------------

/**
 * Get the bond member details *** DELETE THIS AFTER NEXT TESTNET ***
 * @returns {object} memberDetails
 */
export const bondMemberDetails = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract(wallet)
  try {
    let awaitArray = [contract.callStatic.getMemberWeight(wallet.account)]
    awaitArray = await Promise.all(awaitArray)
    const member = {
      weight: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.BOND_MEMBER, member))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

// --------------------------------------- BOND FUNCTIONS ---------------------------------------

/**
 * Perform a Bond txn; mints LP tokens and stakes them in the BondVault (Called via DAO contract)
 * @param {string} tokenAddr @param {number} amount @param {object} wallet
 * @returns {boolean}
 */
export const bondDeposit = (tokenAddr, amount, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value: tokenAddr === getAddresses().bnb ? amount : null,
      gasPrice: gPrice,
    }
    const deposit = await contract.bond(tokenAddr, amount, ORs)
    dispatch(payloadToDispatch(Types.BOND_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Claim an array of Bond assets by poolAddresses
 * @param {object} wallet
 * @returns {boolean}
 */
export const claimBond = (bondAssets, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const bondClaim = await contract.claimAll(bondAssets, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.BOND_CLAIM, bondClaim))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}
