import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// import NotificationAlert from 'react-notification-alert'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import DataManager from '../DataManager/DataManager'
import { routes } from '../../routes'

const Common = () => {
  // const notificationAlertRef = useRef(null)

  const getRoutes = (tempRoutes) =>
    tempRoutes.map((prop) => (
      <Route
        path={prop.path}
        component={prop.component}
        key={prop.path + prop.name}
      />
    ))

  return (
    <div className="wrapper">
      <div className="rna-container">
        <DataManager />
        {/* <NotificationAlert ref={notificationAlertRef} /> */}
      </div>
      <div className="main-panel">
        <Header />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/home" />
        </Switch>
        <Footer />
      </div>
    </div>
  )
}

export default Common
