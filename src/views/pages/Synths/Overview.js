/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  Nav,
  NavItem,
  NavLink,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePool } from '../../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../../utils/bigNumber'
import {
  calcSwapOutput,
  calcSwapFee,
  calcValueInBase,
  calcShare,
  calcLiquidityUnitsAsym,
} from '../../../utils/web3Utils'
import {
  routerSwapBaseToSynth,
  routerSwapSynthToBase,
} from '../../../store/router/actions'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useSynth } from '../../../store/synth/selector'
import swapIcon from '../../../assets/icons/swapadd.svg'
// import SwapPair from '../Swap/SwapPair'

const Swap = () => {
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('mint')
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  useEffect(() => {
    const { poolDetails } = pool

    const getAssetDetails = () => {
      if (poolDetails?.length > 0) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))

        if (poolDetails.find((asset) => asset.tokenAddress === assetParam1)) {
          ;[asset1] = poolDetails.filter(
            (asset) => asset.tokenAddress === assetParam1,
          )
          setAssetParam1('')
        }
        if (poolDetails.find((asset) => asset.tokenAddress === assetParam2)) {
          ;[asset2] = poolDetails.filter(
            (asset) => asset.tokenAddress === assetParam2,
          )
          setAssetParam2('')
        }

        if (activeTab === 'mint') {
          asset1 = { tokenAddress: addr.sparta }
          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'synth')
          if (asset2.tokenAddress === addr.sparta) {
            asset2 = { tokenAddress: addr.bnb }
          }
        } else {
          asset2 = { tokenAddress: addr.sparta }
          window.localStorage.setItem('assetType1', 'synth')
          window.localStorage.setItem('assetType2', 'token')
          if (asset1.tokenAddress === addr.sparta) {
            asset1 = { tokenAddress: addr.bnb }
          }
        }

        if (!asset1) {
          asset1 = { tokenAddress: addr.sparta }
        }

        if (!asset2) {
          asset2 = { tokenAddress: addr.bnb }
        }

        asset1 = getItemFromArray(asset1, poolDetails)
        asset2 = getItemFromArray(asset2, poolDetails)

        setAssetSwap1(asset1)
        setAssetSwap2(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType2'),
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getSynth = (tokenAddress) =>
    synth.synthDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const clearInputs = () => {
    if (swapInput1) {
      swapInput1.value = ''
      swapInput1.focus()
    }
    if (swapInput2) {
      swapInput2.value = ''
    }
  }

  //= =================================================================================//
  // Functions SWAP calculations

  const getBalance = (asset) => {
    let item = ''
    let type = ''
    if (asset === 1) {
      item = assetSwap1
      type = window.localStorage.getItem('assetType1')
    } else {
      item = assetSwap2
      type = window.localStorage.getItem('assetType2')
    }
    if (type === 'token') {
      return getToken(item.tokenAddress)?.balance
    }
    if (type === 'synth') {
      return getSynth(item.tokenAddress)?.balance
    }
    return item.balanceTokens
  }

  //= =================================================================================//
  // Functions for SWAP input handling
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  //= =================================================================================//
  // Functions SYNTHS calculations

  const getSynthLPsFromBase = () => {
    const temp = calcLiquidityUnitsAsym(
      convertToWei(swapInput1.value),
      assetSwap2.baseAmount,
      assetSwap2.poolUnits,
    )
    return temp
  }

  const getSynthFeeFromBase = () => {
    let temp = calcSwapFee(
      convertToWei(swapInput1?.value),
      assetSwap2?.baseAmount,
      assetSwap2?.tokenAmount,
    )
    temp = calcValueInBase(assetSwap2.tokenAmount, assetSwap2.baseAmount, temp)
    return temp
  }

  const getSynthOutputFromBase = () => {
    const lpUnits = getSynthLPsFromBase()
    const baseAmount = calcShare(
      lpUnits,
      BN(assetSwap2.poolUnits).plus(lpUnits),
      BN(assetSwap2.baseAmount).plus(BN(swapInput1.value)),
    )
    const tokenAmount = calcShare(
      lpUnits,
      BN(assetSwap2.poolUnits).plus(lpUnits),
      assetSwap2.tokenAmount,
    )
    const baseSwapped = calcSwapOutput(
      baseAmount,
      assetSwap2.tokenAmount,
      BN(assetSwap2.baseAmount).plus(BN(swapInput1.value)),
    )
    const tokenValue = BN(tokenAmount).plus(baseSwapped)
    return tokenValue
  }

  const getSynthFeeToBase = () => {
    const fee = calcSwapFee(
      convertToWei(swapInput1.value),
      assetSwap1.baseAmount,
      assetSwap1.tokenAmount,
      true,
    )
    return fee
  }

  const getSynthOutputToBase = () => {
    const inputSynth = convertToWei(swapInput1?.value)
    const baseOutput = calcSwapOutput(
      inputSynth,
      assetSwap1.tokenAmount,
      assetSwap1.baseAmount,
      true,
    )
    return baseOutput
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = () => {
    if (activeTab === 'mint') {
      if (swapInput1?.value) {
        swapInput2.value = convertFromWei(getSynthOutputFromBase(), 18)
      } else {
        clearInputs()
      }
    } else if (swapInput1?.value) {
      swapInput2.value = convertFromWei(getSynthOutputToBase(), 18)
    } else {
      clearInputs()
    }
  }

  // GET USD VALUES
  const getInput1USD = () => {
    if (activeTab === 'mint' && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (swapInput1?.value) {
      return BN(
        calcValueInBase(
          assetSwap1?.tokenAmount,
          assetSwap1?.baseAmount,
          convertToWei(swapInput1?.value),
        ),
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  // GET USD VALUES
  const getInput2USD = () => {
    if (activeTab === 'burn' && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (swapInput2?.value) {
      return BN(
        calcValueInBase(
          assetSwap2?.tokenAmount,
          assetSwap2?.baseAmount,
          convertToWei(swapInput2?.value),
        ),
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  const getRateSlip = () => {
    if (assetSwap1 && swapInput1?.value > 0 && swapInput2?.value > 0) {
      return BN(getInput2USD()).div(getInput1USD()).minus('1').times('100')
    }
    return '0'
  }

  return (
    <>
      <div className="content">
        {pool.poolDetails?.length > 0 && (
          <>
            <Row className="justify-content-center">
              <Col xs="6" xl="5">
                <h2 className="d-inline text-title ml-1">{t('Synths')}</h2>
              </Col>
              <Col xs="6" xl="4">
                {/* Buttons? */}
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Card className="card-body" style={{ maxWidth: '540px' }}>
                <Nav pills className="nav-tabs-custom mt-2 mb-4">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'mint',
                      })}
                      onClick={() => {
                        toggle('mint')
                      }}
                    >
                      Mint Synths
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'burn',
                      })}
                      onClick={() => {
                        toggle('burn')
                      }}
                    >
                      Burn Synths
                    </NavLink>
                  </NavItem>
                </Nav>
                <Row>
                  <Col xs="12" className="px-1 px-sm-3">
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body mb-1"
                    >
                      <Row>
                        {/* 'From' input box */}
                        <Col xs="4">
                          <div className="text-sm-label">
                            {' '}
                            {activeTab === 'mint' ? 'Add' : 'Burn'}
                          </div>
                        </Col>

                        <Col xs="8" className="text-right">
                          <div
                            className="balance"
                            role="button"
                            onClick={() => {
                              swapInput1.value = convertFromWei(getBalance(1))
                              handleZapInputChange(
                                convertFromWei(getBalance(1)),
                                true,
                              )
                            }}
                          >
                            {t('balance')}
                            {': '}
                            {formatFromWei(getBalance(1), 4)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="my-2">
                        <Col xs="auto" className="ml-1">
                          <AssetSelect
                            priority="1"
                            filter={
                              activeTab === 'mint' ? ['token'] : ['synth']
                            }
                            whiteList={activeTab === 'mint' && [addr.sparta]}
                            disabled={activeTab === 'mint'}
                          />
                        </Col>
                        <Col className="text-right">
                          <InputGroup className="m-0 mt-n1">
                            <Input
                              className="text-right h-100 ml-0"
                              type="text"
                              placeholder="Add..."
                              id="swapInput1"
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
                          <div className="text-right text-sm-label">
                            ~$
                            {swapInput1?.value
                              ? formatFromWei(getInput1USD(), 2)
                              : '0.00'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                    <Row className="my-n2">
                      {activeTab === 'mint' && (
                        <img
                          src={swapIcon}
                          alt="plusicon"
                          className="mx-auto z-index my-n2"
                          style={{ height: '35px' }}
                        />
                      )}
                      {activeTab === 'burn' && (
                        <img
                          src={swapIcon}
                          alt="plusicon"
                          className="mx-auto z-index my-n2"
                          style={{ height: '35px' }}
                        />
                      )}
                    </Row>

                    {activeTab === 'mint' && (
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body mb-1"
                      >
                        <Row>
                          <Col xs="4" className="">
                            <div className="text-sm-label">
                              {' '}
                              {activeTab === 'mint' ? 'Mint' : 'Receive'}
                            </div>
                          </Col>
                          <Col xs="8" className="text-right">
                            <div>
                              Balance{': '}
                              {pool.poolDetails &&
                                formatFromWei(getBalance(2), 4)}
                            </div>
                          </Col>
                        </Row>
                        <Row className="">
                          <Col xs="auto" className="ml-1">
                            <AssetSelect priority="2" filter={['synth']} />
                          </Col>
                          <Col className="text-right">
                            <InputGroup className="m-0 mt-n1">
                              <Input
                                className="text-right h-100 ml-0 text-light"
                                type="text"
                                placeholder="0.00"
                                id="swapInput2"
                                value={
                                  swapInput1?.value &&
                                  assetSwap1?.tokenAddress === addr.sparta &&
                                  `${formatFromWei(
                                    getSynthOutputFromBase(),
                                    10,
                                  )}`
                                }
                              />
                            </InputGroup>
                            <div className="text-right">
                              ~$
                              {swapInput2?.value &&
                                formatFromWei(getInput2USD(), 2)}
                              {' ('}
                              {swapInput2?.value &&
                                formatFromUnits(getRateSlip())}
                              {'%)'}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {activeTab === 'burn' && (
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body mb-1"
                      >
                        <Row>
                          <Col xs="4" className="">
                            <div className="text-sm-label">
                              {activeTab === 'burn' ? 'Receive' : 'Burn'}
                            </div>
                          </Col>
                          <Col xs="8" className="text-right">
                            <div>
                              Balance{': '}
                              {pool.poolDetails &&
                                formatFromWei(getBalance(2), 4)}
                            </div>
                          </Col>
                        </Row>

                        <Row className="my-2">
                          <Col xs="auto">
                            <div className="output-card ml-1">
                              <AssetSelect
                                priority="2"
                                filter={['token']}
                                disabled={
                                  activeTab === 'burn' ||
                                  assetSwap1.tokenAddress !== addr.sparta
                                }
                              />
                            </div>
                          </Col>
                          <Col className="text-right">
                            <InputGroup className="m-0 mt-n1">
                              <Input
                                className="text-right h-100 ml-0 text-light"
                                type="text"
                                placeholder="0.00"
                                id="swapInput2"
                                disabled
                                value={
                                  swapInput1?.value &&
                                  assetSwap1?.tokenAddress !== addr.sparta &&
                                  `${formatFromWei(getSynthOutputToBase(), 10)}`
                                }
                              />
                            </InputGroup>
                            <div className="text-right">
                              ~$
                              {swapInput2?.value &&
                                formatFromWei(getInput2USD(), 2)}
                              {' ('}
                              {swapInput2?.value &&
                                formatFromUnits(getRateSlip())}
                              {'%)'}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {/* Bottom 'synth' txnDetails row */}
                    <Row className="mb-3">
                      <Col xs="auto">
                        <div className="text-card">{t('input')}</div>
                      </Col>
                      <Col className="text-right">
                        <div className="output-card">
                          {swapInput1?.value &&
                            formatFromUnits(swapInput1?.value, 6)}{' '}
                          {getToken(assetSwap1.tokenAddress)?.symbol}
                          {assetSwap1?.tokenAddress !== addr.sparta && '-SPS'}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="auto">
                        <div className="text-card">
                          Fee{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2 mt-n1"
                            id="tooltipSynthFee"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipSynthFee"
                          >
                            The slip fee being injected into the pool to reward
                            the liquidity providers
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col className="text-right">
                        <div className="output-card">
                          {swapInput1?.value &&
                            assetSwap1?.tokenAddress === addr.sparta &&
                            formatFromWei(getSynthFeeFromBase(), 6)}
                          {swapInput1?.value &&
                            assetSwap1?.tokenAddress !== addr.sparta &&
                            formatFromWei(getSynthFeeToBase(), 6)}{' '}
                          SPARTA
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="auto">
                        <div className="amount">Output</div>
                      </Col>
                      <Col className="text-right">
                        <div className="subtitle-amount">
                          {swapInput1?.value &&
                            assetSwap1?.tokenAddress === addr.sparta &&
                            `${formatFromWei(getSynthOutputFromBase(), 10)} ${
                              getToken(assetSwap2.tokenAddress)?.symbol
                            }-SPS`}
                          {swapInput1?.value &&
                            assetSwap1?.tokenAddress !== addr.sparta &&
                            `${formatFromWei(getSynthOutputToBase(), 10)} ` +
                              `SPARTA`}
                        </div>
                      </Col>
                    </Row>

                    {/* 'Approval/Allowance' row */}
                    {activeTab === 'mint' && (
                      <Col>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={() =>
                            dispatch(
                              routerSwapBaseToSynth(
                                convertToWei(swapInput1?.value),
                                getSynth(assetSwap2.tokenAddress)?.address,
                              ),
                            )
                          }
                          block
                        >
                          Mint {getToken(assetSwap2.tokenAddress)?.symbol}-SPS
                        </Button>
                      </Col>
                    )}
                    {activeTab === 'burn' && (
                      <Col>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={() =>
                            dispatch(
                              routerSwapSynthToBase(
                                convertToWei(swapInput1?.value),
                                getSynth(assetSwap1.tokenAddress)?.address,
                              ),
                            )
                          }
                          block
                        >
                          Burn {getToken(assetSwap1.tokenAddress)?.symbol}-SPS
                        </Button>
                      </Col>
                    )}
                  </Col>
                </Row>
              </Card>
            </Row>
          </>
        )}
        {!pool.poolDetails && (
          <div>
            <HelmetLoading height={300} width={300} />
          </div>
        )}
      </div>
    </>
  )
}

export default Swap
