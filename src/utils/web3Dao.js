import { ethers } from "ethers";

import DAO from '../config/ABI/Dao.json'
// import DAOVAULT from '../config/ABI/DaoVault.json'
import { getWalletProvider, getProviderGasPrice } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const DAOv1_ADDR = net === 'testnet' ? '0x1b83a813045165c81d84b9f5d6916067b57FF9C0' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

// CURRENT CONTRACT ADDRESSES
export const DAO_ADDR = net === 'testnet' ? '0x1b83a813045165c81d84b9f5d6916067b57FF9C0' : '0x04e283c9350Bab8A1243ccfc1dd9BF1Ab72dF4f0'

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

// --------------------------------------- HELPERS ---------------------------------------

// function calcCurrentReward(address member) public returns(uint){


// --------------------------------------- FUNCTIONS ---------------------------------------

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