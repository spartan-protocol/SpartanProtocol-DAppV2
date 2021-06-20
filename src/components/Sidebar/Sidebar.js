/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { ReactComponent as NavOpenIcon } from '../../assets/icons/icon-menu-open.svg'
import { ReactComponent as NavClosedIcon } from '../../assets/icons/icon-menu-closed.svg'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import { routes } from '../../routes'

const Sidebar = () => {
  const [navOpen, setnavOpen] = useState(false)
  const [lightMode, setlightMode] = useState(false)
  const { t } = useTranslation()

  const checkLightMode = () => {
    if (document.body.classList.contains('white-content')) {
      setlightMode(true)
    } else {
      setlightMode(false)
    }
  }

  const openNav = () => {
    checkLightMode()
    setnavOpen(true)
  }

  const closeNav = () => {
    checkLightMode()
    setnavOpen(false)
  }

  return (
    <>
      {navOpen ? (
        <>
          <NavOpenIcon
            fill={lightMode ? 'black' : 'white'}
            role="button"
            onClick={closeNav}
          />
        </>
      ) : (
        <NavClosedIcon
          fill={lightMode ? 'black' : 'white'}
          role="button"
          onClick={openNav}
        />
      )}
      <Offcanvas show={navOpen} placement="start" onHide={closeNav}>
        <Offcanvas.Header closeButton>
          {navOpen ? (
            <>
              <NavOpenIcon
                fill={lightMode ? 'black' : 'white'}
                role="button"
                onClick={closeNav}
              />
            </>
          ) : (
            <NavClosedIcon
              fill={lightMode ? 'black' : 'white'}
              role="button"
              onClick={openNav}
            />
          )}
          <Offcanvas.Title className="ms-2">
            {' '}
            <Link to="/" className="navbar-brand ms-2" onClick={closeNav}>
              <SpartanLogo className="my-auto" />
              <Navbar.Brand className="ms-2">Spartan Protocol</Navbar.Brand>
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
                        <route.icon
                          height="30"
                          width="30"
                          fill={lightMode ? 'black' : 'white'}
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
