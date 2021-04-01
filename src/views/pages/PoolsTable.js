import React from 'react'
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  Row,
  Col,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Collapse,
} from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import bnbSparta from '../../assets/icons/bnb_sparta.png'
import bnb from '../../assets/icons/BNB.svg'
import { usePoolFactory } from '../../store/poolFactory'
import HelmetLoading from '../../components/Loaders/HelmetLoading'

const Poolstable = () => {
  // eslint-disable-next-line no-unused-vars
  const poolFactory = usePoolFactory()

  const [horizontalTabs, sethorizontalTabs] = React.useState('harvest')
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
      {!poolFactory.finalLpArray && <HelmetLoading height={300} width={300} />}
      {poolFactory?.finalLpArray && (
        <Col md={12}>
          {poolFactory?.finalLpArray.map((asset) => (
            <Card
              key={asset.tokenAddress}
              className="card-body"
              style={{ backgroundColor: '#1D171F' }}
            >
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
                        {asset.symbol}
                      </h2>
                    </Col>
                    <Col md="2">
                      <div className="title-card">APY</div>
                      <div className="subtitle-card">XXX.XX%</div>
                    </Col>
                    <Col md="2">
                      <div className="title-card">Liquidity</div>
                      <div className="subtitle-card">$X,XXX.XX</div>
                    </Col>
                    <Col md="2">
                      <div className="title-card">Volume (24hrs)</div>
                      <div className="subtitle-card">XXX,XXX.XX SPARTA</div>
                    </Col>
                    <Col md="2">
                      <div className="title-card">Locked LP</div>
                      <div className="subtitle-amount">0.00</div>
                    </Col>
                    <Col md="2" className="m-auto">
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
                          style={{ color: '#FFF' }}
                        />
                      </div>
                    </Col>
                  </Row>

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
          ))}
        </Col>
      )}

      {/* Harvest modal> */}

      <Modal isOpen={modalNotice} toggle={toggleModalNotice}>
        <div className="modal-header">
          <button
            aria-hidden
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModalNotice}
          />
        </div>
        <ModalBody className="text-center">
          <div className="instruction">
            <h3 className="text-center header-title">Manage LP</h3>

            <Row>
              <Col md={6} className="justify-content-center">
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <NavItem style={{ listStyleType: 'none' }}>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === 'harvest' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'harvest')
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
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <NavItem style={{ listStyleType: 'none' }}>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === 'remove' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'remove')
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
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body"
                    >
                      <Col>
                        <div className="title-card">Harvest</div>
                        <div className="output-card">12.2568 SPARTA</div>
                      </Col>
                    </Card>
                    <Row>
                      <Col>
                        <div className="text-card">
                          DAO weight{' '}
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
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body"
                    >
                      <Row>
                        <Col>
                          <div className="title-card text-left">Remove LP</div>
                          <div className="output-card text-left">678.23</div>
                        </Col>
                        <Col>
                          <div className="title-card text-right">
                            Locked LP 678.23
                          </div>
                          <div className="output-card text-right">
                            WBNB-SPARTA LP{' '}
                            <img
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
                      {/* <div className="slider" ref={slider1Ref} /> */}

                      {/* <div className="slider slider-primary mb-ImageUpload.3" ref={slider2Ref} /> */}
                    </Row>
                    <br />
                    <Row>
                      <Col>
                        <div className="text-card">
                          DAO Redeem LP Tokens{' '}
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
                          Receive{' '}
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
                          Staked LP Tokens{' '}
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
                          Staked LP Tokens{' '}
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
                        <div className="output-card text-right">
                          52.23 of 52.23
                        </div>
                        <br />
                        <div className="output-card text-right">1.02 BNB</div>
                        <div className="output-card text-right">
                          100.52 SPARTA
                        </div>
                        <br />

                        <div className="output-card text-right">52.23</div>
                        <br />
                        <div className="subtitle-amount text-right">
                          1.02 BNB
                        </div>
                        <div className="subtitle-amount text-right">
                          100.52 SPARTA
                        </div>
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
