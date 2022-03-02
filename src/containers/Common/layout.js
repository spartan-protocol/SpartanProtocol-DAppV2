import { Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import { install } from 'resize-observer'

import Header from './Header'
import Footer from './Footer'
import SidebarLg from './SidebarLg'
import DataManager from './DataManager/index'
import { routes } from '../../routes'

const getRoutes = (tempRoutes) =>
  tempRoutes.map((prop) => (
    <Route
      path={prop.path}
      component={prop.component}
      key={prop.path + prop.name}
    />
  ))

const Common = () => {
  if (!window.ResizeObserver) {
    install()
  }

  return (
    <div className="wrapper">
      <div className="rna-container" />
      <div className="main-panel">
        <DataManager />
        <Header />
        <SidebarLg />
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
