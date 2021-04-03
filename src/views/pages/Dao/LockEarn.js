/* eslint-disable */
import React from "react"
// react plugin for creating notifications over the dashboard

// reactstrap components
import { Button, Card, CardBody, Row, Col, Collapse } from "reactstrap"
import bnbSparta from "../../../assets/icons/bnb_sparta.png"
import bnb from "../../../assets/icons/BNB.svg"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"

const LockEarn = () => {
  return (
    <>
      <Card className="card-body" style={{ backgroundColor: "#1D171F" }}>
        <CardBody>
          <Row>
            <Col md={3} xs={12} className="mb-n4">
              <h2 className="mt-3">
                <img
                  className="mr-2"
                  src={bnbSparta}
                  alt="Logo"
                  height="32"
                />
                BNB-SPARTA LP
              </h2></Col>
            <Col md={2}>
            </Col>
            <Col md={2}>
              <div className="card-text">Locked</div>
            </Col>
            <Col md={2}>
              <div className="card-text">Unlocked</div>
            </Col>
            <Col md={2} className="ml-auto mr-2 mt-2">
              <Button type="Button" className="btn btn-primary">
                Unlock
              </Button></Col>
          </Row>
          <Row>
            <Col md={3}>
            </Col>
            <Col md={2}>
            </Col>
            <Col md={2}>
              <div className="title-card mt-n4">250,87</div>
            </Col>
            <Col md={2}>
              <div className="title-card mt-n4">0.00</div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <br/>
      <Card className="card-body" style={{ backgroundColor: "#1D171F" }}>
        <CardBody>
          <Row>
            <Col md={3} xs={12} className="mb-n4">
              <h2 className="mt-3">
                <img
                  className="mr-2"
                  src={bnbSparta}
                  alt="Logo"
                  height="32"
                />
                BNB-SPARTA LP
              </h2></Col>
            <Col md={2}>
            </Col>
            <Col md={2}>
              <div className="card-text">Locked</div>
            </Col>
            <Col md={2}>
              <div className="card-text">Unlocked</div>
            </Col>
            <Col md={2} className="ml-auto mr-2 mt-2">
              <Button type="Button" className="btn btn-primary">
                Unlock
              </Button></Col>
          </Row>
          <Row>
            <Col md={3}>
            </Col>
            <Col md={2}>
            </Col>
            <Col md={2}>
              <div className="title-card mt-n4">250,87</div>
            </Col>
            <Col md={2}>
              <div className="title-card mt-n4">0.00</div>
            </Col>
          </Row>
        </CardBody>
      </Card>

    </>
  )
}

export default LockEarn
