import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { parseTxn } from '../../utils/web3'
import { getDaoContract, getDaoVaultContract } from '../../utils/getContracts'
import { BN } from '../../utils/bigNumber'
import { getPoolShareWeight } from '../../utils/math/utils'

export const useDao = () => useSelector((state) => state.dao)

export const daoSlice = createSlice({
  name: 'dao',
  initialState: {
    loading: false,
    error: null,
    global: false,
    totalWeight: false,
    member: false,
    daoDetails: false,
    proposal: false,
    lastDeposits: false,
    proposalWeight: false,
    txn: [],
    propTxn: [],
  },
  reducers: {
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateError: (state, action) => {
      state.error = action.payload
    },
    updateGlobal: (state, action) => {
      state.global = action.payload
    },
    updateTotalWeight: (state, action) => {
      state.totalWeight = action.payload
    },
    updateMember: (state, action) => {
      state.member = action.payload
    },
    updateDaoDetails: (state, action) => {
      state.daoDetails = action.payload
    },
    updateProposal: (state, action) => {
      state.proposal = action.payload
    },
    updateLastDeposits: (state, action) => {
      state.lastDeposits = action.payload
    },
    updateProposalWeight: (state, action) => {
      state.proposalWeight = action.payload
    },
    updateTxn: (state, action) => {
      state.txn = action.payload
    },
    updatePropTxn: (state, action) => {
      state.propTxn = action.payload
    },
  },
})

export const {
  updateLoading,
  updateError,
  updateGlobal,
  updateTotalWeight,
  updateMember,
  updateDaoDetails,
  updateProposal,
  updateLastDeposits,
  updateProposalWeight,
  updateTxn,
  updatePropTxn,
} = daoSlice.actions

/**
 * Get the global daoVault details
 * @returns globalDetails
 */
export const daoGlobalDetails = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(null, rpcs)
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
    dispatch(updateGlobal(global))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
}

/**
 * Get the current daoVault's total weight
 */
export const daoVaultWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails } = getState().pool
  try {
    if (poolDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getDaoVaultContract(null, rpcs)
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
      dispatch(updateTotalWeight(totalWeight.toString()))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the daoVault member details
 */
export const daoMemberDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  try {
    if (walletAddr && rpcs.length > 0) {
      const contract = getDaoContract(null, rpcs)
      let awaitArray = [contract.callStatic.mapMember_lastTime(walletAddr)]
      awaitArray = await Promise.all(awaitArray)
      const member = {
        lastHarvest: awaitArray[0].toString(),
      }
      dispatch(updateMember(member))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the member daoVault details *VIEW*
 * @returns daoDetails
 */
export const getDaoDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { listedPools } = getState().pool
  try {
    if (listedPools.length > 0) {
      const { rpcs } = getState().web3
      const contract = getDaoVaultContract(null, rpcs)
      let awaitArray = []
      for (let i = 0; i < listedPools.length; i++) {
        if (!walletAddr || listedPools[i].baseAmount <= 0) {
          awaitArray.push('0')
        } else {
          awaitArray.push(
            contract.callStatic.getMemberPoolBalance(
              listedPools[i].address,
              walletAddr,
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
      dispatch(updateDaoDetails(daoDetails))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/** Get all the dao proposal details */
export const daoProposalDetails =
  (walletAddr) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { currentProposal } = getState().dao.global
    try {
      if (currentProposal > 0) {
        const { rpcs } = getState().web3
        const contract = getDaoContract(null, rpcs)
        const awaitArray = []
        for (let i = 1; i <= currentProposal; i++) {
          awaitArray.push(contract.callStatic.getProposalDetails(i))
          awaitArray.push(
            walletAddr ? contract.callStatic.memberVoted(i, walletAddr) : '0',
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
        dispatch(updateProposal(proposal))
      }
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Get the daoVault member deposit times
 */
export const daoDepositTimes = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { daoDetails } = getState().dao
  try {
    if (daoDetails.length > 0) {
      const { rpcs } = getState().web3
      const contract = getDaoVaultContract(null, rpcs)
      const loopPools = daoDetails.filter((x) => x.staked > 0)
      let awaitArray = []
      for (let i = 0; i < loopPools.length; i++) {
        awaitArray.push(
          contract.callStatic.getMemberPoolDepositTime(
            loopPools[i].address,
            walletAddr,
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
      dispatch(updateLastDeposits(lastDeposits))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the current dao proposal's total weight
 */
export const proposalWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { poolDetails } = getState().pool
  const { currentProposal } = getState().dao.global
  try {
    if (poolDetails.length > 0 && currentProposal > 0) {
      const { rpcs } = getState().web3
      const contract = getDaoContract(null, rpcs)
      let _proposalWeight = BN(0)
      const vaultPools = poolDetails.filter((x) => x.curated && !x.hide)
      if (vaultPools.length > 0) {
        const awaitArray = []
        for (let i = 0; i < vaultPools.length; i++) {
          awaitArray.push(
            contract.callStatic.getProposalAssetVotes(
              currentProposal,
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
      dispatch(updateProposalWeight(_proposalWeight.toString()))
    }
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Deposit / Stake LP Tokens (Lock them in the DAOVault)
 */
export const daoDeposit =
  (pool, amount, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.deposit(pool, amount, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'daoDeposit', rpcs)
      dispatch(updateTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 */
export const daoWithdraw = (pool, wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.withdraw(pool, { gasPrice: gPrice })
    txn = await parseTxn(txn, 'daoWithdraw', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
}

/**
 * Harvest SPARTA DAOVault rewards
 */
export const daoHarvest = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.harvest({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'daoHarvest', rpcs)
    dispatch(updateTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * New action proposal
 */
export const newActionProposal =
  (typeStr, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.newActionProposal(typeStr, { gasPrice: gPrice })
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * New parameter proposal
 */
export const newParamProposal =
  (param, typeStr, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newParamProposal(param, typeStr, ORs)
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * New address proposal
 */
export const newAddressProposal =
  (proposedAddress, typeStr, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newAddressProposal(proposedAddress, typeStr, ORs)
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * New grant proposal
 */
export const newGrantProposal =
  (recipient, amount, wallet) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(wallet, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.newGrantProposal(recipient, amount, ORs)
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason))
    }
    dispatch(updateLoading(false))
  }

/**
 * Vote for the current open proposal
 */
export const voteProposal = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.voteProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'voteProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Remove your vote from the current open proposal
 */
export const removeVote = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.unvoteProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'removeVoteProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Poll vote weights and check if proposal is ready to go into finalisation stage
 */
export const pollVotes = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.pollVotes({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'pollVotes', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Cancel the current open proposal
 */
export const cancelProposal = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.cancelProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'cancelProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

/**
 * Finalise a proposal
 */
export const finaliseProposal = (wallet) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(wallet, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.finaliseProposal({ gasPrice: gPrice })
    txn = await parseTxn(txn, 'finaliseProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason))
  }
  dispatch(updateLoading(false))
}

export default daoSlice.reducer
