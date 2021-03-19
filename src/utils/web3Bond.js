import { ethers } from 'ethers'

import {
  getAbis,
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET OLDER BOND CONTRACT (v1, v2, v3)
export const getOldBondContract = (bondAddress) => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(bondAddress, abiBond, provider)
  return contract
}

// GET CURRENT BOND CONTRACT
export const getBondContract = () => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bond, abiBond, provider)
  return contract
}

// --------------------------------------- HELPER ASYNC FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * Get a count of all bond-listed assets
 * @returns {uint256} count
 */
export const getBondListedCount = () => async () => {
  const contract = getBondContract()

  try {
    const bondListedCount = await contract.callStatic.assetListedCount()
    console.log(bondListedCount)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a count of all bond members
 * @returns {uint256} count
 */
export const getBondMemberCount = () => async () => {
  const contract = getBondContract()

  try {
    const memberCount = await contract.callStatic.memberCount()
    console.log(memberCount)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get an array of all bond members
 * @returns {address} array all members
 */
export const getBondMembers = () => async () => {
  const contract = getBondContract()

  try {
    const members = await contract.callStatic.allMembers()
    console.log(members)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a bond members' details
 * @param {address} member
 * @param {address} asset
 * @returns {object} isMember, bondedLP, claimRate, lastBlockTime
 */
export const getBondMemberDetails = () => async () => {
  const contract = getBondContract()

  try {
    const memberDetails = await contract.callStatic.allMembers()
    console.log(memberDetails)
  } catch (error) {
    console.log(error)
  }
}

// --------------------------------------- ASYNC FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * Claim bond by asset & member
 * @param {address} asset
 * @param {address} member
 * @returns {boolean}
 */
export const bondClaimAsset = async (asset, member) => {
  const contract = getBondContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.claimForMember(asset, member)
    const bondClaimed = await contract.claimForMember(asset, member, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(bondClaimed)
  } catch (error) {
    console.log(error)
  }
}
