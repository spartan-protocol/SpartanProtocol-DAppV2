import { BscConnector } from '@binance-chain/bsc-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
// import { LedgerConnector } from '@web3-react/ledger-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ethers } from 'ethers'
import { getNetwork, changeRpc } from './web3'

const pollingInt = 12000

const bscConnect = (chainId) =>
  new BscConnector({ supportedChainIds: [chainId] })
const injectConnect = (chainId) =>
  new InjectedConnector({ supportedChainIds: [chainId] })
// const ledgerConnect = (chainId, rpcUrl) =>
//   new LedgerConnector({
//     chainId,
//     url: rpcUrl,
//     pollingInterval: pollingInt,
//   })
const walletConnect = (chainId, rpcUrl) =>
  new WalletConnectConnector({
    rpc: { [chainId]: rpcUrl },
    chainId,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
  })
const walletlink = (chainId, rpcUrl) =>
  new WalletLinkConnector({
    url: rpcUrl,
    appName: 'Spartan Protocol DApp',
    supportedChainIds: [chainId],
  })

export const connectorsByName = (connectorName, rpcUrls) => {
  // console.log(rpcUrls)
  const network = getNetwork()
  const { chainId } = network
  const rpcItem = changeRpc(chainId, rpcUrls)
  // console.log(rpcItem.url)
  if (connectorName === 'bsc') {
    return bscConnect(chainId)
  }
  // if (connectorName === 'ledger') {
  //   return ledgerConnect(chainId, rpcItem.url)
  // }
  if (connectorName === 'walletconnect') {
    return walletConnect(chainId, rpcItem.url)
  }
  if (connectorName === 'walletlink') {
    const connector = walletlink(chainId, rpcItem.url)
    return connector
  }
  return injectConnect(chainId)
}

export const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = pollingInt
  return library
}
