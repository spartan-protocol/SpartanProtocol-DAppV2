/*eslint-disable*/
import React from 'react'
// react plugin for creating notifications over the dashboard

// reactstrap components
import { Button, Card, CardBody, Row, Col, Collapse } from 'reactstrap'
import bnbSparta from '../../../assets/icons/bnb_sparta.png'

const BondTable = () => {
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)
  return (
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
                  <Col md={5}>
                    <h2>
                      <img
                        className="mr-2"
                        src={bnbSparta}
                        alt="Logo"
                        height="32"
                      />
                      BNB-SPARTA LP
                    </h2>
                  </Col>
                  <Col>
                    <div className="title-card">LP Tokens locked</div>
                  </Col>
                  <Col>
                    <div className="title-card">Claim LP tokens</div>
                  </Col>
                  <Col md="0" className="ml-auto mr-2">
                    <Button type="Button" className="btn btn-danger">
                      Bond BNB
                    </Button>
                    <Button type="Button" className="btn btn-primary">
                      Claim
                    </Button>
                  </Col>
                  <Col md="1" className="ml-auto text-right">
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
                        style={{ color: '#FFF' }}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="offset-md-5">
                    <div className="output-card mt-n4">15.00</div>
                  </Col>
                  <Col>
                    <div className="subtitle-amount mt-n4">
                      1.26
                      <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                    </div>
                  </Col>
                  <Col />
                  <Col />
                </Row>
              </CardBody>

              <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                <CardBody>
                  <Row>
                    <Col className="offset-md-5">
                      <div className="text-card">Remaining BNB-SPARTA LP</div>
                    </Col>
                    <Col>
                      <div className="output-card">0.00</div>
                    </Col>
                    <Col>
                      <div className="text-card">Redemption date</div>
                    </Col>
                    <Col>
                      <div className="output-card">2021-03-19 13:00:00</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="offset-md-5">
                      <div className="text-card">Duration</div>
                    </Col>
                    <Col>
                      <div className="output-card">0 days</div>
                    </Col>
                    <Col>
                      <div className="text-card">Intereset</div>
                    </Col>
                    <Col>
                      <div className="output-card">15.000,00 SPARTA</div>
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </div>
        </Card>
      </Row>
    </>
  )
}

export default BondTable
