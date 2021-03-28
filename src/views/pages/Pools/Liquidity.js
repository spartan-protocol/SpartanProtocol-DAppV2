/* eslint-disable react-hooks/exhaustive-deps */
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
// import coinBnb from '../../../assets/icons/coin_bnb.svg'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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
  calcSwapFee,
  calcSwapOutput,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import { useWeb3 } from '../../../store/web3'
import { routerAddLiq, routerAddLiqAsym } from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import { getRouterContract } from '../../../utils/web3Router'
// import bnb_sparta from '../../../assets/icons/bnb_sparta.png'
// import { manageBodyClass } from '../../../components/Common/common'

const Liquidity = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const web3 = useWeb3()
  const [routerContract, setRouterContract] = useState(getRouterContract())
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [assetAdd3, setAssetAdd3] = useState('...')
  const [assetAdd4, setAssetAdd4] = useState('...')
  // const [assetRemove1, setAssetRemove1] = useState('...')
  // const [assetRemove2, setAssetRemove2] = useState('...')
  // const [assetRemove3, setAssetRemove3] = useState('...')
  // const [assetRemove4, setAssetRemove4] = useState('...')

  useEffect(() => {
    const checkContracts = () => {
      if (wallet.status === 'connected') {
        setRouterContract(getRouterContract())
      }
    }
    checkContracts()
  }, [wallet.account, window.localStorage.getItem('network')])

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))
        let asset4 = JSON.parse(window.localStorage.getItem('assetSelected4'))

        asset1 = asset1 ? asset1[0] : addr.wbnb
        asset3 = asset3 ? asset3[0] : addr.wbnb
        asset4 = asset3 && asset4 && asset3 !== asset4 ? asset4[0] : addr.sparta

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset2 = getItemFromArray(addr.sparta, poolFactory.finalArray)
        asset3 = getItemFromArray(asset3, poolFactory.finalArray)
        asset4 = getItemFromArray(asset4, poolFactory.finalArray)

        setAssetAdd1(asset1)
        setAssetAdd2(asset2)
        setAssetAdd3(asset3)
        setAssetAdd4(asset4)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
        window.localStorage.setItem('assetSelected4', JSON.stringify(asset4))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolFactory.finalArray,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected3'),
    window.localStorage.getItem('assetSelected4'),
  ])

  const addInput1 = document.getElementById('addInput1')
  const addInput2 = document.getElementById('addInput2')
  // const addInput3 = document.getElementById('addInput3') // There is no addInput3
  const addInput4 = document.getElementById('addInput4')
  // const RemBothInput1 = document.getElementById('RemBothInput1') // There is no RemBothInput1
  // const RemBothInput2 = document.getElementById('RemBothInput2')
  // const RemOneInput1 = document.getElementById('RemOneInput1') // Use LP token details here
  // const RemOneInput2 = document.getElementById('RemOneInput2')

  const getAddOneSwapInput = () => {
    if (addInput4) {
      return convertToWei(BN(addInput4.value).div(2))
    }
    return '0'
  }

  const getAddOneSwapOutput = () => {
    if (addInput4 && assetAdd3[0] && assetAdd4[0]) {
      return calcSwapOutput(
        convertToWei(BN(addInput4?.value).div(2)),
        assetAdd3[0]?.tokenAmount,
        assetAdd3[0]?.baseAmount,
        assetAdd4[0]?.symbol !== 'SPARTA',
      )
    }
    return '0'
  }

  const getAddOneSwapFee = () => {
    if (addInput4 && assetAdd3[0] && assetAdd4[0]) {
      return calcSwapFee(
        convertToWei(BN(addInput4.value).div(2)),
        assetAdd3[0].tokenAmount,
        assetAdd3[0].baseAmount,
        assetAdd4[0].symbol !== 'SPARTA',
      )
    }
    return '0'
  }

  const getAddOneOutputLP = () => {
    if (assetAdd4 && assetAdd3[0] && assetAdd4[0]) {
      return calcLiquidityUnits(
        assetAdd4[0].symbol === 'SPARTA'
          ? getAddOneSwapInput()
          : BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
        assetAdd4[0].symbol === 'SPARTA'
          ? BN(getAddOneSwapOutput()).minus(getAddOneSwapFee())
          : getAddOneSwapInput(),
        assetAdd3[0]?.baseAmount,
        assetAdd3[0]?.tokenAmount,
        assetAdd3[0]?.poolUnits,
      )
    }
    return '0'
  }

  const handleInputChange = (input, toBase) => {
    if (toBase) {
      addInput2.value = calcValueInBase(
        assetAdd1[0].tokenAmount,
        assetAdd1[0].baseAmount,
        input,
      )
    } else {
      addInput1.value = calcValueInToken(
        assetAdd1[0].tokenAmount,
        assetAdd1[0].baseAmount,
        input,
      )
    }
  }

  useEffect(() => {
    const clearInputs = () => {
      if (addInput1) {
        addInput1.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetAdd1])

  useEffect(() => {
    const clearInputs = () => {
      if (addInput2) {
        addInput2.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetAdd2])

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
                            <AssetSelect
                              priority="1"
                              blackList={[addr.sparta]}
                            />
                          </Col>
                          <Col className="text-right">
                            <div className="title-card">
                              Balance{' '}
                              {assetAdd1 !== '...' &&
                                formatFromWei(assetAdd1[0]?.balanceTokens)}
                            </div>
                            <div className="output-card">
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="addInput1"
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
                              {addInput2 &&
                                web3.spartaPrice &&
                                addInput2.value > 0 &&
                                formatFromUnits(
                                  BN(addInput2?.value).times(web3.spartaPrice),
                                  2,
                                )}
                              {!addInput2 ||
                                !web3.spartaPrice ||
                                (addInput2?.value <= 0 && '0')}
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
                              {assetAdd2 !== '...' &&
                                formatFromWei(assetAdd2[0]?.balanceTokens)}
                            </div>
                            <div className="output-card">
                              {' '}
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="addInput2"
                                  // onFocus={() => setFocused('asset2')}
                                  // onBlur={() => setFocused(null)}
                                  onInput={(event) =>
                                    handleInputChange(event.target.value)
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="title-card">
                              1 {assetAdd1[0]?.symbol} ={' '}
                              {poolFactory.finalArray &&
                                formatFromUnits(
                                  BN(assetAdd1[0]?.baseAmount).div(
                                    BN(assetAdd1[0]?.tokenAmount),
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
                          formatFromUnits(addInput1?.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdd1[0]?.balanceTokens)}{' '}
                        {assetAdd1[0]?.symbol}
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          addInput2?.value > 0 &&
                          formatFromUnits(addInput2?.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdd2[0]?.balanceTokens)}{' '}
                        SPARTA
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              addInput2?.value,
                              addInput1?.value,
                              assetAdd1[0]?.baseAmount,
                              assetAdd1[0]?.tokenAmount,
                              assetAdd1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdd1[0]?.poolUnits)}{' '}
                        SPT2-
                        {assetAdd1[0]?.symbol}
                      </div>
                      <br />
                      <br />
                      <div className="subtitle-amount">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              addInput2?.value,
                              addInput1?.value,
                              assetAdd1[0]?.baseAmount,
                              assetAdd1[0]?.tokenAmount,
                              assetAdd1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        SPT2-{assetAdd1[0]?.symbol}
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
                          convertToWei(addInput2?.value),
                          convertToWei(addInput1?.value),
                          assetAdd1[0]?.tokenAddress,
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
                      className="card-body"
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Select pool</div>
                          <AssetSelect
                            priority="3"
                            type="pools"
                            blackList={[addr.sparta]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="output-card">
                            <img
                              className="mr-2"
                              src={bnbSparta}
                              alt="Logo"
                              height="25"
                            />
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
                          <AssetSelect
                            priority="4"
                            whiteList={[
                              assetAdd3[0]?.tokenAddress,
                              addr.sparta,
                            ]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">
                            Balance{' '}
                            {assetAdd4 !== '...' &&
                              formatFromWei(assetAdd4[0]?.balanceTokens)}
                          </div>
                          <div className="output-card">
                            <FormGroup>
                              <Input
                                className="text-right"
                                type="text"
                                placeholder="0"
                                id="addInput4"
                              />
                            </FormGroup>
                          </div>
                          <div className="title-card">
                            ~$
                            {addInput4 &&
                              web3.spartaPrice &&
                              addInput4.value > 0 &&
                              formatFromUnits(
                                BN(assetAdd3[0]?.baseAmount)
                                  .div(BN(assetAdd3[0]?.tokenAmount))
                                  .times(BN(addInput4?.value)),
                                2,
                              )}
                            {!addInput4 ||
                              !web3.spartaPrice ||
                              (addInput4?.value <= 0 && '0')}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {assetAdd4 && wallet && routerContract && addInput4 && (
                      <Approval
                        tokenAddress={assetAdd4[0]?.tokenAddress}
                        walletAddress={wallet?.account}
                        contractAddress={routerContract}
                        txnAmount={addInput4?.value}
                      />
                    )}
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
                    <div className="output-card">
                      {addInput4 && formatFromUnits(addInput4?.value, 4)} of{' '}
                      {assetAdd4 !== '...' &&
                        formatFromWei(assetAdd4[0]?.balanceTokens)}
                      {assetAdd4[0]?.symbol}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapInput())}{' '}
                      {assetAdd4[0]?.symbol} to{' '}
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(
                          BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
                        )}{' '}
                      {assetAdd4[0]?.symbol === 'SPARTA'
                        ? assetAdd3[0]?.symbol
                        : 'SPARTA'}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(
                          BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
                        )}{' '}
                      {assetAdd4[0]?.symbol === 'SPARTA'
                        ? assetAdd3[0]?.symbol
                        : 'SPARTA'}{' '}
                      +{' '}
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapInput(), 4)}{' '}
                      {assetAdd4[0]?.symbol}
                    </div>
                    <br />
                    <div className="subtitle-amount">
                      {poolFactory.finalArray &&
                        formatFromWei(getAddOneOutputLP())}{' '}
                      SPT2-{assetAdd3[0]?.symbol}
                    </div>
                    <br />
                  </Col>
                </Row>
                <br />
                <Button
                  color="primary"
                  size="lg"
                  onClick={() =>
                    dispatch(
                      routerAddLiqAsym(
                        convertToWei(BN(addInput4?.value)),
                        assetAdd4[0]?.symbol === 'SPARTA',
                        assetAdd3[0]?.tokenAddress,
                      ),
                    )
                  }
                  block
                >
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
