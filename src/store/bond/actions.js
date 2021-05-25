import * as Types from './types'
import {
  getBondVaultContract,
  getDaoContract,
  getTokenContract,
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
  const contract = getTokenContract(addr.spartav2, wallet)
  const bondContract = getBondVaultContract(wallet)

  try {
    let awaitArray = [
      contract.callStatic.balanceOf(addr.dao),
      bondContract.callStatic.totalWeight(),
    ]
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
    const listedAssets = await contract.callStatic.allListedAssets()
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
 * Deposit asset via bond+mint contract
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
 * Claim bond by asset
 * @param {address} asset
 * @returns {boolean}
 */
export const claimForMember = (asset, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const bondClaim = await contract.claimForMember(asset, {
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM, bondClaim))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Claim all available bond by member
 * @param {object} wallet
 * @returns {boolean}
 */
export const claimAllForMember = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const bondClaimAll = await contract.claimAllForMember(wallet.account, {
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ALL, bondClaimAll))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}
