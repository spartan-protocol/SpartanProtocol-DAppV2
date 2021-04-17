/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import classnames from 'classnames'
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import MaxBadge from '../../../assets/icons/max.svg'
import { usePoolFactory } from '../../../store/poolFactory'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromWei,
} from '../../../utils/bigNumber'
import {
  calcLiquidityUnits,
  calcLiquidityUnitsAsym,
  calcSwapFee,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import { routerAddLiq, routerAddLiqAsym } from '../../../store/router/actions'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import { getPoolContract } from '../../../utils/web3Pool'
import Approval from '../../../components/Approval/Approval'

const AddLiquidity = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('addTab1')
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [poolAdd1, setPoolAdd1] = useState('...')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray && activeTab === 'addTab1') {
        window.localStorage.setItem('assetType1', 'token')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'pool')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 = { tokenAddress: addr.sparta }
        asset3 =
          asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset2 = getItemFromArray(asset2, poolFactory.finalArray)
        asset3 = getItemFromArray(asset3, poolFactory.finalArray)

        setAssetAdd1(asset1)
        setAssetAdd2(asset2)
        setPoolAdd1(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      } else if (finalArray && activeTab === 'addTab2') {
        window.localStorage.setItem('assetType1', 'token')
        window.localStorage.setItem('assetType3', 'pool')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))

        asset1 = asset1 || { tokenAddress: addr.bnb }
        asset3 =
          asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset3 = getItemFromArray(asset3, poolFactory.finalArray)

        setAssetAdd1(asset1)
        setPoolAdd1(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected2'),
    activeTab,
  ])

  const addInput1 = document.getElementById('addInput1')
  const addInput2 = document.getElementById('addInput2')
  const addInput3 = document.getElementById('addInput3')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const clearInputs = () => {
    addInput1.value = '0'
    addInput2.value = '0'
    addInput3.value = '0'
  }

  //= =================================================================================//
  // 'Add Both' Functions (Re-Factor)

  const getAddBothOutputLP = () => {
    if (addInput1 && addInput2 && assetAdd1) {
      return convertFromWei(
        calcLiquidityUnits(
          convertToWei(addInput2?.value),
          convertToWei(addInput1?.value),
          assetAdd1?.baseAmount,
          assetAdd1?.tokenAmount,
          assetAdd1?.poolUnits,
        ),
      )
    }
    return '0'
  }

  //= =================================================================================//
  // 'Add Single' Functions (Re-Factor)

  const getAddSingleOutputLP = () => {
    if (addInput1 && assetAdd1) {
      return convertFromWei(
        calcLiquidityUnitsAsym(
          convertToWei(addInput1?.value),
          assetAdd1.tokenAddress === addr.sparta
            ? poolAdd1?.baseAmount
            : poolAdd1?.tokenAmount,
          poolAdd1?.poolUnits,
        ),
      )
    }
    return '0'
  }

  const getAddSingleSwapFee = () => {
    if (addInput1 && assetAdd1) {
      const swapFee = calcSwapFee(
        convertToWei(BN(addInput1?.value).div(2)),
        poolAdd1.tokenAmount,
        poolAdd1.baseAmount,
        assetAdd1.symbol !== 'SPARTA',
      )
      return swapFee
    }
    return '0'
  }

  //= =================================================================================//
  // General Functions

  const handleInputChange = (input, toBase) => {
    if (toBase && addInput1 && addInput2) {
      addInput2.value = calcValueInBase(
        assetAdd1.tokenAmount,
        assetAdd1.baseAmount,
        input,
      )
    } else if (addInput1 && addInput2) {
      addInput1.value = calcValueInToken(
        assetAdd1.tokenAmount,
        assetAdd1.baseAmount,
        input,
      )
    }
    if (activeTab === 'addTab1' && addInput1 && addInput2 && addInput3) {
      addInput3.value = getAddBothOutputLP()
    }
    if (activeTab === 'addTab2' && addInput1 && addInput3) {
      addInput3.value = getAddSingleOutputLP()
    }
  }

  useEffect(() => {
    if (activeTab === 'addTab1') {
      if (
        document.activeElement.id === 'addInput2' &&
        addInput2?.value !== ''
      ) {
        handleInputChange(addInput2?.value, false)
      } else if (
        (addInput1 && addInput2 && addInput1?.value === '') ||
        (addInput1 && addInput2 && addInput2?.value === '')
      ) {
        addInput1.value = '0'
        addInput2.value = '0'
      } else {
        handleInputChange(addInput1?.value, true)
      }
    }

    if (activeTab === 'addTab2') {
      if (addInput1?.value !== '') {
        handleInputChange()
      } else {
        addInput1.value = '0'
        handleInputChange()
      }
      if (addInput2) {
        addInput2.value = '0'
      }
    }
  }, [addInput1?.value, addInput2?.value, assetAdd1, assetAdd2, activeTab])

  return (
    <>
      <Row>
        <Card>
          <CardBody>
            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'addTab1' })}
                  onClick={() => {
                    toggle('addTab1')
                  }}
                >
                  <span className="d-none d-sm-block">Add Both</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'addTab2' })}
                  onClick={() => {
                    toggle('addTab2')
                  }}
                >
                  <span className="d-none d-sm-block">Add Single</span>
                </NavLink>
              </NavItem>
            </Nav>
            <Row>
              <Col md={12}>
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <Row>
                    <Col xs="4" className="">
                      <div className="title-card">Input {assetAdd1.symbol}</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">
                        Balance: {formatFromWei(assetAdd1.balanceTokens)}{' '}
                        <img src={MaxBadge} alt="Max Button" />
                      </div>
                    </Col>
                  </Row>

                  <Row className="my-3 input-pane">
                    <Col xs="6">
                      <div className="output-card">
                        <AssetSelect
                          priority="1"
                          filter={['token']}
                          blackList={[
                            activeTab === 'addTab1' ? addr.sparta : '',
                          ]}
                        />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <InputGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="addInput1"
                        />
                        <InputGroupAddon
                          addonType="append"
                          role="button"
                          tabIndex={-1}
                          onKeyPress={() => clearInputs()}
                          onClick={() => clearInputs()}
                        >
                          <i className="icon-search-bar icon-close icon-light my-auto" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>

                  {activeTab === 'addTab1' && (
                    <>
                      <Row className="my-2">
                        <Col xs="4" className="">
                          <div className="title-card">Input SPARTA</div>
                        </Col>
                        <Col xs="8" className="text-right">
                          <div className="title-card">
                            Balance: {formatFromWei(assetAdd2.balanceTokens)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="input-pane">
                        <Col xs="6">
                          <div className="output-card">
                            <AssetSelect
                              priority="2"
                              filter={['token']}
                              whiteList={[addr.sparta]}
                              disabled={activeTab === 'addTab1'}
                            />
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <InputGroup className="h-100">
                            <Input
                              className="text-right h-100 ml-0"
                              type="text"
                              placeholder="0"
                              id="addInput2"
                            />
                            <InputGroupAddon
                              addonType="append"
                              role="button"
                              tabIndex={-1}
                              onKeyPress={() => clearInputs()}
                              onClick={() => clearInputs()}
                            >
                              <i className="icon-search-bar icon-close icon-light my-auto" />
                            </InputGroupAddon>
                          </InputGroup>
                        </Col>
                      </Row>
                    </>
                  )}
                </Card>

                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <Row>
                    <Col xs="4" className="">
                      <div className="title-card">Pool</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">
                        Balance: {formatFromWei(poolAdd1.balanceLPs)}{' '}
                        {poolAdd1?.symbol}-SPP
                      </div>
                    </Col>
                  </Row>

                  <Row className="my-3 input-pane">
                    <Col xs="6">
                      <div className="output-card">
                        <AssetSelect
                          priority="3"
                          filter={['pool']}
                          disabled={
                            activeTab === 'addTab1' ||
                            assetAdd1.tokenAddress !== addr.sparta
                          }
                        />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <InputGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="addInput3"
                          disabled
                        />
                        <InputGroupAddon
                          addonType="append"
                          role="button"
                          tabIndex={-1}
                          onKeyPress={() => clearInputs()}
                          onClick={() => clearInputs()}
                        >
                          <i className="icon-search-bar icon-close icon-light my-auto" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                </Card>

                <Row className="mb-2">
                  <Col xs="4" className="">
                    <div className="title-card">Add Liq</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div className="title-card">
                      {addInput1?.value} {assetAdd1?.symbol}
                    </div>
                    {activeTab === 'addTab1' && (
                      <div className="title-card">
                        {addInput2?.value} {assetAdd2?.symbol}
                      </div>
                    )}
                  </Col>
                </Row>

                {activeTab === 'addTab2' && (
                  <Row className="mb-2">
                    <Col xs="4" className="">
                      <div className="title-card">Fee</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">
                        {assetAdd1 && formatFromWei(getAddSingleSwapFee())}{' '}
                        SPARTA
                      </div>
                    </Col>
                  </Row>
                )}

                <Row className="mb-2">
                  <Col xs="4" className="">
                    <div className="title-card">Output</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div className="title-card">
                      {addInput3?.value} {poolAdd1?.symbol}-SPP
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="text-center">
              <Col xs="12" sm="4">
                {assetAdd1?.tokenAddress &&
                  assetAdd1?.tokenAddress !== addr.bnb &&
                  wallet?.account &&
                  addInput1?.value && (
                    <Approval
                      tokenAddress={assetAdd1?.tokenAddress}
                      symbol={assetAdd1?.symbol}
                      walletAddress={wallet?.account}
                      contractAddress={addr.router}
                      txnAmount={convertToWei(addInput1?.value)}
                    />
                  )}
              </Col>
              <Col xs="12" sm="4">
                <Button
                  className="w-100 h-100 btn-primary"
                  onClick={() =>
                    activeTab === 'addTab1'
                      ? dispatch(
                          routerAddLiq(
                            convertToWei(addInput2.value),
                            convertToWei(addInput1.value),
                            assetAdd1.tokenAddress,
                          ),
                        )
                      : dispatch(
                          routerAddLiqAsym(
                            convertToWei(addInput1.value),
                            assetAdd1.tokenAddress === addr.sparta,
                            poolAdd1.tokenAddress,
                          ),
                        )
                  }
                >
                  Join Pool
                </Button>
              </Col>
              <Col xs="12" sm="4">
                {assetAdd2?.tokenAddress &&
                  assetAdd2?.tokenAddress !== addr.bnb &&
                  wallet?.account &&
                  addInput2?.value && (
                    <Approval
                      tokenAddress={assetAdd2?.tokenAddress}
                      symbol={assetAdd2?.symbol}
                      walletAddress={wallet?.account}
                      contractAddress={addr.router}
                      txnAmount={convertToWei(addInput2?.value)}
                    />
                  )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Row>
      <Row>
        <Col xs="12">
          <SwapPair
            assetSwap={poolAdd1}
            finalLpArray={poolFactory.finalLpArray}
            web3={web3}
          />
        </Col>
        <Col xs="12">
          <RecentTxns
            contracts={poolFactory.finalArray
              ?.filter((asset) => asset.symbol !== 'SPARTA')
              .map((asset) => getPoolContract(asset.poolAddress))}
          />
        </Col>
      </Row>
    </>
  )
}

export default AddLiquidity
