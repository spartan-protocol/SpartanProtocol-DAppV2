/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import classnames from 'classnames'
import {
  Button,
  Card,
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
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { usePool } from '../../../store/pool'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../../utils/bigNumber'
import {
  calcLiquidityHoldings,
  calcSwapFee,
  calcSwapOutput,
  calcValueInBase,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import {
  routerRemoveLiq,
  routerRemoveLiqAsym,
} from '../../../store/router/actions'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const RemoveLiquidity = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('1')
  const [assetRemove1, setAssetRemove1] = useState('...')
  const [assetRemove2, setAssetRemove2] = useState('...')
  const [poolRemove1, setPoolRemove1] = useState('...')

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails.length > 0 && activeTab === '1') {
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

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset2 = getItemFromArray(asset2, pool.poolDetails)
        asset3 = getItemFromArray(asset3, pool.poolDetails)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)
        setAssetRemove2(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      } else if (poolDetails && activeTab === '2') {
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

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset2 = getItemFromArray(asset2, pool.poolDetails)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
  }, [
    pool.poolDetails,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected2'),
    window.localStorage.getItem('assetSelected3'),
    activeTab,
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const removeInput1 = document.getElementById('removeInput1')
  const removeInput2 = document.getElementById('removeInput2')
  const removeInput3 = document.getElementById('removeInput3')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const clearInputs = (focusAfter) => {
    if (removeInput1) {
      removeInput1.value = ''
    }
    if (removeInput2) {
      removeInput2.value = ''
    }
    if (removeInput3) {
      removeInput3.value = ''
    }
    if (focusAfter === 1) {
      removeInput1.focus()
    }
    if (focusAfter === 2) {
      removeInput2.focus()
    }
  }

  const getBalance = (asset) => {
    if (asset === 1) {
      return poolRemove1?.balance
    }
    if (asset === 2) {
      return getToken(assetRemove1?.tokenAddress)?.balance
    }
    if (asset === 3) {
      return getToken(assetRemove2?.tokenAddress)?.balance
    }
    return poolRemove1?.balance
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
    return '0.00'
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
    return '0.00'
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
    return '0.00'
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
    return '0.00'
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
    return '0.00'
  }

  //= =================================================================================//
  // General Functions

  const getOutput1ValueUSD = () => {
    if (assetRemove1 && removeInput2?.value) {
      return calcValueInBase(
        poolRemove1.tokenAmount,
        poolRemove1.baseAmount,
        convertToWei(removeInput2.value),
      ).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getOutput2ValueUSD = () => {
    if (assetRemove2 && removeInput3?.value) {
      return BN(convertToWei(removeInput3.value)).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        poolRemove1.baseAmount,
        convertToWei(removeInput1.value),
        poolRemove1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        poolRemove1.tokenAmount,
        convertToWei(removeInput1.value),
        poolRemove1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetRemove1 && removeInput1?.value) {
      return BN(
        calcValueInBase(
          poolRemove1?.tokenAmount,
          poolRemove1?.baseAmount,
          getLpValueToken(),
        ),
      )
        .plus(getLpValueBase())
        .times(web3.spartaPrice)
    }

    return '0.00'
  }

  const handleInputChange = () => {
    if (activeTab === '1') {
      if (removeInput1?.value && removeInput2 && removeInput3) {
        removeInput2.value = getRemoveTokenOutput()
        removeInput3.value = getRemoveSpartaOutput()
      }
    } else if (activeTab === '2') {
      if (removeInput1?.value) {
        removeInput2.value = convertFromWei(getRemoveOneFinalOutput())
      }
    }
  }

  useEffect(() => {
    handleInputChange()
  }, [
    removeInput1?.value,
    removeInput2?.value,
    assetRemove1,
    assetRemove2,
    poolRemove1,
    activeTab,
  ])

  return (
    <>
      <Row className="justify-content-center">
        <Card className="card-body" style={{ maxWidth: '480px' }}>
          <Row>
            <Col md={12}>
              <Card
                style={{ backgroundColor: '#25212D' }}
                className="card-body"
              >
                <Row>
                  <Col xs="4" className="">
                    <div className="">Pool</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div
                      role="button"
                      onClick={() => {
                        clearInputs(1)
                        removeInput1.value = convertFromWei(getBalance(1))
                      }}
                    >
                      Balance:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(1))}
                    </div>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col xs="6">
                    <div className="output-card ml-2">
                      <AssetSelect priority="1" filter={['pool']} />
                    </div>
                  </Col>
                  <Col className="text-right" xs="6">
                    <InputGroup className="">
                      <Input
                        className="text-right ml-0"
                        type="text"
                        placeholder="0.00"
                        id="removeInput1"
                      />
                      <InputGroupAddon
                        addonType="append"
                        role="button"
                        tabIndex={-1}
                        onKeyPress={() => clearInputs(1)}
                        onClick={() => clearInputs(1)}
                      >
                        <i className="icon-search-bar icon-close icon-light my-auto" />
                      </InputGroupAddon>
                    </InputGroup>
                    <div className="text-right">
                      ~$
                      {removeInput1?.value
                        ? formatFromWei(getLpValueUSD(), 2)
                        : '0.00'}
                    </div>
                  </Col>
                </Row>
              </Card>
              <Nav pills className="nav-tabs-custom  mt-2 mb-4">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                    Remove Both
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    Remove Single
                  </NavLink>
                </NavItem>
              </Nav>
              <Card
                style={{ backgroundColor: '#25212D' }}
                className="card-body mb-0"
              >
                <Row>
                  <Col xs="4" className="">
                    <div className="">Output</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div className="">
                      Balance:{' '}
                      {pool.tokenDetails && formatFromWei(getBalance(2))}
                    </div>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col xs="6">
                    <div className="output-card ml-2">
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
                    <InputGroup className="">
                      <Input
                        className="text-right ml-0"
                        type="text"
                        placeholder="0.00"
                        id="removeInput2"
                        disabled
                      />
                    </InputGroup>
                    <div className="text-right">
                      ~$
                      {removeInput2?.value
                        ? formatFromWei(getOutput1ValueUSD(), 2)
                        : '0.00'}
                    </div>
                  </Col>
                </Row>

                {activeTab === '1' && (
                  <>
                    <hr className="m-1" />
                    <Row className="my-2">
                      <Col xs="4" className="">
                        <div className="">Output</div>
                      </Col>
                      <Col xs="8" className="text-right">
                        <div className="">
                          Balance:{' '}
                          {pool.tokenDetails &&
                            formatFromWei(getBalance(3))}
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col xs="6">
                        <div className="output-card ml-2">
                          <AssetSelect
                            priority="3"
                            filter={['token']}
                            whiteList={[addr.sparta]}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col className="text-right" xs="6">
                        <InputGroup className="">
                          <Input
                            className="text-right ml-0"
                            type="text"
                            placeholder="0.00"
                            id="removeInput3"
                            disabled
                          />
                        </InputGroup>
                        <div className="text-right">
                          ~$
                          {removeInput3?.value
                            ? formatFromWei(getOutput2ValueUSD(), 2)
                            : '0.00'}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>

              {pool.poolDetails && (
                <>
                  <div className="card-body">
                    <Row className="mb-2">
                      <Col xs="auto">
                        <div className="title-card">Input</div>
                      </Col>
                      <Col className="text-right">
                        <div className="">
                          {removeInput1?.value > 0
                            ? formatFromUnits(removeInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(poolRemove1?.tokenAddress)?.symbol}-SPP
                        </div>
                      </Col>
                    </Row>

                    {activeTab === '2' && (
                      <Row className="mb-2">
                        <Col xs="4" className="">
                          <div className="title-card">Fee</div>
                        </Col>
                        <Col xs="8" className="text-right">
                          <div className="">
                            {getRemoveOneSwapFee() > 0
                              ? formatFromWei(getRemoveOneSwapFee())
                              : '0.00'}{' '}
                            SPARTA
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row className="mb-2">
                      <Col xs="auto">
                        {activeTab === '1' && (
                          <div className="title-card mt-2">Output</div>
                        )}
                        {activeTab === '2' && (
                          <div className="title-card">Output</div>
                        )}
                      </Col>
                      <Col className="text-right">
                        <div className="">
                          {removeInput2?.value > 0
                            ? formatFromUnits(removeInput2?.value, 6)
                            : '0.00'}{' '}
                          {getToken(poolRemove1?.tokenAddress)?.symbol}
                        </div>
                        {activeTab === '1' && (
                          <div className="">
                            {removeInput3?.value > 0
                              ? formatFromUnits(removeInput3?.value, 6)
                              : '0.00'}{' '}
                            SPARTA
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </>
              )}

              {!pool.poolDetails && (
                <HelmetLoading height="150px" width="150px" />
              )}
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Button
                className="w-75 h-100 btn-primary"
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
          </Row>
        </Card>
      </Row>
      {pool.poolDetails && (
        <Row>
          <Col xs="12">
            <SwapPair assetSwap={poolRemove1} />
          </Col>
        </Row>
      )}
    </>
  )
}

export default RemoveLiquidity
