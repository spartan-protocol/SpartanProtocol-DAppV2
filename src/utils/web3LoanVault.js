import { getProviderGasPrice } from './web3'
import { getLoanVaultContract } from './web3Loan'

// ---------------- ASYNC FUNCTIONS FOR STORE (WAIT FOR PHASE 2 BEFORE CREATING THE STORE THEN DELETE THIS FILE) ---------------

/**
 * Get a LoanVault member's details
 * @param {address} member
 * @param {address} pool
 * @returns {uint} MemberDebt
 */
export const loanVaultGetMemberDetails = async (member, poolAddress) => {
  const contract = getLoanVaultContract()
  const memberDebt = await contract.callStatic.getMemberDetails(
    member,
    poolAddress,
  )
  return memberDebt
}

/**
 * Get a count of all members of the loanVault
 * @returns {uint} memberCount
 */
export const loanVaultGetMemberCount = async () => {
  const contract = getLoanVaultContract()
  const memberCount = await contract.callStatic.getMemberLength()
  return memberCount
}

/**
 * Add collateral via the loanVault contract
 * @param {address} poolAddress
 * @returns {uint} asset
 */
export const loanVaultAddCollateral = async (poolAddress, justCheck) => {
  const contract = getLoanVaultContract()
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
 * @returns {array} uint outputCollateral, uint burntDebt
 */
export const loanVaultRemoveCollateral = async (poolAddress, justCheck) => {
  const contract = getLoanVaultContract()
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
