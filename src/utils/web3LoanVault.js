import { getProviderGasPrice } from './web3'
import { getLoanVaultContract } from './web3Contracts'

// ---------------- ASYNC FUNCTIONS FOR STORE (WAIT FOR PHASE 2 BEFORE CREATING THE STORE THEN DELETE THIS FILE) ---------------

/**
 * Get a LoanVault member's details
 * @param {object} wallet
 * @param {address} pool
 * @returns {uint} MemberDebt
 */
export const loanVaultGetMemberDetails = async (wallet, poolAddress) => {
  const contract = getLoanVaultContract(wallet)
  const memberDebt = await contract.callStatic.getMemberDetails(
    wallet.account,
    poolAddress,
  )
  return memberDebt
}

/**
 * Get a count of all members of the loanVault
 * @returns {uint} memberCount
 */
export const loanVaultGetMemberCount = async (wallet) => {
  const contract = getLoanVaultContract(wallet)
  const memberCount = await contract.callStatic.getMemberLength()
  return memberCount
}

/**
 * Add collateral via the loanVault contract
 * @param {address} poolAddress
 * @param {object} wallet
 * @returns {uint} asset
 */
export const loanVaultAddCollateral = async (
  poolAddress,
  wallet,
  justCheck,
) => {
  const contract = getLoanVaultContract(wallet)
  let asset = ''
  try {
    if (justCheck) {
      asset = await contract.callStatic.addCollateral(poolAddress)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.addCollateral(poolAddress)
      asset = await contract.addCollateral(poolAddress, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    console.log(asset)
  } catch (error) {
    console.log(error)
  }
  return asset
}

/**
 * Remove collateral via the loanVault contract
 * @param {address} poolAddress
 * @param {object} wallet
 * @returns {array} uint outputCollateral, uint burntDebt
 */
export const loanVaultRemoveCollateral = async (
  poolAddress,
  wallet,
  justCheck,
) => {
  const contract = getLoanVaultContract(wallet)
  let outputCollateral = ''
  try {
    if (justCheck) {
      outputCollateral = await contract.callStatic.removeCollateral(poolAddress)
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.removeCollateral(poolAddress)
      outputCollateral = await contract.removeCollateral(poolAddress, {
        gasPrice: gPrice,
        gasLimit: gLimit,
      })
    }
    console.log(outputCollateral)
  } catch (error) {
    console.log(error)
  }
  return outputCollateral
}
