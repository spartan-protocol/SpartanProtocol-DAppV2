import React from 'react'
import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import bnbSparta from '../../../assets/icons/bnb_sparta.png'

const BondTable = () => (
  <>
    <Row>
      <Card className="card-body" style={{ backgroundColor: '#1D171F' }}>
        <div
          aria-multiselectable
          className="card-collapse"
          id="accordion"
          role="tablist"
        >
          <Card className="mt-n2 mb-n2">
            <CardBody>
              <Row>
                <Col xs="9" className="mb-2">
                  <h2 className="m-0">
                    <img
                      className="mr-2"
                      src={bnbSparta}
                      alt="Logo"
                      height="32"
                    />
                    BNB-SPP
                  </h2>
                </Col>
                <Col xs="3" className="text-center d-none d-sm-block mb-2">
                  <Button type="Button" className="btn btn-primary">
                    Claim
                  </Button>
                </Col>
                <Col xs="6" md="3">
                  <div className="title-card">Remaining</div>
                  <div className="d-none d-md-block">###.##</div>
                </Col>
                <Col xs="6" className="d-md-none">
                  <div className="text-right">###.##</div>
                </Col>
                <Col xs="6" md="3">
                  <div className="title-card">Claimable</div>
                  <div className="d-none d-md-block">###.##</div>
                </Col>
                <Col xs="6" className="d-md-none">
                  <div className="text-right">
                    ###.##
                    <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                  </div>
                </Col>
                <Col xs="6" md="3">
                  <div className="title-card">Last Claimed:</div>
                  <div className="d-none d-md-block">###.##</div>
                </Col>
                <Col xs="6" className="d-md-none">
                  <div className="text-right">###.##</div>
                </Col>
                <Col xs="6" md="3">
                  <div className="title-card">Final Date:</div>
                  <div className="d-none d-md-block">###.##</div>
                </Col>
                <Col xs="6" className="d-md-none">
                  <div className="text-right">
                    {/* Remaining LP / ClaimRate = Seconds */}
                    {/* Add that to unix time for end-date */}
                    ###.##
                  </div>
                </Col>
                <Col xs="12" className="d-sm-none text-center">
                  <Button type="Button" className="btn btn-primary">
                    Claim
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </Card>
    </Row>
  </>
)

export default BondTable
