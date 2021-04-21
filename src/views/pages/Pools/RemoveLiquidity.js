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
import { AssetSelect } from '../../../components/AssetSelect/AssetSelect'
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
  calcLiquidityHoldings,
  calcSwapFee,
  calcSwapOutput,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import {
  routerRemoveLiq,
  routerRemoveLiqAsym,
} from '../../../store/router/actions'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import { getPoolContract } from '../../../utils/web3Pool'

const AddLiquidity = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('1')
  const [assetRemove1, setAssetRemove1] = useState('...')
  const [assetRemove2, setAssetRemove2] = useState('...')
  const [poolRemove1, setPoolRemove1] = useState('...')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray && activeTab === '1') {
        window.localStorage.setItem('assetType1', 'pool')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'token')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 =
          asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset3 = { tokenAddress: addr.sparta }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset2 = getItemFromArray(asset2, poolFactory.finalArray)
        asset3 = getItemFromArray(asset3, poolFactory.finalArray)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)
        setAssetRemove2(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      } else if (finalArray && activeTab === '2') {
        window.localStorage.setItem('assetType1', 'pool')
        window.localStorage.setItem('assetType2', 'token')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 =
          asset2.tokenAddress === asset1.tokenAddress ||
          asset2.tokenAddress === addr.sparta
            ? asset2
            : { tokenAddress: addr.sparta }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)
        asset2 = getItemFromArray(asset2, poolFactory.finalArray)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected2'),
    window.localStorage.getItem('assetSelected3'),
    activeTab,
  ])

  const removeInput1 = document.getElementById('removeInput1')
  const removeInput2 = document.getElementById('removeInput2')
  const removeInput3 = document.getElementById('removeInput3')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const clearInputs = () => {
    if (removeInput1) {
      removeInput1.value = '0'
    }
    if (removeInput2) {
      removeInput2.value = '0'
    }
    if (removeInput3) {
      removeInput3.value = '0'
    }
  }

  //= =================================================================================//
  // 'Remove Both' Functions (Re-Factor to just getOutput)

  const getRemoveTokenOutput = () => {
    if (removeInput1 && removeInput2 && poolRemove1) {
      return convertFromWei(
        calcLiquidityHoldings(
          poolRemove1?.tokenAmount,
          convertToWei(removeInput1?.value),
          poolRemove1?.poolUnits,
        ),
      )
    }
    return '0'
  }

  const getRemoveSpartaOutput = () => {
    if (removeInput1 && removeInput2 && poolRemove1) {
      return convertFromWei(
        calcLiquidityHoldings(
          poolRemove1?.baseAmount,
          convertToWei(removeInput1?.value),
          poolRemove1?.poolUnits,
        ),
      )
    }
    return '0'
  }

  //= =================================================================================//
  // 'Remove Single' Functions (Re-Factor)

  const getRemoveOneSwapFee = () => {
    if (removeInput1 && assetRemove1) {
      const swapFee = calcSwapFee(
        assetRemove1?.tokenAddress === addr.sparta
          ? convertToWei(getRemoveTokenOutput())
          : convertToWei(getRemoveSpartaOutput()),
        BN(poolRemove1?.tokenAmount).minus(
          convertToWei(getRemoveTokenOutput()),
        ),
        BN(poolRemove1?.baseAmount).minus(
          convertToWei(getRemoveSpartaOutput()),
        ),
        assetRemove1?.tokenAddress === addr.sparta,
      )
      return swapFee
    }
    return '0'
  }

  const getRemoveOneSwapOutput = () => {
    if (removeInput1 && assetRemove1) {
      return calcSwapOutput(
        assetRemove1?.tokenAddress === addr.sparta
          ? convertToWei(getRemoveTokenOutput())
          : convertToWei(getRemoveSpartaOutput()),
        BN(poolRemove1?.tokenAmount).minus(
          convertToWei(getRemoveTokenOutput()),
        ),
        BN(poolRemove1?.baseAmount).minus(
          convertToWei(getRemoveSpartaOutput()),
        ),
        assetRemove1?.tokenAddress === addr.sparta,
      )
    }
    return '0'
  }

  const getRemoveOneFinalOutput = () => {
    if (removeInput1 && assetRemove1) {
      const result = BN(getRemoveOneSwapOutput()).plus(
        assetRemove1?.tokenAddress === addr.sparta
          ? BN(convertToWei(getRemoveSpartaOutput()))
          : BN(convertToWei(getRemoveTokenOutput())),
      )
      return result
    }
    return '0'
  }

  //= =================================================================================//
  // General Functions

  const handleInputChange = () => {
    if (activeTab === '1' && removeInput1 && removeInput2 && removeInput3) {
      removeInput2.value = getRemoveTokenOutput()
      removeInput3.value = getRemoveSpartaOutput()
    }
    if (activeTab === '2' && removeInput1 && removeInput2) {
      removeInput2.value = convertFromWei(getRemoveOneFinalOutput())
    }
  }

  useEffect(() => {
    if (activeTab === '1') {
      if (
        document.activeElement.id === 'removeInput2' &&
        removeInput2?.value !== ''
      ) {
        handleInputChange(removeInput2?.value, false)
      } else if (
        (removeInput1 && removeInput2 && removeInput1?.value === '') ||
        (removeInput1 && removeInput2 && removeInput2?.value === '')
      ) {
        removeInput1.value = '0'
        removeInput2.value = '0'
      } else {
        handleInputChange(removeInput1?.value, true)
      }
    }

    if (activeTab === '2') {
      if (removeInput1?.value !== '') {
        handleInputChange()
      } else {
        removeInput1.value = '0'
        handleInputChange()
      }
    }
  }, [
    removeInput1?.value,
    removeInput2?.value,
    assetRemove1,
    assetRemove2,
    activeTab,
  ])

  return (
    <>
      <Row>
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
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
                        Balance: {formatFromWei(poolRemove1.balanceLPs)}{' '}
                        {poolRemove1?.symbol}-SPP
                      </div>
                    </Col>
                  </Row>

                  <Row className="my-3 input-pane">
                    <Col xs="6">
                      <div className="output-card">
                        <AssetSelect priority="1" filter={['pool']} />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <InputGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="removeInput1"
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
                <Nav tabs className="nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => {
                        toggle('1')
                      }}
                    >
                      <span className="d-none d-sm-block">Remove Both</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => {
                        toggle('2')
                      }}
                    >
                      <span className="d-none d-sm-block">Remove Single</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <Row>
                    <Col xs="4" className="">
                      <div className="title-card">
                        Output {assetRemove1.symbol}
                      </div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">
                        Balance: {formatFromWei(assetRemove1.balanceTokens)}{' '}
                        <img src={MaxBadge} alt="Max Button" />
                      </div>
                    </Col>
                  </Row>

                  <Row className="my-3 input-pane">
                    <Col xs="6">
                      <div className="output-card">
                        <AssetSelect
                          priority="2"
                          filter={['token']}
                          blackList={[activeTab === '1' ? addr.sparta : '']}
                          whiteList={
                            activeTab === '2'
                              ? [addr.sparta, poolRemove1.tokenAddress]
                              : ['']
                          }
                          disabled={activeTab === '1'}
                        />
                      </div>
                    </Col>
                    <Col className="text-right" xs="6">
                      <InputGroup className="h-100">
                        <Input
                          className="text-right h-100 ml-0"
                          type="text"
                          placeholder="0"
                          id="removeInput2"
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

                  {activeTab === '1' && (
                    <>
                      <Row className="my-2">
                        <Col xs="4" className="">
                          <div className="title-card">Output SPARTA</div>
                        </Col>
                        <Col xs="8" className="text-right">
                          <div className="title-card">
                            Balance: {formatFromWei(assetRemove2.balanceTokens)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="input-pane">
                        <Col xs="6">
                          <div className="output-card">
                            <AssetSelect
                              priority="3"
                              filter={['token']}
                              whiteList={[addr.sparta]}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <InputGroup className="h-100">
                            <Input
                              className="text-right h-100 ml-0"
                              type="text"
                              placeholder="0"
                              id="removeInput3"
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
                    </>
                  )}
                </Card>

                <Row className="mb-2">
                  <Col xs="4" className="">
                    <div className="title-card">Remove Liq</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div className="title-card">
                      ~{removeInput1?.value} {poolRemove1?.symbol}-SPP
                    </div>
                  </Col>
                </Row>

                {activeTab === '2' && (
                  <Row className="mb-2">
                    <Col xs="4" className="">
                      <div className="title-card">Fee</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="title-card">
                        {formatFromWei(getRemoveOneSwapFee())} SPARTA
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
                      ~{removeInput2?.value} {assetRemove1?.symbol}
                    </div>
                    {activeTab === '1' && (
                      <div className="title-card">
                        ~{removeInput3?.value} SPARTA
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="text-center">
              <Col xs="12" sm="4" />
              <Col xs="12" sm="4">
                <Button
                  className="w-100 h-100 btn-primary"
                  onClick={() =>
                    activeTab === '1'
                      ? dispatch(
                          routerRemoveLiq(
                            convertToWei(removeInput1.value),
                            poolRemove1.tokenAddress,
                          ),
                        )
                      : dispatch(
                          routerRemoveLiqAsym(
                            convertToWei(removeInput1.value),
                            assetRemove1.tokenAddress === addr.sparta,
                            poolRemove1.tokenAddress,
                          ),
                        )
                  }
                >
                  Remove Liq
                </Button>
              </Col>
              <Col xs="12" sm="4" />
            </Row>
          </CardBody>
        </Card>
      </Row>
      <Row>
        <Col xs="12">
          <SwapPair
            assetSwap={poolRemove1}
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
