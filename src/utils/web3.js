import { ethers } from "ethers";

const rpcUrl = process.env.REACT_APP_RPC
const net = process.env.REACT_APP_NET

// TOKEN ADDRESSES
export const BNB_ADDR = '0x0000000000000000000000000000000000000000'
export const WBNB_ADDR = net === 'testnet' ? '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870' : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
export const SPARTA_ADDR = net === 'testnet' ? '0xb58a43D2D9809ff4393193de536F242fefb03613' : '0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C'

// CONNECT ROUTER CONTRACT WITH PROVIDER & SIGNER IF AVAILABLE
export const getWalletProvider = () => {
    let provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    let connectedWalletType = ''
    if (window.sessionStorage.getItem('lastWallet') === 'BC') {connectedWalletType = window.BinanceChain}
    else {connectedWalletType = window.ethereum}
    let tempProvider = new ethers.providers.Web3Provider(connectedWalletType)
    if (window.sessionStorage.getItem('walletConnected')) {provider = tempProvider}
    provider = provider.getSigner()
    console.log(provider)
    return provider
}