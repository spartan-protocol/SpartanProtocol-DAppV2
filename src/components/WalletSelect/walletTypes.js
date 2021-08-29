import React from 'react'
import { Icon } from '../Icons/icons'

const size = '30'

const walletTypes = [
  {
    id: 'BC',
    title: 'BinanceChain',
    icon: <Icon size={size} icon="binanceChain" />,
    inject: 'bsc',
  },
  {
    id: 'MM',
    title: 'MetaMask',
    icon: <Icon size={size} icon="metamask" />,
    inject: undefined,
  },
  {
    id: 'TW',
    title: 'TrustWallet',
    icon: <Icon size={size} icon="trustwallet" />,
    inject: 'injected',
  },
  {
    id: 'OOT',
    title: 'Others',
    icon: <Icon size={size} icon="mathwallet" />,
    inject: 'injected',
  },
  // {
  //   id: 'WC',
  //   title: 'WalletConnect',
  //   icon: <Icon icon="binanceChain" />,
  //   inject: 'walletconnect',
  // },
]

export default walletTypes
