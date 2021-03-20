import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CardBody, CardHeader, Collapse } from 'reactstrap'

import Button from 'react-bootstrap/Button'

import bnb from '../../assets/icons/BNB.svg'
import bnbSparta from '../../assets/icons/bnb_sparta.png'

const PoolsTable = () => {
  //   const [openedCollapseOne, setopenedCollapseOne] = React.useState(true)
  //   const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false)
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
            <CardHeader role="tab">
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
                <Row>
                  <Col md="2">
                    <h2>
                      <img className="mr-2" src={bnb} alt="Logo" />
                      BNB
                    </h2>
                  </Col>
                  <Col md="0" className="mr-4">
                    <div className="title-card">APY</div>
                    <div className="subtitle-card">188.25%</div>
                  </Col>
                  <Col md="0" className="mr-">
                    <div className="title-card">Liquidity</div>
                    <div className="subtitle-card">$22.584.633</div>
                  </Col>
                  <Col md="3" className="mr-3">
                    <div className="title-card">Volume (24hrs)</div>
                    <div className="subtitle-card">218.988,784 SPARTA</div>
                  </Col>
                  <Col md="0" className="mr-5">
                    <div className="title-card">Locked LP</div>
                    <div className="subtitle-amount">0.00</div>
                  </Col>
                  <Col md="0" className="mr-2">
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
                    <i
                      className="bd-icons icon-minimal-down mt-n8"
                      style={{ color: '#FFF' }}
                    />
                  </Col>
                </Row>
              </div>
            </CardHeader>
            <Card style={{ backgroundColor: '#25212D' }}>
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
                      <div className="title-card">Available LP</div>
                      <div className="subtitle-card">0.00</div>
                    </Col>
                    <Col md="4">
                      <Button type="Button" className="btn btn-success">
                        Lock
                      </Button>
                      <Button type="Button" className="btn btn-success">
                        Unlock
                      </Button>
                      <Button type="Button" className="btn btn-success">
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
    </>
  )
}

export default PoolsTable
