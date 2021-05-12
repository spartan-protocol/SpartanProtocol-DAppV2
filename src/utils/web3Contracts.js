import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const addr = getAddresses()

const isAddress = (addrToCheck) => ethers.utils.isAddress(addrToCheck)

/**
 * Get a BEP20 token contract with signer/provider injected
 * @param {address} tokenAddr
 * @returns {uint} contract
 */
export const getTokenContract = (tokenAddr) => {
  let contract = isAddress(tokenAddr)
  const abiErc20 = getAbis().erc20
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(tokenAddr, abiErc20, provider)
  }
  return contract
}

/**
 * Get the current Reserve contract with signer/provider injected
 * @returns {uint} contract
 */
export const getReserveContract = () => {
  let contract = isAddress(addr.reserve)
  const abiReserve = getAbis().reserve
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.reserve, abiReserve, provider)
  }
  return contract
}

/**
 * Get the older bond contracts with signer/provider injected
 * @param {address} bondAddress
 * @returns {uint} contract
 */
export const getOldBondContract = (bondAddress) => {
  let contract = isAddress(bondAddress)
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(bondAddress, abiBond, provider)
  }
  return contract
}

/**
 * Get the current bond contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondContract = () => {
  let contract = isAddress(addr.bond)
  const abiBond = getAbis().bond
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.bond, abiBond, provider)
  }
  return contract
}

/**
 * Get the current bondVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondVaultContract = () => {
  let contract = isAddress(addr.bondVault)
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.bondVault, abiBondVault, provider)
  }
  return contract
}

/**
 * Get the current DAO contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoContract = () => {
  let contract = isAddress(addr.dao)
  const abiDao = getAbis().dao
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.dao, abiDao, provider)
  }
  return contract
}

/**
 * Get the current DAO Vault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoVaultContract = () => {
  let contract = isAddress(addr.daoVault)
  const abiDaoVault = getAbis().daoVault
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.daoVault, abiDaoVault, provider)
  }
  return contract
}

// GET LOAN CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanContract = () => {
  let contract = isAddress(addr.loan)
  const abiLoan = getAbis().daoLoan
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.loan, abiLoan, provider)
  }
  return contract
}

// GET LOANVAULT CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanVaultContract = () => {
  let contract = isAddress(addr.loanVault)
  const abiLoanVault = getAbis().daoLoanVault
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.loanVault, abiLoanVault, provider)
  }
  return contract
}

/**
 * Get the current migration contract with signer/provider injected
 * @returns {uint} contract
 */
export const getMigrateContract = () => {
  let contract = isAddress(addr.migrate)
  const abiMigrate = getAbis().migrate
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.migrate, abiMigrate, provider)
  }
  return contract
}

/**
 * Get the current pool contract with signer/provider injected
 * @param {address} poolAddress
 * @returns {uint} contract
 */
export const getPoolContract = (poolAddress) => {
  let contract = isAddress(poolAddress)
  const abiPool = getAbis().pool
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(poolAddress, abiPool, provider)
  }
  return contract
}

/**
 * Get the current poolFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getPoolFactoryContract = () => {
  let contract = isAddress(addr.poolFactory)
  const abiPoolFactory = getAbis().poolFactory
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.poolFactory, abiPoolFactory, provider)
  }
  return contract
}

/**
 * Get the current router contract with signer/provider injected
 * @returns {uint} contract
 */
export const getRouterContract = () => {
  let contract = isAddress(addr.router)
  const abiRouter = getAbis().router
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.router, abiRouter, provider)
  }
  return contract
}

/**
 * Get the current base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaContract = () => {
  let contract = isAddress(addr.sparta)
  const abiBase = getAbis().sparta
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.sparta, abiBase, provider)
  }
  return contract
}

/**
 * Get the current fallenSpartans contract with signer/provider injected
 * @returns {uint} contract
 */
export const getFallenSpartansContract = () => {
  let contract = isAddress(addr.fallenSpartans)
  const abiFS = getAbis().fallenSpartans
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.fallenSpartans, abiFS, provider)
  }
  return contract
}

/**
 * Get the current synth contract with signer/provider injected
 * @param {address} synthAddress
 * @returns {uint} contract
 */
export const getSynthContract = (synthAddress) => {
  let contract = isAddress(synthAddress)
  const abiSynth = getAbis().synth
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(synthAddress, abiSynth, provider)
  }
  return contract
}

/**
 * Get the current synthFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthFactoryContract = () => {
  let contract = isAddress(addr.synthFactory)
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.synthFactory, abiSynthFactory, provider)
  }
  return contract
}

/**
 * Get the current synthVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthVaultContract = () => {
  let contract = isAddress(addr.synthVault)
  const abiSynthVault = getAbis().synthVault
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.synthVault, abiSynthVault, provider)
  }
  return contract
}

/**
 * Get the current utils contract with signer/provider injected
 * @returns {uint} contract
 */
export const getUtilsContract = () => {
  let contract = isAddress(addr.utils)
  const abiUtils = getAbis().utils
  const provider = getWalletProvider()
  if (contract === true) {
    contract = new ethers.Contract(addr.utils, abiUtils, provider)
  }
  return contract
}
