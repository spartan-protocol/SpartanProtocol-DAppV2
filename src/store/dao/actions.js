import * as Types from './types'
import { getProviderGasPrice, getWalletProvider } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract, getDaoVaultContract } from '../../utils/web3Contracts'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

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
  const contract = getDaoContract(wallet)

  try {
    let awaitArray = [
      // contract.callStatic.running(), // Uncomment after new Testnet
      true, // Delete after new Testnet
      contract.callStatic.coolOffPeriod(),
      contract.callStatic.erasToEarn(),
      contract.callStatic.daoClaim(),
      contract.callStatic.daoFee(),
      contract.callStatic.currentProposal(),
      contract.callStatic.memberCount(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const global = {
      running: awaitArray[0], // Dao proposals currently running?
      coolOffPeriod: awaitArray[1].toString(), // Dao coolOffPeriod
      erasToEarn: awaitArray[2].toString(), // Dao erasToEarn
      daoClaim: awaitArray[3].toString(), // Dao daoClaim
      daoFee: awaitArray[4].toString(), // Dao proposal fee
      currentProposal: awaitArray[5].toString(), // Dao proposalCount / current PID
      memberCount: awaitArray[6].toString(), // DaoVault memberCount
    }
    dispatch(payloadToDispatch(Types.DAO_GLOBAL_DETAILS, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Get the current daoVault's total weight
 * @param {[string]} poolDetails @param {object} wallet
 * @returns {number} spartaWeight
 */
export const daoVaultWeight = (poolDetails, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoVaultContract(wallet)
  try {
    const vaultPools = poolDetails.filter((x) => x.curated === true)
    if (vaultPools.length > 0) {
      const awaitArray = []
      for (let i = 0; i < vaultPools.length; i++) {
        awaitArray.push(
          contract.callStatic.mapTotalPool_balance(vaultPools[i].address),
        )
      }
      const totalStaked = await Promise.all(awaitArray)
      let totalWeight = BN(0)
      for (let i = 0; i < totalStaked.length; i++) {
        totalWeight = totalWeight.plus(
          getPoolShareWeight(
            totalStaked[i],
            vaultPools[i].poolUnits,
            vaultPools[i].baseAmount,
          ),
        )
      }
      dispatch(payloadToDispatch(Types.DAO_TOTAL_WEIGHT, totalWeight))
    }
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
  try {
    let awaitArray = [contract.callStatic.mapMember_lastTime(wallet.account)]
    awaitArray = await Promise.all(awaitArray)
    const member = {
      lastHarvest: awaitArray[0].toString(),
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
export const daoProposalDetails =
  (proposalCount, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract(wallet)
    try {
      if (proposalCount > 0) {
        const awaitArray = []
        for (let i = 1; i <= proposalCount; i++) {
          awaitArray.push(contract.callStatic.getProposalDetails(i))
          awaitArray.push(
            wallet.account
              ? // ? contract.callStatic.memberVoted(i, wallet.account) // uncomment after new Testnet
                contract.callStatic.mapPIDMember_votes(i, wallet.account) // Remove this after new testnet
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
            votes: proposalArray[i].votes.toString(), // Remove this line after new testnet
            coolOffTime: proposalArray[i].coolOffTime.toString(), // timestamp of coolOff
            finalising: proposalArray[i].finalising,
            finalised: proposalArray[i].finalised,
            param: proposalArray[i].param.toString(),
            proposedAddress: proposalArray[i].proposedAddress.toString(),
            open: proposalArray[i].open,
            startTime: proposalArray[i].startTime.toString(), // timestamp of proposal genesis
            memberVotes: proposalArray[i + 1].toString(), // Remove this after new testnet
            // memberVoted: proposalArray[i + 1].toString(), // uncomment after new Testnet
          })
        }
        dispatch(payloadToDispatch(Types.DAO_PROPOSAL_DETAILS, proposal))
      }
    } catch (error) {
      dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
    }
  }

/**
 * Get the current dao proposal's total weight
 * @param {number} proposalID @param {object} poolDetails @param {object} wallet
 * @returns {number} spartaWeight
 */
export const proposalWeight =
  (proposalID, poolDetails, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract(wallet)
    try {
      const vaultPools = poolDetails.filter((x) => x.curated === true)
      if (vaultPools.length > 0) {
        const awaitArray = []
        for (let i = 0; i < vaultPools.length; i++) {
          awaitArray.push(
            contract.callStatic.getProposalAssetVotes(
              proposalID,
              vaultPools[i].address,
            ),
          )
        }
        const votedArray = await Promise.all(awaitArray)
        let _proposalWeight = BN(0)
        for (let i = 0; i < votedArray.length; i++) {
          _proposalWeight = _proposalWeight.plus(
            getPoolShareWeight(
              votedArray[i],
              vaultPools[i].poolUnits,
              vaultPools[i].baseAmount,
            ),
          )
        }
        dispatch(payloadToDispatch(Types.DAO_PROPOSAL_WEIGHT, _proposalWeight))
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
 * @param {string} typeStr @param {object} wallet
 * @returns {number} proposalID
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
 * @param {number} param @param {string} typeStr @param {object} wallet
 * @returns {number} proposalID
 */
export const newParamProposal =
  (param, typeStr, wallet) => async (dispatch) => {
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
 * @param {string} proposedAddress @param {string} typeStr @param {object} wallet
 * @returns {number} proposalID
 */
export const newAddressProposal =
  (proposedAddress, typeStr, wallet) => async (dispatch) => {
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
 * @param {string} recipient @param {number} amount @param {object} wallet
 * @returns {number} proposalID
 */
export const newGrantProposal =
  (recipient, amount, wallet) => async (dispatch) => {
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
 * Vote for the current open proposal
 * @param {object} wallet
 * @returns *nothing*
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
 * Remove your vote from the current open proposal
 * @param {object} wallet
 * @returns *nothing*
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
 * Poll vote weights and check if proposal is ready to go into finalisation stage
 * @param {object} wallet
 * @returns *nothing*
 */
export const pollVotes = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    const _pollVotes = await contract.pollVotes({
      gasPrice: gPrice,
    })
    dispatch(payloadToDispatch(Types.DAO_POLL_VOTES, _pollVotes))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, `${error}.`))
  }
}

/**
 * Cancel the current open proposal
 * @param {object} wallet
 * @returns *nothing*
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
 * @param {object} wallet
 * @returns *nothing*
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
