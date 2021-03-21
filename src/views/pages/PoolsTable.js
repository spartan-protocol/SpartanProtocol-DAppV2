/* eslint-disable global-require */
/* eslint-disable react/no-unescaped-entities */
import React from "react"
import classnames from "classnames"
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert"

// reactstrap components
import {
  UncontrolledAlert,
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Modal,
  ModalBody,
  Row,
  Col, NavItem, NavLink, TabContent, TabPane, Collapse
} from "reactstrap"
import coinBnb from "../../assets/icons/coin_bnb.svg"
import coinSparta from "../../assets/icons/coin_sparta.svg"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import bnbSparta from "../../assets/icons/bnb_sparta.png"
import bnb from "../../assets/icons/BNB.svg"
import Slider from "nouislider"

const Poolstable = () => {

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


  const [horizontalTabs, sethorizontalTabs] = React.useState("harvest")
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  const [modalNotice, setModalNotice] = React.useState(false)
  const toggleModalNotice = () => {
    setModalNotice(!modalNotice)
  }

  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)


  return (

    <>

    <Col md={10}>
      <Card className="card-body" style={{ backgroundColor: "#1D171F" }}>
        <div
          aria-multiselectable
          className="card-collapse"
          id="accordion"
          role="tablist">

          <Card>
                <Row>
                  <Col md="2">
                    <h2>
                      <img className="mr-2" src={bnb} alt="Logo" />
                      BNB
                    </h2>
                  </Col>
                  <Col className="mr-4">
                    <div className="title-card">APY</div>
                    <div className="subtitle-card">188.25%</div>
                  </Col>
                  <Col className="mr-">
                    <div className="title-card">Liquidity</div>
                    <div className="subtitle-card">$22.584.633</div>
                  </Col>
                  <Col className="mr-3">
                    <div className="title-card">Volume (24hrs)</div>
                    <div className="subtitle-card">218.988,784 SPARTA</div>
                  </Col>
                  <Col md="0" className="mr-5">
                    <div className="title-card">Locked LP</div>
                    <div className="subtitle-amount">0.00</div>
                  </Col>
                  <Col md="0" className="ml-auto mr-2">
                    <Button type="Button" className="btn btn-primary">
                      Bond
                    </Button>
                    <Button type="Button" className="btn btn-primary">
                      Swap
                    </Button>
                    <Button type="Button" className="btn btn-primary">
                      Join
                    </Button>
                  </Col>
                  <Col className="ml-auto" md="1">
                    {/* ADD ARROW ICON */}
                    <div
                      aria-expanded={openedCollapseThree}
                      role="button"
                      tabIndex={-1}
                      data-parent="#accordion"
                      data-toggle="collapse"
                      onClick={(e) => {
                        e.preventDefault()
                        setopenedCollapseThree(!openedCollapseThree)
                      }}
                      onKeyPress={(e) => {
                        e.preventDefault()
                        setopenedCollapseThree(!openedCollapseThree)
                      }}
                    >
                      <i
                        className="bd-icons icon-minimal-down mt-3"
                        style={{ color: "#FFF" }}
                      /></div>
                  </Col>
                </Row>

            <Card style={{ backgroundColor: "#25212D" }}>
              <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                <CardBody>
                  <Row>
                    <Col md="7">
                      <h3>
                        <img
                          className="mr-2"
                          src={bnbSparta}
                          alt="Logo"
                          height="32"
                        />
                        WBNB-SPARTA LP
                      </h3>
                    </Col>
                    <Col md="1">
                      <div className="title-card ml-n1">Available LP</div>
                      <div className="subtitle-card">0.00</div>
                    </Col>
                    <Col md="4">
                      <Button type="Button" className="btn btn-success">
                        Lock
                      </Button>
                      <Button type="Button" className="btn btn-success">
                        Unlock
                      </Button>
                      <Button color="success" onClick={toggleModalNotice}>
                        Manage LP
                      </Button>
                    </Col>
                  </Row>
                </CardBody>

              </Collapse>
            </Card>
          </Card>

        </div>
      </Card>
    </Col>


      {/*Harvest modal>*/}

      <Modal isOpen={modalNotice} toggle={toggleModalNotice}>
        <div className="modal-header">
          <button
            aria-hidden
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModalNotice}
          >
          </button>
        </div>
        <ModalBody className="text-center">
          <div className="instruction">
            <h3 className="text-center header-title">Manage LP</h3>

            <Row>
              <Col md={6} className="justify-content-center">
                <Card
                  style={{ backgroundColor: "#25212D" }}
                  className="card-body "
                >
                  <NavItem style={{ listStyleType: "none" }}>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === "harvest" ? "active" : ""}
                      onClick={(e) =>
                        changeActiveTab(e, "horizontalTabs", "harvest")
                      }
                    >
                      <div className="text-center">
                        <i
                          className="icon-small icon-remove icon-dark text-center"
                          aria-hidden="true"
                        />
                        <div className="output-card">Harvest SPARTA</div>
                      </div>
                    </NavLink>
                  </NavItem>
                </Card>
              </Col>
              <Col md={6} className="justify-content-center">
                <Card
                  style={{ backgroundColor: "#25212D" }}
                  className="card-body "
                >
                  <NavItem style={{ listStyleType: "none" }}>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === "remove" ? "active" : ""}
                      onClick={(e) =>
                        changeActiveTab(e, "horizontalTabs", "remove")
                      }
                    >
                      <div className="text-center">
                        <i
                          className="icon-small icon-remove icon-dark text-center"
                          aria-hidden="true"
                        />
                        <div className="output-card">Remove LP</div>
                      </div>
                    </NavLink>
                  </NavItem>
                </Card>
              </Col>
            </Row>
            <TabContent className="tab-space" activeTab={horizontalTabs}>
              <TabPane tabId="harvest">
                <Row>

                  <Col md={12}>
                    <Card style={{ backgroundColor: "#25212D" }}
                          className="card-body">
                      <Col>
                        <div className="title-card">Harvest</div>
                        <div className="output-card">12.2568 SPARTA</div>
                      </Col>

                    </Card>
                    <Row>
                      <Col>
                        <div className="text-card">
                          DAO weight{" "}
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
                        <br />
                        <div className="text-card">Latest harvest</div>
                      </Col>
                      <Col>
                        <div className="output-card text-right">0.051%</div>
                        <br />
                        <div className="output-card text-right">5 days ago</div>
                      </Col>
                    </Row>
                    <br />
                    <Button color="primary" size="lg" block>
                      Harvest
                    </Button>
                    <br />
                    <br />
                    <br />
                    <br />

                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="remove">
                <Row>
                  <Col md={12}>
                    <Card style={{ backgroundColor: "#25212D" }}
                          className="card-body">
                      <Row>
                        <Col>
                          <div className="title-card text-left">Remove LP</div>
                          <div className="output-card text-left">678.23</div>
                        </Col>
                        <Col>
                          <div className="title-card text-right">Locked LP 678.23</div>
                          <div className="output-card text-right">WBNB-SPARTA LP <img
                            className="mr-2"
                            src={bnbSparta}
                            alt="Logo"
                            height="32"
                          />
                          </div>
                        </Col>
                      </Row>
                    </Card>
                    <Row>

                      <Col>0%</Col>
                      <Col>25%</Col>
                      <Col>50%</Col>
                      <Col>75%</Col>
                      <Col>
                        <div className="text-right output-card">MAX</div>
                      </Col>
                      {/*<div className="slider" ref={slider1Ref} />*/}

                      {/*<div className="slider slider-primary mb-ImageUpload.3" ref={slider2Ref} />*/}
                    </Row>
                    <br />
                    <Row>
                      <Col>
                        <div className="text-card">
                          DAO Redeem LP Tokens{" "}
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
                        <br />
                        <div className="text-card">
                          Receive{" "}
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
                        <br />
                        <div className="text-card">
                          Staked LP Tokens{" "}
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
                        <br />
                        <div className="text-card">
                          Staked LP Tokens{" "}
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
                        <div className="output-card text-right">52.23 of 52.23</div>
                        <br />
                        <div className="output-card text-right">1.02 BNB</div>
                        <div className="output-card text-right">100.52 SPARTA</div>
                        <br />

                        <div className="output-card text-right">52.23</div>
                        <br />
                        <div className="subtitle-amount text-right">1.02 BNB</div>
                        <div className="subtitle-amount text-right">100.52 SPARTA</div>
                      </Col>
                    </Row>
                    <br />

                    <br />
                    <Button color="primary" size="lg" block>
                      Remove LP
                    </Button>
                    <br />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
            <Row />
            <Button
              className="btn-round mt-n5"
              color="info"
              data-dismiss="modal"
              type="button"
              onClick={toggleModalNotice}
            >
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Poolstable
