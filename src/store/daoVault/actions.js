import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoVaultContract } from '../../utils/web3Dao'

export const daoVaultLoading = () => ({
  type: Types.DAOVAULT_LOADING,
})

// --------------------------------------- GENERAL DAO HELPERS ---------------------------------------

/**
 * Check members weight in particular pool
 * @param {address} member
 * @param {address} poolAddr?
 * @returns {boolean} memberPoolWeight
 */
export const getDaoVaultMemberPoolWeight = (member, poolAddr) => async (
  dispatch,
) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    const memberPoolWeight = await contract.callStatic.isMember(
      member,
      poolAddr,
    )
    dispatch(
      payloadToDispatch(
        Types.GET_DAOVAULT_MEMBER_POOL_WEIGHT,
        memberPoolWeight,
      ),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Returns the total weight in the DAO
 * @returns unit
 */
export const getDaoVaultTotalWeight = () => async (dispatch) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    const daoTotalWeight = await contract.callStatic.totalWeight()
    dispatch(payloadToDispatch(Types.GET_DAOVAULT_TOTAL_WEIGHT, daoTotalWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Returns the member's weight in the DAO
 * @returns unit
 */
export const getDaoVaultMemberWeight = (member) => async (dispatch) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    const memberWeight = await contract.callStatic.mapMember_weight(member)
    dispatch(payloadToDispatch(Types.GET_DAOVAULT_MEMBER_WEIGHT, memberWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}
