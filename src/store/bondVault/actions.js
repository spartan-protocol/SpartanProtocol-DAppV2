import * as Types from './types'
import { getBondVaultContract } from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getAddresses } from '../../utils/web3'

export const bondVaultLoading = () => ({
  type: Types.BONDVAULT_LOADING,
})

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

/**
 * Get a bond members' details
 * @param {address} member
 * @param {array} assetArray
 * @returns {object} isMember, bondedLP, claimRate, lastBlockTime
 */
export const getBondVaultMemberDetails = (member, assetArray) => async (
  dispatch,
) => {
  dispatch(bondVaultLoading())
  const addr = getAddresses()
  const contract = getBondVaultContract()
  const awaitArray = []
  for (let i = 0; i < assetArray.length; i++) {
    // console.log(assetArray[i].tokenAddress)
    if (assetArray[i].tokenAddress !== addr.sparta) {
      awaitArray.push(
        contract.callStatic.getMemberDetails(
          member,
          assetArray[i].tokenAddress,
        ),
      )
    }
  }

  try {
    const memberDetails = await Promise.all(awaitArray)
    dispatch(
      payloadToDispatch(Types.GET_BONDVAULT_MEMBER_DETAILS, memberDetails),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BONDVAULT_ERROR, error))
  }
}
