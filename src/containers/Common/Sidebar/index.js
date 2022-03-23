import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'

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
      <Offcanvas show={navOpen} placement="start" onHide={closeNav}>
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
            {routes
              .filter((route) => !route.hide)
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
              ))}
          </Nav>
          <div className="text-center">
            <a
              href="https://github.com/spartan-protocol"
              target="_blank"
              rel="noreferrer"
              id="footer-github"
              className="mx-1"
            >
              <Icon icon="github" size="25" />
            </a>
            <a
              href="https://docs.spartanprotocol.org/"
              target="_blank"
              rel="noreferrer"
              id="footer-gitbook"
              className="mx-2"
            >
              <Icon icon="gitbook" size="25" />
            </a>
            <a
              href="https://twitter.com/SpartanProtocol"
              target="_blank"
              rel="noreferrer"
              id="footer-twitter"
              className="mx-1"
            >
              <Icon icon="twitter" size="25" />
            </a>
            <a
              href="https://t.me/SpartanProtocolOrg"
              target="_blank"
              rel="noreferrer"
              id="footer-telegram"
              className="mx-1"
            >
              <Icon icon="telegram" size="25" />
            </a>
            <a
              href="https://discord.gg/wQggvntnGk"
              target="_blank"
              rel="noreferrer"
              id="footer-discord"
              className="mx-2"
            >
              <Icon icon="discord" size="25" />
            </a>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
