import { getProviderGasPrice } from './web3'
import { getLoanContract } from './web3Contracts'

// ---------------- ASYNC FUNCTIONS FOR STORE (WAIT FOR PHASE 2 BEFORE CREATING THE STORE) ---------------

/**
 * Add collateral via the loan contract
 * @param {uint} inputLPToken
 * @param {address} lpToken
 * @param {address} loanAsset
 * @returns {uint} loanAssets
 */
export const loanAddCollateral = async (
  inputLPToken,
  lpToken,
  loanAsset,
  justCheck,
) => {
  const contract = getLoanContract()
  let loanAssets = ''
  try {
    if (justCheck) {
      loanAssets = await contract.callStatic.addCollateral(
        inputLPToken,
        lpToken,
        loanAsset,
      )
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.addCollateral(
        inputLPToken,
        lpToken,
        loanAsset,
      )
      loanAssets = await contract.addCollateral(
        inputLPToken,
        lpToken,
        loanAsset,
        {
          gasPrice: gPrice,
          gasLimit: gLimit,
        },
      )
    }
    console.log(loanAssets)
  } catch (error) {
    console.log(error)
  }
  return loanAssets
}

/**
 * Remove collateral via the loan contract
 * @param {uint} inputAmount
 * @param {address} lpToken
 * @param {address} loanAsset
 * @returns {uint} lpCollateral
 */
export const loanRemoveCollateral = async (
  inputAmount,
  lpToken,
  loanAsset,
  justCheck,
) => {
  const contract = getLoanContract()
  let lpCollateral = ''
  try {
    if (justCheck) {
      lpCollateral = await contract.callStatic.removeCollateral(
        inputAmount,
        lpToken,
        loanAsset,
      )
    } else {
      const gPrice = await getProviderGasPrice()
      const gLimit = await contract.estimateGas.removeCollateral(
        inputAmount,
        lpToken,
        loanAsset,
      )
      lpCollateral = await contract.removeCollateral(
        inputAmount,
        lpToken,
        loanAsset,
        {
          gasPrice: gPrice,
          gasLimit: gLimit,
        },
      )
    }
    console.log(lpCollateral)
  } catch (error) {
    console.log(error)
  }
  return lpCollateral
}
