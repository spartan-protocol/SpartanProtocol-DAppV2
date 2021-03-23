import * as Types from './types'
import { getProviderGasPrice } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract } from '../../utils/web3Dao'

export const daoLoading = () => ({
  type: Types.DAO_LOADING,
})

// --------------------------------------- GENERAL DAO HELPERS ---------------------------------------

/**
 * Get the count of DAO members
 * @returns {unit} dao
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
 * Get the dao members' details
 * @param {address} member
 * @returns {object} isMember, weight, lastBlock, poolCount
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
 * Deposit / Stake LP Tokens (Lock them in the DAO)
 * @param {address} pool
 * @param {uint256} amount
 */
export const daoDeposit = (pool, amount, justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let deposit = {}
    if (justCheck) {
      deposit = await contract.callStatic.deposit(pool, amount)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.deposit(pool, amount)
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
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 * @param {address} pool
 * @param {uint} amount
 */
export const daoWithdraw = (pool, amount, justCheck) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let withdraw = {}
    if (justCheck) {
      withdraw = await contract.callStatic.withdraw(pool, amount)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.withdraw(pool, amount)
      withdraw = await contract.withdraw(pool, amount, {
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
 * Harvest SPARTA 'staking' rewards
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

/**
 * Check if proposal has at least the majority of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalMajority = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const majority = await contract.callStatic.hasMajority(proposalID)
    dispatch(payloadToDispatch(Types.GET_DAO_PROPOSAL_MAJORITY, majority))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Check if proposal has at least the quorum of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalQuorum = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const quorum = await contract.callStatic.hasQuorum(proposalID)
    dispatch(payloadToDispatch(Types.GET_DAO_PROPOSAL_QUORUM, quorum))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Check if proposal has at least the minorty of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalMinority = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const minorty = await contract.callStatic.hasMinority(proposalID)
    dispatch(payloadToDispatch(Types.GET_DAO_PROPOSAL_MINORITY, minorty))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the dao proposal details
 * @param {uint} proposalID
 * @returns {object} id, proposalType, votes, timeStart, finalising, finalised, param, proposedAddress
 */
export const getDaoProposalDetails = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const proposalDetails = await contract.callStatic.getProposalDetails(
      proposalID,
    )
    dispatch(payloadToDispatch(Types.GET_DAO_PROPOSAL_DETAILS, proposalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the dao grant proposal details
 * @param {uint} proposalID
 * @returns {object} id, proposalType, votes, timeStart, finalising, finalised, param, proposedAddress
 */
export const getDaoGrantDetails = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const grantDetails = await contract.callStatic.getGrantDetails(proposalID)
    dispatch(payloadToDispatch(Types.GET_DAO_GRANT_DETAILS, grantDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New action proposal
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewAction = (typeStr) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newActionProposal(typeStr)
    const proposalID = await contract.newActionProposal(typeStr, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_NEW_ACTION, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New parameter proposal
 * @param {uint32} param
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewParam = (param, typeStr) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newParamProposal(param, typeStr)
    const proposalID = await contract.newParamProposal(param, typeStr, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_NEW_PARAM, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New address proposal
 * @param {address} proposedAddress
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewAddress = (proposedAddress, typeStr) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newAddressProposal(
      proposedAddress,
      typeStr,
    )
    const proposalID = await contract.newAddressProposal(
      proposedAddress,
      typeStr,
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_NEW_ADDRESS, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New grant proposal
 * @param {address} recipient
 * @param {uint} amount
 * @returns {unit} proposalID
 */
export const daoProposalNewGrant = (recipient, amount) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newGrantProposal(
      recipient,
      amount,
    )
    const proposalID = await contract.newGrantProposal(recipient, amount, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_NEW_GRANT, proposalID))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Vote for a proposal
 * @param {uint} proposalID
 * @returns {unit} voteWeight
 */
export const daoProposalVote = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.voteProposal(proposalID)
    const voteWeight = await contract.voteProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_VOTE, voteWeight))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Remove your vote from a proposal
 * @param {uint} proposalID
 * @returns {unit} voteWeightRemoved
 */
export const daoProposalRemoveVote = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas._removeVote(proposalID)
    const voteWeightRemoved = await contract._removeVote(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(
      payloadToDispatch(Types.DAO_PROPOSAL_REMOTE_VOTE, voteWeightRemoved),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Cancel a proposal (replace)
 * Old + New proposal must be same type
 * Old proposal must be in 'finalising' stage
 * New proposal must have at least minority weight
 * @param {uint} oldProposalID
 * @param {uint} newProposalID
 */
export const daoProposalCancel = (oldProposalID, newProposalID) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.cancelProposal(
      oldProposalID,
      newProposalID,
    )
    const proposal = await contract.cancelProposal(
      oldProposalID,
      newProposalID,
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )
    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_CANCEL, proposal))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Finalise a proposal
 * Must be past cool-off & in finalising stage
 * @param {uint} oldProposalID
 */
export const daoProposalFinalise = (proposalID) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.finaliseProposal(proposalID)
    const proposal = await contract.finaliseProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.DAO_PROPOSAL_FINALISE, proposal))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}
