/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar'
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert'

// core components
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Sidebar from '../Sidebar/Sidebar'

import routes from '../../routes'

import logo from '../../assets/img/spartan_red_medium.svg'

let ps

const Common = (props) => {
  const [activeColor, setActiveColor] = React.useState('blue')
  const [sidebarMini, setSidebarMini] = React.useState(true)
  const [opacity, setOpacity] = React.useState(0)
  const [sidebarOpened, setSidebarOpened] = React.useState(false)
  const mainPanelRef = React.useRef(null)
  const notificationAlertRef = React.useRef(null)
  const location = useLocation()
  React.useEffect(() => {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0
    }
  }, [location])
  const showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop > 50)
    ) {
      setOpacity(1)
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      (mainPanelRef.current && mainPanelRef.current.scrollTop <= 50)
    ) {
      setOpacity(0)
    }
  }
  React.useEffect(() => {
    const innerMainPanelRef = mainPanelRef
    if (navigator.platform.indexOf('Win') > -1) {
      document.documentElement.classList.add('perfect-scrollbar-on')
      document.documentElement.classList.remove('perfect-scrollbar-off')
      ps = new PerfectScrollbar(mainPanelRef.current)
      mainPanelRef.current &&
        mainPanelRef.current.addEventListener('ps-scroll-y', showNavbarButton)
      const tables = document.querySelectorAll('.table-responsive')
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i])
      }
    }
    window.addEventListener('scroll', showNavbarButton)

    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy()
        document.documentElement.classList.add('perfect-scrollbar-off')
        document.documentElement.classList.remove('perfect-scrollbar-on')
        innerMainPanelRef.current &&
          innerMainPanelRef.current.removeEventListener(
            'ps-scroll-y',
            showNavbarButton,
          )
      }
      window.removeEventListener('scroll', showNavbarButton)
    }
  }, [])
  const getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views)
      }
      if (prop.layout === '/dapp') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      }
      return null
    })
  const getActiveRoute = (routes) => {
    const activeRoute = 'Default Brand Text'
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routes[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else if (
        window.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name
      }
    }
    return activeRoute
  }
  const handleActiveClick = (color) => {
    setActiveColor(color)
  }
  const handleMiniClick = () => {
    if (document.body.classList.contains('sidebar-mini')) {
      setSidebarMini(false)
    } else {
      setSidebarMini(true)
    }
    document.body.classList.toggle('sidebar-mini')
  }
  const toggleSidebar = () => {
    setSidebarOpened(!sidebarOpened)
    document.documentElement.classList.toggle('nav-open')
  }
  const closeSidebar = () => {
    setSidebarOpened(false)
    document.documentElement.classList.remove('nav-open')
  }
  return (
    <div className="wrapper">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="navbar-minimize-fixed" style={{ opacity }}>
        <button
          className="minimize-sidebar btn btn-link btn-just-icon"
          onClick={handleMiniClick}
        >
          <i className="spartan-icons icon-align-center visible-on-sidebar-regular text-muted" />
          <i className="spartan-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
        </button>
      </div>
      <Sidebar
        {...props}
        routes={routes}
        activeColor={activeColor}
        logo={{
          outterLink: './',
          text: 'Spartan Protocol',
          imgSrc: logo,
        }}
        closeSidebar={closeSidebar}
      />
      <div className="main-panel" ref={mainPanelRef} data={activeColor}>
        <Header
          {...props}
          handleMiniClick={handleMiniClick}
          brandText={getActiveRoute(routes)}
          sidebarOpened={sidebarOpened}
          toggleSidebar={toggleSidebar}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/dapp/buttons" />
        </Switch>
        {
          // we don't want the Footer to be rendered on full screen maps page
          props.location.pathname.indexOf('full-screen-map') !== -1 ? null : (
            <Footer fluid />
          )
        }
      </div>
    </div>
  )
}

export default Common
