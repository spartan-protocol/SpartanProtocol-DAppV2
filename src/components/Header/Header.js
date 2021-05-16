import React from 'react'
import classNames from 'classnames'
import { Button, Navbar, Nav, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import ThemeSwitcher from '../Common/ThemeSwitcher'
import Supply from '../Supply/Supply'

const Header = (props) => (
  <Navbar
    className={classNames('navbar sticky-top', {
      color: 'navbar-transparent',
    })}
    expand="lg"
  >
    <Container fluid className="px-1">
      <div className="navbar-wrapper w-100">
        <div className="navbar-minimize d-inline mr-n4">
          <Button
            className="minimize-sidebar btn-just-icon ml-n2 mr-4"
            color="link"
            id="tooltip209599"
            onClick={props.handleMiniClick}
          >
            <i
              id="menu-drawer-closed"
              className="icon-medium icon-menu-closed-dark visible-on-sidebar-regular"
            />
            <i
              id="menu-drawer-open"
              className="icon-medium icon-menu-open-dark visible-on-sidebar-mini"
            />
          </Button>
        </div>
        <div
          className={classNames('navbar-toggle d-inline', {
            toggled: props.sidebarOpened,
          })}
        >
          <button
            className="navbar-toggler ml-0"
            type="button"
            onClick={props.toggleSidebar}
          >
            <i
              id="mobile-menu-drawer-open"
              className="icon-medium icon-menu-open-dark"
            />
          </button>
        </div>
        <Link to="/">
          <div className="d-none d-md-block navbar-brand-thing">
            <h6 className="text-title-header ">
              <SpartanLogo className="mr-1" /> Spartan Protocol
            </h6>
          </div>
        </Link>
        <Nav className="ml-auto">
          <ThemeSwitcher />
          <LanguageDropdown />
          <AddressConn
            changeStates={props.changeStates}
            changeNotification={props.changeNotification}
            connectedTokens={props.connectedTokens}
            connectingTokens={props.connectingTokens}
          />
          <Supply />
        </Nav>
      </div>
    </Container>
  </Navbar>
)

export default Header
