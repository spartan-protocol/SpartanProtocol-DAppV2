/*eslint-disable*/
import React from 'react'
import classNames from 'classnames'
import { Button, Navbar, Nav, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import Supply from '../Supply/Supply'

const Header = (props) => (
  // const [color, setColor] = React.useState('navbar-transparent')
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  // const updateColor = () => {
  //   if (window.innerWidth < 993 && collapseOpen) {
  //     setColor('bg-white')
  //   } else {
  //     setColor('navbar-transparent')
  //   }
  // }
  // React.useEffect(() => {
  //   window.addEventListener('resize', updateColor)
  //   return function cleanup() {
  //     window.removeEventListener('resize', updateColor)
  //   }
  // })

  // // this function opens and closes the collapse on small devices
  // const toggleCollapse = () => {
  //   if (collapseOpen) {
  //     setColor('navbar-transparent')
  //   } else {
  //     setColor('bg-white')
  //   }
  //   setCollapseOpen(!collapseOpen)
  // }

  // Wallet functions
  <Navbar
    className={classNames('navbar sticky-top', {
      color: 'navbar-transparent',
    })}
    expand="lg"
  >
    <Container fluid className="px-1">
      <div className="navbar-wrapper ">
        <div className="navbar-minimize d-inline">
          <Button
            className="minimize-sidebar btn-just-icon ml-n2 mr-3"
            color="link"
            id="tooltip209599"
            onClick={props.handleMiniClick}
          >
            <i className="icon-medium icon-menu-closed icon-light visible-on-sidebar-regular" />
            <i className="icon-medium icon-menu-open icon-light visible-on-sidebar-mini" />
          </Button>
        </div>
        <div
          className={classNames('navbar-toggle d-inline', {
            toggled: props.sidebarOpened,
          })}
        >
          <button
            className="navbar-toggler ml-2"
            type="button"
            onClick={props.toggleSidebar}
          >
            <span className="navbar-toggler-bar bar1"/>
            <span className="navbar-toggler-bar" />
          </button>
        </div>
        <Link to="/">
          <div className="d-none d-md-block navbar-brand-thing">
            <SpartanLogo className="mr-1 mt-n1" /> Spartan Protocol
          </div>
        </Link>
      </div>
      <Nav className="ml-auto">
        <AddressConn
          changeStates={props.changeStates}
          changeNotification={props.changeNotification}
          connectedTokens={props.connectedTokens}
          connectingTokens={props.connectingTokens}
        />
        <LanguageDropdown />
        <Supply />
      </Nav>
    </Container>
  </Navbar>
)

export default Header
