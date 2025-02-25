import React from 'react'

import Home from './containers/Pools'
import Liquidity from './containers/Liquidity'
import Swap from './containers/Swap'
import Synths from './containers/Synths'
import Vaults from './containers/Vaults'
import Dao from './containers/Dao'
import PU from './containers/PU'
import Friends from './containers/Friends'
import Contracts from './containers/Contracts'
import { PolDistribution } from './containers/PolDistribution/PolDistribution'

export const routes = [
  {
    path: '',
    name: 'Pools',
    icon: 'home',
    component: <Home />,
    layout: '',
  },

  {
    path: 'liquidity',
    name: 'liquidity',
    icon: 'pool',
    component: <Liquidity />,
    layout: '',
  },

  {
    path: 'swap',
    name: 'swap',
    icon: 'swap',
    component: <Swap />,
    layout: '',
  },

  {
    path: 'synths',
    name: 'synths',
    icon: 'synth',
    component: <Synths />,
    layout: '',
  },

  {
    path: 'vaults',
    name: 'vaults',
    icon: 'vault',
    component: <Vaults />,
    layout: '',
  },

  {
    path: 'dao',
    name: 'dao',
    icon: 'dao',
    component: <Dao />,
    layout: '',
  },

  {
    path: 'polDistribution',
    name: 'POL Distribution',
    icon: 'upgrade',
    component: <PolDistribution />,
    layout: '',
  },

  {
    path: 'friends',
    name: 'friends',
    icon: 'handshake',
    component: <Friends />,
    layout: '',
    informational: true,
  },

  {
    path: 'contracts',
    name: 'contracts',
    icon: 'contract',
    component: <Contracts />,
    layout: '',
    informational: true,
  },

  {
    path: 'pu',
    name: 'PowerUser',
    icon: '',
    component: <PU />,
    layout: '',
    hide: true,
  },
]
