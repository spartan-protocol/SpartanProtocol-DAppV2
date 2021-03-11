import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract } from '../../utils/web3Dao'

export const daoLoading = () => ({
  type: Types.DAO_LOADING,
})

// --------------------------------------- GENERAL DAO HELPERS ---------------------------------------

/**
 * DAO HELPER -
 * Returns the amount of members with LP tokens locked in the DAO
 * @returns unit
 */
export const getDaoMemberCount = () => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const memberCount = await contract.callStatic.memberCount()
    dispatch(payloadToDispatch(Types.GET_DAO_MEMBER_COUNT, memberCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Returns a specified member's details:
 * @returns [ isMember | weight | totalFees | lastBlock | poolsCount ]
 */
export const getDaoMemberDetails = (member) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const memberDetails = await contract.callStatic.getMemberDetails(member)
    dispatch(payloadToDispatch(Types.GET_DAO_MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Returns the total weight in the DAO
 * @returns unit
 */
export const getDaoTotalWeight = () => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const daoTotalWeight = await contract.callStatic.totalWeight()
    dispatch(payloadToDispatch(Types.GET_DAO_TOTAL_WEIGHT, daoTotalWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Returns the member's weight in the DAO
 * @returns unit
 */
export const getDaoMemberWeight = (member) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const memberWeight = await contract.callStatic.mapMember_weight(member)
    dispatch(payloadToDispatch(Types.GET_DAO_MEMBER_WEIGHT, memberWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Get the current harvestable amount of SPARTA from Lock+Earn
 * Uses getDaoHarvestEraAmount() but works out what portion of an era/s the member can claim
 * @returns unit
 */
export const getDaoHarvestAmount = (member) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const harvestAmount = await contract.callStatic.calcCurrentReward(member)
    dispatch(payloadToDispatch(Types.GET_DAO_HARVEST_AMOUNT, harvestAmount))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO HELPER -
 * Get the member's current harvest share of the DAO (per era)
 * @returns unit
 */
export const getDaoHarvestEraAmount = (member) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const harvestEraAmount = await contract.callStatic.calcReward(member)
    dispatch(
      payloadToDispatch(Types.GET_DAO_HARVEST_ERA_AMOUNT, harvestEraAmount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

// --------------------------------------- GENERAL DAO FUNCTIONS ---------------------------------------

/**
 * DAO FUNCTION -
 * Deposit / Stake LP Tokens (Lock them in the DAO)
 * @return null
 */
export const daoDeposit = (pool, amount, justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let deposit = {}
    if (justCheck) {
      deposit = await contract.callStatic.deposit()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.deposit()
      deposit = await contract.deposit(pool, amount, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.DAO_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO FUNCTION -
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 * @return null
 */
export const daoWithdraw = (pool, justCheck) => async (dispatch) => {
  // ADD 'amount' IN V2 CONTRACTS
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let withdraw = {}
    if (justCheck) {
      withdraw = await contract.callStatic.withdraw()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.withdraw()
      withdraw = await contract.withdraw(pool, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.DAO_WITHDRAW, withdraw))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * DAO FUNCTION -
 * Harvest SPARTA 'staking' rewards
 * (currently no emissions going in to fill this up, but later; probably 10% of emissions will go in)
 * @return null
 */
export const daoHarvest = (justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let harvest = {}
    if (justCheck) {
      harvest = await contract.callStatic.harvest()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.harvest()
      harvest = await contract.harvest({
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    dispatch(payloadToDispatch(Types.DAO_HARVEST, harvest))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

//= ============================= DAO PROPOSAL HELPERS ADD THIS AS NEW STORE 'daoProposals' ================================//

// Wait for V2 contracts

//= ============================= DAO PROPOSAL FUNCTIONS ADD THIS AS NEW STORE 'daoProposals'  ================================//

// Wait for V2 contracts
