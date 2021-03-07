import { ethers } from "ethers";

import BOND from '../config/ABI/Bond.json'
import { getProviderGasPrice, getWalletProvider } from "./web3"
import { getSpartaContract } from "./web3Sparta";

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const BONDv1_ADDR = net === 'testnet' ? '0x4551457647f6810a917AF70Ca47252BbECD2A36c' : '0xDa7d913164C5611E5440aE8c1d3e06Df713a13Da'
export const BONDv2_ADDR = net === 'testnet' ? '0x2021047F7E3F8c9882e502A63eF036daEFA0B5f6' : '0xE6844821B03828Fd4067167Bc258FA1EEFD1cCdf'
export const BONDv3_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// CURRENT CONTRACT ADDRESSES
export const BOND_ADDR = net === 'testnet' ? '0xa11D0a9F919EDc6D72aF8F90D56735cAd0EBE836' : '0xf2EbA4b92fAFD47a6403d24a567b38C07D7A5b43'

// FUTURE CONTRACT ADDRESSES
// export const BONDv4_ADDR = net === 'testnet' ? '' : ''

// ABI
export const BOND_ABI = BOND.abi

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET OLDER BOND CONTRACT (v1, v2, v3)
export const getOldBondContract = (bondAddress) => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(bondAddress, BOND_ABI, provider)
    console.log(contract)
    return contract
}

// GET CURRENT BOND CONTRACT
export const getBondContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(BOND_ADDR, BOND_ABI, provider)
    console.log(contract)
    return contract
}

// --------------------------------------- BOND+MINT HELPERS ---------------------------------------

// GET ALL ASSETS ENABLED FOR BOND+MINT
export const getBondListed = async () => {
    let contract = getBondContract()
    const result = await contract.callStatic.allListedAssets()
    console.log(result)
    return result
}

// Check if a specific asset is listed for Bond+mint
export const getBondListedAsset = async (asset) => {
    let contract = getBondContract()
    const result = await contract.callStatic.isListed(asset)
    console.log(result)
    return result
}

// Estimated LP-token result of 'Deposit' asset into Bond+Mint
export const getBondDepositEstimate = async (asset, amount) => {
    let contract = getBondContract()
    const result = await contract.callStatic.handleTransferIn(asset, amount)
    console.log(result)
    return result
}

// Get claimable LP tokens from Bond contract via BOND contract address
export const getBondClaimable = async (bondAddress, member, asset) => {
    let contract = getOldBondContract(bondAddress)
    let result = await contract.callStatic.calcClaimBondedLP(member, asset)
    console.log(result)
    return result
}

// Get specific BOND member details by member and bond contract address
export const getBondMemberDetails = async (bondAddress, member, asset) => {
    let contract = getOldBondContract(bondAddress)
    let result = await contract.callStatic.getMemberDetails(member, asset)
    console.log(result)
    return result
}

// Get SPARTA allocation remaining in current BOND contract
export const getBondSpartaRemaining = async () => {
    let contract = getSpartaContract()
    let result = await contract.balanceOf(BOND_ADDR) // doesnt need callStatic
    console.log(result.toString())
    return result
}

// Check if there is a BOND-TOKEN available to burn for SPARTA top-up of BOND allocation
export const getBondBurnReady = async () => {
    let contract = getBondContract()
    console.log(contract)
    let result = await contract.balanceOf(BOND_ADDR) // doesnt need callStatic
    console.log(result.toString())
    return result
}

// --------------------------------------- BOND+MINT FUNCTIONS ---------------------------------------

// 'Burn' BOND token if available (to mint SPARTA for BOND allocation at the claimRate defined in BASE contract)
export const bondBurn = async () => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.burnBond()
    const result = await contract.burnBond({gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// 'Deposit' asset into Bond+Mint
export const bondDeposit = async (asset, amount) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.deposit(asset, amount)
    const result = await contract.deposit(asset, amount, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Claim+Lock in DAO || Claim your available LP tokens from Bond and lock them in the DAO
export const bondClaimLock = async (asset) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimAndLock(asset)
    const result = await contract.claimAndLock(asset, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// --------------------------------------- BOND-DAO HELPERS ---------------------------------------

// Get BOND Proposals Count
export const getBondProposalCount = async () => {
    let contract = getBondContract()
    let result = await contract.callStatic.proposalCount()
    console.log(result)
    return result
}

// Get BOND Proposal Array
export const getBondProposals = async () => {
    let proposalCount = await getBondProposalCount()
    let result = []
    for (let i = 0; i < +proposalCount + 1; i++) { // + 1 due to blank ID#0 peroposal not counted
        result.push(await getBondProposal(i))
    }
    console.log(result)
    return result
}

// Get Each BOND Proposal
export const getBondProposal = async (pid) => {
    let contract = getBondContract()
    let data = await Promise.all([
        contract.callStatic.mapPID_type(pid), contract.callStatic.mapPID_votes(pid), contract.callStatic.mapPID_timeStart(pid), 
        contract.callStatic.mapPID_finalising(pid), contract.callStatic.mapPID_finalised(pid), contract.callStatic.mapPID_address(pid),
        contract.callStatic.hasMajority(pid), contract.callStatic.hasMinority(pid)
    ])
    let result = {
        'id': pid,
        'type': data[0],
        'votes': data[1],
        'timeStart': data[2],
        'finalising': data[3],
        'finalised': data[4],
        'proposedAddress': data[5],
        'majority': data[6],
        'minority': data[7],
    }
    console.log(result)
    return result
}

// Get current value of the BOND-DAO cool-off period
export const getBondCoolOffPeriod = async () => {
    let contract = getBondContract()
    let result = await contract.callStatic.coolOffPeriod()
    console.log(result)
    return result
}

// --------------------------------------- BOND-DAO FUNCTIONS ---------------------------------------

// New proposal to mint a BOND token to burn for another SPARTA allocation
export const bondProposalMintBond = async () => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newActionProposal('MINT')
    const result = await contract.newActionProposal('MINT', {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// New proposal to list an asset for Bond+Mint
export const bondProposalListAsset = async (asset) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newAddressProposal(asset, 'LIST')
    const result = await contract.newAddressProposal(asset, 'LIST', {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// New proposal to de-list an asset from Bond+Mint
export const bondProposalDelistAsset = async (asset) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.newAddressProposal(asset, 'DELIST')
    const result = await contract.newAddressProposal(asset, 'DELIST', {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Vote for a proposal
export const bondProposalVote = async (proposalID) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.voteProposal(proposalID)
    const result = await contract.voteProposal(proposalID, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Attempt to finalize a proposal (not instant, see: 'coolOffPeriod')
export const bondProposalFinalize = async (proposalID) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.finaliseProposal(proposalID)
    const result = await contract.finaliseProposal(proposalID, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Attempt to replace a proposal || Both proposals must be of the same 'type'
// Old proposal must be 'finalising' || New proposal must have at least 'minority'
export const bondProposalReplace = async (oldProposalID, newProposalID) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.cancelProposal(oldProposalID, newProposalID)
    const result = await contract.cancelProposal(oldProposalID, newProposalID, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Recount a proposal's votes (this function is only run when a user adds voting weight, hence supplying this manual function might be helpful in the UI)
export const bondProposalRecount = async (proposalID) => {
    let contract = getBondContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.countVotes(proposalID)
    const result = await contract.countVotes(proposalID, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}