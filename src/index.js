/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import AdminLayout from './components/layout/Common'
import './assets/css/bd-icons.css'
import './assets/css/spartan-icons.css'
import './app.scss'
// import Contexts from './Contexts'
import './assets/scss/spartan.scss'

import { web3AllReducer } from './store/web3All'
import { infoReducer } from './store/info'
import { pricingReducer } from './store/pricing'
import { utilsMathReducer } from './store/utilsMath'
import { spartaReducer } from './store/sparta'
import { routerReducer } from './store/router'

const reducers = combineReducers({
  info: infoReducer,
  web3All: web3AllReducer,
  pricing: pricingReducer,
  utilsMath: utilsMathReducer,
  sparta: spartaReducer,
  router: routerReducer,
})

const store = createStore(reducers, applyMiddleware(thunk))

const rpcUrl = process.env.REACT_APP_RPC

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <UseWalletProvider
        chainId={parseInt(process.env.REACT_APP_CHAIN_ID, 16)}
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
    </React.StrictMode>
    ,
  </Provider>,

  document.getElementById('root'),
)
