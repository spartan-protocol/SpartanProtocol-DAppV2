/* eslint-disable */
import React from 'react'
// react plugin for creating notifications over the dashboard

// reactstrap components
import { Button, Card, CardBody, Row, Col, Collapse } from 'reactstrap'
import bnbSparta from '../../assets/icons/bnb_sparta.png'
import bnb from '../../assets/icons/BNB.svg'

const BondTable = () => {
  // const [horizontalTabs, sethorizontalTabs] = React.useState('harvest')
  // const changeActiveTab = (e, tabState, tabName) => {
  //   e.preventDefault()
  //   sethorizontalTabs(tabName)
  // }

  // const [modalNotice, setModalNotice] = React.useState(false)
  // const toggleModalNotice = () => {
  //   setModalNotice(!modalNotice)
  // }

  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)

  return (
    <>
        <Card className="card-body" style={{ backgroundColor: '#1D171F' }}>
          <div
            aria-multiselectable
            className="card-collapse"
            id="accordion"
            role="tablist"
          >
            <Card>
              <Row>
                <Col md="2">
                  <h2>
                    <img className="mr-2" src={bnb} alt="Logo" />
                    BNB
                  </h2>
                </Col>
                <Col className="mr-4">
                  <div className="title-card">LP Tokens locked</div>
                  <div className="subtitle-card">15.00</div>
                </Col>
                <Col className="mr-">
                  <div className="title-card">Claim LP tokens</div>
                  <div className="subtitle-card">1.26</div>
                </Col>
                <Col md="0" className="ml-auto mr-2">
                  <Button type="Button" className="btn btn-danger">
                    Bond BNB
                  </Button>
                  <Button type="Button" className="btn btn-primary">
                    Claim
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
                      style={{ color: '#FFF' }}
                    />
                  </div>
                </Col>
              </Row>

              <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                <CardBody>
                  <Row>
                    <Col md="5">
                      <h3>
                        <img
                          className="mr-2"
                          src={bnbSparta}
                          alt="Logo"
                          height="32"
                        />
                        BNB-SPARTA LP
                      </h3>
                    </Col>
                    <Col md="2">
                      <div className="text-card">Remaining BNB-SPARTA LP</div>
                      <div className="text-card">Duration</div>
                    </Col>
                    <Col md="1">
                      <div className="output-card">0.00</div>
                      <div className="output-card">0 days</div>
                    </Col>

                    <Col md="2">
                      <div className="text-card">Redemption date</div>
                      <div className="text-card">Intereset</div>
                    </Col>
                    <Col md="2">
                      <div className="output-card">2021-03-19 13:00:00</div>
                      <div className="output-card">15.000,00 SPARTA</div>
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </div>
        </Card>
    </>
  )
}

export default BondTable
