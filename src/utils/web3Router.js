import { ethers } from 'ethers'

import ROUTER from '../config/ABI/Router.json'
// import SYNTH_ROUTER from '../config/ABI/synthRouter.json'
// import LEVERAGE from '../config/ABI/Leverage.json'
import { getWalletProvider } from './web3'

const net = process.env.REACT_APP_NET

// OLD CONTRACT ADDRESSES
export const INCENTIVE_ADDR =
  net === 'testnet'
    ? '0xc241d694d51db9e934b147130cfefe8385813b86'
    : '0xdbe936901aeed4718608d0574cbaab01828ae016'
// eslint-disable-next-line camelcase
export const ROUTERv1_ADDR =
  net === 'testnet'
    ? '0x94fFAD4568fF00D921C76aA158848b33D7Bd65d3'
    : '0x4ab5b40746566c09f4B90313D0801D3b93f56EF5'
// eslint-disable-next-line camelcase
export const ROUTERv2a_ADDR =
  net === 'testnet'
    ? '0x111589F4cE6f10E72038F1E4a19F7f19bF31Ee35'
    : '0xDbe936901aeed4718608D0574cbAAb01828AE016'
// eslint-disable-next-line camelcase
export const ROUTERv2b_ADDR =
  net === 'testnet'
    ? '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50'
    : '0x9dB88952380c0E35B95e7047E5114971dFf20D07'
// eslint-disable-next-line camelcase
export const ROUTERv2c_ADDR =
  net === 'testnet'
    ? '0x772E6dE5165A70B9a6aBe33fa20ddB78C28E6f50'
    : '0x6239891FC4030dc050fB9F7083aa68a2E4Fe426D'

// CURRENT CONTRACT ADDRESSES
// eslint-disable-next-line camelcase
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
  const provider = getWalletProvider()
  const contract = new ethers.Contract(ROUTER_ADDR, ROUTER_ABI, provider)
  return contract
}
