import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js' // chart.js - Tree-shake to only bundle the used modules
import Layout from './containers/Common/layout'

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
import { BreakpointProvider } from './providers/Breakpoint'
import { ThemeProvider } from './providers/Theme'
import { isAppleDevice } from './utils/helpers'

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
) // chart.js - Tree-shake to only bundle the used modules

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

if (isAppleDevice()) {
  const el = document.querySelector('meta[name=viewport]')

  if (el !== null) {
    let content = el.getAttribute('content')
    let re = /maximum-scale=[0-9.]+/g

    if (re.test(content)) {
      content = content.replace(re, 'maximum-scale=1.0')
    } else {
      content = [content, 'maximum-scale=1.0'].join(', ')
    }

    el.setAttribute('content', content)
  }
}

const Providers = () => (
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <BreakpointProvider>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </BreakpointProvider>
      </BrowserRouter>
    </Web3ReactProvider>
  </Provider>
)

export default Providers
