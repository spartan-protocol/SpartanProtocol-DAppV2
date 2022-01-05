import React, { useState } from 'react'
import { Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../routes'
import { Icon } from '../Icons/icons'

const Sidebar = () => {
  const [navOpen, setnavOpen] = useState(false)
  const { t } = useTranslation()

  const isLightMode = window.localStorage.getItem('theme')

  const openNav = () => {
    setnavOpen(true)
  }

  const closeNav = () => {
    setnavOpen(false)
  }

  return (
    <>
      {navOpen ? (
        <>
          <span role="button" onClick={closeNav} aria-hidden="true">
            <Icon
              icon="menuOpen"
              fill={isLightMode ? 'black' : 'white'}
              size="24"
            />
          </span>
        </>
      ) : (
        <span role="button" onClick={openNav} aria-hidden="true">
          <Icon
            icon="menuClose"
            fill={isLightMode ? 'black' : 'white'}
            size="24"
          />
        </span>
      )}
      <Offcanvas show={navOpen} placement="start" onHide={closeNav}>
        <Offcanvas.Header closeButton>
          {navOpen ? (
            <>
              <span role="button" onClick={closeNav} aria-hidden="true">
                <Icon
                  icon="menuOpen"
                  fill={isLightMode ? 'black' : 'white'}
                  size="24"
                />
              </span>
            </>
          ) : (
            <span role="button" onClick={openNav} aria-hidden="true">
              <Icon
                icon="menuClose"
                fill={isLightMode ? 'black' : 'white'}
                size="24"
              />
            </span>
          )}
          <Offcanvas.Title className="ms-2">
            <Link to="/" className="navbar-brand ms-2" onClick={closeNav}>
              <Navbar.Brand className="ms-2">
                <h4>
                  <Icon icon="spartav2" className="my-auto me-2" />
                  Spartan Protocol
                </h4>
              </Navbar.Brand>
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="px-0">
          <Nav className="flex-column">
            {routes
              .filter((route) => !route.hide)
              .map((route) => (
                <Nav.Item key={route.path}>
                  <LinkContainer to={route.path}>
                    <Nav.Link eventKey={route.path} onClick={closeNav}>
                      <div>
                        <Icon
                          icon={route.icon}
                          fill={isLightMode ? 'black' : 'white'}
                          size="24"
                        />
                        <span className="ms-2">{t(route.name)}</span>
                      </div>
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
