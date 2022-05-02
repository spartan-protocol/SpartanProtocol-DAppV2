import { Route, Switch, Redirect } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { install } from 'resize-observer'

import { Chart } from 'chart.js'
import styles from './styles.module.scss'

import Navbar from './Navbar'
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
  const breakpoint = useBreakpoint()
  const { isDark } = useTheme()

  const [compact, setCompact] = useState(true)
  const [fixed, setFixed] = useState(false)

  const [sideNavIcon, setSideNavIcon] = useState('menuOpen')

  if (!window.ResizeObserver) {
    install()
  }

  Chart.defaults.color = isDark ? 'white' : 'black'

  const handleCompact = (boolieeee) => {
    setCompact(boolieeee)
    setSideNavIcon(boolieeee ? 'menuClose' : 'menuOpen')
  }

  const handleSideNavState = () => {
    if (fixed) {
      setCompact(true)
      setSideNavIcon('menuClose')
    } else {
      setSideNavIcon('menuOpen')
    }
    setFixed(!fixed)
  }

  useEffect(() => {
    if (breakpoint.xl) {
      setCompact(false)
      setFixed(true)
    }
  }, [breakpoint.xl])

  return (
    <>
      <div className={styles.wrapper}>
        <DataManager />
        <Navbar
          fixed={fixed}
          handleCompact={handleCompact}
          sideNavIcon={sideNavIcon}
          handleSideNavState={handleSideNavState}
        />
        {breakpoint.lg && (
          <SidebarLg
            compact={compact}
            fixed={fixed}
            handleCompact={handleCompact}
          />
        )}
        <div className="body">
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
