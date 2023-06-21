import React from 'react'
import { Icon } from '../Icons/index'

const size = '30'

const walletTypes = [
  {
    id: 'BW',
    title: 'Binance Wallet',
    icon: <Icon size={size} icon="binanceChain" />,
    connector: 'binWallet',
  },
  {
    id: 'MM',
    title: 'MetaMask',
    icon: <Icon size={size} icon="metamask" />,
    connector: 'injected',
  },
  {
    id: 'TW',
    title: 'TrustWallet',
    icon: <Icon size={size} icon="trustwallet" />,
    connector: 'injected',
  },
  {
    id: 'WC',
    title: 'WalletConnect',
    icon: <Icon size={size} icon="walletconnect" />,
    connector: 'walletconnect',
  },
  // {
  //   id: 'LEDGER',
  //   title: 'Ledger',
  //   icon: <Icon size={size} icon="ledger" />,
  //   connector: 'ledger',
  // },
  {
    id: 'BRAVE',
    title: 'Brave Wallet',
    icon: <Icon size={size} icon="brave" />,
    connector: 'injected',
  },
  {
    id: 'ON',
    title: 'ONTO Wallet',
    icon: <Icon size={size} icon="onto" />,
    connector: 'injected',
  },
  {
    id: 'CB',
    title: 'Coinbase Wallet',
    icon: <Icon size={size} icon="coinbase" />,
    connector: 'walletlink',
  },
  {
    id: 'OOT',
    title: 'Others',
    icon: <Icon size={size} icon="mathwallet" />,
    connector: 'injected',
  },
]

export default walletTypes
