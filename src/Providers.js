/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import AdminLayout from './components/layout/Common'

import { bondReducer } from './store/bond'
import { bondVaultReducer } from './store/bondVault'
import { daoReducer } from './store/dao'
import { daoVaultReducer } from './store/daoVault'
import { poolFactoryReducer } from './store/poolFactory'
import { routerReducer } from './store/router'
import { spartaReducer } from './store/sparta'
import { synthReducer } from './store/synth'
import { utilsReducer } from './store/utils'
import { utilsMathReducer } from './store/utilsMath'
import { utilsPricingReducer } from './store/utilsPricing'
import { web3Reducer } from './store/web3'
import { getNetwork } from './utils/web3'

const globalFormat = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
}

BigNumber.config({ FORMAT: globalFormat })

const reducers = combineReducers({
  bond: bondReducer,
  bondVault: bondVaultReducer,
  dao: daoReducer,
  daoVault: daoVaultReducer,
  poolFactory: poolFactoryReducer,
  router: routerReducer,
  sparta: spartaReducer,
  synth: synthReducer,
  utils: utilsReducer,
  utilsMath: utilsMathReducer,
  utilsPricing: utilsPricingReducer,
  web3: web3Reducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

const store = createStore(
  reducers,
  /* preloadedState, */ composeEnhancers
    ? composeEnhancers(applyMiddleware(thunk))
    : applyMiddleware(thunk),
)

const Providers = () => {
  const [network, setNetwork] = useState(getNetwork())

  useEffect(() => {
    const interval = setInterval(() => {
      if (network !== JSON.parse(window.localStorage.getItem('network'))) {
        setNetwork(JSON.parse(window.localStorage.getItem('network')))
      }
    }, 500)
    return () => clearInterval(interval)
  })

  return (
    <Provider store={store}>
      <UseWalletProvider
        chainId={parseInt(network.chainId, 10)}
        connectors={{
          walletconnect: { rpcUrl: network.rpc },
          bsc: {},
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route path="/" render={(props) => <AdminLayout {...props} />} />
            <Redirect from="/" to="/dapp/home" />
          </Switch>
        </BrowserRouter>
      </UseWalletProvider>
    </Provider>
  )
}

export default Providers
