import React from 'react'
import { Icon } from '../Icons/icons'

const walletTypes = [
  {
    id: 'BC',
    title: 'BinanceChain',
    icon: <Icon icon="binanceChain" />,
    inject: 'bsc',
  },
  {
    id: 'MM',
    title: 'MetaMask',
    icon: <Icon icon="metamask" />,
    inject: undefined,
  },
  {
    id: 'TW',
    title: 'TrustWallet',
    icon: <Icon icon="trustwallet" />,
    inject: 'injected',
  },
  {
    id: 'OOT',
    title: 'Others',
    icon: <Icon icon="mathwallet" />,
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
