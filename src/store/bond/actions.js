import * as Types from './types'
import {
  getBondContract,
  getOldBondContract,
  getSpartaV1Contract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getProviderGasPrice, getAddresses } from '../../utils/web3'

const addr = getAddresses()

export const bondLoading = () => ({
  type: Types.BOND_LOADING,
})

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

export const getBondListed = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const bondListed = await contract.callStatic.allListedAssets()
    dispatch(payloadToDispatch(Types.BOND_LISTED, bondListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

export const getBondListedAsset = (asset, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const isListed = await contract.callStatic.isListed(asset)
    dispatch(payloadToDispatch(Types.BOND_LISTED_ASSET, isListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

export const getBondClaimable = (bondAddress, wallet, asset) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getOldBondContract(bondAddress, wallet)

  try {
    const bondClaimable = await contract.callStatic.calcClaimBondedLP(
      wallet.account,
      asset,
    )
    dispatch(payloadToDispatch(Types.BOND_CLAIMABLE, bondClaimable))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

export const getBondSpartaRemaining = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getSpartaV1Contract(wallet)

  try {
    let bondSpartaRemaining = await contract.callStatic.balanceOf(addr.bond)
    bondSpartaRemaining = bondSpartaRemaining.toString()
    dispatch(
      payloadToDispatch(Types.BOND_SPARTA_REMAINING, bondSpartaRemaining),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

export const getBondBurnReady = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const bondBurnReady = await contract.callStatic.balanceOf(addr.bond)
    dispatch(payloadToDispatch(Types.BOND_BURN_READY, bondBurnReady))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get a count of all bond-listed assets
 * @returns {uint256} count
 */
export const getBondListedCount = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const bondListedCount = await contract.callStatic.assetListedCount()

    dispatch(payloadToDispatch(Types.BOND_LISTED_COUNT, bondListedCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get a count of all bond members
 * @returns {uint256} count
 */
export const getBondMemberCount = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const memberCount = await contract.callStatic.memberCount()

    dispatch(payloadToDispatch(Types.BOND_MEMBER_COUNT, memberCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Get an array of all bond members
 * @returns {address} array all members
 */
export const getBondMembers = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const members = await contract.callStatic.allMembers()

    dispatch(payloadToDispatch(Types.BOND_MEMBERS, members))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

// --------------------------------------- BOND+MINT FUNCTIONS ---------------------------------------

export const bondBurn = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    // const gLimit = await contract.estimateGas.burnBond()
    const bondBurned = await contract.burnBond({
      gasPrice: gPrice,
      // gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_BURN, bondBurned))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Deposit asset via bond+mint contract
 * @param {address} asset
 * @param {uint256} amount
 * @returns {boolean}
 */
export const bondDeposit = (asset, amount, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    // const gLimit = await contract.estimateGas.deposit(asset, amount)
    const deposit = await contract.deposit(asset, amount, {
      value:
        asset === '0x0000000000000000000000000000000000000000' ? amount : null,
      gasPrice: gPrice,
      // gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Claim all available bond by member
 * @param {address} member
 * @returns {boolean}
 */
export const bondClaimAll = (wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const bondClaimedAll = await contract.claimAllForMember(wallet.account, {
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ALL, bondClaimedAll))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}

/**
 * Claim bond by asset
 * @param {address} assetAddr
 * @returns {boolean}
 */
export const bondClaim = (assetAddr, wallet) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const bondClaimed = await contract.claimForMember(assetAddr, {
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM, bondClaimed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, `${error}.`))
  }
}
