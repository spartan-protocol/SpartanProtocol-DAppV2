import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import ThemeSwitcher from '../Common/ThemeSwitcher'
import Supply from '../Supply/Supply'
import Contracts from '../Contracts/Contracts'
import './Header.scss'
import Sidebar from '../Sidebar/Sidebar'
import { Icon } from '../Icons/icons'

const Header = () => (
  <Navbar className="header" fixed="top">
    <Container fluid>
      <div className="d-xl-none">
        <Sidebar />
        <Link to="/" className="navbar-brand ms-2">
          <Icon icon="spartav2" className="my-auto" size="35" />
          <h4 className="d-none d-sm-inline ms-2">Spartan Protocol</h4>
        </Link>
      </div>
      <div className="d-none d-xl-block">
        <Link to="/" className="navbar-brand ms-2">
          <Icon icon="spartav2" className="my-auto" size="35" />
          <h4 className="d-none d-sm-inline ms-2">Spartan Protocol</h4>
        </Link>
      </div>

      <Nav>
        <ThemeSwitcher />
        <LanguageDropdown />
        <AddressConn />
        <Contracts />
        <Supply />
      </Nav>
    </Container>
  </Navbar>
)

export default Header
