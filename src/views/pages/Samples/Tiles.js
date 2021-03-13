
import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CardBody, CardHeader, Collapse } from 'reactstrap'

import Button from 'react-bootstrap/Button'

import bnb from '../../../assets/icons/BNB.svg'
import coin_bnb from '../../../assets/icons/coin_bnb.svg'
import coin_sparta from '../../../assets/icons/coin_sparta.svg'
import bnb_sparta from '../../../assets/icons/bnb_sparta.png'

const Tiles = () => {
  //   const [openedCollapseOne, setopenedCollapseOne] = React.useState(true)
  //   const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false)
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)
  return (
    <>
      <div className="content">
        <Card className="card-body">
          <Col md={12}>
            <Row>
              <Col md="2">
                <h2>
                  <img className="mr-2" src={bnb} alt="Logo" />
                  BNB
                </h2>
              </Col>
              <Col md="2">
                <h7>APY</h7>
                <br />
                <h9>
                  <i className="icon-small icon-spinner icon-light float-left" />
                  188.25%
                </h9>
              </Col>
              <Col md="2">
                <h7 className="modal-title">Depth</h7>
                <br />
                <h9>$2.113.877</h9>
              </Col>
              <Col md="2">
                <h7>Volume</h7>
                <br />
                <h9>$13.386.399</h9>
              </Col>
              <Col sm="0">
                <Button type="Button" className="btn btn-success mr-5">
                  <i className="bi-lg bi bi-lock-fill mb-2" /> Bond
                </Button>
                <Button type="Button" className="btn btn-primary">
                  Exchange
                </Button>
              </Col>
            </Row>
          </Col>
          <Card className="card-body" style={{ backgroundColor: '#25212D' }}>
            <div
              aria-multiselectable
              className="card-collapse"
              id="accordion"
              role="tablist"
            >
              <Card>
                <CardHeader role="tab">
                  <a
                    aria-expanded={openedCollapseThree}
                    href="#"
                    data-parent="#accordion"
                    data-toggle="collapse"
                    onClick={(e) => {
                      e.preventDefault()
                      setopenedCollapseThree(!openedCollapseThree)
                    }}
                  >
                    <Row>
                      <Col md="9">
                        <h3>
                          <img
                            className="mr-2"
                            src={bnb_sparta}
                            alt="Logo"
                            height="32"
                          />
                          BNB-SPARTA
                          <accentstatus>ACTIVE</accentstatus>
                        </h3>
                      </Col>
                      <Col className="ml-auto" md="2">
                        <i className="bd-icons icon-minimal-down mt-n8" />
                        <h3>
                          $1204.00 <accentcurrency>USD</accentcurrency>
                        </h3>
                      </Col>
                    </Row>
                  </a>
                </CardHeader>
                <Card className="card-body">
                  <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                    <CardBody>
                      <Row>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Total LP Tokens
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted mr-2">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>210.45</titlecard>
                          <titlecard>5.76</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Add & Remove
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>+26.78</titlecard>
                          <titlecard>-0.23</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Gains
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>237.23</titlecard>
                          <titlecard>5.53</titlecard>
                        </Col>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
              </Card>
            </div>
          </Card>
        </Card>
        <Card className="card-body">
          <Col md={12}>
            <Row>
              <Col md="2">
                <h2>
                  <img className="mr-2" src={bnb} alt="Logo" />
                  BNB
                </h2>
              </Col>
              <Col md="2">
                <h7>APY</h7>
                <br />
                <h9>
                  <i className="icon-small icon-spinner icon-light float-left" />
                  188.25%
                </h9>
              </Col>
              <Col md="2">
                <h7 className="modal-title">Depth</h7>
                <br />
                <h9>$2.113.877</h9>
              </Col>
              <Col md="2">
                <h7>Volume</h7>
                <br />
                <h9>$13.386.399</h9>
              </Col>
              <Col sm="0">
                <Button type="Button" className="btn btn-success mr-5">
                  <i className="bi-lg bi bi-lock-fill mb-2" /> Bond
                </Button>
                <Button type="Button" className="btn btn-primary">
                  Exchange
                </Button>
              </Col>
            </Row>
          </Col>
          <Card className="card-body" style={{ backgroundColor: '#25212D' }}>
            <div
              aria-multiselectable
              className="card-collapse"
              id="accordion"
              role="tablist"
            >
              <Card>
                <CardHeader role="tab">
                  <a
                    aria-expanded={openedCollapseThree}
                    href="#"
                    data-parent="#accordion"
                    data-toggle="collapse"
                    onClick={(e) => {
                      e.preventDefault()
                      setopenedCollapseThree(!openedCollapseThree)
                    }}
                  >
                    <Row>
                      <Col md="9">
                        <h3>
                          <img
                            className="mr-2"
                            src={bnb_sparta}
                            alt="Logo"
                            height="32"
                          />
                          BNB-SPARTA
                          <accentstatus>ACTIVE</accentstatus>
                        </h3>
                      </Col>
                      <Col className="ml-auto" md="2">
                        <i className="bd-icons icon-minimal-down mt-n8" />
                        <h3>
                          $1204.00 <accentcurrency>USD</accentcurrency>
                        </h3>
                      </Col>
                    </Row>
                  </a>
                </CardHeader>
                <Card className="card-body">
                  <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                    <CardBody>
                      <Row>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Total LP Tokens
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted mr-2">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>210.45</titlecard>
                          <titlecard>5.76</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Add & Remove
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>+26.78</titlecard>
                          <titlecard>-0.23</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Gains
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>237.23</titlecard>
                          <titlecard>5.53</titlecard>
                        </Col>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
              </Card>
            </div>
          </Card>
        </Card>
        <Card className="card-body">
          <Col md={12}>
            <Row>
              <Col md="2">
                <h2>
                  <img className="mr-2" src={bnb} alt="Logo" />
                  BNB
                </h2>
              </Col>
              <Col md="2">
                <h7>APY</h7>
                <br />
                <h9>
                  <i className="icon-small icon-spinner icon-light float-left" />
                  188.25%
                </h9>
              </Col>
              <Col md="2">
                <h7 className="modal-title">Depth</h7>
                <br />
                <h9>$2.113.877</h9>
              </Col>
              <Col md="2">
                <h7>Volume</h7>
                <br />
                <h9>$13.386.399</h9>
              </Col>
              <Col sm="0">
                <Button type="Button" className="btn btn-success mr-5">
                  <i className="bi-lg bi bi-lock-fill mb-2" /> Bond
                </Button>
                <Button type="Button" className="btn btn-primary">
                  Exchange
                </Button>
              </Col>
            </Row>
          </Col>
          <Card className="card-body" style={{ backgroundColor: '#25212D' }}>
            <div
              aria-multiselectable
              className="card-collapse"
              id="accordion"
              role="tablist"
            >
              <Card>
                <CardHeader role="tab">
                  <a
                    aria-expanded={openedCollapseThree}
                    href="#"
                    data-parent="#accordion"
                    data-toggle="collapse"
                    onClick={(e) => {
                      e.preventDefault()
                      setopenedCollapseThree(!openedCollapseThree)
                    }}
                  >
                    <Row>
                      <Col md="9">
                        <h3>
                          <img
                            className="mr-2"
                            src={bnb_sparta}
                            alt="Logo"
                            height="32"
                          />
                          BNB-SPARTA
                          <accentstatus>ACTIVE</accentstatus>
                        </h3>
                      </Col>
                      <Col className="ml-auto" md="2">
                        <i className="bd-icons icon-minimal-down mt-n8" />
                        <h3>
                          $1204.00 <accentcurrency>USD</accentcurrency>
                        </h3>
                      </Col>
                    </Row>
                  </a>
                </CardHeader>
                <Card className="card-body">
                  <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                    <CardBody>
                      <Row>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Total LP Tokens
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted mr-2">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>210.45</titlecard>
                          <titlecard>5.76</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Add & Remove
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>+26.78</titlecard>
                          <titlecard>-0.23</titlecard>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            Gains
                            <i className="icon-small icon-info icon-dark ml-2" />
                          </titlecard>
                          <h6 className="text-muted">
                            <img
                              className="mr-2"
                              src={coin_sparta}
                              alt="Logo"
                            />
                            SPARTA
                          </h6>
                          <h6 className="text-muted">
                            <img className="mr-2" src={coin_bnb} alt="Logo" />
                            BNB
                          </h6>
                        </Col>
                        <Col md="2">
                          <titlecard className="mb-4">
                            <br />
                          </titlecard>
                          <titlecard>237.23</titlecard>
                          <titlecard>5.53</titlecard>
                        </Col>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
              </Card>
            </div>
          </Card>
        </Card>
      </div>
    </>
  )
}

export default Tiles
