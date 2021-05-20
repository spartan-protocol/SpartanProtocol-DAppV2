import { getProviderGasPrice } from './web3'
import { getMigrateContract } from './web3Contracts'

// ---------------- ASYNC FUNCTIONS FOR STORE (WAIT FOR PHASE 2 BEFORE CREATING THE STORE, DAPPV1 WILL HANDLE MIGRATION FOR NOW) ---------------

/**
 * Migrate liquidity
 * @param {object} wallet
 * @returns {bool}
 */
export const migrateLiq = async (wallet, justCheck) => {
  const contract = getMigrateContract(wallet)
  let migratedLiq = ''
  try {
    if (justCheck) {
      migratedLiq = await contract.callStatic.migrateLiquidity()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.migrateLiquidity()
      migratedLiq = await contract.migrateLiquidity({
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    console.log(migratedLiq)
  } catch (error) {
    console.log(error)
  }
  return migratedLiq
}

/**
 * Migrate bondV2
 * @param {address} token
 * @param {object} wallet
 * @returns {bool}
 */
export const migrateBondV2 = async (token, wallet, justCheck) => {
  const contract = getMigrateContract(wallet)
  let migratedBond = ''
  try {
    if (justCheck) {
      migratedBond = await contract.callStatic.upgradeBond(token)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.upgradeBond(token)
      migratedBond = await contract.upgradeBond(token, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    console.log(migratedBond)
  } catch (error) {
    console.log(error)
  }
  return migratedBond
}

/**
 * Migrate bondV3
 * @param {address} token
 * @param {object} wallet
 * @returns {bool}
 */
export const migrateBondV3 = async (wallet, justCheck) => {
  const contract = getMigrateContract(wallet)
  let migratedBond = ''
  try {
    if (justCheck) {
      migratedBond = await contract.callStatic.upgradeBONDv3()
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.upgradeBONDv3()
      migratedBond = await contract.upgradeBONDv3({
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    console.log(migratedBond)
  } catch (error) {
    console.log(error)
  }
  return migratedBond
}
