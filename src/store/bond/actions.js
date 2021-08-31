import * as Types from './types'
import {
  getBondVaultContract,
  getDaoContract,
  getSpartaV2Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses, getProviderGasPrice } from '../../utils/web3'

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
    awaitArray.push(bondContract ? bondContract.callStatic.totalWeight() : '0')
    awaitArray = await Promise.all(awaitArray)
    const global = {
      spartaRemaining: awaitArray[0].toString(), // Bond allocation left
      weight: awaitArray[1].toString(), // BondVault totalWeight
    }
    dispatch(payloadToDispatch(Types.BOND_GLOBAL, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get a bond listed assets
 * @returns {uint} count
 */
export const allListedAssets = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)

  try {
    const historyBonded = await contract.callStatic.allListedAssets()
    let awaitArray = []
    for (let i = 0; i < historyBonded.length; i++) {
      awaitArray.push(contract.isListed(historyBonded[i]))
    }
    awaitArray = await Promise.all(awaitArray)
    const listedAssets = []
    for (let i = 0; i < historyBonded.length; i++) {
      if (awaitArray[i]) {
        listedAssets.push(historyBonded[i])
      }
    }
    dispatch(payloadToDispatch(Types.BOND_LISTED_ASSETS, listedAssets))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

// --------------------------------------- BOND MEMBER SCOPE ---------------------------------------

/**
 * Get the bond member details
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
 * @param {address} asset
 * @param {uint256} amount
 * @param {object} wallet
 * @returns {boolean}
 */
export const bondDeposit = (asset, amount, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const ORs = {
      value: asset === getAddresses().bnb ? amount : null,
      gasPrice: gPrice,
    }
    const deposit = await contract.bond(asset, amount, ORs)
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
