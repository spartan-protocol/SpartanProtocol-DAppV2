import React from 'react'
import classNames from 'classnames'
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
} from 'reactstrap'
import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import LanguageDropdown from '../Common/LanguageDropdown'
import AddressConn from '../Common/AddressConn'
import { useWeb3 } from '../../store/web3'
import IconLogo from '../../assets/img/spartan_black_small.svg'

const Header = (props) => {
  const web3 = useWeb3()
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
        className={classNames('navbar-absolute', {
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
                <i className="icon-medium icon-menu-closed icon-light visible-on-sidebar-regular mr-4" />
                <i className="icon-medium icon-menu-open icon-light visible-on-sidebar-mini mr-4" />
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

          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            // onClick={toggleCollapse}
          /> */}
          <Nav className="ml-auto" navbar>
            <LanguageDropdown />
            <AddressConn
              changeStates={props.changeStates}
              changeNotification={props.changeNotification}
              connectedTokens={props.connectedTokens}
              connectingTokens={props.connectingTokens}
            />
            <UncontrolledDropdown className="d-inline-block p-0" nav>
              <DropdownToggle caret color="default" data-toggle="dropdown" nav>
                <Button type="Button" className="mx-1 btn-sm btn-primary">
                  <img className="mr-1" src={IconLogo} alt="share icon" /> $
                  {web3.spartaPrice}
                </Button>
              </DropdownToggle>
              <DropdownMenu className="dropdown-navbar" right tag="ul">
                <NavLink tag="li">
                  <DropdownItem className="nav-item">
                    Total Supply:
                  </DropdownItem>
                </NavLink>
                <NavLink tag="li">
                  <DropdownItem className="nav-item">Circulating:</DropdownItem>
                </NavLink>
                <NavLink tag="li">
                  <DropdownItem className="nav-item">
                    Max Supply: 300,000,000
                  </DropdownItem>
                </NavLink>
                <NavLink tag="li">
                  <DropdownItem className="nav-item">Market Cap:</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem disabled>
                    <div className="text-center">
                      <i className="bx bx-edit text-success mr-1" />
                      Contracts
                    </div>
                  </DropdownItem>
                  <DropdownItem>
                    <div>SPARTA</div>
                    <div>UTILS</div>
                  </DropdownItem>
                  <DropdownItem>
                    <div>DAO</div>
                    <div>ROUTER</div>
                  </DropdownItem>
                  <DropdownItem>
                    <div>BONDv2</div>
                    <div>BONDv3</div>
                  </DropdownItem>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
