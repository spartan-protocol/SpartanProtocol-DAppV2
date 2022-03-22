import { Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import { install } from 'resize-observer'

import { Chart } from 'chart.js'
import styles from './styles.module.scss'

import Navbar from './Navbar'
// import Footer from './Footer'
import SidebarLg from './SidebarLg'
import DataManager from './DataManager/index'
import TranslationNotice from './TranslationNotice/index'
import { routes } from '../../routes'
import { useBreakpoint } from '../../providers/Breakpoint'
import { useTheme } from '../../providers/Theme'

const getRoutes = (tempRoutes) =>
  tempRoutes.map((prop) => (
    <Route
      path={prop.path}
      component={prop.component}
      key={prop.path + prop.name}
    />
  ))

const Layout = () => {
  if (!window.ResizeObserver) {
    install()
  }
  const breakpoint = useBreakpoint()
  const { isDark } = useTheme()

  Chart.defaults.color = isDark ? 'white' : 'black'

  return (
    <>
      <div className={styles.wrapper}>
        <DataManager />
        <Navbar />
        {breakpoint.lg && <SidebarLg />}
        <div className={`${styles.body} bg-0`}>
          <div className={styles.content}>
            <TranslationNotice />
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/home" />
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
