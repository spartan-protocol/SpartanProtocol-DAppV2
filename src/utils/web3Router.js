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
export const ROUTERv2b_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'
export const ROUTERv2c_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D'

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

// --------------------------------------- HELPERS ---------------------------------------

// Get LP-token address from token address
export const getPool = async (token) => {
    let contract = getRouterContract()
    const result = await contract.callStatic.getPool(token)
    console.log(result)
    return result
}

// --------------------------------------- FUNCTIONS ---------------------------------------

// LIQUIDITY - Add Symmetrically
export const addLiquidity = async (inputBase, inputToken, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidity(inputBase, inputToken, token)
    const result = await contract.addLiquidity(inputBase, inputToken, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Add Asymmetrically
export const addLiquidityAsym = async (inputToken, fromBase, token) => {
    let contract = getRouterContract()
    const gPrice = await getProviderGasPrice()
    const gLimit = await contract.estimateGas.addLiquidityAsym(inputToken, fromBase, token)
    const result = await contract.addLiquidityAsym(inputToken, fromBase, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Remove Symmetrically

// LIQUIDITY - Remove Asymmetrically