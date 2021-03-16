import React from "react"

import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Table,
  UncontrolledDropdown
} from "reactstrap"

// import { withNamespaces } from 'react-i18next'
// import InputGroup from 'reactstrap/es/InputGroup'
// import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import Slider from "nouislider"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
// import { Breadcrumb } from 'react-bootstrap'
import coin_bnb from "../../../assets/icons/coin_bnb.svg"
import coin_sparta from "../../../assets/icons/coin_sparta.svg"
// import bnb_sparta from '../../../assets/icons/bnb_sparta.png'
// import { manageBodyClass } from '../../../components/Common/common'

const Liquidity = () => {
  const [horizontalTabs, sethorizontalTabs] = React.useState("profile")
  //   const [setverticalTabs] = React.useState('profile')
  //   const [setverticalTabsIcons] = React.useState('home')
  //   const [setpageTabs] = React.useState('home')
  // with this function we change the active tab for all the tabs in this page
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  // const slider1Ref = React.useRef(null)
  // const slider2Ref = React.useRef(null)
  // React.useEffect(() => {
  //   const slider1 = slider1Ref.current
  //   const slider2 = slider2Ref.current
  //   if (slider1.className === 'slider') {
  //     Slider.create(slider1, {
  //       start: [40],
  //       connect: [true, false],
  //       step: 1,
  //       range: { min: 0, max: 100 },
  //     })
  //   }
  //   if (slider2.className === 'slider slider-primary mb-3') {
  //     Slider.create(slider2, {
  //       start: [20, 60],
  //       connect: [false, true, false],
  //       step: 1,
  //       range: { min: 0, max: 100 },
  //     })
  //   }
  // }, [])

  //   const [dropdownOpen, setDropdownOpen] = useState(false)

  //   const toggle = () => setDropdownOpen(!dropdownOpen)


  {/* <InputPaneJoin */
  }
  {/*    address={props.pool.address} */
  }
  {/*    paneData={props.userData} */
  }
  {/*    onInputChange={props.onAddChange} */
  }
  {/*    changeAmount={props.changeAmount} */
  }
  {/*    activeTab={props.activeTab} */
  }
  {/*    name={props.name} */
  }
  {/* /> */
  }
  return (
    <>
      <div className="content">
        <br/>
        <Breadcrumb><Col md={10}>Join</Col><Col md={2}>         <UncontrolledDropdown>
          <DropdownToggle
            aria-expanded={false}
            aria-haspopup
            caret
            className="btn-block"
            color="danger"
            data-toggle="dropdown"
            id="dropdownMenuButton"
            type="button"
          >
            <i className="bi bi-wallet mr-2" />
            Wallet
          </DropdownToggle>
          <DropdownMenu aria-labelledby="dropdownMenuButton">
            <DropdownItem
              className="text-center"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              Available Balance
              <DropdownItem divider />
            </DropdownItem>
            <DropdownItem href="">
              SPARTA : <span className="float-right">XXX</span>
            </DropdownItem>
            <DropdownItem href="">
              BNB: <span className="float-right">XXX</span>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem
              className="text-primary text-center"
              onClick={(e) => e.preventDefault()}
            >
              View all assets
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown></Col></Breadcrumb>
        <Row>

          <Col md={7}> <Card className="card-body">X</Card></Col>


          <Col md={5}> <Card className="card-body">X</Card></Col>


        </Row>


        {/*<Row>*/}
        {/*  <Col md="12">*/}
        {/*    <Row>*/}
        {/*      <Col md={10}>*/}
        {/*        <Nav pills className="nav-tabs-custom">*/}
        {/*          <NavItem>*/}
        {/*            <NavLink*/}
        {/*              data-toggle="tab"*/}
        {/*              href="#"*/}
        {/*              className={horizontalTabs === 'profile' ? 'active' : ''}*/}
        {/*              onClick={(e) =>*/}
        {/*                changeActiveTab(e, 'horizontalTabs', 'profile')*/}
        {/*              }*/}
        {/*            >*/}
        {/*              Add Both*/}
        {/*            </NavLink>*/}
        {/*          </NavItem>*/}
        {/*          <NavItem>*/}
        {/*            <NavLink*/}
        {/*              data-toggle="tab"*/}
        {/*              href="#"*/}
        {/*              className={*/}
        {/*                horizontalTabs === 'settings' ? 'active' : ''*/}
        {/*              }*/}
        {/*              onClick={(e) =>*/}
        {/*                changeActiveTab(e, 'horizontalTabs', 'settings')*/}
        {/*              }*/}
        {/*            >*/}
        {/*              Add BNB*/}
        {/*            </NavLink>*/}
        {/*          </NavItem>*/}
        {/*          <NavItem>*/}
        {/*            <NavLink*/}
        {/*              data-toggle="tab"*/}
        {/*              href="#"*/}
        {/*              className={horizontalTabs === 'options' ? 'active' : ''}*/}
        {/*              onClick={(e) =>*/}
        {/*                changeActiveTab(e, 'horizontalTabs', 'options')*/}
        {/*              }*/}
        {/*            >*/}
        {/*              Remove Both*/}
        {/*            </NavLink>*/}
        {/*          </NavItem>*/}
        {/*        </Nav>*/}
        {/*      </Col>*/}
        {/*      <Col md={2} className="text-left">*/}

        {/*      </Col>*/}
        {/*    </Row>*/}

        {/*    <TabContent className="tab-space" activeTab={horizontalTabs}>*/}
        {/*      <TabPane tabId="profile">*/}
        {/*        <Row>*/}
        {/*          <Col md={8}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>1</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 10.36</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_bnb}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              BNB*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>100.52</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 255.89</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_sparta}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              SPARTA*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <div className="slider" ref={slider1Ref} />*/}
        {/*              <br />*/}
        {/*              <div*/}
        {/*                className="slider slider-primary mb-ImageUpload.3"*/}
        {/*                ref={slider2Ref}*/}
        {/*              />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h10 className="font-weight-light m-0">*/}
        {/*                    Input{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h10>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                  <br />*/}
        {/*                  100.52 of 255.89 SPARTA*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <br />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Share{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Estimated output{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  52.23*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*            </Card>*/}
        {/*          </Col>*/}
        {/*          <Col md={4}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Table borderless>*/}
        {/*                  <tbody>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            height={15}*/}
        {/*                            src={coin_bnb}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          BNB*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>*/}
        {/*                        <div className="amount">*/}
        {/*                          <h5>$260.55</h5>*/}
        {/*                        </div>*/}
        {/*                      </td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            src={coin_sparta}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          SPARTA*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>$1.30</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Spot price</td>*/}
        {/*                      <td>178.28 SPARTA</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Volume</td>*/}
        {/*                      <td>$261.474.287</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Tx count</td>*/}
        {/*                      <td>@fat</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Fees</td>*/}
        {/*                      <td>$1.070.836</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Depth</td>*/}
        {/*                      <td>48.907 BNB</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        APY{' '}*/}
        {/*                        <i*/}
        {/*                          className="bi bi-info-circle"*/}
        {/*                          id="tooltipAddBase"*/}
        {/*                          role="button"*/}
        {/*                        />*/}
        {/*                      </td>*/}
        {/*                      <td>150.39%</td>*/}
        {/*                    </tr>*/}
        {/*                  </tbody>*/}
        {/*                </Table>*/}
        {/*              </Row>*/}
        {/*            </Card>{' '}*/}
        {/*          </Col>*/}
        {/*        </Row>*/}
        {/*      </TabPane>*/}
        {/*      <TabPane tabId="settings">*/}
        {/*        <Row>*/}
        {/*          <Col md={8}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>1</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 10.36</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_bnb}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              BNB*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>100.52</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 255.89</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_sparta}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              SPARTA*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <div className="slider" ref={slider1Ref} />*/}
        {/*              <br />*/}
        {/*              <div*/}
        {/*                className="slider slider-primary mb-ImageUpload.3"*/}
        {/*                ref={slider2Ref}*/}
        {/*              />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h10 className="font-weight-light m-0">*/}
        {/*                    Input{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h10>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                  <br />*/}
        {/*                  100.52 of 255.89 SPARTA*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <br />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Share{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Estimated output{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  52.23*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*            </Card>*/}
        {/*          </Col>*/}
        {/*          <Col md={4}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Table borderless>*/}
        {/*                  <tbody>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            height={15}*/}
        {/*                            src={coin_bnb}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          BNB*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>*/}
        {/*                        <div className="amount">*/}
        {/*                          <h5>$260.55</h5>*/}
        {/*                        </div>*/}
        {/*                      </td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            src={coin_sparta}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          SPARTA*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>$1.30</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Spot price</td>*/}
        {/*                      <td>178.28 SPARTA</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Volume</td>*/}
        {/*                      <td>$261.474.287</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Tx count</td>*/}
        {/*                      <td>@fat</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Fees</td>*/}
        {/*                      <td>$1.070.836</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Depth</td>*/}
        {/*                      <td>48.907 BNB</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        APY{' '}*/}
        {/*                        <i*/}
        {/*                          className="bi bi-info-circle"*/}
        {/*                          id="tooltipAddBase"*/}
        {/*                          role="button"*/}
        {/*                        />*/}
        {/*                      </td>*/}
        {/*                      <td>150.39%</td>*/}
        {/*                    </tr>*/}
        {/*                  </tbody>*/}
        {/*                </Table>*/}
        {/*              </Row>*/}
        {/*            </Card>{' '}*/}
        {/*          </Col>*/}
        {/*        </Row>*/}
        {/*      </TabPane>*/}
        {/*      <TabPane tabId="options">*/}
        {/*        <Row>*/}
        {/*          <Col md={8}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>1</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 10.36</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_bnb}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              BNB*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*                <Col>*/}
        {/*                  {' '}*/}
        {/*                  <Card*/}
        {/*                    className="card-body"*/}
        {/*                    style={{ backgroundColor: '#25212D' }}*/}
        {/*                  >*/}
        {/*                    <Row>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-left">*/}
        {/*                          <label>Input</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>100.52</h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                      <Col md={6}>*/}
        {/*                        <div className="text-right">*/}
        {/*                          <label>Balance 255.89</label>*/}
        {/*                          <FormGroup>*/}
        {/*                            <h5>*/}
        {/*                              <img*/}
        {/*                                className="mr-2"*/}
        {/*                                src={coin_sparta}*/}
        {/*                                alt="Logo"*/}
        {/*                              />*/}
        {/*                              SPARTA*/}
        {/*                            </h5>*/}
        {/*                          </FormGroup>*/}
        {/*                        </div>*/}
        {/*                      </Col>*/}
        {/*                    </Row>*/}
        {/*                  </Card>*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <div className="slider" ref={slider1Ref} />*/}
        {/*              <br />*/}
        {/*              <div*/}
        {/*                className="slider slider-primary mb-ImageUpload.3"*/}
        {/*                ref={slider2Ref}*/}
        {/*              />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h10 className="font-weight-light m-0">*/}
        {/*                    Input{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h10>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                  <br />*/}
        {/*                  100.52 of 255.89 SPARTA*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <br />*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Share{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  1 of 10.36 BNB*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*              <Row>*/}
        {/*                <Col md={6}>*/}
        {/*                  <h6 className="font-weight-light m-0">*/}
        {/*                    Estimated output{' '}*/}
        {/*                    <i*/}
        {/*                      className="bi bi-info-circle"*/}
        {/*                      id="tooltipAddBase"*/}
        {/*                      role="button"*/}
        {/*                    />*/}
        {/*                  </h6>*/}
        {/*                  <UncontrolledTooltip*/}
        {/*                    placement="right"*/}
        {/*                    target="tooltipAddBase"*/}
        {/*                  >*/}
        {/*                    The quantity of & SPARTA you are adding to the*/}
        {/*                    pool.*/}
        {/*                  </UncontrolledTooltip>*/}
        {/*                </Col>*/}
        {/*                <Col className="text-right" md={6}>*/}
        {/*                  52.23*/}
        {/*                </Col>*/}
        {/*              </Row>*/}
        {/*            </Card>*/}
        {/*          </Col>*/}
        {/*          <Col md={4}>*/}
        {/*            <Card className="card-body">*/}
        {/*              <Row>*/}
        {/*                <Table borderless>*/}
        {/*                  <tbody>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            height={15}*/}
        {/*                            src={coin_bnb}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          BNB*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>*/}
        {/*                        <div className="amount">*/}
        {/*                          <h5>$260.55</h5>*/}
        {/*                        </div>*/}
        {/*                      </td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        <h5>*/}
        {/*                          <img*/}
        {/*                            className="mr-2"*/}
        {/*                            src={coin_sparta}*/}
        {/*                            alt="Logo"*/}
        {/*                          />*/}
        {/*                          SPARTA*/}
        {/*                        </h5>*/}
        {/*                      </td>*/}
        {/*                      <td>$1.30</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Spot price</td>*/}
        {/*                      <td>178.28 SPARTA</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Volume</td>*/}
        {/*                      <td>$261.474.287</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Tx count</td>*/}
        {/*                      <td>@fat</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Fees</td>*/}
        {/*                      <td>$1.070.836</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>Depth</td>*/}
        {/*                      <td>48.907 BNB</td>*/}
        {/*                    </tr>*/}
        {/*                    <tr>*/}
        {/*                      <td>*/}
        {/*                        APY{' '}*/}
        {/*                        <i*/}
        {/*                          className="bi bi-info-circle"*/}
        {/*                          id="tooltipAddBase"*/}
        {/*                          role="button"*/}
        {/*                        />*/}
        {/*                      </td>*/}
        {/*                      <td>150.39%</td>*/}
        {/*                    </tr>*/}
        {/*                  </tbody>*/}
        {/*                </Table>*/}
        {/*              </Row>*/}
        {/*            </Card>{' '}*/}
        {/*          </Col>*/}
        {/*        </Row>*/}
        {/*      </TabPane>*/}
        {/*    </TabContent>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
      </div>
    </>
  )
}

export default Liquidity
