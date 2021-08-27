/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Card,
  Col,
  Nav,
  Row,
  InputGroup,
  FormControl,
  Button,
  Badge,
} from 'react-bootstrap'
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
  calcSpotValueInBase,
  getTimeUntil,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import {
  removeLiquidityExact,
  removeLiquiditySingle,
} from '../../../store/router/actions'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import Approval from '../../../components/Approval/Approval'
import { useSparta } from '../../../store/sparta'
import { Icon } from '../../../components/Icons/icons'
import { removeLiq, removeLiqAsym } from '../../../utils/web3Router'

const LiqRemove = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const wallet = useWallet()
  const sparta = useSparta()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const [assetRemove1, setAssetRemove1] = useState('...')
  const [assetRemove2, setAssetRemove2] = useState('...')
  const [poolRemove1, setPoolRemove1] = useState('...')
  const [output1, setoutput1] = useState('0.00')
  const [output2, setoutput2] = useState('0.00')

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails.length > 0 && activeTab === '1') {
        window.localStorage.setItem('assetType1', 'pool')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'token')

        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
        let asset3 = tryParse(window.localStorage.getItem('assetSelected3'))

        asset1 =
          asset1 &&
          asset1.tokenAddress !== addr.spartav2 &&
          pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 =
          asset1.tokenAddress !== addr.spartav2
            ? asset1
            : { tokenAddress: addr.bnb }
        asset3 = { tokenAddress: addr.spartav2 }

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

        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))

        asset1 =
          asset1 &&
          asset1.tokenAddress !== addr.spartav2 &&
          pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 = pool.poolDetails.find(
          (x) => x.tokenAddress === asset2.tokenAddress,
        )
          ? asset2
          : { tokenAddress: addr.spartav2 }
        asset2 =
          asset2.tokenAddress === asset1.tokenAddress ||
          asset2.tokenAddress === addr.spartav2
            ? asset2
            : { tokenAddress: addr.spartav2 }

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

  const clearInputs = (focusAfter) => {
    setoutput1('0.00')
    setoutput2('0.00')
    if (removeInput1) {
      removeInput1.value = ''
    }
    if (removeInput2) {
      removeInput2.value = ''
    }
    if (focusAfter === 1) {
      removeInput1.focus()
    }
    if (focusAfter === 2) {
      removeInput2.focus()
    }
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
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

  const getTimeNew = () => {
    const timeStamp = BN(poolRemove1?.genesis).plus(604800)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Remove Liquidity Txn Details

  /**
   * Get remove liquidity equal (sym) txn details
   * @returns spartaOutput @returns tokenOutput
   */
  const getRemLiq = () => {
    if (removeInput1 && poolRemove1 && activeTab === '1') {
      const [spartaOutput, tokenOutput] = removeLiq(
        convertToWei(removeInput1.value),
        poolRemove1,
        sparta.globalDetails.feeOnTransfer,
      )
      return [spartaOutput, tokenOutput]
    }
    return ['0.00', '0.00']
  }

  /**
   * Get remove liquidity one-sided (asym) txn details
   * @returns tokensOut @returns swapFee
   */
  const getRemLiqAsym = () => {
    if (removeInput1 && assetRemove1 && activeTab === '2') {
      const [tokensOut, swapFee] = removeLiqAsym(
        convertToWei(removeInput1.value),
        poolRemove1,
        assetRemove1.tokenAddress === addr.spartav2,
        sparta.globalDetails.feeOnTransfer,
      )
      return [tokensOut, swapFee]
    }
    return ['0.00', '0.00']
  }

  //= =================================================================================//
  // Remove liquidity get-value-of functions

  const getOutput1ValueUSD = () => {
    if (assetRemove1 && output1) {
      if (assetRemove1.tokenAddress === addr.spartav2) {
        return output1.times(web3.spartaPrice)
      }
      return calcSpotValueInBase(output1, poolRemove1).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        convertToWei(removeInput1.value),
        poolRemove1,
      )[0]
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        convertToWei(removeInput1.value),
        poolRemove1,
      )[1]
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetRemove1 && removeInput1?.value) {
      return BN(calcSpotValueInBase(getLpValueToken(), poolRemove1))
        .plus(getLpValueBase())
        .times(web3.spartaPrice)
    }
    return '0.00'
  }

  //= =================================================================================//
  // Handlers

  const handleInputChange = () => {
    if (activeTab === '1') {
      if (removeInput1?.value) {
        setoutput1(getRemLiq()[1])
        setoutput2(getRemLiq()[0])
      }
    }
    if (activeTab === '2') {
      if (removeInput1?.value && document.getElementById('removeInput2')) {
        document.getElementById('removeInput2').value = convertFromWei(
          getRemLiqAsym()[0],
        )
        setoutput1(getRemLiqAsym()[0])
      }
    }
  }

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleInputChange()
  }, [removeInput1?.value, assetRemove1, assetRemove2, poolRemove1, activeTab])

  return (
    <Row>
      <Col xs="auto">
        <Card xs="auto" className="card-480">
          <Card.Header className="p-0 border-0 mb-3">
            <Nav activeKey={activeTab} fill className="rounded-top">
              <Nav.Item key="addTab1" className="rounded-top">
                <Nav.Link
                  className="rounded-top"
                  eventKey="1"
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  {t('removeBoth')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className="rounded-top"
                  eventKey="2"
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  {t('removeSingle')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs="12" className="px-1 px-sm-3">
                <Card className="card-alt">
                  <Card.Body>
                    <Row>
                      <Col xs="auto" className="text-sm-label">
                        {t('redeem')}
                      </Col>
                      <Col
                        className="text-sm-label float-end text-end"
                        role="button"
                        aria-hidden="true"
                        onClick={() => {
                          clearInputs(1)
                          removeInput1.value = convertFromWei(getBalance(1))
                        }}
                      >
                        <Badge bg="primary" className="me-1">
                          MAX
                        </Badge>
                        {t('balance')}:{' '}
                        {pool.poolDetails && formatFromWei(getBalance(1))}
                      </Col>
                    </Row>

                    <Row className="my-1">
                      <Col>
                        <InputGroup className="m-0">
                          <InputGroup.Text>
                            <AssetSelect priority="1" filter={['pool']} />
                          </InputGroup.Text>
                          <FormControl
                            className="text-end ms-0"
                            type="number"
                            placeholder={`${t('redeem')}...`}
                            id="removeInput1"
                            autoComplete="off"
                            autoCorrect="off"
                            onInput={(e) => handleTokenInputChange(e)}
                          />
                          <InputGroup.Text
                            role="button"
                            tabIndex={-1}
                            onKeyPress={() => clearInputs(1)}
                            onClick={() => clearInputs(1)}
                          >
                            <Icon icon="close" size="12" fill="grey" />
                          </InputGroup.Text>
                        </InputGroup>
                        <div className="text-end text-sm-label pt-1">
                          ~$
                          {removeInput1?.value
                            ? formatFromWei(getLpValueUSD(), 2)
                            : '0.00'}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Row style={{ height: '2px' }}>
                  {activeTab === '2' && (
                    <Icon
                      icon="swapAdd"
                      size="25"
                      fill="#fb2715"
                      className="mx-auto position-relative"
                      style={{ height: '35px', top: '-20px', zIndex: '1000' }}
                    />
                  )}
                </Row>

                {activeTab === '2' && (
                  <Card className="card-alt">
                    <Card.Body>
                      <Row>
                        <Col xs="auto" className="text-sm-label">
                          {t('receive')}
                        </Col>
                        <Col className="text-sm-label float-end text-end">
                          {t('balance')}:{' '}
                          {pool.tokenDetails && formatFromWei(getBalance(2))}
                        </Col>
                      </Row>

                      <Row className="my-1">
                        <Col>
                          <InputGroup className="">
                            <InputGroup.Text>
                              <AssetSelect
                                priority="2"
                                filter={['token']}
                                blackList={[
                                  activeTab === '1' ? addr.spartav2 : '',
                                ]}
                                whiteList={
                                  activeTab === '2'
                                    ? [addr.spartav2, poolRemove1.tokenAddress]
                                    : ['']
                                }
                                disabled={activeTab === '1'}
                              />
                            </InputGroup.Text>
                            <FormControl
                              className="text-end ms-0"
                              type="number"
                              placeholder={`${t('receive')}...`}
                              id="removeInput2"
                              disabled
                            />
                          </InputGroup>
                          <div className="text-end text-sm-label pt-1">
                            ~$
                            {removeInput2?.value
                              ? formatFromWei(getOutput1ValueUSD(), 2)
                              : '0.00'}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {pool.poolDetails && (
                  <>
                    <Row className="mb-2 mt-3">
                      <Col xs="auto">
                        <div className="text-card">{t('redeem')}</div>
                      </Col>
                      <Col className="text-end">
                        <div className="text-card">
                          {removeInput1?.value > 0
                            ? formatFromUnits(removeInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(poolRemove1?.tokenAddress)?.symbol}p
                        </div>
                      </Col>
                    </Row>

                    {activeTab === '2' && (
                      <Row className="mb-2">
                        <Col xs="auto">
                          <div className="text-card">{t('fee')}</div>
                        </Col>
                        <Col className="text-end">
                          <div className="text-card">
                            {getRemLiqAsym()[1] > 0
                              ? formatFromWei(getRemLiqAsym()[1], 6)
                              : '0.00'}{' '}
                            <span className="">SPARTA</span>
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row className="">
                      <Col xs="auto" className="title-card">
                        <span className="subtitle-card">{t('receive')}</span>
                        {activeTab === '1' && (
                          <div className="subtitle-card">{t('receive')}</div>
                        )}
                      </Col>
                      <Col className="text-end">
                        <span className="subtitle-card">
                          ~{output1 > 0 ? formatFromWei(output1, 6) : '0.00'}{' '}
                          <span className="output-card">
                            {getToken(assetRemove1?.tokenAddress)?.symbol}
                          </span>
                        </span>
                        {activeTab === '1' && (
                          <span className="subtitle-card">
                            <br />~
                            {output2 > 0 ? formatFromWei(output2, 6) : '0.00'}{' '}
                            <span className="output-card">SPARTA</span>
                          </span>
                        )}
                      </Col>
                    </Row>
                  </>
                )}

                {!pool.poolDetails && (
                  <HelmetLoading height="150px" width="150px" />
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {!poolRemove1?.newPool ? (
              <Row className="text-center">
                {poolRemove1?.tokenAddress &&
                  wallet?.account &&
                  removeInput1?.value && (
                    <Approval
                      tokenAddress={poolRemove1?.address}
                      symbol={`${getToken(poolRemove1.tokenAddress)?.symbol}p`}
                      walletAddress={wallet?.account}
                      contractAddress={addr.router}
                      txnAmount={convertToWei(removeInput1?.value)}
                      assetNumber="1"
                    />
                  )}
                <Col xs="12" sm="4" md="12" className="hide-if-siblings">
                  <Button
                    className="w-100"
                    disabled={
                      removeInput1?.value <= 0 ||
                      BN(convertToWei(removeInput1?.value)).isGreaterThan(
                        getBalance(1),
                      )
                    }
                    onClick={() =>
                      activeTab === '1'
                        ? dispatch(
                            removeLiquidityExact(
                              convertToWei(removeInput1.value),
                              poolRemove1.tokenAddress,
                              wallet,
                            ),
                          )
                        : dispatch(
                            removeLiquiditySingle(
                              convertToWei(removeInput1.value),
                              assetRemove1.tokenAddress === addr.spartav2,
                              poolRemove1.tokenAddress,
                              wallet,
                            ),
                          )
                    }
                  >
                    {t('removeLiq')}
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row className="text-center">
                <Col xs="12" sm="4" md="12">
                  <Button className="w-100" disabled>
                    {t('newPoolLockedFor')}: {getTimeNew()[0]} {getTimeNew()[1]}
                  </Button>
                </Col>
              </Row>
            )}
          </Card.Footer>
        </Card>
      </Col>
      {pool.poolDetails && (
        <Col xs="auto">
          <SwapPair assetSwap={poolRemove1} />
        </Col>
      )}
    </Row>
  )
}

export default LiqRemove
