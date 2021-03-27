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
  const [assetAdBo1, setAssetAdBo1] = useState('...')
  const [assetAdBo2, setAssetAdBo2] = useState('...')
  const [assetAdSi1, setAssetAdSi1] = useState('...')
  const [assetAdSi2, setAssetAdSi2] = useState('...')
  // const [assetReBo1, setAssetReBo1] = useState('...')
  // const [assetReBo2, setAssetReBo2] = useState('...')
  // const [assetReSi1, setAssetReSi1] = useState('...')
  // const [assetReSi2, setAssetReSi2] = useState('...')

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
        asset1 = asset1 ? asset1[1] : addr.wbnb
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))
        asset3 = asset3 ? asset3[1] : addr.wbnb
        let asset4 = JSON.parse(window.localStorage.getItem('assetSelected4'))
        asset4 = asset4 ? asset4[1] : addr.wbnb
        setAssetAdBo1(getItemFromArray(asset1, poolFactory.finalArray))
        setAssetAdBo2(getItemFromArray(addr.sparta, poolFactory.finalArray))
        setAssetAdSi1(getItemFromArray(asset3, poolFactory.finalArray))
        setAssetAdSi2(getItemFromArray(asset4, poolFactory.finalArray))
        // setAssetReBo1(getItemFromArray(asset1LS, poolFactory.finalArray))
        // setAssetReBo2(getItemFromArray(addr.sparta, poolFactory.finalArray))
        // setAssetReSi1(getItemFromArray(asset1LS, poolFactory.finalArray))
        // setAssetReSi2(getItemFromArray(addr.sparta, poolFactory.finalArray))
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

  const AddBothInput1 = document.getElementById('AddBothInput1')
  const AddBothInput2 = document.getElementById('AddBothInput2')
  // const AddOneInput1 = document.getElementById('AddOneInput1') // There is no AddOneInput1
  const AddOneInput2 = document.getElementById('AddOneInput2')
  // const RemBothInput1 = document.getElementById('RemBothInput1') // There is no RemBothInput1
  // const RemBothInput2 = document.getElementById('RemBothInput2')
  // const RemOneInput1 = document.getElementById('RemOneInput1') // Use LP token details here
  // const RemOneInput2 = document.getElementById('RemOneInput2')

  const getAddOneSwapInput = () => {
    if (AddOneInput2) {
      return convertToWei(BN(AddOneInput2.value).div(2))
    }
    return '0'
  }

  const getAddOneSwapOutput = () => {
    if (AddOneInput2 && assetAdSi1[0] && assetAdSi2[0]) {
      return calcSwapOutput(
        convertToWei(BN(AddOneInput2?.value).div(2)),
        assetAdSi1[0]?.tokenAmount,
        assetAdSi1[0]?.baseAmount,
        assetAdSi2[0]?.symbol !== 'SPARTA',
      )
    }
    return '0'
  }

  const getAddOneSwapFee = () => {
    if (AddOneInput2 && assetAdSi1[0] && assetAdSi2[0]) {
      return calcSwapFee(
        convertToWei(BN(AddOneInput2.value).div(2)),
        assetAdSi1[0].tokenAmount,
        assetAdSi1[0].baseAmount,
        assetAdSi2[0].symbol !== 'SPARTA',
      )
    }
    return '0'
  }

  const getAddOneOutputLP = () => {
    if (assetAdSi2 && assetAdSi1[0] && assetAdSi2[0]) {
      return calcLiquidityUnits(
        assetAdSi2[0].symbol === 'SPARTA'
          ? getAddOneSwapInput()
          : BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
        assetAdSi2[0].symbol === 'SPARTA'
          ? BN(getAddOneSwapOutput()).minus(getAddOneSwapFee())
          : getAddOneSwapInput(),
        assetAdSi1[0]?.baseAmount,
        assetAdSi1[0]?.tokenAmount,
        assetAdSi1[0]?.poolUnits,
      )
    }
    return '0'
  }

  const handleInputChange = (input, toBase) => {
    if (toBase) {
      AddBothInput2.value = calcValueInBase(
        assetAdBo1[0].tokenAmount,
        assetAdBo1[0].baseAmount,
        input,
      )
    } else {
      AddBothInput1.value = calcValueInToken(
        assetAdBo1[0].tokenAmount,
        assetAdBo1[0].baseAmount,
        input,
      )
    }
  }

  useEffect(() => {
    const clearInputs = () => {
      if (AddBothInput1) {
        AddBothInput1.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetAdBo1])

  useEffect(() => {
    const clearInputs = () => {
      if (AddBothInput2) {
        AddBothInput2.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetAdBo2])

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
                              {assetAdBo1 !== '...' &&
                                formatFromWei(assetAdBo1[0].balanceTokens)}
                            </div>
                            <div className="output-card">
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="AddBothInput1"
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
                              {AddBothInput2 &&
                                web3.spartaPrice &&
                                AddBothInput2.value > 0 &&
                                formatFromUnits(
                                  BN(AddBothInput2.value).times(
                                    web3.spartaPrice,
                                  ),
                                  2,
                                )}
                              {!AddBothInput2 ||
                                !web3.spartaPrice ||
                                (AddBothInput2.value <= 0 && '0')}
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
                              {assetAdBo2 !== '...' &&
                                formatFromWei(assetAdBo2[0].balanceTokens)}
                            </div>
                            <div className="output-card">
                              {' '}
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="AddBothInput2"
                                  // onFocus={() => setFocused('asset2')}
                                  // onBlur={() => setFocused(null)}
                                  onInput={(event) =>
                                    handleInputChange(event.target.value)
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="title-card">
                              1 {assetAdBo1[0].symbol} ={' '}
                              {poolFactory.finalArray &&
                                formatFromUnits(
                                  BN(assetAdBo1[0].baseAmount).div(
                                    BN(assetAdBo1[0].tokenAmount),
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
                          formatFromUnits(AddBothInput1?.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdBo1[0]?.balanceTokens)}{' '}
                        {assetAdBo1[0]?.symbol}
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          AddBothInput2?.value > 0 &&
                          formatFromUnits(AddBothInput2.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdBo2[0]?.balanceTokens)}{' '}
                        SPARTA
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              AddBothInput2?.value,
                              AddBothInput1?.value,
                              assetAdBo1[0]?.baseAmount,
                              assetAdBo1[0]?.tokenAmount,
                              assetAdBo1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdBo1[0]?.poolUnits)}{' '}
                        SPT2-
                        {assetAdBo1[0]?.symbol}
                      </div>
                      <br />
                      <br />
                      <div className="subtitle-amount">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(
                            calcLiquidityUnits(
                              AddBothInput2?.value,
                              AddBothInput1?.value,
                              assetAdBo1[0]?.baseAmount,
                              assetAdBo1[0]?.tokenAmount,
                              assetAdBo1[0]?.poolUnits,
                            ),
                            4,
                          )}{' '}
                        SPT2-{assetAdBo1[0]?.symbol}
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
                          convertToWei(AddBothInput2?.value),
                          convertToWei(AddBothInput1?.value),
                          assetAdBo1[0].tokenAddress,
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
                              assetAdSi1[0].tokenAddress,
                              addr.sparta,
                            ]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">
                            Balance{' '}
                            {assetAdSi2 !== '...' &&
                              formatFromWei(assetAdSi2[0].balanceTokens)}
                          </div>
                          <div className="output-card">
                            <FormGroup>
                              <Input
                                className="text-right"
                                type="text"
                                placeholder="0"
                                id="AddOneInput2"
                              />
                            </FormGroup>
                          </div>
                          <div className="title-card">
                            ~$
                            {AddOneInput2 &&
                              web3.spartaPrice &&
                              AddOneInput2.value > 0 &&
                              formatFromUnits(
                                BN(assetAdSi1[0].baseAmount)
                                  .div(BN(assetAdSi1[0].tokenAmount))
                                  .times(BN(AddOneInput2.value)),
                                2,
                              )}
                            {!AddOneInput2 ||
                              !web3.spartaPrice ||
                              (AddOneInput2.value <= 0 && '0')}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {assetAdSi2 && wallet && routerContract && AddOneInput2 && (
                      <Approval
                        tokenAddress={assetAdSi2[0]?.tokenAddress}
                        walletAddress={wallet?.account}
                        contractAddress={routerContract}
                        txnAmount={AddOneInput2?.value}
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
                      {AddOneInput2 && formatFromUnits(AddOneInput2.value, 4)}{' '}
                      of{' '}
                      {assetAdSi2 !== '...' &&
                        formatFromWei(assetAdSi2[0].balanceTokens)}
                      {assetAdSi2[0].symbol}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdSi2 &&
                        AddOneInput2 &&
                        formatFromWei(getAddOneSwapInput())}{' '}
                      {assetAdSi2[0].symbol} to{' '}
                      {assetAdSi2 &&
                        AddOneInput2 &&
                        formatFromWei(
                          BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
                        )}{' '}
                      {assetAdSi2[0].symbol === 'SPARTA'
                        ? assetAdSi1[0].symbol
                        : 'SPARTA'}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdSi2 &&
                        AddOneInput2 &&
                        formatFromWei(
                          BN(getAddOneSwapOutput()).minus(getAddOneSwapFee()),
                        )}{' '}
                      {assetAdSi2[0].symbol === 'SPARTA'
                        ? assetAdSi1[0].symbol
                        : 'SPARTA'}{' '}
                      +{' '}
                      {assetAdSi2 &&
                        AddOneInput2 &&
                        formatFromWei(getAddOneSwapInput(), 4)}{' '}
                      {assetAdSi2[0].symbol}
                    </div>
                    <br />
                    <div className="subtitle-amount">
                      {poolFactory.finalArray &&
                        formatFromWei(getAddOneOutputLP())}{' '}
                      SPT2-{assetAdSi1[0].symbol}
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
                        convertToWei(BN(AddOneInput2.value)),
                        assetAdSi2[0].symbol === 'SPARTA',
                        assetAdSi1[0].tokenAddress,
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
