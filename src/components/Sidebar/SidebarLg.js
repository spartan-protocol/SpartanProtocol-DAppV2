import React from 'react'
import { Nav } from 'react-bootstrap'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../routes'
import { Icon } from '../Icons/icons'

const SidebarLg = () => {
  const { t } = useTranslation()

  const isLightMode = window.localStorage.getItem('theme')
  const getRoutes = (tempRoutes) =>
    tempRoutes.map((prop) => (
      <Route
        path={prop.path}
        component={prop.component}
        key={prop.path + prop.name}
      />
    ))
  return (
    <>
      <div className="d-none d-lg-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2 px-0" style={{ background: '#25212d' }}>
              <div
                className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
                // style={{ width: '280px' }}
              >
                <ul className="nav nav-pills flex-column mb-auto">
                  {routes
                    .filter((route) => !route.hide)
                    .map((route) => (
                      <li className="nav-item" key={route.path}>
                        <LinkContainer to={route.path}>
                          <Nav.Link eventKey={route.path}>
                            <Icon
                              icon={route.icon}
                              fill={isLightMode ? 'black' : 'white'}
                              size="24"
                            />
                            <span className="ms-2">{t(route.name)}</span>
                          </Nav.Link>
                        </LinkContainer>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="col-10 p-3">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="*" to="/home" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      <div className="d-lg-none">
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/home" />
        </Switch>
      </div>
    </>
  )
}

export default SidebarLg
