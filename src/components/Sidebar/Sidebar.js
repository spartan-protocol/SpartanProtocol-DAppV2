/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */

import React, { useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar'

// reactstrap components
import { Nav, Collapse } from 'reactstrap'

let ps

const Sidebar = (props) => {
  const [state, setState] = React.useState({})
  const sidebarRef = React.useRef(null)
  const location = useLocation()
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  const getCollapseInitialState = useCallback((routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true
      }
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true
      }
    }
    return false
  }, [])
  // this creates the intial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = useCallback(
    (routes) => {
      let initialState = {}
      routes.map((prop) => {
        if (prop.collapse) {
          initialState = {
            [prop.state]: getCollapseInitialState(prop.views),
            ...getCollapseStates(prop.views),
            ...initialState,
          }
        }
        return null
      })
      return initialState
    },
    [getCollapseInitialState],
  )

  React.useEffect(() => {
    setState(getCollapseStates(props.routes))
  }, [getCollapseStates, props.routes])
  React.useEffect(() => {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
    }
    return function cleanup() {
      // we need to destroy the false scrollbar when we navigate
      // to a page that doesn't have this component rendered
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy()
      }
    }
  })
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { rtlActive } = props
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null
      }
      if (prop.collapse) {
        const st = {}
        st[prop.state] = !state[prop.state]
        return (
          <li
            className={getCollapseInitialState(prop.views) ? 'active' : ''}
            key={key}
          >
            <div
              role="button"
              className="navdiv"
              tabIndex={-1}
              onKeyPress={(e) => {
                e.preventDefault()
                setState({ ...state, ...st })
              }}
              data-toggle="collapse"
              aria-expanded={state[prop.state]}
              onClick={(e) => {
                e.preventDefault()
                setState({ ...state, ...st })
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {rtlActive ? prop.rtlName : prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">
                    {rtlActive ? prop.rtlMini : prop.mini}
                  </span>
                  <span className="sidebar-normal">
                    {rtlActive ? prop.rtlName : prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </div>
            <Collapse isOpen={state[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        )
      }
      // verifies if routeName is the one active (in browser input)
      const activeRoute = (routeName) =>
        location.pathname === routeName ? 'active' : ''
      return (
        <li className={activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink
            to={prop.layout + prop.path}
            activeClassName=""
            onClick={props.closeSidebar}
          >
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{rtlActive ? prop.rtlName : prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
                <span className="sidebar-normal">
                  {rtlActive ? prop.rtlName : prop.name}
                </span>
              </>
            )}
          </NavLink>
        </li>
      )
    })
  }

  const { activeColor, logo } = props
  let logoImg = null
  let logoText = null
  if (logo !== undefined) {
    if (logo.outterLink !== undefined) {
      logoImg = (
        <a
          href={logo.outterLink}
          className="simple-text logo-mini"
          target="_blank"
          rel="noreferrer"
          onClick={props.closeSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </a>
      )
      logoText = (
        <a
          href={logo.outterLink}
          className="simple-text logo-normal"
          target="_blank"
          rel="noreferrer"
          onClick={props.closeSidebar}
        >
          {logo.text}
        </a>
      )
    } else {
      logoImg = (
        <NavLink
          to={logo.innerLink}
          className="simple-text logo-mini"
          onClick={props.closeSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="spartan-logo" />
          </div>
        </NavLink>
      )
      logoText = (
        <NavLink
          to={logo.innerLink}
          className="simple-text logo-normal"
          onClick={props.closeSidebar}
        >
          {logo.text}
        </NavLink>
      )
    }
  }
  return (
    <div className="sidebar" data={activeColor}>
      <div className="sidebar-wrapper" ref={sidebarRef}>
        {logoImg !== null || logoText !== null ? (
          <div className="logo">
            {logoImg}
            {logoText}
          </div>
        ) : null}
        <Nav>{createLinks(props.routes)}</Nav>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  activeColor: PropTypes.oneOf(['primary', 'blue', 'green', 'orange', 'red']),
  rtlActive: PropTypes.bool,
  routes: PropTypes.array.isRequired,
  logo: PropTypes.oneOfType([
    PropTypes.shape({
      innerLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      outterLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ]),
  // this is used on responsive to close the sidebar on route navigation
  closeSidebar: PropTypes.func,
}

export default Sidebar
