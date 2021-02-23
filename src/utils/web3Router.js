import { ethers } from "ethers";

import ROUTER from '../config/ABI/Router.json'
// import SYNTH_ROUTER from '../config/ABI/synthRouter.json'
// import LEVERAGE from '../config/ABI/Leverage.json'
import { getWalletProvider } from "./web3"

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const INCENTIVE_ADDR = net === 'testnet' ? '0xc241d694d51db9e934b147130cfefe8385813b86' : '0xdbe936901aeed4718608d0574cbaab01828ae016'
export const ROUTERv1_ADDR = net === 'testnet' ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3' : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'
export const ROUTERv2_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'

// CURRENT CONTRACT ADDRESSES
export const ROUTER_ADDR = net === 'testnet' ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35' : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'

// FUTURE CONTRACT ADDRESSES
// export const pROUTER_ADDR = net === 'testnet' ? '' : ''
// export const sROUTER_ADDR = net === 'testnet' ? '' : ''
// export const LEVERAGE_ADDR = net === 'testnet' ? '' : ''

// ABI
export const ROUTER_ABI = ROUTER.abi
// export const SYNTH_ROUTER_ABI = SYNTH_ROUTER.abi
// export const LEVERAGE_ABI = LEVERAGE.abi

// LIQUIDITY - Add Symmetrically
export const addLiquidity = async (inputBase, inputToken, token) => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(ROUTER_ADDR, ROUTER_ABI, provider)
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.addLiquidity(inputBase, inputToken, token)
    const result = await contract.addLiquidity(inputBase, inputToken, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// LIQUIDITY - Add Asymmetrically
export const addLiquidityAsym = async (inputToken, fromBase, token) => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(ROUTER_ADDR, ROUTER_ABI, provider)
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.addLiquidityAsym(inputToken, fromBase, token)
    const result = await contract.addLiquidityAsym(inputToken, fromBase, token, {gasPrice: gPrice, gasLimit: gLimit})
    console.log(result)
    return result
}

// // LIQUIDITY - Remove Symmetrically
// export const removeLiquidity = (basisPoints, token, send, account) => {
//     let contract = provROUTER()
//     console.log(contract)
//     if (send === true) {contract = signContract(contract, account)}
//     console.log(contract)
//     const units = contract.removeLiquidity(basisPoints, token);
//     return units;
// }

// LIQUIDITY - Remove Asymmetrically