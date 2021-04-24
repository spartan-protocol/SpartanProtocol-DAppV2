import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoVaultContract } from '../../utils/web3Contracts'

export const daoVaultLoading = () => ({
  type: Types.DAOVAULT_LOADING,
})

// --------------------------------------- GENERAL DAO HELPERS ---------------------------------------

/**
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
 * Returns the member's weight in the DAO
 * @returns unit
 */
export const getDaoVaultMemberWeight = (member) => async (dispatch) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    const memberWeight = await contract.callStatic.getMemberWeight(member)
    dispatch(payloadToDispatch(Types.GET_DAOVAULT_MEMBER_WEIGHT, memberWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}
