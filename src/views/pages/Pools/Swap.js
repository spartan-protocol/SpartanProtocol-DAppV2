/* eslint-disable */

import React, { useState } from "react"
import Select from "react-select"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import { Button, Card, Col, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledAlert } from "reactstrap"
import Wallet from "../../../components/Wallet/Wallet"
import coinBnb from "../../../assets/icons/coin_bnb.svg"
import coinSparta from "../../../assets/icons/coin_sparta.svg"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import bnbSparta from "../../../assets/icons/bnb_sparta.png"
import PoolsPaneSide from "./PoolsPaneSide"


const Swap = () => {
  const [singleSelect, setsingleSelect] = React.useState(null)
  const [singleSelect2, setsingleSelect2] = React.useState(null)


  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={10}>Swap</Col>
          <Col md={2}>
            {" "}
            <Wallet />
          </Col>
        </Breadcrumb>
        <Row>
          <Col md={8}>
            <Card className="card-body">
              <Row>
                <Col md={5}>
                  <Card
                    style={{ backgroundColor: "#25212D" }}
                    className="card-body "
                  >
                    <Row>
                      <Col className="text-left">
                        <div className="title-card">From</div>
                        <br />
                        <div className="output-card"><Select
                          className="react-select info"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={singleSelect}
                          onChange={(value) => setsingleSelect(value)}
                          options={[
                            {
                              value: "",
                              label: false,
                              icon: "",
                              isDisabled: true
                            },
                            { value: "1", label: <span><img src={coinBnb} alt="empty" /> BNB</span> },
                            { value: "2", label: <span><img src={coinSparta} alt="empty" /> SPARTA</span> }

                          ]}
                          placeholder="Select token"
                        /></div>
                      </Col>
                      <Col className="text-right">
                        <br />
                        <div className="output-card">Balance 10.36</div>
                        <div className="title-card  mt-2">1</div>
                        <div className="output-card">≈ $265,96</div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <div className="card-body ml-5 mt-4">
                    <Button className="btn-rounded btn-icon" color="primary">
                      <i className="icon-small icon-swap icon-light mt-1" />
                    </Button>
                  </div>

                </Col>

                <Col md={5}>
                  <Card
                    style={{ backgroundColor: "#25212D" }}
                    className="card-body "
                  >
                    <Row>
                      <Col className="text-left">
                        <div className="title-card">To</div>
                        <br />
                        <div className="output-card"><Select
                          className="react-select info"
                          classNamePrefix="react-select"
                          name="singleSelect2"
                          value={singleSelect2}
                          onChange={(value) => setsingleSelect2(value)}
                          options={[
                            {
                              value: "",
                              label: false,
                              icon: "",
                              isDisabled: true
                            },
                            { value: "2", label: <span><img src={coinSparta} alt="empty" /> SPARTA</span> },
                            { value: "1", label: <span><img src={coinBnb} alt="empty" /> BNB</span> }

                          ]}
                          placeholder="Select token"
                        /></div>
                      </Col>
                      <Col className="text-right">
                        <br />
                        <br />
                        <div className="title-card mt-2">0.00</div>
                        <br />
                      </Col>
                    </Row>
                  </Card>

                </Col>

              </Row>
              <Row>
                <Col>
                  <div className="text-card">
                    Ouput{" "}
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
                    Slip{" "}
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
                  <div className="amount">
                    Input{" "}
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
                </Col>
                <Col className="text-right">

                  <div className="output-card">
                    0,0000 BNB
                  </div>
                  <br />
                  <div className="output-card">
                    0,000 %
                  </div>
                  <br />
                  <div className="subtitle-amount">
                    0.00 BNB
                  </div>
                </Col>
              </Row>
              <Button color="primary" size="lg" block>
                Swap
              </Button>

            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Swap


