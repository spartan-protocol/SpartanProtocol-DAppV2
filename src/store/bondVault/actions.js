import * as Types from './types'
import { getBondVaultContract } from '../../utils/web3Bond'
import { payloadToDispatch, errorToDispatch } from '../helpers'
// import { getAddresses } from '../../utils/web3'

// const addr = getAddresses()

export const bondVaultLoading = () => ({
  type: Types.BONDVAULT_LOADING,
})

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

/**
 * Get a bond members' details
 * @param {address} member
 * @param {address} asset
 * @returns {object} isMember, bondedLP, claimRate, lastBlockTime
 */
export const getBondVaultMemberDetails = (member, asset) => async (
  dispatch,
) => {
  dispatch(bondVaultLoading())
  const contract = getBondVaultContract()

  try {
    const memberDetails = await contract.callStatic.getMemberDetails(
      member,
      asset,
    )
    dispatch(
      payloadToDispatch(Types.GET_BONDVAULT_MEMBER_DETAILS, memberDetails),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BONDVAULT_ERROR, error))
  }
}
