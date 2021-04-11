import React, { useEffect } from 'react'
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
import bnbSparta from '../../../assets/icons/bnb_sparta.png'
import bnb from '../../../assets/icons/BNB.svg'
import { usePoolFactory } from '../../../store/poolFactory'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { calcAPY } from '../../../utils/web3Utils'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { useWeb3 } from '../../../store/web3'

const Poolstable = () => {
  const poolFactory = usePoolFactory()
  const web3 = useWeb3()

  const [horizontalTabs, sethorizontalTabs] = React.useState('harvest')
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  const [modalNotice, setModalNotice] = React.useState(false)
  const toggleModalNotice = () => {
    setModalNotice(!modalNotice)
  }

  const [openedCollapseThree, setopenedCollapseThree] = React.useState([])

  useEffect(() => {
    const collapseThree = []
    if (poolFactory && poolFactory.finalLpArray) {
      poolFactory.finalLpArray.forEach(() => {
        collapseThree.push(false)
      })
    }
  }, [poolFactory])

  return (
    <>
      {!poolFactory.finalLpArray && <HelmetLoading height={300} width={300} />}
      {poolFactory?.finalLpArray && (
        <Col md={12}>
          {poolFactory?.finalLpArray
            .filter((asset) => asset.symbol !== 'SPARTA')
            .sort((a, b) => b.baseAmount - a.baseAmount)
            .map((asset, index) => (
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
                    {/* MOBILE */}
                    <Row className="d-md-none d-lg-none">
                      <Col>
                        <h2>
                          <img className="mr-2" src={bnb} alt="Logo" />
                          {asset.symbol}
                        </h2>
                      </Col>
                      <Col className="text-right mr-2">
                        {' '}
                        <div
                          aria-expanded={openedCollapseThree[index]}
                          role="button"
                          tabIndex={-1}
                          data-parent="#accordion"
                          data-toggle="collapse"
                          onClick={(e) => {
                            e.preventDefault()
                            setopenedCollapseThree(!openedCollapseThree[index])
                          }}
                          onKeyPress={(e) => {
                            e.preventDefault()
                            setopenedCollapseThree(!openedCollapseThree[index])
                          }}
                        >
                          <i
                            className="bd-icons icon-minimal-down mt-3"
                            style={{ color: '#FFF' }}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* MOBILE */}
                    <Row>
                      <Col md="2" sm="0" className="d-none d-sm-block mt-1">
                        <h2>
                          <img className="mr-2" src={bnb} alt="Logo" />
                          {asset.symbol}
                        </h2>
                      </Col>
                      <Col className="d-md-none" md="1" sm="6" />
                      <Col md="1" sm="10">
                        <div className="title-card ">APY</div>
                        <div className="subtitle-card">
                          {formatFromUnits(
                            calcAPY(
                              asset.recentDivis,
                              asset.recentFees,
                              asset.baseAmount,
                            ),
                          )}
                          %
                        </div>
                      </Col>
                      <Col md="1">
                        <div className="title-card">Depth</div>
                        <div className="subtitle-card">
                          $
                          {formatFromWei(
                            BN(asset.baseAmount).times(web3?.spartaPrice),
                            2,
                          )}
                        </div>
                      </Col>
                      <Col md="2">
                        <div className="title-card">Volume (24hrs)</div>
                        <div className="subtitle-card">XXX,XXX.XX SPARTA</div>
                      </Col>
                      <Col md="1">
                        <div className="title-card">Locked LP</div>
                        <div className="subtitle-amount">0.00</div>
                      </Col>

                      <Col md="3" className="m-auto d-none d-sm-block">
                        <Button type="Button" className="btn btn-primary mb-2">
                          Bond
                        </Button>
                        <Button type="Button" className="btn btn-primary mb-2">
                          Swap
                        </Button>
                        <Button type="Button" className="btn btn-primary mb-2">
                          Join
                        </Button>
                      </Col>

                      <Col className="d-block d-sm-none">
                        <br />
                        <Button
                          type="Button"
                          className="btn-sm btn-primary mb-2"
                        >
                          Bond
                        </Button>
                        <Button
                          type="Button"
                          className="btn-sm btn-primary mb-2"
                        >
                          Swap
                        </Button>
                        <Button
                          type="Button"
                          className="btn-sm btn-primary mb-2"
                        >
                          Join
                        </Button>
                      </Col>

                      <Col className="ml-auto mt-2 d-none d-sm-block" md="1">
                        {/* ADD ARROW ICON */}
                        <div
                          aria-expanded={openedCollapseThree[index]}
                          role="button"
                          tabIndex={-1}
                          data-parent="#accordion"
                          data-toggle="collapse"
                          onClick={(e) => {
                            e.preventDefault()
                            const collapseThree = [...openedCollapseThree]
                            collapseThree[index] = !collapseThree[index]
                            setopenedCollapseThree(collapseThree)
                          }}
                          onKeyPress={(e) => {
                            e.preventDefault()
                            setopenedCollapseThree(!openedCollapseThree[index])
                          }}
                        >
                          <i
                            className="bd-icons icon-minimal-down mt-3"
                            style={{ color: '#FFF' }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Collapse
                      role="tabpanel"
                      isOpen={openedCollapseThree[index]}
                    >
                      <Row>
                        <Col md="6">
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
                        <Col md="6">
                          <Card style={{ backgroundColor: '#25212D' }}>
                            <CardBody>
                              <Row>
                                <Col md="4">
                                  <div className="title-card ml-n1">
                                    Available LP
                                  </div>
                                  <div className="subtitle-card">0.00</div>
                                </Col>

                                {/* Mobile */}
                                <Col className="ml-n1 d-block d-sm-none">
                                  <Button
                                    type="Button"
                                    className="btn-sm btn-success"
                                  >
                                    Lock
                                  </Button>
                                  <Button
                                    type="Button"
                                    className="btn-sm btn-success"
                                  >
                                    Unlock
                                  </Button>
                                  <Button
                                    className="btn-sm btn-success"
                                    color="success"
                                    onClick={toggleModalNotice}
                                  >
                                    LP
                                  </Button>
                                </Col>

                                <Col md="8" className="ml-n1 d-none d-sm-block">
                                  <Button
                                    type="Button"
                                    className="btn btn-success"
                                  >
                                    Lock
                                  </Button>
                                  <Button
                                    type="Button"
                                    className="btn btn-success"
                                  >
                                    Unlock
                                  </Button>
                                  <Button
                                    color="success"
                                    onClick={toggleModalNotice}
                                  >
                                    Manage LP
                                  </Button>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Collapse>
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
