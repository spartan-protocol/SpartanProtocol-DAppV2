import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import ThemeSwitcher from '../Common/ThemeSwitcher'
import Supply from '../Supply/Supply'
import './Header.scss'

const Header = (props) => (
  <Navbar fixed="top">
    <Container>
      {/* ADD TOGGLE FOR SIDEBAR HERE */}

      <Link to="/" className="navbar-brand">
        <SpartanLogo className="my-auto" />
        <Navbar.Brand className="d-none d-sm-inline ms-2">
          Spartan Protocol
        </Navbar.Brand>
      </Link>

      <Nav>
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
    </Container>
  </Navbar>
)

export default Header
