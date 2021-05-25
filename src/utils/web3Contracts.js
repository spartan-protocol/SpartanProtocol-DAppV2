import { ethers } from 'ethers'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const isAddress = (addrToCheck) => ethers.utils.isAddress(addrToCheck)

/**
 * Get a BEP20 token contract with signer/provider injected
 * @param {address} tokenAddr
 * @returns {uint} contract
 */
export const getTokenContract = (tokenAddr, wallet) => {
  let contract = isAddress(tokenAddr)
  const abiErc20 = getAbis().erc20
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(tokenAddr, abiErc20, provider)
  }
  return contract
}

/**
 * Get the current Reserve contract with signer/provider injected
 * @returns {uint} contract
 */
export const getReserveContract = (wallet) => {
  let contract = isAddress(getAddresses().reserve)
  const abiReserve = getAbis().reserve
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().reserve, abiReserve, provider)
  }
  return contract
}

/**
 * Get the older bond contracts with signer/provider injected
 * @param {address} bondAddress
 * @returns {uint} contract
 */
export const getOldBondContract = (bondAddress, wallet) => {
  let contract = isAddress(bondAddress)
  const abiBond = getAbis().bond
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(bondAddress, abiBond, provider)
  }
  return contract
}

/**
 * Get the current bondVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondVaultContract = (wallet) => {
  let contract = isAddress(getAddresses().bondVault)
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().bondVault,
      abiBondVault,
      provider,
    )
  }
  return contract
}

/**
 * Get the current DAO contract with signer/provider injected
 * @param {object} wallet
 * @returns {uint} contract
 */
export const getDaoContract = (wallet) => {
  let contract = isAddress(getAddresses().dao)
  const abiDao = getAbis().dao
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().dao, abiDao, provider)
  }
  return contract
}

/**
 * Get the current DAO Vault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoVaultContract = (wallet) => {
  let contract = isAddress(getAddresses().daoVault)
  const abiDaoVault = getAbis().daoVault
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().daoVault,
      abiDaoVault,
      provider,
    )
  }
  return contract
}

// GET LOAN CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanContract = (wallet) => {
  let contract = isAddress(getAddresses().loan)
  const abiLoan = getAbis().daoLoan
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().loan, abiLoan, provider)
  }
  return contract
}

// GET LOANVAULT CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanVaultContract = (wallet) => {
  let contract = isAddress(getAddresses().loanVault)
  const abiLoanVault = getAbis().daoLoanVault
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().loanVault,
      abiLoanVault,
      provider,
    )
  }
  return contract
}

/**
 * Get the current migration contract with signer/provider injected
 * @returns {uint} contract
 */
export const getMigrateContract = (wallet) => {
  let contract = isAddress(getAddresses().migrate)
  const abiMigrate = getAbis().migrate
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().migrate, abiMigrate, provider)
  }
  return contract
}

/**
 * Get the current pool contract with signer/provider injected
 * @param {address} poolAddress
 * @param {object} wallet
 * @returns {uint} contract
 */
export const getPoolContract = (poolAddress, wallet) => {
  let contract = isAddress(poolAddress)
  const abiPool = getAbis().pool
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(poolAddress, abiPool, provider)
  }
  return contract
}

/**
 * Get the current poolFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getPoolFactoryContract = (wallet) => {
  let contract = isAddress(getAddresses().poolFactory)
  const abiPoolFactory = getAbis().poolFactory
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().poolFactory,
      abiPoolFactory,
      provider,
    )
  }
  return contract
}

/**
 * Get the current router contract with signer/provider injected
 * @returns {uint} contract
 */
export const getRouterContract = (wallet) => {
  let contract = isAddress(getAddresses().router)
  const abiRouter = getAbis().router
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().router, abiRouter, provider)
  }
  return contract
}

/**
 * Get the old base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaV1Contract = (wallet) => {
  let contract = isAddress(getAddresses().spartav1)
  const abiBase = getAbis().sparta
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().spartav1, abiBase, provider)
  }
  return contract
}

/**
 * Get the current base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaV2Contract = (wallet) => {
  let contract = isAddress(getAddresses().spartav2)
  const abiBase = getAbis().sparta
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().spartav2, abiBase, provider)
  }
  return contract
}

/**
 * Get the current fallenSpartans contract with signer/provider injected
 * @returns {uint} contract
 */
export const getFallenSpartansContract = (wallet) => {
  let contract = isAddress(getAddresses().fallenSpartans)
  const abiFS = getAbis().fallenSpartans
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().fallenSpartans,
      abiFS,
      provider,
    )
  }
  return contract
}

/**
 * Get the current synth contract with signer/provider injected
 * @param {address} synthAddress
 * @returns {uint} contract
 */
export const getSynthContract = (synthAddress, wallet) => {
  let contract = isAddress(synthAddress)
  const abiSynth = getAbis().synth
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(synthAddress, abiSynth, provider)
  }
  return contract
}

/**
 * Get the current synthFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthFactoryContract = (wallet) => {
  let contract = isAddress(getAddresses().synthFactory)
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().synthFactory,
      abiSynthFactory,
      provider,
    )
  }
  return contract
}

/**
 * Get the current synthVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthVaultContract = (wallet) => {
  let contract = isAddress(getAddresses().synthVault)
  const abiSynthVault = getAbis().synthVault
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(
      getAddresses().synthVault,
      abiSynthVault,
      provider,
    )
  }
  return contract
}

/**
 * Get the current utils contract with signer/provider injected
 * @returns {uint} contract
 */
export const getUtilsContract = (wallet) => {
  let contract = isAddress(getAddresses().utils)
  const abiUtils = getAbis().utils
  const provider = getWalletProvider(wallet?.ethereum)
  if (contract === true) {
    contract = new ethers.Contract(getAddresses().utils, abiUtils, provider)
  }
  return contract
}
