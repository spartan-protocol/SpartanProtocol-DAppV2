import * as Types from './types'
import { getBondContract, getOldBondContract } from '../../utils/web3Bond'
import { getSpartaContract } from '../../utils/web3Sparta'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getProviderGasPrice, getAddresses } from '../../utils/web3'

const addr = getAddresses()

export const bondLoading = () => ({
  type: Types.BOND_LOADING,
})

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

export const getBondListed = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondListed = await contract.callStatic.allListedAssets()
    dispatch(payloadToDispatch(Types.GET_BOND_LISTED, bondListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondListedAsset = (asset) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const isListed = await contract.callStatic.isListed(asset)
    dispatch(payloadToDispatch(Types.GET_BOND_LISTED_ASSET, isListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondClaimable = (bondAddress, member, asset) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getOldBondContract(bondAddress)

  try {
    const bondClaimable = await contract.callStatic.calcClaimBondedLP(
      member,
      asset,
    )
    dispatch(payloadToDispatch(Types.GET_BOND_CLAIMABLE, bondClaimable))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get a bond members' details
 * @param {address} member
 * @param {address} asset
 * @returns {object} isMember, bondedLP, claimRate, lastBlockTime
 */
export const getBondMemberDetails = (bondAddress, member, asset) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getOldBondContract(bondAddress)

  try {
    const memberDetails = await contract.callStatic.getMemberDetails(
      member,
      asset,
    )
    dispatch(payloadToDispatch(Types.GET_BOND_MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondSpartaRemaining = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getSpartaContract()

  try {
    const bondSpartaRemaining = await contract.callStatic.balanceOf(addr.bond)
    dispatch(
      payloadToDispatch(Types.GET_BOND_SPARTA_REMAINING, bondSpartaRemaining),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondBurnReady = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondBurnReady = await contract.callStatic.balanceOf(addr.bond)
    dispatch(payloadToDispatch(Types.GET_BOND_BURN_READY, bondBurnReady))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get a count of all bond-listed assets
 * @returns {uint256} count
 */
export const getBondListedCount = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondListedCount = await contract.callStatic.assetListedCount()

    dispatch(payloadToDispatch(Types.GET_BOND_LISTED_COUNT, bondListedCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get a count of all bond members
 * @returns {uint256} count
 */
export const getBondMemberCount = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const memberCount = await contract.callStatic.memberCount()

    dispatch(payloadToDispatch(Types.GET_BOND_MEMBER_COUNT, memberCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Get an array of all bond members
 * @returns {address} array all members
 */
export const getBondMembers = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const members = await contract.callStatic.allMembers()

    dispatch(payloadToDispatch(Types.GET_BOND_MEMBERS, members))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

// --------------------------------------- BOND+MINT FUNCTIONS ---------------------------------------

export const bondBurn = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.burnBond()
    const bondBurned = await contract.burnBond({
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_BURN, bondBurned))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Deposit asset via bond+mint contract
 * @param {address} asset
 * @param {uint256} amount
 * @returns {boolean}
 */
export const bondDeposit = (asset, amount) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.deposit(asset, amount)
    const deposit = await contract.deposit(asset, amount, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Claim all available bond by member
 * @param {address} member
 * @returns {boolean}
 */
export const bondClaimAll = (member) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimAllForMember(member)
    const bondClaimedAll = await contract.claimAllForMember(member, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ALL, bondClaimedAll))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Claim bond by asset & member
 * @param {address} asset
 * @param {address} member
 * @returns {boolean}
 */
export const bondClaimAsset = (asset, member) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimForMember(asset, member)
    const bondClaimed = await contract.claimForMember(asset, member, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ASSET, bondClaimed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}
