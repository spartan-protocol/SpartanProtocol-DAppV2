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
  calcLiquidityHoldings,
  calcLiquidityUnits,
  calcSwapFee,
  calcSwapOutput,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import { useWeb3 } from '../../../store/web3'
import {
  routerAddLiq,
  routerAddLiqAsym,
  routerRemoveLiq,
  routerRemoveLiqAsym,
} from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import { getRouterContract } from '../../../utils/web3Router'
import SharePool from '../../../components/Share/SharePool'
// import bnb_sparta from '../../../assets/icons/bnb_sparta.png'
// import { manageBodyClass } from '../../../components/Common/common'

const Liquidity = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const web3 = useWeb3()
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [assetAdd3, setAssetAdd3] = useState('...')
  const [assetAdd4, setAssetAdd4] = useState('...')
  const [assetRemove1, setAssetRemove1] = useState('...')
  // const [assetRemove2, setAssetRemove2] = useState('...') //UNUSED
  const [assetRemove3, setAssetRemove3] = useState('...')
  const [assetRemove4, setAssetRemove4] = useState('...')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))
        let asset4 = JSON.parse(window.localStorage.getItem('assetSelected4'))
        let asset5 = JSON.parse(window.localStorage.getItem('assetSelected5'))
        // let asset6 = JSON.parse(window.localStorage.getItem('assetSelected6')) //UNUSED
        let asset7 = JSON.parse(window.localStorage.getItem('assetSelected7'))
        let asset8 = JSON.parse(window.localStorage.getItem('assetSelected8'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset3 =
          asset3 && asset3.tokenAddress !== addr.sparta
            ? asset3
            : { tokenAddress: addr.bnb }
        asset4 =
          asset3 && asset4 && asset3.tokenAddress === asset4.tokenAddress
            ? asset3
            : { tokenAddress: addr.sparta }
        asset5 =
          asset5 && asset5.tokenAddress !== addr.sparta
            ? asset5
            : { tokenAddress: addr.bnb }
        asset7 =
          asset7 && asset7.tokenAddress !== addr.sparta
            ? asset7
            : { tokenAddress: addr.bnb }
        asset8 =
          asset7 && asset8 && asset7.tokenAddress === asset8.tokenAddress
            ? asset7
            : { tokenAddress: addr.sparta }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset2 = getItemFromArray(
          { tokenAddress: addr.sparta },
          poolFactory.finalArray,
        )
        asset3 = getItemFromArray(asset3, poolFactory.finalArray)
        asset4 = getItemFromArray(asset4, poolFactory.finalArray)
        if (poolFactory.finalLpArray) {
          asset5 = getItemFromArray(asset5, poolFactory.finalLpArray)
        } // Use LP array here for LP balance
        else asset5 = getItemFromArray(asset5, poolFactory.finalArray) // Fallback to finalLpArray
        // asset6 = getItemFromArray(
        //   { tokenAddress: addr.sparta },
        //   poolFactory.finalArray,
        // ) //UNUSED
        if (poolFactory.finalLpArray) {
          asset7 = getItemFromArray(asset7, poolFactory.finalLpArray)
        } else asset7 = getItemFromArray(asset7, poolFactory.finalArray)
        if (poolFactory.finalLpArray) {
          asset8 = getItemFromArray(asset8, poolFactory.finalLpArray)
        } else asset8 = getItemFromArray(asset8, poolFactory.finalArray)

        setAssetAdd1(asset1)
        setAssetAdd2(asset2)
        setAssetAdd3(asset3)
        setAssetAdd4(asset4)
        setAssetRemove1(asset5)
        // setAssetRemove2(asset6) //UNUSED
        setAssetRemove3(asset7)
        setAssetRemove4(asset8)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
        window.localStorage.setItem('assetSelected4', JSON.stringify(asset4))
        window.localStorage.setItem('assetSelected5', JSON.stringify(asset5))
        // window.localStorage.setItem('assetSelected6', JSON.stringify(asset6)) //UNUSED
        window.localStorage.setItem('assetSelected7', JSON.stringify(asset7))
        window.localStorage.setItem('assetSelected8', JSON.stringify(asset8))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected3'),
    window.localStorage.getItem('assetSelected4'),
    window.localStorage.getItem('assetSelected5'),
    window.localStorage.getItem('assetSelected7'),
    window.localStorage.getItem('assetSelected8'),
  ])

  const addInput1 = document.getElementById('addInput1')
  const addInput2 = document.getElementById('addInput2')
  // const addInput3 = document.getElementById('addInput3') // There is no addInput3
  const addInput4 = document.getElementById('addInput4')
  // const removeInput1 = document.getElementById('RemBothInput1') // There is no removeInput1
  const removeInput2 = document.getElementById('removeInput2') // Use LP token details here
  // const removeInput3 = document.getElementById('removeInput3') // There is no removeInput3
  const removeInput4 = document.getElementById('removeInput4')

  //= =================================================================================//
  // 'Add Both' Functions (Re-Factor)

  const getAddBothOutputLP = () => {
    if (addInput1 && addInput2 && assetAdd1) {
      return calcLiquidityUnits(
        addInput2?.value,
        addInput1?.value,
        assetAdd1?.baseAmount,
        assetAdd1?.tokenAmount,
        assetAdd1?.poolUnits,
      )
    }
    return '0'
  }

  //= =================================================================================//
  // 'Add Single' Functions (Re-Factor)
  const getAddOneSwapInput = () => {
    if (addInput4) {
      return convertToWei(BN(addInput4.value).div(2))
    }
    return '0'
  }

  const getAddOneSwapOutput = () => {
    if (addInput4 && assetAdd3 && assetAdd4) {
      return calcSwapOutput(
        getAddOneSwapInput(),
        assetAdd3?.tokenAmount,
        assetAdd3?.baseAmount,
        assetAdd4?.symbol !== 'SPARTA',
      )
    }
    return '0'
  }

  const getAddOneSwapFee = () => {
    if (addInput4 && assetAdd3 && assetAdd4) {
      let swapFee = calcSwapFee(
        getAddOneSwapInput(),
        assetAdd3.tokenAmount,
        assetAdd3.baseAmount,
        assetAdd4.symbol !== 'SPARTA',
      )
      if (assetAdd4?.symbol === 'SPARTA') {
        swapFee = calcValueInBase(
          assetAdd3?.tokenAmount,
          assetAdd3?.baseAmount,
          swapFee,
        )
      }
      return swapFee
    }
    return '0'
  }

  const getAddOneOutputLP = () => {
    if (assetAdd4 && assetAdd3 && assetAdd4) {
      return calcLiquidityUnits(
        assetAdd4.symbol === 'SPARTA'
          ? getAddOneSwapInput()
          : getAddOneSwapOutput(),
        assetAdd4.symbol === 'SPARTA'
          ? getAddOneSwapOutput()
          : getAddOneSwapInput(),
        assetAdd3?.baseAmount,
        assetAdd3?.tokenAmount,
        assetAdd3?.poolUnits,
      )
    }
    return '0'
  }

  //= =================================================================================//
  // 'Remove Both' Functions (Re-Factor)

  const getRemBothOutputToken = () => {
    if (assetRemove1 && removeInput2?.value) {
      return calcLiquidityHoldings(
        assetRemove1?.tokenAmount,
        convertToWei(removeInput2?.value),
        assetRemove1?.poolUnits,
      )
    }
    return '0'
  }

  const getRemBothOutputBase = () => {
    if (assetRemove1 && removeInput2?.value) {
      return calcLiquidityHoldings(
        assetRemove1?.baseAmount,
        convertToWei(removeInput2?.value),
        assetRemove1?.poolUnits,
      )
    }
    return '0'
  }

  const getRemBothInputValue = () => {
    if (assetRemove1 && removeInput2?.value) {
      return BN(
        calcValueInBase(
          assetRemove1?.tokenAmount,
          assetRemove1?.baseAmount,
          getRemBothOutputToken(),
        ),
      ).plus(BN(getRemBothOutputBase()).times(web3.spartaPrice))
    }
    return '0'
  }
  //= =================================================================================//
  // 'Remove Single' Functions (Re-Factor)

  const getRemOneOutputToken = () => {
    if (assetRemove3 && removeInput4?.value) {
      return calcLiquidityHoldings(
        assetRemove3?.tokenAmount,
        convertToWei(removeInput4?.value),
        assetRemove3?.poolUnits,
      )
    }
    return '0'
  }

  const getRemOneOutputBase = () => {
    if (assetRemove3 && removeInput4?.value) {
      return calcLiquidityHoldings(
        assetRemove3?.baseAmount,
        convertToWei(removeInput4?.value),
        assetRemove3?.poolUnits,
      )
    }
    return '0'
  }

  const getRemoveOneSwapInput = () => {
    if (removeInput4) {
      if (assetRemove3?.tokenAddress === assetRemove4?.tokenAddress) {
        return BN(getRemOneOutputBase())
      }
      return BN(getRemOneOutputToken())
    }
    return '0'
  }

  const getRemoveOneSwapFee = () => {
    if (removeInput4 && assetRemove3 && assetRemove4) {
      let swapFee = calcSwapFee(
        getRemoveOneSwapInput(),
        assetRemove3?.tokenAmount,
        assetRemove3?.baseAmount,
        assetRemove4?.symbol === 'SPARTA',
      )
      if (assetRemove4?.symbol !== 'SPARTA') {
        swapFee = calcValueInBase(
          assetRemove3?.tokenAmount,
          assetRemove3?.baseAmount,
          swapFee,
        )
      }
      return swapFee
    }
    return '0'
  }

  const getRemoveOneSwapOutput = () => {
    if (removeInput4 && assetRemove3 && assetRemove4) {
      return calcSwapOutput(
        BN(getRemoveOneSwapInput()),
        assetRemove3?.tokenAmount,
        assetRemove3?.baseAmount,
        assetRemove4?.symbol === 'SPARTA',
      )
    }
    return '0'
  }

  const getRemoveOneFinalOutput = () => {
    if (assetRemove4 && assetRemove3 && assetRemove4) {
      const result = BN(getRemoveOneSwapOutput()).plus(
        assetRemove4?.symbol === 'SPARTA'
          ? BN(getRemOneOutputBase())
          : BN(getRemOneOutputToken()),
      )
      return result
    }
    return '0'
  }

  const getRemOneInputValue = () => {
    if (assetRemove3 && removeInput4?.value) {
      return BN(
        calcValueInBase(
          assetRemove3?.tokenAmount,
          assetRemove3?.baseAmount,
          getRemOneOutputToken(),
        ),
      ).plus(BN(getRemOneOutputBase()).times(web3.spartaPrice))
    }
    return '0'
  }

  //= =================================================================================//
  // General Functions

  const handleInputChange = (input, toBase) => {
    if (toBase) {
      addInput2.value = calcValueInBase(
        assetAdd1.tokenAmount,
        assetAdd1.baseAmount,
        input,
      )
    } else {
      addInput1.value = calcValueInToken(
        assetAdd1.tokenAmount,
        assetAdd1.baseAmount,
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
          <Col md={8}>Liquidity</Col>
          <Col md={2}>
            <SharePool />
          </Col>
          <Col md={2}>
            <Wallet />
          </Col>
        </Breadcrumb>
        <Row>
          <Col md={8}>
            <Row>
              <Col md={12}>
                {/* ----- NAV TABS ----- */}
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
              {/* ----- ADD BOTH ----- */}
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
                                formatFromWei(assetAdd1?.balanceTokens)}
                            </div>
                            <div className="output-card">
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="addInput1"
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
                                formatFromWei(assetAdd2?.balanceTokens)}
                            </div>
                            <div className="output-card">
                              {' '}
                              <FormGroup>
                                <Input
                                  className="text-right"
                                  type="text"
                                  placeholder="0"
                                  id="addInput2"
                                  onInput={(event) =>
                                    handleInputChange(event.target.value)
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="title-card">
                              1 {assetAdd1?.symbol} ={' '}
                              {poolFactory.finalArray &&
                                formatFromUnits(
                                  BN(assetAdd1?.baseAmount).div(
                                    BN(assetAdd1?.tokenAmount),
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

                  <Row>
                    <Col md={6}>
                      {assetAdd1?.tokenAddress &&
                        assetAdd1?.tokenAddress !== addr.bnb &&
                        wallet?.account &&
                        addInput1?.value && (
                          <Approval
                            tokenAddress={assetAdd1?.tokenAddress}
                            walletAddress={wallet?.account}
                            contractAddress={addr.router}
                            txnAmount={addInput1?.value}
                          />
                        )}
                    </Col>
                    <Col md={6}>
                      {assetAdd2?.tokenAddress &&
                        assetAdd2?.tokenAddress !== addr.bnb &&
                        wallet?.account &&
                        addInput2?.value && (
                          <Approval
                            tokenAddress={assetAdd2?.tokenAddress}
                            walletAddress={wallet?.account}
                            contractAddress={addr.router}
                            txnAmount={addInput2?.value}
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
                          formatFromWei(assetAdd1?.balanceTokens)}{' '}
                        {assetAdd1?.symbol}
                      </div>
                      <div className="output-card">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          addInput2?.value > 0 &&
                          formatFromUnits(addInput2?.value, 4)}{' '}
                        of {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromWei(assetAdd2?.balanceTokens)}{' '}
                        SPARTA
                      </div>
                      <br />
                      <div className="subtitle-amount">
                        {!poolFactory.finalArray && '...'}
                        {poolFactory.finalArray &&
                          formatFromUnits(getAddBothOutputLP(), 4)}{' '}
                        SPT2-{assetAdd1?.symbol}
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <Button
                    color="primary"
                    size="lg"
                    block
                    onClick={() => {
                      console.log(
                        convertToWei(addInput2?.value),
                        convertToWei(addInput1?.value),
                        assetAdd1?.tokenAddress,
                      )
                      dispatch(
                        routerAddLiq(
                          convertToWei(addInput2?.value),
                          convertToWei(addInput1?.value),
                          assetAdd1?.tokenAddress,
                        ),
                      )
                    }}
                  >
                    Add to pool
                  </Button>
                </Card>
              </TabPane>
              {/* ----- ADD SINGLE ----- */}
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
                          <AssetSelect priority="3" blackList={[addr.sparta]} />
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
                            whiteList={[assetAdd3?.tokenAddress, addr.sparta]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">
                            Balance{' '}
                            {assetAdd4 !== '...' &&
                              formatFromWei(assetAdd4?.balanceTokens)}
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
                                BN(assetAdd3?.baseAmount)
                                  .div(BN(assetAdd3?.tokenAmount))
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
                    {assetAdd4?.tokenAddress &&
                      assetAdd4?.tokenAddress !== addr.bnb &&
                      wallet?.account &&
                      addInput4?.value && (
                        <Approval
                          tokenAddress={assetAdd4?.tokenAddress}
                          walletAddress={wallet?.account}
                          contractAddress={addr.router}
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
                      Add{' '}
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
                        formatFromWei(assetAdd4?.balanceTokens)}
                      {assetAdd4?.symbol}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapInput())}{' '}
                      {assetAdd4?.symbol} to{' '}
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapOutput())}{' '}
                      {assetAdd4?.symbol === 'SPARTA'
                        ? assetAdd3?.symbol
                        : 'SPARTA'}
                    </div>
                    <div className="output-card">
                      inc slip fee:{' '}
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapFee())}{' '}
                      SPARTA
                    </div>
                    <br />
                    <div className="output-card">
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapOutput())}{' '}
                      {assetAdd4?.symbol === 'SPARTA'
                        ? assetAdd3?.symbol
                        : 'SPARTA'}{' '}
                      +{' '}
                      {assetAdd4 &&
                        addInput4 &&
                        formatFromWei(getAddOneSwapInput(), 4)}{' '}
                      {assetAdd4?.symbol}
                    </div>
                    <br />
                    <div className="subtitle-amount">
                      {poolFactory.finalArray &&
                        formatFromWei(getAddOneOutputLP())}{' '}
                      SPT2-{assetAdd3?.symbol}
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
                        assetAdd4?.symbol === 'SPARTA',
                        assetAdd3?.tokenAddress,
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
              {/* ----- REMOVE BOTH ----- */}
              <TabPane tabId="removeBoth">
                {/* ----- Remove both INPUT PANE ----- */}
                <Row>
                  <Col md={12}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">Redeem</div>
                          <AssetSelect
                            priority="5"
                            type="pools"
                            blackList={[addr.sparta]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">
                            Balance: {formatFromWei(assetRemove1?.balanceLPs)}{' '}
                            STP2-{assetRemove1?.symbol}
                          </div>
                          <div className="title-card">
                            Locked: XXX.XX STP2-{assetRemove1?.symbol}
                          </div>
                          <FormGroup>
                            <Input
                              className="text-right"
                              type="text"
                              placeholder="0"
                              id="removeInput2"
                            />
                          </FormGroup>
                          <div className="output-card">
                            ~${formatFromWei(getRemBothInputValue()).toString()}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                <br />
                {/* ----- Remove both TXN DETAILS PANE ----- */}
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
                      Est. Output{' '}
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
                      {formatFromUnits(removeInput2?.value, 4)} of{' '}
                      {formatFromWei(assetRemove1?.balanceLPs)}
                    </div>
                    <br />
                    <div className="output-card">
                      {formatFromWei(getRemBothOutputToken())}{' '}
                      {assetRemove1?.symbol}
                    </div>
                    <div className="output-card">
                      {formatFromWei(getRemBothOutputBase())} SPARTA
                    </div>
                  </Col>
                </Row>
                <br />
                <Button
                  color="primary"
                  size="lg"
                  onClick={() =>
                    dispatch(
                      routerRemoveLiq(
                        BN(convertToWei(removeInput2.value))
                          .div(BN(assetRemove1?.balanceLPs))
                          .times('10000')
                          .toFixed(0),
                        assetRemove1?.tokenAddress,
                      ),
                    )
                  }
                  block
                >
                  Redeem LP Tokens
                </Button>
              </TabPane>
              {/* ----- REMOVE SINGLE ----- */}
              <TabPane tabId="removeSingle">
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
                            priority="7"
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
                          <div className="title-card">Output</div>
                          <AssetSelect
                            priority="8"
                            whiteList={[
                              assetRemove3?.tokenAddress,
                              addr.sparta,
                            ]}
                          />
                        </Col>
                        <Col className="text-right">
                          <div className="title-card">
                            Balance{' '}
                            {assetRemove4 !== '...' &&
                              formatFromWei(assetRemove3?.balanceLPs)}{' '}
                            SPT2-{assetRemove3?.symbol}
                          </div>
                          <div className="output-card">
                            <FormGroup>
                              <Input
                                className="text-right"
                                type="text"
                                placeholder="0"
                                id="removeInput4"
                              />
                            </FormGroup>
                          </div>
                          <div className="title-card">
                            ~${formatFromWei(getRemOneInputValue()).toString()}
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
                      Remove{' '}
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
                      {removeInput4 && formatFromUnits(removeInput4?.value, 4)}{' '}
                      of{' '}
                      {assetRemove4 !== '...' &&
                        formatFromWei(assetRemove3?.balanceLPs)}{' '}
                      SPT2-{assetRemove3?.symbol}
                    </div>
                    <br />
                    <div className="output-card">
                      {assetRemove4 &&
                        removeInput4 &&
                        formatFromWei(getRemOneOutputToken())}{' '}
                      {assetRemove3?.symbol}
                    </div>
                    <div className="output-card">
                      {assetRemove4 &&
                        removeInput4 &&
                        formatFromWei(getRemOneOutputBase())}{' '}
                      SPARTA
                    </div>
                    <br />
                    <div className="output-card">
                      {formatFromWei(getRemoveOneSwapInput())}{' '}
                      {assetRemove4?.symbol === 'SPARTA'
                        ? assetRemove3?.symbol
                        : 'SPARTA'}{' '}
                      to {formatFromWei(getRemoveOneSwapOutput())}{' '}
                      {assetRemove4?.symbol === 'SPARTA'
                        ? 'SPARTA'
                        : assetRemove3?.symbol}
                    </div>
                    <div className="output-card">
                      inc slip fee: {formatFromWei(getRemoveOneSwapFee())}{' '}
                      SPARTA
                    </div>
                    <br />
                    <div className="subtitle-amount">
                      {poolFactory.finalArray &&
                        formatFromWei(getRemoveOneFinalOutput())}{' '}
                      {assetRemove4?.symbol}
                    </div>
                    <br />
                    <br />
                  </Col>
                </Row>
                <br />
                <Button
                  color="primary"
                  size="lg"
                  onClick={() =>
                    dispatch(
                      routerRemoveLiqAsym(
                        convertToWei(BN(removeInput4?.value)),
                        assetRemove4?.symbol === 'SPARTA',
                        assetRemove3?.tokenAddress,
                      ),
                    )
                  }
                  block
                >
                  Redeem LP Tokens
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
                    asymmetric remove! Assets will be removed equally from the
                    pool like usual, however 100% of the non-preferred asset
                    will be swapped into your preferred asset. This is subject
                    to the usual swap fees!
                  </span>
                </UncontrolledAlert>
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
          <Col md={12}>
            <Card className="card-body">
              {poolFactory.finalArray && (
                <RecentTxns
                  contract={getRouterContract()}
                  walletAddr={wallet.account}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Liquidity
