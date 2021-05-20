import * as Types from './types'
import {
  getFallenSpartansContract,
  getSpartaContract,
} from '../../utils/web3Contracts'
import { payloadToDispatch, errorToDispatch } from '../helpers'
import { getProviderGasPrice } from '../../utils/web3'

export const spartaLoading = () => ({
  type: Types.SPARTA_LOADING,
})

export const getSpartaGlobalDetails = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getSpartaContract(wallet)
  const fsContract = getFallenSpartansContract(wallet)

  try {
    let awaitArray = [
      contract.callStatic.emitting(),
      // contract.callStatic.minting(),
      // contract.callStatic.feeOnTransfer(),
      // contract.callStatic.emissionCurve(),
      contract.callStatic.secondsPerEra(),
      // contract.callStatic.nextEraTime(),
      fsContract.callStatic.genesis(),
    ]
    awaitArray = await Promise.all(awaitArray)
    const globalDetails = {
      emitting: awaitArray[0],
      // minting: awaitArray[],
      // feeOnTransfer: awaitArray[],
      // emissionCurve: awaitArray[],
      secondsPerEra: awaitArray[1].toString(),
      // nextEraTime: awaitArray[],
      fsGenesis: awaitArray[2].toString(),
    }
    dispatch(payloadToDispatch(Types.SPARTA_GLOBAL_DETAILS, globalDetails))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}

/**
 * Upgrade SPARTA(old V1) to SPARTA(New V2)
 */
export const spartaUpgrade = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getSpartaContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const upgrade = await contract.upgrade({
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.SPARTA_UPGRADE, upgrade))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}

/**
 * Check if your wallet was affected by the attacks and your SPARTA amount available to claim
 * @param {object} wallet
 * @returns {uint} claimAmount
 */
export const fallenSpartansCheck = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getFallenSpartansContract(wallet)

  try {
    const claimCheck = await contract.callStatic.getClaim(wallet.account)
    dispatch(payloadToDispatch(Types.FALLENSPARTA_CHECK, claimCheck.toString()))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}

/**
 * Claim your wallet portion from the fallenSparta fund
 */
export const fallenSpartansClaim = (wallet) => async (dispatch) => {
  dispatch(spartaLoading())
  const contract = getFallenSpartansContract(wallet)

  try {
    const gPrice = await getProviderGasPrice()
    const claim = await contract.claim({
      gasPrice: gPrice,
    })

    dispatch(payloadToDispatch(Types.FALLENSPARTA_CLAIM, claim))
  } catch (error) {
    dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
  }
}

// OLD SPARTA CONTRACT FUNCTION
// export const getAdjustedClaimRate = (assetAddress) => async (dispatch) => {
//   dispatch(spartaLoading())
//   const contract = getSpartaContract()

//   try {
//     const adjustedClaimRate = await contract.callStatic.getAdjustedClaimRate(
//       assetAddress,
//     )
//     dispatch(
//       payloadToDispatch(Types.SPARTA_ADJUSTED_CLAIM_RATE, adjustedClaimRate),
//     )
//   } catch (error) {
//     dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
//   }
// }

// OLD SPARTA CONTRACT FUNCTION
// export const claim = (assetAddress, amount, justCheck) => async (dispatch) => {
//   dispatch(spartaLoading())
//   const provider = getWalletProvider()
//   const contract = getSpartaContract()

//   try {
//     let claimed = {}
//     if (justCheck) {
//       claimed = await contract.callStatic.claim(assetAddress, amount)
//     } else {
//       const gPrice = await provider.getGasPrice()
//       // const gLimit = await contract.estimateGas.claim(assetAddress, amount)
//       claimed = await contract.claim(assetAddress, amount, {
//         gasPrice: gPrice,
//         // gasLimit: gLimit,
//       })
//     }
//     dispatch(payloadToDispatch(Types.SPARTA_CLAIM, claimed))
//   } catch (error) {
//     dispatch(errorToDispatch(Types.SPARTA_ERROR, `${error}.`))
//   }
// }
