import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import Common from './containers/Common/layout'

import bondReducer from './store/bond'
import daoReducer from './store/dao'
import poolReducer from './store/pool'
import reserveReducer from './store/reserve'
import routerReducer from './store/router'
import spartaReducer from './store/sparta'
import synthReducer from './store/synth'
import utilsReducer from './store/utils'
import web3Reducer from './store/web3'
import { getLibrary } from './utils/web3React'

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR) // turn off warnings

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

const store = configureStore({
  reducer: {
    bond: bondReducer,
    dao: daoReducer,
    pool: poolReducer,
    reserve: reserveReducer,
    router: routerReducer,
    sparta: spartaReducer,
    synth: synthReducer,
    utils: utilsReducer,
    web3: web3Reducer,
  },
})

const Providers = () => (
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

export default Providers
