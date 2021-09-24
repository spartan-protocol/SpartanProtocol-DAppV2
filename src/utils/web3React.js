import { BscConnector } from '@binance-chain/bsc-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ethers } from 'ethers'
import { getNetwork } from './web3'

const pollingInt = 12000
const network = getNetwork()
const rpcUrl = network.rpc
const { chainId } = network

const bscConnect = new BscConnector({ supportedChainIds: [chainId] })
const injectConnect = new InjectedConnector({ supportedChainIds: [chainId] })
const ledgerConnect = new LedgerConnector({
  chainId,
  url: rpcUrl,
  pollingInterval: pollingInt,
})
const walletConnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  pollingInterval: pollingInt,
})

export const connectorsByName = (connectorName) => {
  if (connectorName === 'bsc') {
    return bscConnect
  }
  if (connectorName === 'ledger') {
    return ledgerConnect
  }
  if (connectorName === 'walletconnect') {
    return walletConnect
  }
  return injectConnect
}

export const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = pollingInt
  return library
}
