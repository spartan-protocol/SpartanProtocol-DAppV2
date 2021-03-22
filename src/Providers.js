/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AdminLayout from './components/layout/Common'

import { bondReducer } from './store/bond'
import { daoReducer } from './store/dao'
import { routerReducer } from './store/router'
import { spartaReducer } from './store/sparta'
import { utilsReducer } from './store/utils'
import { utilsMathReducer } from './store/utilsMath'
import { utilsPricingReducer } from './store/utilsPricing'
import { web3Reducer } from './store/web3'
import { getNetwork } from './utils/web3'

const reducers = combineReducers({
  bond: bondReducer,
  dao: daoReducer,
  router: routerReducer,
  sparta: spartaReducer,
  utils: utilsReducer,
  utilsMath: utilsMathReducer,
  utilsPricing: utilsPricingReducer,
  web3: web3Reducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

const store = createStore(
  reducers,
  /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)),
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
            <Redirect from="/" to="/dapp/buttons/" />
          </Switch>
        </BrowserRouter>
      </UseWalletProvider>
    </Provider>
  )
}

export default Providers
