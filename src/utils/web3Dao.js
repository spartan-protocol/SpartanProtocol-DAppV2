import { ethers } from 'ethers'
import {
  getAbis,
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getDaoContract = () => {
  const abiDao = getAbis().dao
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.dao, abiDao, provider)
  return contract
}

// --------------------------------------- HELPER FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * Check if proposal has at least the majority of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalMajority = async (proposalID) => {
  const contract = getDaoContract()
  try {
    const majority = await contract.callStatic.hasMajority(proposalID)
    console.log(majority)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Check if proposal has at least the quorum of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalQuorum = async (proposalID) => {
  const contract = getDaoContract()
  try {
    const quorum = await contract.callStatic.hasQuorum(proposalID)
    console.log(quorum)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Check if proposal has at least the minorty of dao weight
 * @param {uint} proposalID
 * @returns {boolean}
 */
export const getDaoProposalMinority = async (proposalID) => {
  const contract = getDaoContract()
  try {
    const minorty = await contract.callStatic.hasMinority(proposalID)
    console.log(minorty)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get the dao proposal details
 * @param {uint} proposalID
 * @returns {object} id, proposalType, votes, timeStart, finalising, finalised, param, proposedAddress
 */
export const getDaoProposalDetails = async (proposalID) => {
  const contract = getDaoContract()
  try {
    const proposalDetails = await contract.callStatic.getProposalDetails(
      proposalID,
    )
    console.log(proposalDetails)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get the dao grant proposal details
 * @param {uint} proposalID
 * @returns {object} id, proposalType, votes, timeStart, finalising, finalised, param, proposedAddress
 */
export const getDaoGrantDetails = async (proposalID) => {
  const contract = getDaoContract()
  try {
    const grantDetails = await contract.callStatic.getGrantDetails(proposalID)
    console.log(grantDetails)
  } catch (error) {
    console.log(error)
  }
}

// --------------------------------------- NEW PROPOSAL ASYNC FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * New action proposal
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewAction = async (typeStr) => {
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newActionProposal(typeStr)
    const proposalID = await contract.newActionProposal(typeStr, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(proposalID)
  } catch (error) {
    console.log(error)
  }
}

/**
 * New parameter proposal
 * @param {uint32} param
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewParam = async (param, typeStr) => {
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newParamProposal(param, typeStr)
    const proposalID = await contract.newParamProposal(param, typeStr, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(proposalID)
  } catch (error) {
    console.log(error)
  }
}

/**
 * New parameter proposal
 * @param {address} proposedAddress
 * @param {string} typeStr
 * @returns {unit} proposalID
 */
export const daoProposalNewAddress = async (proposedAddress, typeStr) => {
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

    console.log(proposalID)
  } catch (error) {
    console.log(error)
  }
}

/**
 * New grant proposal
 * @param {address} recipient
 * @param {uint} amount
 * @returns {unit} proposalID
 */
export const daoProposalNewGrant = async (recipient, amount) => {
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

    console.log(proposalID)
  } catch (error) {
    console.log(error)
  }
}

// --------------------------------------- PROPOSAL MANAGEMENT FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * Vote for a proposal
 * @param {uint} proposalID
 * @returns {unit} voteWeight
 */
export const daoProposalVote = async (proposalID) => {
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.voteProposal(proposalID)
    const voteWeight = await contract.voteProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(voteWeight)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Remove your vote from a proposal
 * @param {uint} proposalID
 * @returns {unit} voteWeightRemoved
 */
export const daoProposalRemoveVote = async (proposalID) => {
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas._removeVote(proposalID)
    const voteWeightRemoved = await contract._removeVote(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(voteWeightRemoved)
  } catch (error) {
    console.log(error)
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
export const daoProposalCancel = async (oldProposalID, newProposalID) => {
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

    console.log(proposal)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Finalise a proposal
 * Must be past cool-off & in finalising stage
 * @param {uint} oldProposalID
 */
export const daoProposalFinalise = async (proposalID) => {
  const contract = getDaoContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.finaliseProposal(proposalID)
    const proposal = await contract.finaliseProposal(proposalID, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(proposal)
  } catch (error) {
    console.log(error)
  }
}
