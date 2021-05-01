/*eslint-disable*/


import React, { useCallback } from "react"
import { NavLink, useLocation } from "react-router-dom"
import PropTypes from "prop-types"

import { Nav, Collapse, Button } from "reactstrap"
import { useTranslation } from "react-i18next"

import { ReactComponent as SpartanLogoRedSmall } from "../../assets/img/spartan_red_small.svg"

const Sidebar = (props) => {
  const { t } = useTranslation()
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
            ...initialState
          }
        }
        return null
      })
      return initialState
    },
    [getCollapseInitialState]
  )

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { rtlActive } = props
    return routes.map((prop) => {
      if (prop.redirect) {
        return null
      }
      if (prop.collapse) {
        const st = {}
        st[prop.state] = !state[prop.state]
        return (
          <li
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            key={prop.path + prop.name}
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
                    {rtlActive ? t(prop.rtlName) : t(prop.name)}
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
        location.pathname === routeName ? "active" : ""
      return (
        <li
          className={activeRoute(prop.layout + prop.path)}
          key={prop.path + prop.name}
        >
          <NavLink
            to={prop.layout + prop.path}
            activeClassName=""
            onClick={props.closeSidebar}
          >
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{rtlActive ? t(prop.rtlName) : t(prop.name)}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
                <span className="sidebar-normal">
                  {rtlActive ? t(prop.rtlName) : t(prop.name)}
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
          onClick={props.closeSidebar}
        >

          <div className="logo-img">
            <img src={logo.imgSrc} alt="spartan-logo" />
          </div>
        </a>
      )
      logoText = (
        <a
          href={logo.outterLink}
          className="simple-text logo-normal"
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
            <i className="icon-medium icon-menu-closed icon-light" />

          </div>
        </NavLink>
      )
      logoText = (
        <NavLink
          to={logo.innerLink}
          className="simple-text logo-normal"
          onClick={props.closeSidebar}
        >
          <div><SpartanLogoRedSmall className="mr-2" />{logo.text}</div>


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
  activeColor: PropTypes.oneOf(["primary", "blue", "green", "orange", "red"]),
  rtlActive: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  routes: PropTypes.array.isRequired,
  logo: PropTypes.oneOfType([
    PropTypes.shape({
      innerLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    PropTypes.shape({
      outterLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ]),
  // this is used on responsive to close the sidebar on route navigation
  closeSidebar: PropTypes.func
}

export default Sidebar
