import {
    ethers
} from "ethers";

import ERC20 from '../config/ABI/ERC20.json'

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// TOKEN ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xb58a43D2D9809ff4393193de536F242fefb03613' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'

// ABI
export const ERC20_ABI = ERC20.abi

// CONNECT WITH PROVIDER (& SIGNER IF WALLET IS CONNECTED)
export const getWalletProvider = () => {
    let provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    let connectedWalletType = ''
    if (window.sessionStorage.getItem('lastWallet') === 'BC') {
        connectedWalletType = window.BinanceChain
    } else {
        connectedWalletType = window.ethereum
    }
    if (window.sessionStorage.getItem('walletConnected')) {
        provider = new ethers.providers.Web3Provider(connectedWalletType)
        provider = provider.getSigner()
    }
    return provider
}

// GET GAS PRICE FROM PROVIDER
export const getProviderGasPrice = () => {
    let provider = getWalletProvider()
    let gasPrice = provider.getGasPrice()
    return gasPrice
}

// CONNECT TO CONTRACT WITH PROVIDER & SIGNER IF AVAILABLE
export const getTokenContract = (tokenAddress) => {
    let provider = getWalletProvider()
    let contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    return contract
}

// GET allowance APPROVAL FOR ASSET TO INTERACT WITH CONTRACT VIA WALLET
export const newApproval = async (tokenAddress, contractAddress) => {
    let provider = getWalletProvider()
    let contract = getTokenContract(tokenAddress)
    let supply = await contract.totalSupply()
    const gPrice = await provider.getGasPrice()
    const gLimit = await contract.estimateGas.approve(contractAddress, supply)
    contract = await contract.approve(contractAddress, supply, {
        gasPrice: gPrice,
        gasLimit: gLimit
    })
    console.log(contract)
    return contract
}

// Check approval allowance 
export const getApprovalAllowance = async (tokenAddress, userAddress, contractAddress) => {
    let contract = getTokenContract(tokenAddress)
    let result = await contract.allowance(userAddress, contractAddress)
    console.log(result)
    return result
}

// ADD TOKEN INFO TO WALLET
export const watchAsset = async (tokenAddress, tokenSymbol, tokenDecimals, tokenImage) => {
    let connectedWalletType = ''
    if (window.sessionStorage.getItem('lastWallet') === 'BC') {
        connectedWalletType = window.BinanceChain
    } else {
        connectedWalletType = window.ethereum
    }
    if (window.sessionStorage.getItem('walletConnected')) {
        try {
            const wasAdded = await connectedWalletType.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            })
            if (wasAdded) {
                console.log('Token added to wallet watch list')
            } else {
                console.log('Token not added to wallet watch list')
            }
        } catch (error) {
            console.log(error)
        }
    }
    else {console.log('Please connect your wallet first')}
}
