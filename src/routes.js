import Home from './views/pages/Pools/Overview'
import Liquidity from './views/pages/Liquidity/Overview'
import Swap from './views/pages/Swap/Swap'
import Synths from './views/pages/Synths/Overview'
import Vaults from './views/pages/Vaults/Overview'
import Positions from './views/pages/Positions/Overview'
import Dao from './views/pages/Dao/Overview'
import Upgrade from './views/pages/Upgrade/Overview'
import Donate from './views/pages/Donate/Overview'
import PU from './views/pages/PU/Overview'
import Security from './views/pages/Security/Overview'

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
    name: 'Positions',
    icon: '',
    component: Positions,
    layout: '',
    hide: true,
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
    path: '/security',
    name: 'Security',
    icon: 'lock',
    component: Security,
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
