import * as Types from './types'
import { getBondContract, getOldBondContract } from '../../utils/web3Bond'
import { getSpartaContract } from '../../utils/web3Sparta'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getProviderGasPrice, getAddresses } from '../../utils/web3'

const addr = getAddresses()

export const bondLoading = () => ({
  type: Types.BOND_LOADING,
})

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

export const getBondListed = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondListed = await contract.callStatic.allListedAssets()
    dispatch(payloadToDispatch(Types.GET_BOND_LISTED, bondListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondListedAsset = (asset) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const isListed = await contract.callStatic.isListed(asset)
    dispatch(payloadToDispatch(Types.GET_BOND_LISTED_ASSET, isListed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondClaimable = (bondAddress, member, asset) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getOldBondContract(bondAddress)

  try {
    const bondClaimable = await contract.callStatic.calcClaimBondedLP(
      member,
      asset,
    )
    dispatch(payloadToDispatch(Types.GET_BOND_CLAIMABLE, bondClaimable))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondMemberDetails = (bondAddress, member, asset) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getOldBondContract(bondAddress)

  try {
    const memberDetails = await contract.callStatic.getMemberDetails(
      member,
      asset,
    )
    dispatch(payloadToDispatch(Types.GET_BOND_MEMBER_DETAILS, memberDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondSpartaRemaining = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getSpartaContract()

  try {
    const bondSpartaRemaining = await contract.callStatic.balanceOf(addr.bond)
    dispatch(
      payloadToDispatch(Types.GET_BOND_SPARTA_REMAINING, bondSpartaRemaining),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondBurnReady = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondBurnReady = await contract.callStatic.balanceOf(addr.bond)
    dispatch(payloadToDispatch(Types.GET_BOND_BURN_READY, bondBurnReady))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

// --------------------------------------- BOND+MINT FUNCTIONS ---------------------------------------

export const bondBurn = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.burnBond()
    const bondBurned = await contract.burnBond({
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_BURN, bondBurned))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Deposit asset via bond+mint contract
 * @param {address} asset
 * @param {uint256} amount
 * @returns {boolean}
 */
export const bondDeposit = (asset, amount) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.deposit(asset, amount)
    const deposit = await contract.deposit(asset, amount, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })
    dispatch(payloadToDispatch(Types.BOND_DEPOSIT, deposit))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

/**
 * Claim all available bond by member
 * @param {address} member
 * @returns {boolean}
 */
export const bondClaimAll = (member) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimAllForMember(member)
    const bondClaimedAll = await contract.claimAllForMember(member, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ALL, bondClaimedAll))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

// --------------------------------------- BOND-DAO HELPERS ---------------------------------------

export const getBondProposalCount = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondProposalCount = await contract.callStatic.proposalCount()
    dispatch(
      payloadToDispatch(Types.GET_BOND_PROPOSAL_COUNT, bondProposalCount),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondProposal = (pid) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const data = await Promise.all([
      contract.callStatic.mapPID_type(pid),
      contract.callStatic.mapPID_votes(pid),
      contract.callStatic.mapPID_timeStart(pid),
      contract.callStatic.mapPID_finalising(pid),
      contract.callStatic.mapPID_finalised(pid),
      contract.callStatic.mapPID_address(pid),
      contract.callStatic.hasMajority(pid),
      contract.callStatic.hasMinority(pid),
    ])
    const bondProposal = {
      id: pid,
      type: data[0],
      votes: data[1],
      timeStart: data[2],
      finalising: data[3],
      finalised: data[4],
      proposedAddress: data[5],
      majority: data[6],
      minority: data[7],
    }
    dispatch(payloadToDispatch(Types.GET_BOND_PROPOSAL, bondProposal))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondProposals = () => async (dispatch) => {
  dispatch(bondLoading())

  try {
    const proposalCount = await getBondProposalCount()
    const result = []
    for (let i = 0; i < +proposalCount + 1; i++) {
      // + 1 due to blank ID#0 peroposal not counted
      result.push(getBondProposal(i))
    }

    const bondProposals = await Promise.all(result)
    dispatch(payloadToDispatch(Types.GET_BOND_PROPOSALS, bondProposals))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondCoolOffPeriod = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondCoolOffPeriod = await contract.callStatic.coolOffPeriod()
    dispatch(
      payloadToDispatch(Types.GET_BOND_COOL_OFF_PERIOD, bondCoolOffPeriod),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

// --------------------------------------- BOND-DAO FUNCTIONS ---------------------------------------

export const bondProposalMintBond = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newActionProposal('MINT')
    const proposalMintBond = await contract.newActionProposal('MINT', {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_PROPOSAL_MINT_BOND, proposalMintBond))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalListAsset = (asset) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newAddressProposal(asset, 'LIST')
    const proposalListAsset = await contract.newAddressProposal(asset, 'LIST', {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(
      payloadToDispatch(Types.BOND_PROPOSAL_LIST_ASSET, proposalListAsset),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalDelistAsset = (asset) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newAddressProposal(
      asset,
      'DELIST',
    )
    const proposalDelistAsset = await contract.newAddressProposal(
      asset,
      'DELIST',
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )

    dispatch(
      payloadToDispatch(Types.BOND_PROPOSAL_DELIST_ASSET, proposalDelistAsset),
    )
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalVote = (proposalID) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.voteProposal(proposalID)
    const proposalVote = await contract.voteProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_PROPOSAL_VOTE, proposalVote))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalFinalize = (proposalID) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.finaliseProposal(proposalID)
    const proposalFinalize = await contract.finaliseProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_PROPOSAL_FINALIZE, proposalFinalize))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalReplace = (oldProposalID, newProposalID) => async (
  dispatch,
) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.cancelProposal(
      oldProposalID,
      newProposalID,
    )
    const proposalReplace = await contract.cancelProposal(
      oldProposalID,
      newProposalID,
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )

    dispatch(payloadToDispatch(Types.BOND_PROPOSAL_REPLACE, proposalReplace))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondProposalRecount = (proposalID) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.countVotes(proposalID)
    const proposalRecount = await contract.countVotes(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_PROPOSAL_RECOUNT, proposalRecount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondListedCount = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const bondListedCount = await contract.callStatic.assetListedCount()

    dispatch(payloadToDispatch(Types.GET_BOND_LISTED_COUNT, bondListedCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondMemberCount = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const memberCount = await contract.callStatic.memberCount()

    dispatch(payloadToDispatch(Types.GET_BOND_MEMBER_COUNT, memberCount))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const getBondMembers = () => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const members = await contract.callStatic.allMembers()

    dispatch(payloadToDispatch(Types.GET_BOND_MEMBERS, members))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}

export const bondClaimAsset = (asset, member) => async (dispatch) => {
  dispatch(bondLoading())
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimForMember(asset, member)
    const bondClaimed = await contract.claimForMember(asset, member, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    dispatch(payloadToDispatch(Types.BOND_CLAIM_ASSET, bondClaimed))
  } catch (error) {
    dispatch(errorToDispatch(Types.BOND_ERROR, error))
  }
}
