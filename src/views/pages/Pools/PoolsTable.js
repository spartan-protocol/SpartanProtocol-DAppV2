import React, { useEffect } from 'react'
import { Button, Card, Row, Col, Collapse, Table } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import bnb from '../../../assets/icons/BNB.svg'
import { usePoolFactory } from '../../../store/poolFactory'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getAddresses } from '../../../utils/web3'

const Poolstable = () => {
  const poolFactory = usePoolFactory()
  const addr = getAddresses()

  const [, sethorizontalTabs] = React.useState('harvest')
  // eslint-disable-next-line no-unused-vars
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  const [modalNotice, setModalNotice] = React.useState(false)
  // eslint-disable-next-line no-unused-vars
  const toggleModalNotice = () => {
    setModalNotice(!modalNotice)
  }

  const [openedCollapseThree, setopenedCollapseThree] = React.useState([])

  useEffect(() => {
    const collapseThree = []
    if (poolFactory && poolFactory.poolDetails) {
      poolFactory.poolDetails.forEach(() => {
        collapseThree.push(false)
      })
    }
  }, [poolFactory])

  const getToken = (tokenAddress) =>
    poolFactory.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  return (
    <>
      {!poolFactory.poolDetails && <HelmetLoading height={300} width={300} />}
      {poolFactory?.poolDetails && (
        <Col md={12}>
          {poolFactory?.poolDetails
            .filter((asset) => asset.tokenAddress !== addr.sparta)
            .sort((a, b) => b.baseAmount - a.baseAmount)
            .map((asset, index) => (
              <Card
                key={asset.address}
                className="card-body"
                style={{ backgroundColor: '#1D171F' }}
              >
                <div
                  aria-multiselectable
                  className="card-collapse"
                  id="accordion"
                  role="tablist"
                >
                  {/* Desktop */}
                  <Card className="d-none d-sm-block ">
                    <Row>
                      <Col md={1} className="ml-n2">
                        <h2>
                          <img className="mr-2" src={bnb} alt="Logo" />
                        </h2>
                      </Col>
                      <Col md={1} className="ml-n5 mr-n4">
                        <h4>
                          {getToken(asset.tokenAddress)?.symbol}
                          <div className="output-card-description">$477,78</div>
                        </h4>
                      </Col>
                      <Col md={1} className="mr-n3">
                        <div className="output-card-description">
                          APY
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">188.25%</div>
                      </Col>
                      <Col md={2} className="ml-n2 mr-n4">
                        <div className="output-card-description">
                          Volume 24u
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">275.248.709</div>
                      </Col>
                      <Col md={2} className="ml-n5 mr-n3">
                        <div className="output-card-description">
                          Total Depth
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">$22.584.633</div>
                      </Col>
                      <Col md={2} className="ml-n5 mr-n4">
                        <div className="output-card-description">
                          Depth SPARTA
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">51%</div>
                      </Col>
                      <Col md={2} className="ml-n5 mr-n5">
                        <div className="output-card-description">
                          Txns
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">148.655</div>
                      </Col>
                      <Col md={2} className="ml-n5 mr-n5">
                        <div className="output-card-description">
                          Fee Revenue
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">$1.256.254</div>
                      </Col>
                      <Col md={2} className="ml-n4 mr-n1">
                        <div className="output-card-description">
                          Dividends
                          <i
                            className="icon-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="subtitle-card">$1.256.254</div>
                      </Col>
                      <Col className="ml-n5 mt-2">
                        <Button
                          type="Button"
                          className="btn-sm btn-primary mb-2 ml-n4"
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
                    </Row>
                  </Card>

                  {/* Mobile */}
                  <Card className="d-block d-sm-none">
                    <Row>
                      <Col xs={4} className="ml-n2">
                        <h2>
                          <img className="mr-2" src={bnb} alt="Logo" />
                        </h2>
                      </Col>
                      <Col xs={4} className="ml-n4">
                        <h4>
                          {getToken(asset.tokenAddress)?.symbol}
                          <div className="output-card-description">$477,78</div>
                        </h4>
                      </Col>
                      <Col xs={4} className="ml-n3">
                        <div className="output-card-description">
                          APY
                          <i
                            className="icon-extra-small icon-info icon-dark ml-1 mb-n1"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            <div className="output-card-description">TEXT</div>
                          </UncontrolledTooltip>
                        </div>
                        <div className="output-card">89%</div>
                      </Col>

                      <Col xs={1} className="mr-3 ml-auto">
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
                            className="icon-extra-small icon-arrow icon-light ml-1"
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
                        <Col>
                          {' '}
                          <Table borderless>
                            <tbody>
                              <tr>
                                <td className="output-card ">Volume 24h</td>
                                <th className="output-card text-right">
                                  218.988 SPARTA
                                </th>
                              </tr>
                              <tr>
                                <td className="output-card">Total depth</td>
                                <th className="output-card text-right">
                                  1.000.000 BNB{' '}
                                </th>
                              </tr>
                              <tr>
                                <td className="output-card">
                                  Depth
                                  <i
                                    className="icon-extra-small icon-info icon-dark ml-1 mb-n1"
                                    id="tooltipAddBase"
                                    role="button"
                                  />
                                  <UncontrolledTooltip
                                    placement="right"
                                    target="tooltipAddBase"
                                  >
                                    <div className="title-c">TEXT</div>
                                  </UncontrolledTooltip>
                                </td>
                                <th className="output-card text-right">52%</th>
                              </tr>
                              <tr>
                                <td className="output-card">
                                  Txns
                                  <i
                                    className="icon-extra-small icon-info icon-dark ml-1 mb-n1"
                                    id="tooltipAddBase"
                                    role="button"
                                  />
                                  <UncontrolledTooltip
                                    placement="right"
                                    target="tooltipAddBase"
                                  >
                                    <div className="output-card-description">
                                      TEXT
                                    </div>
                                  </UncontrolledTooltip>
                                </td>
                                <th className="output-card text-right">
                                  148.655
                                </th>
                              </tr>
                              <tr>
                                <td className="output-card">
                                  Fee
                                  <i
                                    className="icon-extra-small icon-info icon-dark ml-1 mb-n1"
                                    id="tooltipAddBase"
                                    role="button"
                                  />
                                  <UncontrolledTooltip
                                    placement="right"
                                    target="tooltipAddBase"
                                  >
                                    <div className="title-c">TEXT</div>
                                  </UncontrolledTooltip>
                                </td>
                                <th className="output-card text-right">
                                  2.52 SPARTA
                                </th>
                              </tr>
                              <tr>
                                <td className="output-card">
                                  Dividend
                                  <i
                                    className="icon-extra-small icon-info icon-dark mb-n1 ml-1"
                                    id="tooltipAddBase"
                                    role="button"
                                  />
                                  <UncontrolledTooltip
                                    placement="right"
                                    target="tooltipAddBase"
                                  >
                                    <div className="output-card">TEXT</div>
                                  </UncontrolledTooltip>
                                </td>

                                <th className="output-card text-right">
                                  2.52 SPARTA
                                </th>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Collapse>
                    <Row>
                      <Col>
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
                    </Row>
                  </Card>
                </div>
              </Card>
            ))}
        </Col>
      )}
    </>
  )
}

export default Poolstable
