import * as Types from './types'
import { getProviderGasPrice, getWalletProvider } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract, getDaoVaultContract } from '../../utils/web3Contracts'

export const daoLoading = () => ({
  type: Types.DAO_LOADING,
})

// --------------------------------------- FINAL DAO ACTIONS BELOW ---------------------------------------

/**
 * Get the global daoVault details
 * @returns {object} globalDetails
 */
export const daoGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoVaultContract(wallet)
  const daoContract = getDaoContract(wallet)

  try {
    let awaitArray = [
      contract.callStatic.totalWeight(),
      daoContract.callStatic.memberCount(),
      daoContract.callStatic.erasToEarn(),
      daoContract.callStatic.daoClaim(),
      daoContract.callStatic.secondsPerEra(),
      daoContract.callStatic.proposalCount(),
      daoContract.callStatic.coolOffPeriod(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const global = {
      totalWeight: awaitArray[0].toString(), // Dao totalWeight
      memberCount: awaitArray[1].toString(), // Dao memberCount
      erasToEarn: awaitArray[2].toString(), // Dao erasToEarn
      daoClaim: awaitArray[3].toString(), // Dao daoClaim
      secondsPerEra: awaitArray[4].toString(), // Dao secondsPerEra
      proposalCount: awaitArray[5].toString(), // Dao proposalCount
      coolOffPeriod: awaitArray[6].toString(), // Dao coolOffPeriod
    }
    dispatch(payloadToDispatch(Types.DAO_GLOBAL_DETAILS, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Get the daoVault member details
 * @returns {object} weight
 */
export const daoMemberDetails = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  const dvContract = getDaoVaultContract(wallet)

  try {
    let awaitArray = [
      contract.callStatic.isMember(wallet.account),
      dvContract.callStatic.getMemberWeight(wallet.account),
      contract.callStatic.mapMember_lastTime(wallet.account),
    ]
    awaitArray = await Promise.all(awaitArray)
    const member = {
      isMember: awaitArray[0],
      weight: awaitArray[1].toString(),
      lastHarvest: awaitArray[2].toString(),
    }
    dispatch(payloadToDispatch(Types.DAO_MEMBER_DETAILS, member))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Get all the dao proposal details
 * @param {uint} count
 * @param {object} wallet
 * @returns {object}
 */
export const daoProposalDetails = (proposalCount, wallet) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    if (proposalCount > 0) {
      const awaitArray = []
      for (let i = 1; i <= proposalCount; i++) {
        awaitArray.push(contract.callStatic.getProposalDetails(i))
        awaitArray.push(
          wallet.account
            ? contract.callStatic.mapPIDMember_votes(i, wallet.account)
            : '0',
        )
      }
      const proposalArray = await Promise.all(awaitArray)
      const proposal = []
      const varCount = 2
      for (
        let i = 0;
        i < proposalArray.length - (varCount - 1);
        i += varCount
      ) {
        proposal.push({
          id: proposalArray[i].id.toString(),
          proposalType: proposalArray[i].proposalType,
          votes: proposalArray[i].votes.toString(),
          startTime: proposalArray[i].startTime.toString(), // timestamp of proposal genesis
          coolOffTime: proposalArray[i].coolOffTime.toString(), // timestamp of coolOff
          finalising: proposalArray[i].finalising,
          finalised: proposalArray[i].finalised,
          param: proposalArray[i].param.toString(),
          proposedAddress: proposalArray[i].proposedAddress.toString(),
          open: proposalArray[i].open,
          memberVotes: proposalArray[i + 1].toString(),
        })
      }
      dispatch(payloadToDispatch(Types.DAO_PROPOSAL_DETAILS, proposal))
    }
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Deposit / Stake LP Tokens (Lock them in the DAO)
 * @param {address} pool
 * @param {uint256} amount
 * @param {object} wallet
 */
export const daoDeposit = (pool, amount, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  let provider = getWalletProvider(wallet?.ethereum)
  if (provider._isSigner === true) {
    provider = provider.provider
  }

  try {
    const gPrice = await getProviderGasPrice()
    let deposit = await contract.deposit(pool, amount, {
      gasPrice: gPrice,
    })

    deposit = await provider.waitForTransaction(deposit.hash, 1)
    dispatch(payloadToDispatch(Types.DAO_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 * @param {address} pool
 * @param {object} wallet
 */
export const daoWithdraw = (pool, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    let withdraw = {}
    const gPrice = await getProviderGasPrice()
    withdraw = await contract.withdraw(pool, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_WITHDRAW, withdraw))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Harvest SPARTA DAOVault rewards
 */
export const daoHarvest = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    let harvest = {}
    const gPrice = await getProviderGasPrice()
    harvest = await contract.harvest({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_HARVEST, harvest))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * New action proposal
 * @param {string} typeStr
 * @param {object} wallet
 * @returns {unit} proposalID
 */
export const newActionProposal = (typeStr, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const newProp = await contract.newActionProposal(typeStr, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_NEW_ACTION, newProp))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * New parameter proposal
 * @param {uint32} param
 * @param {string} typeStr
 * @param {object} wallet
 * @returns {unit} proposalID
 */
export const newParamProposal = (param, typeStr, wallet) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const newProp = await contract.newParamProposal(param, typeStr, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_NEW_PARAM, newProp))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * New address proposal
 * @param {address} proposedAddress
 * @param {string} typeStr
 * @param {object} wallet
 * @returns {unit} proposalID
 */
export const newAddressProposal = (proposedAddress, typeStr, wallet) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const newProp = await contract.newAddressProposal(
      proposedAddress,
      typeStr,
      {
        gasPrice: gPrice,
      },
    )
    dispatch(payloadToDispatch(Types.DAO_NEW_ADDRESS, newProp))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * New grant proposal
 * @param {address} recipient
 * @param {uint} amount
 * @param {object} wallet
 * @returns {unit} proposalID
 */
export const newGrantProposal = (recipient, amount, wallet) => async (
  dispatch,
) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const newProp = await contract.newGrantProposal(recipient, amount, {
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_NEW_GRANT, newProp))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Vote for a proposal
 * @param {uint} proposalID
 * @param {object} wallet
 * @returns {unit} voteWeight
 */
export const voteProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const propVote = await contract.voteProposal({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_VOTE, propVote))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Remove your vote from a proposal
 * @param {uint} proposalID
 * @param {object} wallet
 * @returns {unit} voteWeightRemoved
 */
export const removeVote = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const propRemoveVote = await contract.removeVote({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_REMOTE_VOTE, propRemoveVote))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Cancel a proposal (replace)
 * Old + New proposal must be same type
 * Old proposal must be in 'finalising' stage
 * New proposal must have at least minority weight
 * @param {uint} oldProposalID
 * @param {uint} newProposalID
 * @param {object} wallet
 */
export const cancelProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const propCancel = await contract.cancelProposal({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_CANCEL, propCancel))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Finalise a proposal
 * Must be past cool-off & in finalising stage
 * @param {uint} proposalID
 * @param {object} wallet
 */
export const finaliseProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const propFinalise = await contract.finaliseProposal({
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.DAO_FINALISE, propFinalise))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}
