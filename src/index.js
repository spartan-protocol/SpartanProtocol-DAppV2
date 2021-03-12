/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import AdminLayout from './components/layout/Common'
import './assets/css/bd-icons.css'
import './assets/css/spartan-icons.css'
import './app.scss'
// import Contexts from './Contexts'
import './assets/scss/spartan.scss'

import { bondReducer } from './store/bond'
import { daoReducer } from './store/dao'
import { routerReducer } from './store/router'
import { spartaReducer } from './store/sparta'
import { utilsReducer } from './store/utils'
import { utilsMathReducer } from './store/utilsMath'
import { utilsPricingReducer } from './store/utilsPricing'
import { web3Reducer } from './store/web3'

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))

const rpcUrl = process.env.REACT_APP_RPC

ReactDOM.render(
  <Provider store={store}>
    <UseWalletProvider
      chainId={parseInt(store.getState().web3.network.chainId, 10)}
      connectors={{
        walletconnect: { rpcUrl },
        bsc: {},
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/" render={(props) => <AdminLayout {...props} />} />
          <Redirect from="/" to="/dapp/buttons/" />
        </Switch>
      </BrowserRouter>
      ,
    </UseWalletProvider>
    ,
  </Provider>,

  document.getElementById('root'),
)
