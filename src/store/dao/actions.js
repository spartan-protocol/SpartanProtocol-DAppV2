import * as Types from './types'
import { getProviderGasPrice, parseTxn } from '../../utils/web3'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getDaoContract, getDaoVaultContract } from '../../utils/web3Contracts'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

export const daoLoading = () => ({
  type: Types.DAO_LOADING,
})

/**
 * Get the global daoVault details
 * @returns globalDetails
 */
export const daoGlobalDetails = () => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()

  try {
    let awaitArray = [
      contract.callStatic.running(),
      contract.callStatic.coolOffPeriod(),
      contract.callStatic.erasToEarn(),
      contract.callStatic.daoClaim(),
      contract.callStatic.daoFee(),
      contract.callStatic.currentProposal(),
      contract.callStatic.cancelPeriod(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const global = {
      running: awaitArray[0], // Dao proposals currently running?
      coolOffPeriod: awaitArray[1].toString(), // Dao coolOffPeriod
      erasToEarn: awaitArray[2].toString(), // Dao erasToEarn
      daoClaim: awaitArray[3].toString(), // Dao daoClaim
      daoFee: awaitArray[4].toString(), // Dao proposal fee
      currentProposal: awaitArray[5].toString(), // Dao proposalCount / current PID
      cancelPeriod: awaitArray[6].toString(), // Dao proposal seconds until can be cancelled
    }
    dispatch(payloadToDispatch(Types.DAO_GLOBAL_DETAILS, global))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get all the dao proposal details
 * @param count @param wallet
 */
export const daoProposalDetails =
  (proposalCount, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract()
    try {
      if (proposalCount > 0) {
        const awaitArray = []
        for (let i = 1; i <= proposalCount; i++) {
          awaitArray.push(contract.callStatic.getProposalDetails(i))
          awaitArray.push(
            wallet.account
              ? contract.callStatic.memberVoted(i, wallet.account)
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
            coolOffTime: proposalArray[i].coolOffTime.toString(), // timestamp of coolOff
            finalising: proposalArray[i].finalising,
            finalised: proposalArray[i].finalised,
            param: proposalArray[i].param.toString(),
            proposedAddress: proposalArray[i].proposedAddress.toString(),
            open: proposalArray[i].open,
            startTime: proposalArray[i].startTime.toString(), // timestamp of proposal genesis
            memberVoted: proposalArray[i + 1],
          })
        }
        dispatch(payloadToDispatch(Types.DAO_PROPOSAL_DETAILS, proposal))
      }
    } catch (error) {
      dispatch(errorToDispatch(Types.DAO_ERROR, error))
    }
  }

/**
 * Get the daoVault member details
 */
export const daoMemberDetails = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()
  try {
    let awaitArray = [contract.callStatic.mapMember_lastTime(wallet.account)]
    awaitArray = await Promise.all(awaitArray)
    const member = {
      lastHarvest: awaitArray[0].toString(),
    }
    dispatch(payloadToDispatch(Types.DAO_MEMBER_DETAILS, member))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the member daoVault details *VIEW*
 * @param listedPools @param wallet
 * @returns daoDetails
 */
export const getDaoDetails = (listedPools, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoVaultContract()
  try {
    let awaitArray = []
    for (let i = 0; i < listedPools.length; i++) {
      if (!wallet.account || listedPools[i].baseAmount <= 0) {
        awaitArray.push('0')
      } else {
        awaitArray.push(
          contract.callStatic.getMemberPoolBalance(
            listedPools[i].address,
            wallet.account,
          ),
        )
      }
    }
    awaitArray = await Promise.all(awaitArray)
    const daoDetails = []
    for (let i = 0; i < awaitArray.length; i++) {
      daoDetails.push({
        tokenAddress: listedPools[i].tokenAddress,
        address: listedPools[i].address,
        staked: awaitArray[i].toString(),
      })
    }
    dispatch(payloadToDispatch(Types.DAO_DETAILS, daoDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the daoVault member deposit times
 * @param daoDetails @param wallet
 */
export const daoDepositTimes = (daoDetails, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoVaultContract()
  try {
    const loopPools = daoDetails.filter((x) => x.staked > 0)
    let awaitArray = []
    for (let i = 0; i < loopPools.length; i++) {
      awaitArray.push(
        contract.callStatic.getMemberPoolDepositTime(
          loopPools[i].address,
          wallet.account,
        ),
      )
    }
    awaitArray = await Promise.all(awaitArray)
    const lastDeposits = []
    for (let i = 0; i < awaitArray.length; i++) {
      lastDeposits.push({
        address: loopPools[i].address,
        lastDeposit: awaitArray[i].toString(),
      })
    }
    dispatch(payloadToDispatch(Types.DAO_LASTDEPOSITS, lastDeposits))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the current dao proposal's total weight
 * @param proposalID @param poolDetails
 */
export const proposalWeight = (proposalID, poolDetails) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract()
  try {
    let _proposalWeight = BN(0)
    const vaultPools = poolDetails.filter((x) => x.curated && !x.hide)
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
      for (let i = 0; i < votedArray.length; i++) {
        _proposalWeight = _proposalWeight.plus(
          getPoolShareWeight(
            votedArray[i].toString(),
            vaultPools[i].poolUnits,
            vaultPools[i].baseAmount,
          ),
        )
      }
    }
    dispatch(
      payloadToDispatch(Types.DAO_PROPOSAL_WEIGHT, _proposalWeight.toString()),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Get the current daoVault's total weight
 * @param poolDetails
 */
export const daoVaultWeight = (poolDetails) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoVaultContract()
  try {
    let totalWeight = BN(0)
    const vaultPools = poolDetails.filter((x) => x.curated && !x.hide)
    if (vaultPools.length > 0) {
      const awaitArray = []
      for (let i = 0; i < vaultPools.length; i++) {
        awaitArray.push(
          contract.callStatic.mapTotalPool_balance(vaultPools[i].address),
        )
      }
      const totalStaked = await Promise.all(awaitArray)
      for (let i = 0; i < totalStaked.length; i++) {
        totalWeight = totalWeight.plus(
          getPoolShareWeight(
            totalStaked[i].toString(),
            vaultPools[i].poolUnits,
            vaultPools[i].baseAmount,
          ),
        )
      }
    }
    dispatch(payloadToDispatch(Types.DAO_TOTAL_WEIGHT, totalWeight.toString()))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Deposit / Stake LP Tokens (Lock them in the DAOVault)
 * @param pool @param amount @param wallet
 */
export const daoDeposit = (pool, amount, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.deposit(pool, amount, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'daoDeposit')
    dispatch(payloadToDispatch(Types.DAO_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 * @param pool @param wallet
 */
export const daoWithdraw = (pool, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.withdraw(pool, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'daoWithdraw')
    dispatch(payloadToDispatch(Types.DAO_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Harvest SPARTA DAOVault rewards
 * @param wallet
 */
export const daoHarvest = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.harvest({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'daoHarvest')
    dispatch(payloadToDispatch(Types.DAO_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New action proposal
 * @param typeStr @param wallet
 */
export const newActionProposal = (typeStr, wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.newActionProposal(typeStr, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'newActionProposal')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * New parameter proposal
 * @param param @param typeStr @param wallet
 */
export const newParamProposal =
  (param, typeStr, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newParamProposal(param, typeStr, ORs)
      txn = await parseTxn(txn, 'newParamProposal')
      dispatch(payloadToDispatch(Types.PROP_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.DAO_ERROR, error))
    }
  }

/**
 * New address proposal
 * @param proposedAddress @param typeStr @param wallet
 */
export const newAddressProposal =
  (proposedAddress, typeStr, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newAddressProposal(proposedAddress, typeStr, ORs)
      txn = await parseTxn(txn, 'newAddrProposal')
      dispatch(payloadToDispatch(Types.PROP_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.DAO_ERROR, error))
    }
  }

/**
 * New grant proposal
 * @param recipient @param amount @param wallet
 */
export const newGrantProposal =
  (recipient, amount, wallet) => async (dispatch) => {
    dispatch(daoLoading())
    const contract = getDaoContract(wallet)
    try {
      const gPrice = await getProviderGasPrice()
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newGrantProposal(recipient, amount, ORs)
      txn = await parseTxn(txn, 'newGrantProposal')
      dispatch(payloadToDispatch(Types.PROP_TXN, txn))
    } catch (error) {
      dispatch(errorToDispatch(Types.DAO_ERROR, error))
    }
  }

/**
 * Vote for the current open proposal
 * @param wallet
 */
export const voteProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.voteProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'voteProposal')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Remove your vote from the current open proposal
 * @param wallet
 */
export const removeVote = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.unvoteProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'removeVoteProposal')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Poll vote weights and check if proposal is ready to go into finalisation stage
 * @param wallet
 */
export const pollVotes = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.pollVotes({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'pollVotes')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Cancel the current open proposal
 * @param wallet
 */
export const cancelProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.cancelProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'cancelProposal')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}

/**
 * Finalise a proposal
 * @param wallet
 */
export const finaliseProposal = (wallet) => async (dispatch) => {
  dispatch(daoLoading())
  const contract = getDaoContract(wallet)
  try {
    const gPrice = await getProviderGasPrice()
    let txn = await contract.finaliseProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'finaliseProposal')
    dispatch(payloadToDispatch(Types.PROP_TXN, txn))
  } catch (error) {
    dispatch(errorToDispatch(Types.DAO_ERROR, error))
  }
}
