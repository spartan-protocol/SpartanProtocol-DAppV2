import { Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import { install } from 'resize-observer'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import SidebarLg from '../Sidebar/SidebarLg'
import DataManager from '../DataManager/DataManager'
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
  if (typeof window !== 'undefined') {
    if ('ResizeObserver' in window === false) {
      install()
    }
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
