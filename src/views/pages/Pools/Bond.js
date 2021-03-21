import React, { Component } from "react"
import {
  CardText,
  Breadcrumb,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane, Button, Card, UncontrolledAlert, Progress
} from "reactstrap"
import coinSparta from "../../../assets/icons/coin_sparta.svg"

import classnames from "classnames"
import PoolsTable from "../PoolsTable"
import BondTable from "../BondTable"
import coinBnb from "../../../assets/icons/coin_bnb.svg"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"

class Bond extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: "1",
      activeTab1: "5",
      activeTab2: "9",
      activeTab3: "13",
      customActiveTab: "1",
      activeTabJustify: "5"
      //   col1: true,
      //   col2: false,
      //   col3: false,
      //   col5: true,
    }
    this.toggle = this.toggle.bind(this)
    this.toggle1 = this.toggle1.bind(this)

    this.toggle2 = this.toggle2.bind(this)
    this.toggle3 = this.toggle3.bind(this)
    this.toggleCustomJustified = this.toggleCustomJustified.bind(this)
    this.toggleCustom = this.toggleCustom.bind(this)
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab
      })
    }
  }

  toggle2(tab) {
    if (this.state.activeTab2 !== tab) {
      this.setState({
        activeTab2: tab
      })
    }
  }

  toggle3(tab) {
    if (this.state.activeTab3 !== tab) {
      this.setState({
        activeTab3: tab
      })
    }
  }

  toggleCustomJustified(tab) {
    if (this.state.activeTabJustify !== tab) {
      this.setState({
        activeTabJustify: tab
      })
    }
  }

  toggleCustom(tab) {
    if (this.state.customActiveTab !== tab) {
      this.setState({
        customActiveTab: tab
      })
    }
  }

  render() {
    return (
      <>
        <div className="content">
          <Breadcrumb>Bond & Mint</Breadcrumb>
          <Row>
            <Col lg={12}>

              <Row>
                <Col md={8} className="ml-4">
                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: this.state.customActiveTab === "1"
                        })}
                        onClick={() => {
                          this.toggleCustom("1")
                        }}
                      >
                        <span className="d-none d-sm-block">Your Bonds</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: this.state.customActiveTab === "2"
                        })}
                        onClick={() => {
                          this.toggleCustom("2")
                        }}
                      >
                        <span className="d-none d-sm-block">New Bond</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col>
                  <Button type="Button" className="btn btn-danger ml-lg-n5">
                    Proposals
                  </Button>
                  <Button type="Button" className="btn btn-primary">
                    Claim all (2)
                  </Button>
                </Col>
              </Row>


              <TabContent activeTab={this.state.customActiveTab}>
                <TabPane tabId="1" className="p-3">
                  <BondTable />
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col md={6}>
                      <Card
                        className="card-body ">
                        <Card
                          style={{ backgroundColor: "#25212D" }}
                          className="card-body "
                        >
                          <Row>
                            <Col>
                              <div className="title-card text-left">Bond Input</div>
                              <div className="output-card text-left">52.23</div>
                            </Col>
                            <Col>
                              <div className="output-card text-right">Balance 52.23</div>
                              <div className="output-card text-right">
                                BNB
                                <img className="ml-2" src={coinBnb} alt="BNB" />
                              </div>
                            </Col>
                          </Row>
                          <br />

                        </Card>

                        <br />
                        <UncontrolledAlert
                          className="alert-with-icon"
                          color="danger"
                          fade={false}
                        >
                    <span
                      data-notify="icon"
                      className="icon-small icon-info icon-dark mb-5"
                    />
                          <span data-notify="message">
                     The equivalent purchasing power in SPARTA is minted with both assets added symmetrically to the BNB:SPARTA liquidity pool.
                            LP tokens will be issued as usual and vested to you over a 12 month period.
                    </span>
                        </UncontrolledAlert>
                        <br/>
                        <Row>
                          <Col>
                          <div className="text-card">
                            SPARTA allocation
                            <i
                              className="icon-small icon-info icon-dark ml-2"
                              id="tooltipAddBase"
                              role="button"
                            />

                            <UncontrolledTooltip
                              placement="right"
                              target="tooltipAddBase"
                            >
                              The quantity of & SPARTA you are adding to the pool.
                            </UncontrolledTooltip>
                          </div>
                        </Col>
                          <Col className="output-card text-right">
                            150.265 Remaining
                          </Col>
                        </Row>

                        <br />
                        <div className="progress-container progress-primary">
                          <span className="progress-badge"></span>
                          <Progress max="100" value="60">
                          </Progress>
                        </div>
                        <br />
                        <Row>
                          <Col>
                            <div className="title-card text-left">
                              <div className="text-card">
                                Input
                                <i
                                  className="icon-small icon-info icon-dark ml-2"
                                  id="tooltipAddBase"
                                  role="button"
                                />

                                <UncontrolledTooltip
                                  placement="right"
                                  target="tooltipAddBase"
                                >
                                  The quantity of & SPARTA you are adding to the pool.
                                </UncontrolledTooltip>
                              </div>
                            </div>
                            <div className="output-card text-left">
                              <div className="text-card">
                                Share
                                <i
                                  className="icon-small icon-info icon-dark ml-2"
                                  id="tooltipAddBase"
                                  role="button"
                                />

                                <UncontrolledTooltip
                                  placement="right"
                                  target="tooltipAddBase"
                                >
                                  The quantity of & SPARTA you are adding to the pool.
                                </UncontrolledTooltip>
                              </div>
                            </div>
                            <br />
                            <div className="amount">
                              Estimated output{" "}
                              <i
                                className="icon-small icon-info icon-dark ml-2"
                                id="tooltipAddBase"
                                role="button"
                              />
                              <UncontrolledTooltip
                                placement="right"
                                target="tooltipAddBase"
                              >
                                The quantity of & SPARTA you are adding to the pool.
                              </UncontrolledTooltip>
                            </div>
                          </Col>
                          <Col>
                            <div className="output-card text-right">52.23 of 52.23 BNB</div>
                            <div className="output-card text-right">2.10 %</div>
                            <br />
                            <br />
                            <div className="subtitle-amount text-right">0.00</div>
                          </Col>
                        </Row>
                        <br />
                        <Button color="primary" size="lg" block>
                          Bond BNB
                        </Button>
                        <Button color="danger" size="lg" block>
                          Return to DAO
                        </Button>

                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card
                        className="card-body ">
                        <Card
                          style={{ backgroundColor: "#25212D" }}
                          className="card-body "
                        >
                          <Row>
                            <Col>
                              <div className="title-card text-left">Bond Input</div>
                              <div className="output-card text-left">52.23</div>
                            </Col>
                            <Col>
                              <br />
                              <div className="output-card text-right">
                                SPARTA
                                <img className="ml-2" src={coinSparta} alt="SPARTA" />
                              </div>
                            </Col>
                          </Row>
                          <br />

                        </Card>
                        <UncontrolledAlert
                          className="alert-with-icon"
                          color="danger"
                          fade={false}
                        >
                    <span
                      data-notify="icon"
                      className="icon-small icon-info icon-dark mb-5"
                    />
                          <span data-notify="message">
                     Bond BNB to get SPARTA LP Tokens. Claim your vested LP tokens.Your BNB-SPARTA LP tokens remain in time-locked contract
                    </span>
                        </UncontrolledAlert>
                        <br />

                        <br />
                        <Row>
                          <Col>
                            <div className="text-card text-left">Remaining BNB-SPARTA LP</div>
                            <div className="text-card text-left">Duration</div>
                            <div className="text-card text-leftt">Redemption date</div>
                            <div className="text-card text-leftt">Redemption date</div>

                          </Col>
                          <Col>
                            <div className="output-card text-right">0.00B</div>
                            <div className="output-card text-right">0 days</div>
                            <div className="output-card text-right">-</div>
                            <div className="output-card text-right">-</div>

                          </Col>

                        </Row>
                        <br />
                        <Button color="danger" size="lg" block>
                          Claim LP Tokens
                        </Button>
                      </Card>
                    </Col>
                  </Row>

                </TabPane>
              </TabContent>


            </Col>
          </Row>
        </div>
        <
        />
        )
        }
        }


        export default Bond
