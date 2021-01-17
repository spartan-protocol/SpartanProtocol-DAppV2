import React from "react"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"

import {ContextProvider} from './context'

import Home from './Home'
// import Pools from './Pools'
// import Bond from './Pools/Bond'
// import Liquidity from './Pools/Liquidity'
// import Swap from './Pools/Swap'
// import Positions from './Pools/Positions'
// import Dao from './Dao'
// import Lock from './Dao/Lock'
// import Propose from './Dao/Propose'
// import Dashboard from './Info/Dashboard'
// import FAQ from './Info/FAQ'

const App = () => {

  const tempDisable = false

  return (
    <ContextProvider>
        <Router>
            {/* <Layout /> */}
            <div className="wrapper">
                {tempDisable === false &&
                    <Switch>
                        <Route path="/"><Home/></Route>
                        {/*Pools*/}
                        {/* <Route path="/pools"><Pools/></Route>
                        <Route path="/pools/bond"><Bond/></Route>
                        <Route path="/pools/liquidity"><Liquidity/></Route>
                        <Route path="/pools/swap"><Swap/></Route>
                        <Route path="/pools/positions"><Positions/></Route> */}
                        {/*Dao*/}
                        {/* <Route path="/dao"><Dao/></Route>
                        <Route path="/dao/lock"><Lock/></Route>
                        <Route path="/dao/propose"><Propose/></Route> */}
                        {/*Info*/}
                        {/* <Route path="/dashboard"><Dashboard/></Route>
                        <Route path="/faq"><FAQ/></Route> */}
                    </Switch>
                }
                {tempDisable === true &&
                <>
                    <div className='mt-5'>...</div>
                    <div className='mt-5'>...</div>
                    <h3 className='mt-5 text-center'>DApp temporarily disabled for smart contract upgrades</h3>
                </>
                }
            </div>
        </Router>
    </ContextProvider>
  )
}

export default App
