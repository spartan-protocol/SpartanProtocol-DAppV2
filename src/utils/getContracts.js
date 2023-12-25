import { createPublicClient, getContract, http, isAddress } from 'viem'
import { bsc } from 'viem/chains'

import { getAbis, getAddresses, getWalletProvider } from './web3'

const getClient = (provider) => {
  if (provider.account) {
    return { walletClient: provider }
  }
  return { publicClient: provider }
}

/**
 * Get a BEP20 token contract with signer/provider injected
 * @param tokenAddr @param wallet
 * @returns contract
 */
export const getTokenContract = (tokenAddr, wallet, rpcUrls) => {
  let contract = isAddress(tokenAddr)
  const abiErc20 = getAbis().erc20
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiErc20,
      address: tokenAddr,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current Reserve contract with signer/provider injected
 * @returns {uint} contract
 */
export const getReserveContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().reserve)
  const abiReserve = getAbis().reserve
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiReserve,
      address: getAddresses().reserve,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the older bond contracts with signer/provider injected
 * @param bondAddress @param wallet
 * @returns contract
 */
export const getOldBondContract = (bondAddress, wallet, rpcUrls) => {
  let contract = isAddress(bondAddress)
  const abiBond = getAbis().bond
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiBond,
      address: bondAddress,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current bondVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getBondVaultContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().bondVault)
  const abiBondVault = getAbis().bondVault
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiBondVault,
      address: getAddresses().bondVault,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current DAO contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().dao)
  const abiDao = getAbis().dao
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiDao,
      address: getAddresses().dao,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current DAO Vault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getDaoVaultContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().daoVault)
  const abiDaoVault = getAbis().daoVault
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiDaoVault,
      address: getAddresses().daoVault,
      ...getClient(provider),
    })
  }
  return contract
}

// GET LOAN CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().loan)
  const abiLoan = getAbis().daoLoan
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiLoan,
      address: getAddresses().loan,
      ...getClient(provider),
    })
  }
  return contract
}

// GET LOANVAULT CONTRACT ** CHECK / UPDATE THIS AFTER V1 ROLLOUT **
export const getLoanVaultContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().loanVault)
  const abiLoanVault = getAbis().daoLoanVault
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiLoanVault,
      address: getAddresses().loanVault,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current pool contract with signer/provider injected
 * @param {address} poolAddress
 * @returns {uint} contract
 */
export const getPoolContract = (poolAddress, wallet, rpcUrls) => {
  let contract = isAddress(poolAddress)
  const abiPool = getAbis().pool
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiPool,
      address: poolAddress,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current poolFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getPoolFactoryContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().poolFactory)
  const abiPoolFactory = getAbis().poolFactory
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiPoolFactory,
      address: getAddresses().poolFactory,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current router contract with signer/provider injected
 * @returns {uint} contract
 */
export const getRouterContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().router)
  const abiRouter = getAbis().router
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiRouter,
      address: getAddresses().router,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the old base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaV1Contract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().spartav1)
  const abiBase = getAbis().sparta
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiBase,
      address: getAddresses().spartav1,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current base/SPARTA contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSpartaV2Contract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().spartav2)
  const abiSparta = getAbis().sparta
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiSparta,
      address: getAddresses().spartav2,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current base/SPARTA contract with API provider injected
 * @returns {uint} contract
 */
export const getSpartaV2API = () => {
  let contract = isAddress(getAddresses().spartav2)
  const abiSparta = getAbis().sparta
  const client = createPublicClient({
    chain: bsc,
    transport: http(
      `https://bsc.getblock.io/?api_key=${process.env.REACT_APP_GETBLOCK}`,
    ),
  })
  if (contract === true) {
    contract = getContract({
      abi: abiSparta,
      address: getAddresses().spartav2,
      publicClient: client,
    })
  }
  return contract
}

/**
 * Get the current fallenSpartans contract with signer/provider injected
 * @returns {uint} contract
 */
export const getFallenSpartansContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().fallenSpartans)
  const abiFS = getAbis().fallenSpartans
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiFS,
      address: getAddresses().fallenSpartans,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current synth contract with signer/provider injected
 * @param {address} synthAddress
 * @returns {uint} contract
 */
export const getSynthContract = (synthAddress, wallet, rpcUrls) => {
  let contract = isAddress(synthAddress)
  const abiSynth = getAbis().synth
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiSynth,
      address: synthAddress,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current synthFactory contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthFactoryContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().synthFactory)
  const abiSynthFactory = getAbis().synthFactory
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiSynthFactory,
      address: getAddresses().synthFactory,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current synthVault contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSynthVaultContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().synthVault)
  const abiSynthVault = getAbis().synthVault
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiSynthVault,
      address: getAddresses().synthVault,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the current utils contract with signer/provider injected
 * @returns {uint} contract
 */
export const getUtilsContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().utils)
  const abiUtils = getAbis().utils
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiUtils,
      address: getAddresses().utils,
      ...getClient(provider),
    })
  }
  return contract
}

/**
 * Get the SpartanSwap Utils contract with signer/provider injected
 * @returns {uint} contract
 */
export const getSSUtilsContract = (wallet, rpcUrls) => {
  let contract = isAddress(getAddresses().ssUtils)
  const abiSSUtils = getAbis().ssUtils
  const provider = getWalletProvider(wallet ?? null, rpcUrls)
  if (contract === true) {
    contract = getContract({
      abi: abiSSUtils,
      address: getAddresses().ssUtils,
      ...getClient(provider),
    })
  }
  return contract
}
