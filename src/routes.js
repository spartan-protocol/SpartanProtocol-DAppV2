// import Dashboard from './components/Dashboard/Dashboard'
import PoolsOverview from './views/pages/Pools/Overview'
// import Dao from './views/pages/Dao/Overview'
import Liquidity from './views/pages/Pools/Liquidity'
import Bond from './views/pages/Bond/Bond'
import Swap from './views/pages/Swap/Swap'
import Vault from './views/pages/Vault/Overview'
import Synths from './views/pages/Synths/Overview'
import Upgrade from './views/pages/Upgrade/Overview'
// import Loaders from './views/pages/Samples/Loaders'
// import Icons from './views/pages/Samples/Icons'
// import Notifications from './views/pages/Samples/Notifications'
// import Buttons from './views/pages/Samples/Buttons'
// import Alerts from './views/pages/Samples/Alerts'
// import Typography from './views/pages/Samples/Typography'
// import Grid from './views/pages/Samples/Grid'
// import ReactTables from './views/pages/Samples/ReactTables'
// import Forms from './views/pages/Samples/Forms'
// import ExtendedForms from './views/pages/Samples/ExtendedForms'
// import Panels from './views/pages/Samples/Panels'
// import Tiles from './views/pages/Samples/Tiles'
// import Utils from './utils/Utils'
// import Tabs from './views/pages/Samples/Tabs'
// import Share from './views/pages/Samples/Share'
// import SearchModal from './views/pages/Samples/SearchModal'

const routes = (t) => [
  {
    path: '/home',
    name: t('overview'),
    icon: 'icon-small icon-home icon-dark',
    component: PoolsOverview,
    layout: '',
  },

  {
    path: '/pools/liquidity',
    name: t('liquidity'),
    icon: 'icon-small icon-sword icon-dark',
    component: Liquidity,
    layout: '',
  },

  {
    path: '/pools/swap',
    name: t('swap'),
    icon: 'icon-small icon-swords icon-dark',
    component: Swap,
    layout: '',
  },

  {
    path: '/synths',
    name: t('synths'),
    icon: 'icon-small icon-synths icon-dark',
    component: Synths,
    layout: '',
  },

  {
    path: '/bond',
    name: t('bond'),
    icon: 'icon-small icon-helmet icon-dark',
    component: Bond,
    layout: '',
  },

  {
    path: '/vault',
    name: t('vault'),
    icon: 'icon-small icon-vault icon-dark',
    component: Vault,
    layout: '',
  },

  {
    path: '/upgrade',
    name: t('upgrade'),
    icon: 'icon-small icon-upgrade icon-dark',
    component: Upgrade,
    layout: '',
  },

  // {
  //   collapse: true,
  //   name: 'Overview',
  //   icon: 'icon-medium icon-info icon-dark',
  //   state: 'pagesCollapse',
  //   views: [
  //     {
  //       path: '/pools/overview',
  //       name: 'Overview',
  //       mini: 'OVIEW',
  //       component: Overview,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/pools/swap',
  //       name: 'Swap',
  //       mini: 'SWAP',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/pools/liquidity',
  //       name: 'Liquidity',
  //       mini: 'LIQ',
  //       component: Liquidity,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/pools/bond',
  //       name: 'Bond',
  //       mini: 'BOND',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/pools/positions',
  //       name: 'Positions',
  //       mini: 'POS',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //   ],
  // },
  //
  // {
  //   collapse: true,
  //   name: 'DAO',
  //   icon: 'icon-medium icon-info icon-dark',
  //   state: 'pagesCollapse',
  //   views: [
  //     {
  //       path: '/dao/overview',
  //       name: 'Overview',
  //       mini: 'OVIEW',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/dao/lockearn',
  //       name: 'Lock+Earn',
  //       mini: 'EARN',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/dao/proposals',
  //       name: 'Proposals',
  //       mini: 'PROP',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //   ],
  // },

  // {
  //   collapse: true,
  //   name: 'Components',
  //   icon: 'icon-medium icon-info icon-dark',
  //   state: 'pagesCollapse',
  //   views: [
  //     {
  //       path: '/cards',
  //       name: 'Tiles',
  //       mini: 'CR',
  //       component: Tiles,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/search',
  //       name: 'Search modal',
  //       mini: 'BU',
  //       component: SearchModal,
  //       layout: '/dapp',
  //     },

  //
  //     {
  //       path: '/share',
  //       name: 'Share',
  //       mini: 'SH',
  //       component: Share,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/panels',
  //       name: 'Panels',
  //       mini: 'PA',
  //       component: Panels,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/alerts',
  //       name: 'Alerts',
  //       mini: 'AL',
  //       component: Alerts,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/typography',
  //       name: 'Typography',
  //       mini: 'TY',
  //       component: Typography,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/tables',
  //       name: 'ReactTables',
  //       mini: 'TB',
  //       component: ReactTables,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/loading',
  //       name: 'Loader',
  //       mini: 'LO',
  //       component: Loaders,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/forms',
  //       name: 'Forms',
  //       mini: 'FO',
  //       component: Forms,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/input',
  //       name: 'Input',
  //       mini: 'FO',
  //       component: ExtendedForms,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/grid',
  //       name: 'Grid',
  //       mini: 'GR',
  //       component: Grid,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/tabs',
  //       name: 'Tabs',
  //       mini: 'TB',
  //       component: Tabs,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/icons',
  //       name: 'Icons',
  //       mini: 'IC',
  //       component: Icons,
  //       layout: '/dapp',
  //     },
  //     {
  //       path: '/utils',
  //       name: 'Utils',
  //       mini: 'UT',
  //       component: Utils,
  //       layout: '/dapp',
  //     },
  //   ],
  // },
]

export default routes
