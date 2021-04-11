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
import IconLogo from '../../assets/img/spartan_black_small.svg'
import { getExplorerContract } from '../../utils/extCalls'
import { getAddresses } from '../../utils/web3'

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
            <Button
              type="Button"
              className="mx-1 btn-sm btn-primary"
              href="#"
              id="headerPriceTooltip"
            >
              <img className="mr-1" src={IconLogo} alt="share icon" /> $
              {web3.spartaPrice}
            </Button>
            <UncontrolledPopover
              placement="bottom"
              target="headerPriceTooltip"
              className="text-center"
              data-html="true"
            >
              <PopoverHeader className="text-center">
                Token Supply
              </PopoverHeader>
              <PopoverBody>
                <Row className="text-center">
                  <Col xs="6">Total Supply:</Col>
                  <Col xs="6">123,456,789</Col>
                  <Col xs="6">Circulating: </Col>
                  <Col xs="6">123,456,789</Col>
                  <Col xs="6">Max Supply: </Col>
                  <Col xs="6">300,000,000</Col>
                  <Col xs="6">Market Cap: </Col>
                  <Col xs="6">123,456,789</Col>
                </Row>
              </PopoverBody>
              <PopoverHeader className="text-center">
                Token Contracts
              </PopoverHeader>
              <PopoverBody>
                <Row className="text-center">
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.sparta)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      SPARTA
                    </a>
                  </Col>
                  <Col xs="6">
                    {' '}
                    <a
                      href={getExplorerContract(addr.poolFactory)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      PoolFactory
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.synthFactory)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      SynthFactory
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.bond)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bond
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.bondVault)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      BondVault
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.dao)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dao
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.daoVault)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      DaoVault
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.router)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Router
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.utils)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Utils
                    </a>
                  </Col>
                  <Col xs="6">
                    <a
                      href={getExplorerContract(addr.migrate)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Migrate
                    </a>
                  </Col>
                </Row>
              </PopoverBody>
            </UncontrolledPopover>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
