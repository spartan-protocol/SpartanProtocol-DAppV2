import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Web3ReactProvider } from '@web3-react/core'
import Common from './components/layout/Common'

import { bondReducer } from './store/bond'
import { daoReducer } from './store/dao'
import { poolReducer } from './store/pool'
import { reserveReducer } from './store/reserve'
import { routerReducer } from './store/router'
import { spartaReducer } from './store/sparta'
import { synthReducer } from './store/synth'
import { utilsReducer } from './store/utils'
import { web3Reducer } from './store/web3'
import { getNetwork } from './utils/web3'
import { getLibrary } from './utils/web3React'

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
  dao: daoReducer,
  pool: poolReducer,
  reserve: reserveReducer,
  router: routerReducer,
  sparta: spartaReducer,
  synth: synthReducer,
  utils: utilsReducer,
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

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return ''
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (network !== tryParse(window.localStorage.getItem('network'))) {
        setNetwork(getNetwork())
      }
    }, 500)
    return () => clearInterval(interval)
  })

  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Common} />
            <Redirect from="/" to="/home" />
          </Switch>
        </BrowserRouter>
      </Web3ReactProvider>
    </Provider>
  )
}

export default Providers
