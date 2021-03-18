import React from "react"

import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Button,
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
  UncontrolledDropdown, Alert, CardBody, UncontrolledAlert
} from "reactstrap"

// import { withNamespaces } from 'react-i18next'
// import InputGroup from 'reactstrap/es/InputGroup'
// import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import Slider from "nouislider"

import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
// import { Breadcrumb } from 'react-bootstrap'
import coin_bnb from "../../../assets/icons/coin_bnb.svg"
import coin_sparta from "../../../assets/icons/coin_sparta.svg"
import bnb_sparta from "../../../assets/icons/bnb_sparta.png"
// import bnb_sparta from '../../../assets/icons/bnb_sparta.png'
// import { manageBodyClass } from '../../../components/Common/common'

const Liquidity = () => {
  const [horizontalTabs, sethorizontalTabs] = React.useState("addBoth")
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  const slider1Ref = React.useRef(null)
  const slider2Ref = React.useRef(null)

  const slider3Ref = React.useRef(null)
  const slider4Ref = React.useRef(null)

  const slider5Ref = React.useRef(null)
  const slider6Ref = React.useRef(null)


  React.useEffect(() => {
    const slider1 = slider1Ref.current
    const slider2 = slider2Ref.current
    if (slider1.className === "slider") {
      Slider.create(slider1, {
        start: [40],
        connect: [true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
    if (slider2.className === "slider slider-primary mb-3") {
      Slider.create(slider2, {
        start: [20, 60],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
  }, [])

  React.useEffect(() => {
    const slider3 = slider3Ref.current
    const slider4 = slider4Ref.current
    if (slider3.className === "slider") {
      Slider.create(slider3, {
        start: [80],
        connect: [true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
    if (slider4.className === "slider slider-primary mb-3") {
      Slider.create(slider4, {
        start: [20, 60],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
  }, [])


  React.useEffect(() => {
    const slider5 = slider5Ref.current
    const slider6 = slider6Ref.current
    if (slider5.className === "slider") {
      Slider.create(slider5, {
        start: [100],
        connect: [true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
    if (slider6.className === "slider slider-primary mb-3") {
      Slider.create(slider6, {
        start: [20, 60],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 }
      })
    }
  }, [])


  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb><Col md={10}>Join</Col><Col md={2}> <UncontrolledDropdown>
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
        </UncontrolledDropdown></Col>
        </Breadcrumb>


        <Row>
          <Col md={7}>

            <Card className="card-body">

              <Row>
                {/*<Nav tabs className="nav-tabs-custom">*/}
                <Col md={4} className="justify-content-center">

                  <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        href="#"
                        className={horizontalTabs === "addBoth" ? "active" : ""}
                        onClick={(e) =>
                          changeActiveTab(e, "horizontalTabs", "addBoth")
                        }
                      >
                        <div className="text-center"><i className="icon-small icon-add-both icon-dark text-center"
                                                        aria-hidden="true"></i>
                          <div className="output-card">Add Both</div>
                        </div>
                      </NavLink>
                    </NavItem>
                  </Card>
                </Col>
                <Col md={4} className="justify-content-center">
                  <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        href="#"
                        className={
                          horizontalTabs === "addSingle" ? "active" : ""
                        }
                        onClick={(e) =>
                          changeActiveTab(e, "horizontalTabs", "addSingle")
                        }
                      >
                        <div className="text-center"><i className="icon-small icon-add-single icon-dark text-center"
                                                        aria-hidden="true"></i>
                          <div className="output-card">Add BNB</div>
                        </div>
                      </NavLink>
                    </NavItem>
                  </Card>
                </Col>

                <Col md={4} className="justify-content-center">
                  <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        href="#"
                        className={horizontalTabs === "remove" ? "active" : ""}
                        onClick={(e) =>
                          changeActiveTab(e, "horizontalTabs", "remove")
                        }
                      >
                        <div className="text-center"><i className="icon-small icon-remove icon-dark text-center"
                                                        aria-hidden="true"></i>
                          <div className="output-card">Remove Both</div>
                        </div>
                      </NavLink>
                    </NavItem>
                  </Card>
                </Col>
                {/*</Nav>*/}
              </Row>
              <TabContent className="tab-space" activeTab={horizontalTabs}>
                <TabPane tabId="addBoth">
                  <Row>
                    <Col md={6}>
                      <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <div className="output-card">1</div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">Balance 10.36</div>
                            <div className="output-card">BNB
                              <img
                                className="ml-2"
                                src={coin_bnb}
                                alt="BNB"
                              />

                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <div className="output-card">1</div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">Balance 10.36</div>
                            <div className="output-card">SPARTA
                              <img
                                className="ml-2"
                                src={coin_sparta}
                                alt="SPARTA"
                              />

                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                  </Row>
                  <Row>
                    <Col><br /><br /><Row><Col>0%</Col><Col>25%</Col><Col>50%</Col><Col>75%</Col><Col>
                      <div class="text-right output-card">MAX</div>
                    </Col></Row>
                      <br />
                      <div className="slider" ref={slider1Ref} />
                      <br />
                      <div
                        className="slider slider-primary mb-ImageUpload.3"
                        ref={slider2Ref}
                      />
                    </Col></Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      <div className="text-card">Input{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <div className="text-card">Share{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br/>

                      <div className="amount">Estimated output{" "}<i
                        className="icon-small icon-info icon-dark ml-2"

                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>

                    </Col>
                    <Col md={6} className="text-right">
                      <div className="output-card">1 of 10.36 BNB</div>
                      <div className="output-card">100.52 of 255.89 SPARTA</div>
                      <div className="output-card">1 of 10.36 BNB</div>
                      <br />
                      <br />
                      <div className="subtitle-amount">52.23</div>
                    </Col>
                  </Row>
                  <br />
                  <Button color="primary" size="lg" block>Add to pool</Button>
                </TabPane>
                <TabPane tabId="addSingle">
                  <Row>
                    <Col md={6}>
                      <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <div className="output-card">1</div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">Balance 10.36</div>
                            <div className="output-card">BNB
                              <img
                                className="ml-2"
                                src={coin_bnb}
                                alt="BNB"
                              />

                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <div className="output-card">1</div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">Balance 10.36</div>
                            <div className="output-card">SPARTA
                              <img
                                className="ml-2"
                                src={coin_sparta}
                                alt="SPARTA"
                              />

                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                  </Row>
                  <Row>
                    <Col><br /><br /><Row><Col>0%</Col><Col>25%</Col><Col>50%</Col><Col>75%</Col><Col>
                      <div class="text-right output-card">MAX</div>
                    </Col></Row>
                      <br />
                      <div className="slider" ref={slider3Ref} />
                      <br />
                      <div
                        className="slider slider-primary mb-ImageUpload.3"
                        ref={slider4Ref}
                      />
                    </Col></Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      <div className="text-card">Input{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <div className="text-card">Swap{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <div className="text-card">Share{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>


                      <br />
                      <div className="amount">Estimated output{" "}<i
                        className="icon-small icon-info icon-dark ml-2"

                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>

                    </Col>
                    <Col md={6} className="text-right">
                      <div className="output-card">1 of 10.36 BNB</div>
                      <div className="output-card">100.52 of 255.89 SPARTA</div>
                      <div className="output-card">1 of 10.36 BNB</div>
                      <br />
                      <br />
                      <br />
                      <br />
                      <div className="subtitle-amount">52.23</div>
                    </Col>
                  </Row>
                  <br />
                  <Button color="primary" size="lg" block>Add to pool</Button>
                  <br />
                  <UncontrolledAlert
                    className="alert-with-icon"
                    color="danger"
                    fade={false}
                  >
                    <span data-notify="icon" className="icon-medium icon-info icon-dark mb-5" />
                    <span data-notify="message">
                      Please ensure you understand the risks related to this asymmetric add! 50%
                      of the input BNB will be swapped to SPARTA before adding both to the pool.
                      This is subject to the usual swap fees and may have unfavourable
                      'impermanent loss' vs hodling your assets!
                  </span>
                  </UncontrolledAlert>
                </TabPane>
                <TabPane tabId="remove">
                  <Row>
                    <Col md={12}>
                      <Card style={{ backgroundColor: "#25212D" }} className="card-body ">
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Redeem</div>
                            <div className="output-card">52.23</div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">Balance 52.23</div>
                            <div className="output-card"><img
                              className="mr-2"
                              src={bnb_sparta}
                              alt="Logo"
                              height="25"
                            />
                              WBNB-SPARTA LP


                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>


                  </Row>
                  <Row>
                    <Col><br /><br /><Row><Col>0%</Col><Col>25%</Col><Col>50%</Col><Col>75%</Col><Col>
                      <div class="text-right output-card">MAX</div>
                    </Col></Row>
                      <br />
                      <div className="slider" ref={slider5Ref} />
                      <br />
                      <div
                        className="slider slider-primary mb-ImageUpload.3"
                        ref={slider6Ref}
                      />
                    </Col></Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      <div className="text-card">Redeem LP Tokens{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <div className="text-card">Receive{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <br />
                      <div className="text-card">Staked LP Tokens{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>
                      <br />
                      <div className="text-card">Projected output{" "}<i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />


                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase">
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>

                      </div>

                    </Col>
                    <Col md={6} className="text-right">
                      <div className="output-card">52.23 of 52.23</div>
                      <div className="output-card">1.02 BNB</div>
                      <div className="output-card">100.52 SPARTA</div>
                      <div className="output-card">52.23</div>
                      <br />
                      <br />
                      <div className="subtitle-amount">1.02 BNB</div>
                      <br />
                      <div className="subtitle-amount">100.52 SPARTA</div>
                    </Col>
                  </Row>
                  <br />
                  <Button color="primary" size="lg" block>Redeem LP Tokens</Button>
                </TabPane>
              </TabContent>
              <Row>
              </Row>
            </Card>

          </Col>
          <Col md={5}> <Card className="card-body"><h1>PANE</h1><br /><br /><br /><br /><br /></Card>
          </Col>
        </Row>

      </div>
    </>
  )
}

export default Liquidity
