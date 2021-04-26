/*eslint-disable*/
import React from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Sidebar from '../Sidebar/Sidebar'

import routes from '../../routes'

import logo from '../../assets/img/spartan_red_medium.svg'
import DataManager from '../DataManager/DataManager'

const Common = () => {
  const { t } = useTranslation()
  const [activeColor] = React.useState('blue')
  const [, setSidebarMini] = React.useState(true)
  const [opacity] = React.useState(0)
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

  // const showNavbarButton = () => {
  //   if (
  //     document.documentElement.scrollTop > 50 ||
  //     document.scrollingElement.scrollTop > 50 ||
  //     (mainPanelRef.current && mainPanelRef.current.scrollTop > 50)
  //   ) {
  //     setOpacity(1)
  //   } else if (
  //     document.documentElement.scrollTop <= 50 ||
  //     document.scrollingElement.scrollTop <= 50 ||
  //     (mainPanelRef.current && mainPanelRef.current.scrollTop <= 50)
  //   ) {
  //     setOpacity(0)
  //   }
  // }

  const getRoutes = (tempRoutes) =>
    tempRoutes.map((prop) => {
      if (prop.collapse) {
        return getRoutes(prop.views)
      }
      if (prop.layout === '/dapp') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={prop.path + prop.name}
          />
        )
      }
      return null
    })

  const getActiveRoute = (tempRoutes) => {
    const activeRoute = 'Default Brand Text'
    for (let i = 0; i < tempRoutes.length; i++) {
      if (tempRoutes[i].collapse) {
        const collapseActiveRoute = getActiveRoute(tempRoutes[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else if (
        window.location.pathname.indexOf(
          tempRoutes[i].layout + tempRoutes[i].path,
        ) !== -1
      ) {
        return tempRoutes[i].name
      }
    }
    return activeRoute
  }

  // const handleActiveClick = (color) => {
  //   setActiveColor(color)
  // }

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

  const clickOutSidebar = (e) => {
    const sidebar = document.body.getElementsByClassName('sidebar-wrapper')[0]
    if (
      !sidebar?.contains(e.target) &&
      !e.target.className?.includes('icon-menu-open') &&
      !e.target.className?.includes('icon-menu-closed') &&
      !e.target.className?.includes('navbar-toggler')
    ) {
      setSidebarOpened(false)
      document.body.classList.add('sidebar-mini')
      closeSidebar()
    }
  }

  return (
    <div
      className="wrapper"
      onClick={(e) => {
        clickOutSidebar(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 32) {
          clickOutSidebar(e)
        }
      }}
      role="tree"
      tabIndex={0}
    >
      <div className="rna-container">
        <DataManager />
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="navbar-minimize-fixed" style={{ opacity }}>
        <button
          type="button"
          className="minimize-sidebar btn btn-link btn-just-icon"
          onClick={handleMiniClick}
        >
          <i className="spartan-icons icon-align-center visible-on-sidebar-regular text-muted" />
          <i className="spartan-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
        </button>
      </div>
      <Sidebar
        routes={routes(t)}
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
          location={location}
          handleMiniClick={handleMiniClick}
          brandText={getActiveRoute(routes(t))}
          sidebarOpened={sidebarOpened}
          toggleSidebar={toggleSidebar}
        />
        <Switch>
          {getRoutes(routes(t))}
          <Redirect from="*" to="/dapp/home" />
        </Switch>
        {
          // we don't want the Footer to be rendered on full screen maps page
          location.pathname.indexOf('full-screen-map') !== -1 ? null : (
            <Footer fluid />
          )
        }
      </div>
    </div>
  )
}

export default Common
