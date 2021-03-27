import React, { useEffect, useState } from 'react'

import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Button,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  UncontrolledAlert,
  FormGroup,
  Input,
  Nav,
} from 'reactstrap'

// import { withNamespaces } from 'react-i18next'
// import InputGroup from 'reactstrap/es/InputGroup'
// import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
// import Slider from 'nouislider'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
// import { Breadcrumb } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import coinBnb from '../../../assets/icons/coin_bnb.svg'
import coinSparta from '../../../assets/icons/coin_sparta.svg'
import bnbSparta from '../../../assets/icons/bnb_sparta.png'
import PoolsPaneSide from './PoolsPaneSide'
import Wallet from '../../../components/Wallet/Wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePoolFactory } from '../../../store/poolFactory'
import {
  BN,
  formatFromWei,
  formatFromUnits,
  convertToWei,
} from '../../../utils/bigNumber'
import {
  calcLiquidityUnits,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import { useWeb3 } from '../../../store/web3'
import { routerAddLiq } from '../../../store/router/actions'
// import bnb_sparta from '../../../assets/icons/bnb_sparta.png'
// import { manageBodyClass } from '../../../components/Common/common'

const Liquidity = () => {
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const web3 = useWeb3()
  const [asset1, setAsset1] = useState('...')
  const [asset2, setAsset2] = useState('...')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAsset1Details = () => {
      if (finalArray) {
        let asset1LS = JSON.parse(window.localStorage.getItem('assetSelected1'))
        asset1LS = asset1LS ? asset1LS[1] : addr.wbnb
        setAsset1(getItemFromArray(asset1LS, poolFactory.finalArray))
        setAsset2(getItemFromArray(addr.sparta, poolFactory.finalArray))
      }
    }

    getAsset1Details()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFactory.finalArray, window.localStorage.getItem('assetSelected1')])

  const assetInput1 = document.getElementById('assetInput1')
  const assetInput2 = document.getElementById('assetInput2')

  const handleInputChange = (input, toBase) => {
    if (toBase) {
      assetInput2.value = calcValueInBase(
        asset1[0].tokenAmount,
        asset1[0].baseAmount,
        input,
      )
    } else {
      assetInput1.value = calcValueInToken(
        asset1[0].tokenAmount,
        asset1[0].baseAmount,
        input,
      )
    }
  }

  useEffect(() => {
    const clearInputs = () => {
      if (assetInput1) {
        assetInput1.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset1])

  useEffect(() => {
    const clearInputs = () => {
      if (assetInput2) {
        assetInput2.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset2])

  const [horizontalTabs, sethorizontalTabs] = React.useState('addBoth')
  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={10}>Liquidity</Col>
          <Col md={2}>
            {' '}
            <Wallet />
          </Col>
        </Breadcrumb>
        <Row>
          <Col md={8}>
            <Row>
              <Col md={12}>
                <Nav tabs className="nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === 'addBoth' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'addBoth')
                      }
                    >
                      <div className="text-center">
                        <div className="output-card">Add both</div>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={horizontalTabs === 'addSingle' ? 'active' : ''}
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'addSingle')
                      }
                    >
                      <div className="text-center">
                        <div className="output-card">Add single</div>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={
                        horizontalTabs === 'removeBoth' ? 'active' : ''
                      }
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'removeBoth')
                      }
                    >
                      <div className="text-center">
                        <div className="output-card">Remove both</div>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#"
                      className={
                        horizontalTabs === 'removeSingle' ? 'active' : ''
                      }
                      onClick={(e) =>
                        changeActiveTab(e, 'horizontalTabs', 'removeSingle')
                      }
                    >
                      <div className="text-center">
                        <div className="output-card">Remove single</div>
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>

            <TabContent className="tab-space" activeTab={horizontalTabs}>
              <TabPane tabId="addBoth">
                <Card className="card-body">
                  <Row>
                    <Col md={6}>
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body "
                      >
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <AssetSelect priority="1" />
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">
                              Balance{' '}
                              {asset1 !== '...' &&
                                formatFromWei(asset1[0].balanceTokens)}
                            </div>
                            <div className="output-card">
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="assetInput1"
                                  // onFocus={() => setFocused('asset1')}
                                  // onBlur={() => setFocused(null)}
                                  onInput={(event) =>
                                    handleInputChange(event.target.value, true)
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="title-card">
                              ~$
                              {assetInput2 &&
                                web3.spartaPrice &&
                                assetInput2.value > 0 &&
                                formatFromUnits(
                                  BN(assetInput2.value).times(web3.spartaPrice),
                                  2,
                                )}
                              {!assetInput2 ||
                                !web3.spartaPrice ||
                                (assetInput2.value <= 0 && '0')}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body "
                      >
                        <Row>
                          <Col className="text-left">
                            <div className="title-card">Input</div>
                            <div className="output-card">
                              <img
                                className="mr-2"
                                src={coinSparta}
                                alt="SPARTA"
                              />
                              SPARTA
                            </div>
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">
                              {' '}
                              Balance{' '}
                              {asset2 !== '...' &&
                                formatFromWei(asset2[0].balanceTokens)}
                            </div>
                            <div className="output-card">
                              {' '}
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="assetInput2"
                                  // onFocus={() => setFocused('asset2')}
                                  // onBlur={() => setFocused(null)}
                                  onInput={(event) =>
                                    handleInputChange(event.target.value)
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="title-card">
                              1 {asset1[0].symbol} ={' '}
                              {poolFactory.finalArray &&
                                formatFromUnits(
                                  BN(asset1[0].baseAmount).div(
                                    BN(asset1[0].tokenAmount),
                                  ),
                                  2,
                                )}
                              {!poolFactory.finalArray && '...'} SPARTA
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col md={6}>
                      <div className="text-card">
                        Input{' '}
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
                        Share{' '}
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
                        Estimated output{' '}
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
                    <Col md={6} className="text-right">
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(assetInput1?.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(asset1[0]?.balanceTokens)}{' '}
                        {asset1[0]?.symbol}
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          assetInput2?.value > 0 &&
                          formatFromUnits(assetInput2.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(asset2[0]?.balanceTokens)}{' '}
                        SPARTA
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              assetInput2?.value,
                              assetInput1?.value,
                              asset1[0]?.baseAmount,
                              asset1[0]?.tokenAmount,
                              asset1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(asset1[0]?.poolUnits)}{' '}
                        SPT2-
                        {asset1[0]?.symbol}
                      </div>
                      <br />
                      <br />
                      <div className="subtitle-amount">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              assetInput2?.value,
                              assetInput1?.value,
                              asset1[0]?.baseAmount,
                              asset1[0]?.tokenAmount,
                              asset1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        SPT2-{asset1[0]?.symbol}
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <Button
                    color="primary"
                    size="lg"
                    block
                    onClick={() =>
                      dispatch(
                        routerAddLiq(
                          convertToWei(assetInput2?.value),
                          convertToWei(assetInput1?.value),
                          asset1[0].tokenAddress,
                        ),
                      )
                    }
                  >
                    Add to pool
                  </Button>
                </Card>
              </TabPane>
              <TabPane tabId="addSingle">
                <Row>
                  <Col md={6}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Select pool</div>
                          <div className="output-card">1</div>
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">Balance 10.36</div>
                          <div className="output-card">
                            BNB
                            <img className="ml-2" src={coinBnb} alt="BNB" />
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Input</div>
                          <div className="output-card">1</div>
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">Balance 10.36</div>
                          <div className="output-card">
                            SPARTA
                            <img
                              className="ml-2"
                              src={coinSparta}
                              alt="SPARTA"
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col md={6}>
                    <div className="text-card">
                      Input{' '}
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
                      Swap{' '}
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
                      Share{' '}
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
                      Estimated output{' '}
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
                  <Col md={6} className="text-right">
                    <div className="output-card">1 of 10.36 BNB</div>
                    <div className="output-card">100.52 of 255.89 SPARTA</div>
                    <div className="output-card">1 of 10.36 BNB</div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="subtitle-amount">52.23</div>
                  </Col>
                </Row>
                <br />
                <Button color="primary" size="lg" block>
                  Add to pool
                </Button>
                <br />
                <UncontrolledAlert
                  className="alert-with-icon"
                  color="danger"
                  fade={false}
                >
                  <span
                    data-notify="icon"
                    className="icon-medium icon-info icon-dark mb-5"
                  />
                  <span data-notify="message">
                    Please ensure you understand the risks related to this
                    asymmetric add! 50% of the input BNB will be swapped to
                    SPARTA before adding both to the pool. This is subject to
                    the usual swap fees and may have unfavourable impermanent
                    loss vs hodling your assets!
                  </span>
                </UncontrolledAlert>
              </TabPane>
              <TabPane tabId="removeBoth">
                <Row>
                  <Col md={12}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Redeem</div>
                          <div className="output-card">52.23</div>
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">Balance 52.23</div>
                          <div className="output-card">
                            <img
                              className="mr-2"
                              src={bnbSparta}
                              alt="Logo"
                              height="25"
                            />
                            WBNB-SPARTA LP
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col md={6}>
                    <div className="text-card">
                      Redeem LP Tokens{' '}
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
                      Projected output{' '}
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
                  <Col md={6} className="text-right">
                    <div className="output-card">52.23 of 52.23</div>
                    <div className="output-card">1.02 BNB</div>
                    <div className="output-card">100.52 SPARTA</div>
                    <div className="output-card">52.23</div>
                    <br />
                    <br />
                    <div className="subtitle-amount">1.02 BNB</div>
                    <br />
                    <div className="subtitle-amount">100.52 SPARTA</div>
                  </Col>
                </Row>
                <br />
                <Button color="primary" size="lg" block>
                  Redeem LP Tokens
                </Button>
              </TabPane>
              <TabPane tabId="removeSingle">
                <Row>
                  <Col md={12}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Redeem</div>
                          <div className="output-card">52.23</div>
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">Balance 52.23</div>
                          <div className="output-card">
                            <img
                              className="mr-2"
                              src={bnbSparta}
                              alt="Logo"
                              height="25"
                            />
                            WBNB-SPARTA LP
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col md={6}>
                    <div className="text-card">
                      Redeem LP Tokens{' '}
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
                      Projected output{' '}
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
                  <Col md={6} className="text-right">
                    <div className="output-card">52.23 of 52.23</div>
                    <div className="output-card">1.02 BNB</div>
                    <div className="output-card">100.52 SPARTA</div>
                    <div className="output-card">52.23</div>
                    <br />
                    <br />
                    <div className="subtitle-amount">1.02 BNB</div>
                    <br />
                    <div className="subtitle-amount">100.52 SPARTA</div>
                  </Col>
                </Row>
                <br />
                <Button color="primary" size="lg" block>
                  Redeem LP Tokens
                </Button>
              </TabPane>
            </TabContent>
            <Row />
          </Col>
          <Col md={4}>
            {' '}
            <Card className="card-body">
              <PoolsPaneSide />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Liquidity
