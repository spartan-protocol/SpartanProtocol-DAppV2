import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

/**
 * Get the current Reserve contract with signer/provider injected
 * @returns {uint} contract
 */
export const getReserveContract = () => {
  const abiReserve = getAbis().reserve
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.reserve, abiReserve, provider)
  return contract
}

/**
 * Get the older bond contracts with signer/provider injected
 * @param {address} bondAddress
 * @returns {uint} contract
 */
export const getOldBondContract = (bondAddress) => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(bondAddress, abiBond, provider)
  return contract
}

/**
 * Get the current bond contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondContract = () => {
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bond, abiBond, provider)
  return contract
}

/**
 * Get the current bondVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondVaultContract = () => {
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.bondVault, abiBondVault, provider)
  return contract
}

/**
 * Get the current DAO contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoContract = () => {
  const abiDao = getAbis().dao
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.dao, abiDao, provider)
  return contract
}

/**
 * Get the current DAO Vault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoVaultContract = () => {
  const abiDaoVault = getAbis().daoVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.daoVault, abiDaoVault, provider)
  return contract
}

// GET LOAN CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanContract = () => {
  const abiLoan = getAbis().daoLoan
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.loan, abiLoan, provider)
  return contract
}

// GET LOANVAULT CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanVaultContract = () => {
  const abiLoanVault = getAbis().daoLoanVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.loanVault, abiLoanVault, provider)
  return contract
}

/**
 * Get the current migration contract with signer/provider injected
 * @returns {uint} contract
 */
export const getMigrateContract = () => {
  const abiMigrate = getAbis().migrate
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.migrate, abiMigrate, provider)
  return contract
}

/**
 * Get the current pool contract with signer/provider injected
 * @param {address} poolAddress
 * @returns {uint} contract
 */
export const getPoolContract = (poolAddress) => {
  const abiPool = getAbis().pool
  const provider = getWalletProvider()
  const contract = new ethers.Contract(poolAddress, abiPool, provider)
  return contract
}

/**
 * Get the current poolFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getPoolFactoryContract = () => {
  const abiPoolFactory = getAbis().poolFactory
  const provider = getWalletProvider()
  const contract = new ethers.Contract(
    addr.poolFactory,
    abiPoolFactory,
    provider,
  )
  return contract
}

/**
 * Get the current router contract with signer/provider injected
 * @returns {uint} contract
 */
export const getRouterContract = () => {
  const abiRouter = getAbis().router
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.router, abiRouter, provider)
  return contract
}

/**
 * Get the current base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaContract = () => {
  const abiBase = getAbis().sparta
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.sparta, abiBase, provider)
  return contract
}

/**
 * Get the current fallenSpartans contract with signer/provider injected
 * @returns {uint} contract
 */
export const getFallenSpartansContract = () => {
  const abiFS = getAbis().fallenSpartans
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.fallenSpartans, abiFS, provider)
  return contract
}

/**
 * Get the current synth contract with signer/provider injected
 * @param {address} synthAddress
 * @returns {uint} contract
 */
export const getSynthContract = (synthAddress) => {
  const abiSynth = getAbis().synth
  const provider = getWalletProvider()
  const contract = new ethers.Contract(synthAddress, abiSynth, provider)
  return contract
}

/**
 * Get the current synthFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthFactoryContract = () => {
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider()
  const contract = new ethers.Contract(
    addr.synthFactory,
    abiSynthFactory,
    provider,
  )
  return contract
}

/**
 * Get the current synthVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthVaultContract = () => {
  const abiSynthVault = getAbis().synthVault
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.synthVault, abiSynthVault, provider)
  return contract
}

/**
 * Get the current utils contract with signer/provider injected
 * @returns {uint} contract
 */
export const getUtilsContract = () => {
  const abiUtils = getAbis().utils
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.utils, abiUtils, provider)
  return contract
}
