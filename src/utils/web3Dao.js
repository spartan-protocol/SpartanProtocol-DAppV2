import { ethers } from "ethers";

import DAO from '../config/ABI/Dao.json'
// import DAOVAULT from '../config/ABI/DaoVault.json'
import { getWalletProvider, getProviderGasPrice } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const DAOv1_ADDR = net === 'testnet' ? '0xbC6134840a2604D00222F276c16d143dd3666dA3' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// CURRENT CONTRACT ADDRESSES
export const DAO_ADDR = net === 'testnet' ? '0xbC6134840a2604D00222F276c16d143dd3666dA3' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// FUTURE CONTRACT ADDRESSES
// export const DAOv2_ADDR = net === 'testnet' ? '' : ''
// export const DAOVAULTv1_ADDR = net === 'testnet' ? '' : ''

// ABI
export const DAO_ABI = DAO.abi
// export const DAOVAULT_ABI = DAOVAULT.abi

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET DAO CONTRACT
export const getDaoContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(DAO_ADDR, DAO_ABI, provider)
    console.log(contract)
    return contract
}

// --------------------------------------- GENERAL DAO HELPERS ---------------------------------------

// Returns the amount of members with LP tokens locked in the DAO
export const getDaoMemberCount = async () => {
    let contract = getDaoContract()
    const result = await contract.callStatic.memberCount()
    console.log(result)
    return result
}

// Returns a specified member's details
// .isMember .weight .lastBlock .poolsCount
export const getDaoMemberDetails = async (member) => {
    let contract = getDaoContract()
    const result = await contract.callStatic.getMemberDetails(member)
    console.log(result)
    return result
}

// Returns the total weight in the DAO
export const getDaoTotalWeight = async () => {
    let contract = getDaoContract()
    const result = await contract.callStatic.totalWeight()
    console.log(result)
    return result
}

// Returns the member's weight in the DAO
export const getDaoMemberWeight = async (member) => {
    let contract = getDaoContract()
    const result = await contract.callStatic.mapMember_weight(member)
    console.log(result)
    return result
}

// Get the current harvestable amount of SPARTA from Lock+Earn
// Uses getDaoHarvestEraAmount() but works out what portion of an era/s the member can claim
export const getDaoHarvestAmount = async (member) => {
    let contract = getDaoContract()
    const result = await contract.callStatic.calcCurrentReward(member)
    console.log(result)
    return result
}

// Get the member's current harvest share of the DAO (per era)
export const getDaoHarvestEraAmount = async (member) => {
    let contract = getDaoContract()
    const result = await contract.callStatic.calcReward(member)
    console.log(result)
    return result
}

// --------------------------------------- GENERAL DAO FUNCTIONS ---------------------------------------

// DAO - Deposit LP Tokens (Lock in DAO)
export const daoDeposit = async (pool, amount) => {
    // Add a check to ensure 'pool' is listed (ROUTER.isPool(pool) == true)
    // Add a check to ensure 'amount' is greater than 0
    let contract = getDaoContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.deposit(pool, amount)
    const result = await contract.deposit(pool, amount, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// DAO - Withdraw LP Tokens (From DAO)
export const daoWithdraw = async (pool) => {
    let contract = getDaoContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.withdraw(pool)
    const result = await contract.withdraw(pool, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// DAO - Harvest SPARTA rewards (currently no emissions going in to fill-up, but later; probably 10% of emissions will go in)
export const daoHarvest = async () => {
    let contract = getDaoContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.harvest()
    const result = await contract.harvest({gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

//============================== DAO PROPOSAL HELPERS ================================//

// Wait for V2 contracts

//============================== DAO PROPOSAL FUNCTIONS ================================//

// Wait for V2 contracts