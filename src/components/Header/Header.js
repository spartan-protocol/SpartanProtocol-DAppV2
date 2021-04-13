/* eslint-disable */
import React from 'react'
import classNames from 'classnames'
import {
  Button,
  NavbarBrand,
  Navbar,
  Nav,
  Row,
  Col,
  Container,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import { useWeb3 } from '../../store/web3'
import IconLogo from '../../assets/icons/coin_sparta_black_bg.svg'
import { getExplorerContract } from '../../utils/extCalls'
import { getAddresses } from '../../utils/web3'
import Supply from "../Supply/Supply"

const Header = (props) => {
  const web3 = useWeb3()
  const addr = getAddresses()
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

  return (
    <>
      <Navbar
        className={classNames('navbar sticky-top', {
          color: 'navbar-transparent',
        })}
        expand="lg"
      >
        <Container fluid className="px-1">
          <div className="navbar-wrapper ml-n2">
            <div className="navbar-minimize d-inline">
              <Button
                className="minimize-sidebar btn-just-icon"
                color="link"
                id="tooltip209599"
                onClick={props.handleMiniClick}
              >
                <i className="icon-medium icon-menu-closed icon-light visible-on-sidebar-regular ml-n2 mr-4" />
                <i className="icon-medium icon-menu-open icon-light visible-on-sidebar-mini ml-n2 mr-4" />
              </Button>
            </div>
            <div
              className={classNames('navbar-toggle d-inline', {
                toggled: props.sidebarOpened,
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={props.toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand className="d-none d-md-block" href="./">
              <SpartanLogo className="mr-2" /> Spartan Protocol
            </NavbarBrand>
          </div>
          <Nav className="ml-auto">
            <LanguageDropdown />
            <AddressConn
              changeStates={props.changeStates}
              changeNotification={props.changeNotification}
              connectedTokens={props.connectedTokens}
              connectingTokens={props.connectingTokens}
            />
            <Supply/>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
