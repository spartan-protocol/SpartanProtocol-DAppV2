import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract } from '../../utils/web3Dao'

export const daoLoading = () => ({
  type: Types.DAO_LOADING,
})

// --------------------------------------- GENERAL DAO HELPERS (DO TESTS) ---------------------------------------

// Returns the amount of members with LP tokens locked in the DAO
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

// Returns a specified member's details
// .isMember .weight .lastBlock .poolsCount
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

// Returns the total weight in the DAO
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

// Returns the member's weight in the DAO
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

// Get the current harvestable amount of SPARTA from Lock+Earn
// Uses getDaoHarvestEraAmount() but works out what portion of an era/s the member can claim
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

// Get the member's current harvest share of the DAO (per era)
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

// --------------------------------------- GENERAL DAO FUNCTIONS (DONT DO TESTS) ---------------------------------------

// DAO - Deposit LP Tokens (Lock in DAO)
export const daoDeposit = (pool, amount, justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let deposit = {}
    if (justCheck === true) {
      deposit = await contract.callStatic.harvest()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.harvest()
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

// DAO - Withdraw LP Tokens (From DAO)
export const daoWithdraw = (pool, justCheck) => async (dispatch) => {
  // ADD 'amount' IN V2 CONTRACTS
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let withdraw = {}
    if (justCheck === true) {
      withdraw = await contract.callStatic.harvest()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.harvest()
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

// DAO - Harvest SPARTA rewards (currently no emissions going in to fill-up, but later; probably 10% of emissions will go in)
export const daoHarvest = (justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let harvest = {}
    if (justCheck === true) {
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

//= ============================= DAO PROPOSAL HELPERS ================================//

// Wait for V2 contracts

//= ============================= DAO PROPOSAL FUNCTIONS ================================//

// Wait for V2 contracts
