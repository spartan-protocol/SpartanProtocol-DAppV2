import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
// STYLES
import './app.scss'
// ALWAYS LOADED LOCAL
import Loader from './components/Loader'
import Header from './components/layout/Header'
//import Navbar from './components/layout/Navbar'
//import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Home from './views/Home'

// CODE-SPLIT LOCAL
// const Pools = lazy(() => import('./views/Pools'))
// const Bond = lazy(() => import('./views/Pools/Bond'))
// const Liquidity = lazy(() => import('./views/Pools/Liquidity'))
// const Swap = lazy(() => import('./views/Pools/Swap'))
// const Positions = lazy(() => import('./views/Pools/Positions'))
// const Dao = lazy(() => import('./views/Dao'))
// const Lock = lazy(() => import('./views/Dao/Lock'))
// const Propose = lazy(() => import('./views/Dao/Propose'))
// const Dashboard = lazy(() => import('./views/Info/Dashboard'))
// const FAQ = lazy(() => import('./views/Info/FAQ'))
// const NoPage = lazy(() => import('./views/NoPage'))

BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
})

const App = () => {
    const tempDisable = false
    const { account, connect } = useWallet()

    useEffect(() => {
        if (!account && window.localStorage.getItem('accountStatus')) {
          connect('injected')
        }
    }, [account, connect])

    return (
        <Router>
            <Header />
            {/* <Navbar />
            <Sidebar /> */}
            <Suspense fallback={<Loader />}>
                {tempDisable === false &&
                    <Switch>
                        <Route path="/" exact>
                            <Home />
                        </Route>
                        {/* <Route path="/pools">
                            <Pools />
                        </Route>
                        <Route path="/pools/bond">
                            <Bond />
                        </Route>
                        <Route path="/pools/liquidity">
                            <Liquidity />
                        </Route>
                        <Route path="/pools/swap">
                            <Swap />
                        </Route>
                        <Route path="/pools/positions">
                            <Positions />
                        </Route>
                        <Route exact path="/dao">
                            <Dao />
                        </Route>
                        <Route path="/dao/lock">
                            <Lock />
                        </Route>
                        <Route path="/dao/propose">
                            <Propose />
                        </Route>
                        <Route path="/info/dashboard">
                            <Dashboard />
                        </Route>
                        <Route path="/info/faq">
                            <FAQ />
                        </Route> */}
                        {/* 40# Page Not Found! */}
                        {/* <Route component={NoPage} /> */}
                    </Switch>
                }
                {tempDisable === true &&
                    <>
                        <div className='mt-5'>...</div>
                        <div className='mt-5'>...</div>
                        <h3 className='mt-5 text-center'>DApp temporarily disabled for smart contract upgrades</h3>
                    </>
                }
            </Suspense>
            <Footer />
        </Router>
      )
}
    
export default React.memo(App)
