import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { exCuratedPools, parseTxn } from '../../utils/web3'
import {
  getDaoContract,
  getDaoVaultContract,
  getSSUtilsContract,
} from '../../utils/getContracts'
import { BN } from '../../utils/bigNumber'
import { getPool, getPoolShareWeight } from '../../utils/math/utils'

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
  const contract = getSSUtilsContract(null, rpcs)
  try {
    const awaitArray = (await contract.simulate.getDaoGlobalDetails()).result[0]
    const global = {
      running: awaitArray.running, // Dao proposals currently running?
      coolOffPeriod: awaitArray.coolOffPeriod.toString(), // Dao coolOffPeriod
      erasToEarn: awaitArray.erasToEarn.toString(), // Dao erasToEarn
      daoClaim: awaitArray.daoClaim.toString(), // Dao daoClaim
      daoFee: awaitArray.daoFee.toString(), // Dao proposal fee
      currentProposal: awaitArray.currentProposal.toString(), // Dao proposalCount / current PID
      cancelPeriod: awaitArray.cancelPeriod.toString(), // Dao proposal seconds until can be cancelled
    }
    dispatch(updateGlobal(global))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
}

/**
 * Get the current daoVault's total weight
 */
export const daoVaultWeight = () => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { curatedPools, poolDetails } = getState().pool
  const { daoDetails } = getState().dao
  try {
    if (daoDetails.length > 0 && curatedPools.length > 0) {
      let totalWeight = BN(0)
      const vaultPools = daoDetails.filter((x) =>
        curatedPools.includes(x.address),
      )
      for (let i = 0; i < vaultPools.length; i++) {
        totalWeight = totalWeight.plus(
          getPoolShareWeight(
            vaultPools[i].globalStaked,
            getPool(vaultPools[i].address, poolDetails).poolUnits,
            getPool(vaultPools[i].address, poolDetails).baseAmount,
          ),
        )
      }
      dispatch(updateTotalWeight(totalWeight.toString()))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
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
      const awaitArray = (
        await contract.simulate.mapMember_lastTime([walletAddr])
      ).result
      const member = {
        lastHarvest: awaitArray.toString(),
      }
      dispatch(updateMember(member))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Get the member daoVault details *VIEW*
 * @returns daoDetails
 */
export const getDaoDetails = (walletAddr) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { curatedPools, poolDetails } = getState().pool
  try {
    const histCuratedPools = [...new Set([...curatedPools, ...exCuratedPools])]
    if (histCuratedPools.length > 0 && poolDetails.length > 0) {
      const { rpcs } = getState().web3
      const { addresses } = getState().app
      const contract = getSSUtilsContract(null, rpcs)
      const awaitArray = (
        await contract.simulate.getDaoDetails([
          walletAddr ?? addresses.bnb,
          histCuratedPools,
        ])
      ).result
      const daoDetails = []
      for (let i = 0; i < awaitArray.length; i++) {
        const pool = getPool(awaitArray[i].poolAddress, poolDetails)
        if (pool) {
          // need to make sure pool exists to avoid needing custom
          // exCurated const for testnet (mainnet array wont break testnet)
          daoDetails.push({
            tokenAddress: pool.tokenAddress,
            address: awaitArray[i].poolAddress,
            staked: awaitArray[i].staked.toString(),
            globalStaked: awaitArray[i].globalStaked.toString(),
          })
        }
      }
      dispatch(updateDaoDetails(daoDetails))
      dispatch(daoVaultWeight()) // Weight changing function, so we need to update weight calculations
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
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
          awaitArray.push(contract.simulate.getProposalDetails([i]))
          awaitArray.push(
            walletAddr ? contract.simulate.memberVoted([i, walletAddr]) : '0',
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
            id: proposalArray[i].result.id.toString(),
            proposalType: proposalArray[i].result.proposalType,
            coolOffTime: proposalArray[i].result.coolOffTime.toString(), // timestamp of coolOff
            finalising: proposalArray[i].result.finalising,
            finalised: proposalArray[i].result.finalised,
            param: proposalArray[i].result.param.toString(),
            proposedAddress: proposalArray[i].result.proposedAddress.toString(),
            open: proposalArray[i].result.open,
            startTime: proposalArray[i].result.startTime.toString(), // timestamp of proposal genesis
            memberVoted: proposalArray[i + 1].result,
          })
        }
        dispatch(updateProposal(proposal))
      }
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
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
          contract.simulate.getMemberPoolDepositTime([
            loopPools[i].address,
            walletAddr,
          ]),
        )
      }
      awaitArray = await Promise.all(awaitArray)
      const lastDeposits = []
      for (let i = 0; i < awaitArray.length; i++) {
        lastDeposits.push({
          address: loopPools[i].address,
          lastDeposit: awaitArray[i].result.toString(),
        })
      }
      dispatch(updateLastDeposits(lastDeposits))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
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
            contract.simulate.getProposalAssetVotes([
              currentProposal,
              vaultPools[i].address,
            ]),
          )
        }
        const votedArray = await Promise.all(awaitArray)
        for (let i = 0; i < votedArray.length; i++) {
          _proposalWeight = _proposalWeight.plus(
            getPoolShareWeight(
              votedArray[i].result.toString(),
              vaultPools[i].poolUnits,
              vaultPools[i].baseAmount,
            ),
          )
        }
      }
      dispatch(updateProposalWeight(_proposalWeight.toString()))
    }
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Deposit / Stake LP Tokens (Lock them in the DAOVault)
 */
export const daoDeposit =
  (pool, amount, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.deposit([pool, amount], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'daoDeposit', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getDaoDetails(walletAddr)) // Update daoDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Withdraw / Unstake LP Tokens (Unlock them from the DAO)
 */
export const daoWithdraw =
  (pool, walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.withdraw([pool], { gasPrice: gPrice })
      txn = await parseTxn(txn, 'daoWithdraw', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getDaoDetails(walletAddr)) // Update daoDetails
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
  }

/**
 * Harvest SPARTA DAOVault rewards
 */
export const daoHarvest =
  (walletAddr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.harvest([], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'daoHarvest', rpcs)
      dispatch(updateTxn(txn))
      dispatch(getDaoDetails(walletAddr)) // Update daoDetails
      dispatch(daoMemberDetails(walletAddr)) // Update daoMemberDetails (daoVault lastHarvest)
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * New action proposal
 */
export const newActionProposal =
  (typeStr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      let txn = await contract.write.newActionProposal([typeStr], {
        gasPrice: gPrice,
      })
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * New parameter proposal
 */
export const newParamProposal =
  (param, typeStr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.write.newParamProposal([param, typeStr], ORs)
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * New address proposal
 */
export const newAddressProposal =
  (proposedAddress, typeStr, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.write.newAddressProposal(
        [proposedAddress, typeStr],
        ORs,
      )
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * New grant proposal
 */
export const newGrantProposal =
  (recipient, amount, signer) => async (dispatch, getState) => {
    dispatch(updateLoading(true))
    const { rpcs } = getState().web3
    const contract = getDaoContract(signer, rpcs)
    try {
      const { gasRateMN, gasRateTN } = getState().app.settings
      const { chainId } = getState().app
      let gPrice = chainId === 56 ? gasRateMN : gasRateTN
      gPrice = BN(gPrice).times(1000000000).toString()
      // const gPrice = await getProviderGasPrice(rpcs)
      const ORs = { gasPrice: gPrice }
      let txn = await contract.write.newGrantProposal([recipient, amount], ORs)
      txn = await parseTxn(txn, 'newProposal', rpcs)
      dispatch(updatePropTxn(txn))
    } catch (error) {
      dispatch(updateError(error.reason ?? error.message ?? error))
    }
    dispatch(updateLoading(false))
  }

/**
 * Vote for the current open proposal
 */
export const voteProposal = (signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.voteProposal([], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'voteProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Remove your vote from the current open proposal
 */
export const removeVote = (signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.unvoteProposal([], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'removeVoteProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Poll vote weights and check if proposal is ready to go into finalisation stage
 */
export const pollVotes = (signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.pollVotes([], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'pollVotes', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Cancel the current open proposal
 */
export const cancelProposal = (signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.cancelProposal([], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'cancelProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

/**
 * Finalise a proposal
 */
export const finaliseProposal = (signer) => async (dispatch, getState) => {
  dispatch(updateLoading(true))
  const { rpcs } = getState().web3
  const contract = getDaoContract(signer, rpcs)
  try {
    const { gasRateMN, gasRateTN } = getState().app.settings
    const { chainId } = getState().app
    let gPrice = chainId === 56 ? gasRateMN : gasRateTN
    gPrice = BN(gPrice).times(1000000000).toString()
    // const gPrice = await getProviderGasPrice(rpcs)
    let txn = await contract.write.finaliseProposal([], { gasPrice: gPrice })
    txn = await parseTxn(txn, 'finaliseProposal', rpcs)
    dispatch(updatePropTxn(txn))
  } catch (error) {
    dispatch(updateError(error.reason ?? error.message ?? error))
  }
  dispatch(updateLoading(false))
}

export default daoSlice.reducer
