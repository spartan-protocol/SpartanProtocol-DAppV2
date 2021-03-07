import { ethers } from "ethers";

import ROUTER from '../config/ABI/Router.json'
// import SYNTH_ROUTER from '../config/ABI/synthRouter.json'
// import LEVERAGE from '../config/ABI/Leverage.json'
import { getWalletProvider, getProviderGasPrice } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const INCENTIVE_ADDR = net === 'testnet' ? '0xc241d694d51db9e934b147130cfefe8385813b86' : '0xdbe936901aeed4718608d0574cbaab01828ae016'
export const ROUTERv1_ADDR = net === 'testnet' ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'
export const ROUTERv2a_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0xDbe936901aeed4718608D0574cbAAb01828AE016'
export const ROUTERv2b_ADDR = net === 'testnet' ? '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50' : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'
export const ROUTERv2c_ADDR = net === 'testnet' ? '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50' : '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D'

// CURRENT CONTRACT ADDRESSES
export const ROUTER_ADDR = ROUTERv2c_ADDR

// FUTURE CONTRACT ADDRESSES
// export const pROUTERv1_ADDR = net === 'testnet' ? '' : ''
// export const sROUTERv1_ADDR = net === 'testnet' ? '' : ''
// export const LEVERAGEv1_ADDR = net === 'testnet' ? '' : ''

// ABI
export const ROUTER_ABI = ROUTER.abi
// export const SYNTH_ROUTER_ABI = SYNTH_ROUTER.abi
// export const LEVERAGE_ABI = LEVERAGE.abi

// --------------------------------------- HANDLE CONTRACTS ---------------------------------------

// GET ROUTER CONTRACT
export const getRouterContract = () => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(ROUTER_ADDR, ROUTER_ABI, provider)
    console.log(contract)
    return contract
}

// --------------------------------------- ROUTER HELPERS ---------------------------------------

// Get LP-token address from token address
export const getPool = async (token) => {
    let contract = getRouterContract()
    const result = await contract.callStatic.getPool(token)
    console.log(result)
    return result
}

// Get count of tokens listed in pools
export const getTokenCount = async () => {
    let contract = getRouterContract()
    const result = await contract.callStatic.tokenCount()
    console.log(result)
    return result
}

// Get TVL in SPARTA-terms (Total value locked in SPARTA value)
export const getTotalPooledValue = async () => {
    let contract = getRouterContract()
    const result = await contract.callStatic.totalPooled()
    console.log(result)
    return result
}

// --------------------------------------- ROUTER FUNCTIONS ---------------------------------------

// LIQUIDITY - Add Symmetrically
export const routerAddLiq = async (inputBase, inputToken, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidity(inputBase, inputToken, token)
    const result = await contract.addLiquidity(inputBase, inputToken, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Add Asymmetrically
export const routerAddLiqAsym = async (inputToken, fromBase, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidityAsym(inputToken, fromBase, token)
    const result = await contract.addLiquidityAsym(inputToken, fromBase, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Remove Symmetrically by percentage (0 to 10,000 basisPoints)
export const routerRemoveLiq = async (basisPoints, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.removeLiquidity(basisPoints, token)
    const result = await contract.removeLiquidity(basisPoints, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Remove Asymmetrically by percentage (0 to 10,000 basisPoints)
export const routerRemoveLiqAsym = async (basisPoints, toBase, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.removeLiquidityAndSwap(basisPoints, toBase, token)
    const result = await contract.removeLiquidityAndSwap(basisPoints, toBase, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// Swap one token for another
export const routerSwapAssets = async (inputAmount, fromToken, toToken) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.swap(inputAmount, fromToken, toToken)
    const result = await contract.swap(inputAmount, fromToken, toToken, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}