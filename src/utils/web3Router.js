import { ethers } from 'ethers'

import {
  getAbis,
  getAddresses,
  getProviderGasPrice,
  getWalletProvider,
} from './web3'

const addr = getAddresses()

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET ROUTER CONTRACT
export const getRouterContract = () => {
  const abiRouter = getAbis().router
  const provider = getWalletProvider()
  const contract = new ethers.Contract(addr.router, abiRouter, provider)
  return contract
}

// --------------------------------------- ASYNC FUNCTIONS TO BE MOVED TO STORE ---------------------------------------

/**
 * Add liquidity asymmetrically
 * @param {uint} inputToken
 * @param {bool} fromBase
 * @param {address} token
 * @returns {unit} units
 */
export const routerAddLiqAsym = async (inputToken, fromBase, token) => {
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidityAsym(
      inputToken,
      fromBase,
      token,
    )
    const units = await contract.addLiquidityAsym(inputToken, fromBase, token, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(units)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Swap LP tokens for other LP tokens
 * @param {uint} unitsLP
 * @param {address} fromToken
 * @param {address} toToken
 * @returns {unit} units
 * @returns {unit} fee
 */
export const routerZapLiquidity = async (unitsLP, fromToken, toToken) => {
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.zapLiquidity(
      unitsLP,
      fromToken,
      toToken,
    )
    const proposalID = await contract.zapLiquidity(
      unitsLP,
      fromToken,
      toToken,
      {
        gasPrice: gPrice,
        gasLimit: gLimit,
      },
    )

    console.log(proposalID)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Remove liquidity asymmetrically
 * @param {uint} units
 * @param {bool} toBase
 * @param {address} token
 * @returns {unit} outputAmount
 * @returns {unit} fee
 */
export const routerRemoveLiqAsym = async (units, toBase, token) => {
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.removeLiquidityAsym(
      units,
      toBase,
      token,
    )
    const liquidity = await contract.removeLiquidityAsym(units, toBase, token, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(liquidity)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Swap SPARTA for synthetic assets
 * @param {uint} inputAmount
 * @param {address} synthOut
 * @returns {unit} outputSynth
 */
export const routerSwapBaseToSynth = async (inputAmount, synthOut) => {
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.swapBaseToSynth(
      inputAmount,
      synthOut,
    )
    const outputSynth = await contract.swapBaseToSynth(inputAmount, synthOut, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(outputSynth)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Swap synthetic assets for SPARTA
 * @param {uint} inputAmount
 * @param {address} synthIn
 * @returns {unit} output
 */
export const routerSwapSynthToBase = async (inputAmount, synthIn) => {
  const contract = getRouterContract()

  try {
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.swapSynthToBase(
      inputAmount,
      synthIn,
    )
    const output = await contract.swapSynthToBase(inputAmount, synthIn, {
      gasPrice: gPrice,
      gasLimit: gLimit,
    })

    console.log(output)
  } catch (error) {
    console.log(error)
  }
}
