import * as Types from './types'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoVaultContract } from '../../utils/web3Contracts'

export const daoVaultLoading = () => ({
  type: Types.DAOVAULT_LOADING,
})

// --------------------------------------- DAO VAULT Calls ---------------------------------------

/**
 * Get the global dao vault details
 * @returns {object} totalWeight
 */
export const getDaoGlobalDetails = () => async (dispatch) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    let awaitArray = [contract.callStatic.totalWeight()]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      totalWeight: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}

/**
 * Get the dao vault member details
 * @returns {object} weight
 */
export const getDaoMemberDetails = (member) => async (dispatch) => {
  dispatch(daoVaultLoading())
  const contract = getDaoVaultContract()

  try {
    let awaitArray = [contract.callStatic.getMemberWeight(member)]
    awaitArray = await Promise.all(awaitArray)
    const memberDetails = {
      weight: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAOVAULT_ERROR, error))
  }
}
