import Home from './containers/Pools'
import Liquidity from './containers/Liquidity'
import Swap from './containers/Swap'
import Synths from './containers/Synths'
import Vaults from './containers/Vaults'
import Positions from './containers/Positions'
import Dao from './containers/Dao'
import Upgrade from './containers/Upgrade'
import Donate from './containers/Donate'
import PU from './containers/PU'
import Partners from './containers/Partners'

export const routes = [
  {
    path: '/home',
    name: 'Pools',
    icon: 'home',
    component: Home,
    layout: '',
  },

  {
    path: '/liquidity',
    name: 'liquidity',
    icon: 'sword',
    component: Liquidity,
    layout: '',
  },

  {
    path: '/swap',
    name: 'swap',
    icon: 'swords',
    component: Swap,
    layout: '',
  },

  {
    path: '/synths',
    name: 'synths',
    icon: 'synth',
    component: Synths,
    layout: '',
  },

  {
    path: '/vaults',
    name: 'vaults',
    icon: 'vault',
    component: Vaults,
    layout: '',
  },

  {
    path: '/positions',
    name: 'positions',
    icon: 'analysis',
    component: Positions,
    layout: '',
  },

  {
    path: '/dao',
    name: 'dao',
    icon: 'colosseum',
    component: Dao,
    layout: '',
  },

  {
    path: '/upgrade',
    name: 'upgrade',
    icon: 'upgrade',
    component: Upgrade,
    layout: '',
  },

  {
    path: '/donate',
    name: 'donate',
    icon: 'list',
    component: Donate,
    layout: '',
  },

  {
    path: '/partners',
    name: 'partners',
    icon: 'handshake',
    component: Partners,
    layout: '',
  },

  {
    path: '/PU',
    name: 'PowerUser',
    icon: '',
    component: PU,
    layout: '',
    hide: true,
  },
]
