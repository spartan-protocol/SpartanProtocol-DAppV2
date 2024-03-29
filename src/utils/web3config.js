import { configureChains, createConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { bsc, bscTestnet } from 'wagmi/chains'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { bscRpcsMN } from './web3'

const getProviders = () => {
  const rpcList = []
  for (let i = 0; i < bscRpcsMN.length; i++) {
    rpcList.push(
      jsonRpcProvider({
        rpc: () => ({
          http: bscRpcsMN[i],
        }),
        // stallTimeout: 1000,
      }),
    )
  }
  return rpcList
}

const { chains, publicClient } = configureChains(
  [bsc, bscTestnet],
  getProviders(),
  {
    rank: true,
  },
)

// const bscConnect = (chainId) =>
//   new BscConnector({ supportedChainIds: [chainId] })
const binWalletConnector = new InjectedConnector({
  options: {
    name: 'Binance Wallet',
    getProvider: () =>
      typeof window !== 'undefined' ? window.BinanceChain : undefined,
  },
})
const injectConnect = new InjectedConnector({ chains })
// new InjectedConnector({ chains: chainId === 56 ? [bsc] : [bscTestnet] })
// const ledgerConnect = (chainId, rpcUrl) =>
//   new LedgerConnector({
//     chainId,
//     url: rpcUrl,
//     pollingInterval: pollingInt,
//   })
const walletConnect = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.REACT_APP_WCONNECT_PROJ_ID,
  },
  // metadata: {
  //   name: 'wagmi',
  //   description: 'my wagmi app',
  //   url: 'https://wagmi.sh',
  //   icons: ['https://wagmi.sh/icon.png'],
  // },
})
const walletlink = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'Spartan Protocol Community DApp',
    jsonRpcUrl: 'https://bsc-dataseed.binance.org/', // TODO: Try without, otherwise hand random RPC url
  },
})

const connectors = [
  injectConnect,
  walletConnect,
  walletlink,
  binWalletConnector,
]

export const connectorsByName = (connectorName, connectorsList) => {
  // const chainId = getChainId() // TODO: Try without, otherwise hand random RPC url
  // const rpcItem = changeRpc(chainId, rpcUrls) // TODO: Try without, otherwise hand random RPC url

  if (connectorName === 'binWallet') {
    return connectorsList[3]
  }

  // if (connectorName === 'ledger') {
  //   return ledgerConnect(chainId, rpcItem.url)
  // }

  if (connectorName === 'walletconnect') {
    return connectorsList[1] // WalletConnect Connector
  }

  if (connectorName === 'walletlink') {
    return connectorsList[2] // Coinbase Wallet SDK Connector (formerly WalletLink)
  }

  return connectorsList[0] // Fallback to injected
}

export const wagmiClient = createConfig({
  publicClient,
  connectors,
})
