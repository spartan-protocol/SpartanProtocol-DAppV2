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
 * Get a sparta allocation remaining for bond (held in the dao address)
 * @returns {uint} spartaRemaining
 */
export const bondSpartaRemaining = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getTokenContract(getAddresses().spartav2, wallet)

  try {
    const spartaRemaining = await contract.callStatic.balanceOf(
      getAddresses().dao,
    )
    dispatch(
      payloadToDispatch(
        Types.BOND_SPARTA_REMAINING,
        spartaRemaining.toString(),
      ),
    )
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
 * Get a bond members weight
 * @returns {uint} count
 */
export const getMemberWeight = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondVaultContract(wallet)

  try {
    const memberWeight = await contract.callStatic.getMemberWeight()
    dispatch(payloadToDispatch(Types.BOND_MEMBER_WEIGHT, memberWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

// --------------------------------------- BOND MEMBER+ASSET SCOPE ---------------------------------------

/**
 * Get a bond members' details
 * @param {object} wallet
 * @param {array} assetArray
 * @returns {object} isMember, bondedLP, claimRate, lastBlockTime
 */
export const getBondMemberDetails = (wallet, assetArray) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const addr = getAddresses()
  const contract = getBondVaultContract(wallet)
  const awaitArray = []
  for (let i = 0; i < assetArray.length; i++) {
    if (
      assetArray[i].tokenAddress !== addr.spartav1 &&
      assetArray[i].tokenAddress !== addr.spartav2
    ) {
      awaitArray.push(
        contract.callStatic.getMemberDetails(
          wallet.account,
          assetArray[i].tokenAddress,
        ),
      )
    }
  }

  try {
    const memberDetails = await Promise.all(awaitArray)
    dispatch(payloadToDispatch(Types.BOND_MEMBER_DETAILS, memberDetails))
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
export const bond = (asset, amount, wallet) => async (dispatch) => {
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
 * @param {address} member
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
