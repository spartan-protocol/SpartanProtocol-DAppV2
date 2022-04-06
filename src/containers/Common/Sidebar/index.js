import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'
import SocialIcons from '../SocialIcons'

import styles from './styles.module.scss'

const Sidebar = () => {
  const [navOpen, setnavOpen] = useState(false)
  const { t } = useTranslation()

  const openNav = () => {
    setnavOpen(true)
  }

  const closeNav = () => {
    setnavOpen(false)
  }

  // return only dapp routes or only informational routes (friends, contracts etc.)
  const navItems = (items, informationalRoutes) =>
    items
      .filter((route) =>
        informationalRoutes
          ? route.informational
          : !route.hide && !route.informational,
      )
      .map((route) => (
        <Nav.Item key={route.path}>
          <LinkContainer to={route.path}>
            <Nav.Link eventKey={route.path} onClick={closeNav}>
              <div>
                <Icon icon={route.icon} size="24" />
                <span className="ms-2">{t(route.name)}</span>
              </div>
            </Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ))

  return (
    <>
      {navOpen ? (
        <>
          <span role="button" onClick={closeNav} aria-hidden="true">
            <Icon icon="menuOpen" size="24" />
          </span>
        </>
      ) : (
        <span role="button" onClick={openNav} aria-hidden="true">
          <Icon icon="menuClose" size="24" />
        </span>
      )}
      <Offcanvas
        className="bg-2"
        show={navOpen}
        placement="start"
        onHide={closeNav}
      >
        <Offcanvas.Header closeButton>
          {navOpen ? (
            <>
              <span role="button" onClick={closeNav} aria-hidden="true">
                <Icon icon="menuOpen" size="24" />
              </span>
            </>
          ) : (
            <span role="button" onClick={openNav} aria-hidden="true">
              <Icon icon="menuClose" size="24" />
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
          <Nav className={styles.links}>
            {/* dapp routes */}
            {navItems(routes)}
            <hr className="mx-3 my-2" />
            {/* informational routes (friends, contracts etc.) */}
            {navItems(routes, true)}
          </Nav>
          <SocialIcons centered />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
