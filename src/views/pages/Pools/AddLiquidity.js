/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import classnames from 'classnames'
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import ShareIcon from '../../../assets/icons/new.svg'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import MaxBadge from '../../../assets/icons/max.svg'
import { usePoolFactory } from '../../../store/poolFactory'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import {
  convertFromWei,
  convertToWei,
  formatFromWei,
} from '../../../utils/bigNumber'
import {
  calcLiquidityUnits,
  calcLiquidityUnitsAsym,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import { routerAddLiq, routerAddLiqAsym } from '../../../store/router/actions'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import { getPoolContract } from '../../../utils/web3Pool'

const AddLiquidity = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('1')
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [poolAdd1, setPoolAdd1] = useState('...')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray && activeTab === '1') {
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
      } else if (finalArray && activeTab === '2') {
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
    if (activeTab === '1' && addInput1 && addInput2 && addInput3) {
      addInput3.value = getAddBothOutputLP()
    }
    if (activeTab === '2' && addInput1 && addInput3) {
      addInput3.value = getAddSingleOutputLP()
    }
  }

  useEffect(() => {
    if (activeTab === '1') {
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

    if (activeTab === '2') {
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
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  <span className="d-none d-sm-block">Add Both</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  <span className="d-none d-sm-block">Add Single</span>
                </NavLink>
              </NavItem>
            </Nav>

            <Row>
              <Col className="card-body">
                {' '}
                <img
                  src={ShareIcon}
                  alt="share icon"
                  style={{
                    height: '19px',
                    verticalAlign: 'bottom',
                    marginRight: '5px',
                  }}
                />{' '}
                You can now swap your BEP20 tokens, LP tokens & Synths
              </Col>
            </Row>
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
                          blackList={[activeTab === '1' ? addr.sparta : '']}
                        />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <FormGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="addInput1"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {activeTab === '1' && (
                    <>
                      <Row className="my-3 input-pane">
                        <Col xs="6">
                          <div className="output-card">
                            <AssetSelect
                              priority="2"
                              filter={['token']}
                              whiteList={[addr.sparta]}
                              disabled={activeTab === '1'}
                            />
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <FormGroup className="h-100">
                            <Input
                              className="text-right h-100 ml-0"
                              type="text"
                              placeholder="0"
                              id="addInput2"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="4" className="">
                          <div className="title-card">Input SPARTA</div>
                        </Col>
                        <Col xs="8" className="text-right">
                          <div className="title-card">
                            Balance: {formatFromWei(assetAdd2.balanceTokens)}
                          </div>
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
                            activeTab === '1' ||
                            assetAdd1.tokenAddress !== addr.sparta
                          }
                        />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <FormGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="addInput3"
                          disabled
                        />
                      </FormGroup>
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
                    {activeTab === '1' && (
                      <div className="title-card">
                        {addInput2?.value} {assetAdd2?.symbol}
                      </div>
                    )}
                  </Col>
                </Row>

                {activeTab === '2' && (
                  <Row className="mb-2">
                    <Col xs="4" className="">
                      <div className="title-card">Fee</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">###.## SPARTA</div>
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
                <Button className="w-100 h-100">Approve TOKEN1</Button>
              </Col>
              <Col xs="12" sm="4">
                <Button className="w-100 h-100">Approve TOKEN2</Button>
              </Col>
              <Col xs="12" sm="4">
                <Button
                  className="w-100 h-100 btn-primary"
                  onClick={() =>
                    activeTab === '1'
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
