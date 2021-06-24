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
import { useWallet } from '@binance-chain/bsc-use-wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray, getNetwork } from '../../../utils/web3'
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
  calcFeeBurn,
} from '../../../utils/web3Utils'
import {
  swapAssetToSynth,
  swapSynthToAsset,
} from '../../../store/router/actions'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useSynth } from '../../../store/synth/selector'
import mintIcon from '../../../assets/icons/mint.svg'
import fireIcon from '../../../assets/icons/fire.svg'
import Approval from '../../../components/Approval/Approval'
import SwapPair from '../Swap/SwapPair'
import SharePool from '../../../components/Share/SharePool'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { useSparta } from '../../../store/sparta'
import NewSynth from './NewSynth'

const Swap = () => {
  const wallet = useWallet()
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const location = useLocation()
  const sparta = useSparta()
  const [activeTab, setActiveTab] = useState('mint')
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )
  const [typeParam1, setTypeParam1] = useState(
    new URLSearchParams(location.search).get(`type1`),
  )

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

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
      if (poolDetails?.length > 0) {
        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))

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

        if (typeParam1 === 'synth') {
          setActiveTab('burn')
          setTypeParam1('')
        }

        if (activeTab === 'mint') {
          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'synth')
          if (asset2?.curated !== true) {
            asset2 = { tokenAddress: addr.bnb }
          }
        } else {
          window.localStorage.setItem('assetType1', 'synth')
          window.localStorage.setItem('assetType2', 'token')
          if (asset1.tokenAddress === addr.spartav2) {
            asset1 = { tokenAddress: addr.bnb }
          }
        }

        if (
          !asset1 ||
          !pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
        ) {
          asset1 = { tokenAddress: addr.spartav2 }
        }

        if (
          !asset2 ||
          !pool.poolDetails.find((x) => x.tokenAddress === asset2.tokenAddress)
        ) {
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

  const getFeeBurn = (_amount) => {
    const burnFee = calcFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)
    return burnFee
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
  // Base-To-Synths Calcs

  // STEP 1 - ADD ASSETs TO POOL (FEEBURN: YES)
  const getAddedBase = (getFee) => {
    const input = BN(convertToWei(swapInput1?.value))
    const fromToken = assetSwap1
    const fromBase = fromToken.tokenAddress === addr.spartav2
    const { baseAmount } = assetSwap1
    const { tokenAmount } = assetSwap1
    let feeBurn = getFeeBurn(input) // feeBurn - SPARTA from User to Pool
    if (fromBase) {
      if (getFee) {
        return '0'
      }
      return input.minus(feeBurn)
    }
    let baseSwapped = calcSwapOutput(input, tokenAmount, baseAmount, true)
    feeBurn = getFeeBurn(baseSwapped) // feeBurn - Pool to Router
    baseSwapped = baseSwapped.minus(feeBurn)
    feeBurn = getFeeBurn(baseSwapped) // feeBurn - Router to Pool
    if (getFee) {
      const swapFee = calcSwapFee(input, tokenAmount, baseAmount, true)
      return calcValueInBase(tokenAmount, baseAmount, swapFee)
    }
    return baseSwapped.minus(feeBurn)
  }

  // STEP 2 - ADD LPs TO SYNTH (FEEBURN: NO)
  // const getAddedLPs = () => {
  //   const input = getAddedBase()
  //   const _pool = assetSwap2
  //   const sameLayer1 = assetSwap1.tokenAddress === assetSwap2.tokenAddress
  //   const { poolUnits } = _pool
  //   const { baseAmount } = _pool
  //   const actualBase = sameLayer1 ? baseAmount.minus(input) : baseAmount
  //   return calcLiquidityUnitsAsym(input, actualBase, poolUnits)
  // }

  // STEP 3 - ADD SYNTHs TO USER (FEEBURN: NO)
  const getAddedSynths = (getFee) => {
    const input = getAddedBase()
    const _pool = assetSwap2
    const sameLayer1 = assetSwap1.tokenAddress === assetSwap2.tokenAddress
    const tokenAmount = BN(_pool.tokenAmount)
    const actualToken = sameLayer1
      ? tokenAmount.plus(convertToWei(swapInput1?.value))
      : tokenAmount
    const baseAmount = BN(_pool.baseAmount)
    const actualBase = sameLayer1 ? baseAmount.minus(input) : baseAmount
    if (getFee) {
      const swapFee = calcSwapFee(input, actualToken, actualBase, false)
      return calcValueInBase(actualToken, actualBase, swapFee)
    }
    return calcSwapOutput(input, actualToken, actualBase, false)
  }

  // STEP 1A - Get fee from swap in step 1
  const getSynthSwapFee = () => {
    const swapFee1 = BN(getAddedBase(true))
    const swapFee2 = BN(getAddedSynths(true))
    return swapFee1.minus(swapFee2)
  }

  //= =================================================================================//
  // Synth-To-Base Calcs
  const getRemovedBase = (getFee) => {
    const input = BN(convertToWei(swapInput1?.value))
    const toToken = assetSwap2
    const toBase = toToken.tokenAddress === addr.spartav2
    const sameLayer1 = assetSwap1.tokenAddress === assetSwap2.tokenAddress
    let baseAmount = BN(assetSwap1.baseAmount)
    let { tokenAmount } = assetSwap1
    const swapped = calcSwapOutput(input, tokenAmount, baseAmount, true)
    let swapFee1 = calcSwapFee(input, tokenAmount, baseAmount, true)
    swapFee1 = calcValueInBase(tokenAmount, baseAmount, swapFee1)
    let feeBurn = getFeeBurn(swapped) // feeBurn - Pool to User / Router
    let output = BN(swapped).minus(feeBurn)
    if (toBase) {
      if (getFee) {
        return swapFee1
      }
      return output
    }
    if (sameLayer1) {
      baseAmount = baseAmount.minus(swapped)
    } else {
      tokenAmount = assetSwap2.tokenAmount
      baseAmount = assetSwap2.baseAmount
    }
    feeBurn = getFeeBurn(output) // feeBurn - Router to Pool
    output = BN(output).minus(feeBurn)
    const swapFee2 = calcSwapFee(output, tokenAmount, baseAmount, false)
    if (getFee) {
      return BN(swapFee1).plus(swapFee2)
    }
    return calcSwapOutput(output, tokenAmount, baseAmount, false)
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = () => {
    if (activeTab === 'mint') {
      if (swapInput1?.value) {
        swapInput2.value = convertFromWei(getAddedSynths(), 18)
      } else {
        clearInputs()
      }
    } else if (swapInput1?.value) {
      swapInput2.value = convertFromWei(getRemovedBase(), 18)
    } else {
      clearInputs()
    }
  }

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1.tokenAddress === addr.spartav2) {
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
    if (assetSwap2.tokenAddress === addr.spartav2) {
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

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleZapInputChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2, activeTab])

  const handleSwapToSynth = () => {
    const gasSafety = '10000000000000000'
    if (
      assetSwap1?.tokenAddress === addr.bnb ||
      assetSwap1?.tokenAddress === addr.wbnb
    ) {
      const balance = getToken(addr.bnb)?.balance
      if (
        BN(balance).minus(convertToWei(swapInput1?.value)).isLessThan(gasSafety)
      ) {
        swapInput1.value = convertFromWei(BN(balance).minus(gasSafety))
      }
    }
    dispatch(
      swapAssetToSynth(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        getSynth(assetSwap2.tokenAddress)?.address,
        wallet,
      ),
    )
  }

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('synths')}</h2>
              <NewSynth />
              {pool.poolDetails.length > 0 && <SharePool />}
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            {pool.poolDetails?.length > 0 && (
              <>
                <Row className="row-480">
                  <Col xs="auto">
                    <Card xs="auto" className="card-body card-480 mb-auto">
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
                            {t('forgeSynths')}
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
                            {t('meltSynths')}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <Row>
                        <Col xs="12" className="px-1 px-sm-3">
                          <Card
                            style={{ backgroundColor: '#25212D' }}
                            className="card-body mb-1 card-inside"
                          >
                            <Row>
                              {/* 'From' input box */}
                              <Col xs="4">
                                <div className="text-sm-label">
                                  {' '}
                                  {activeTab === 'mint' ? t('add') : t('melt')}
                                </div>
                              </Col>

                              <Col xs="8" className="text-right">
                                <div
                                  className="text-sm-label"
                                  role="button"
                                  aria-hidden="true"
                                  onClick={() => {
                                    swapInput1.value = convertFromWei(
                                      getBalance(1),
                                    )
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
                                />
                              </Col>
                              <Col className="text-right">
                                <InputGroup className="m-0">
                                  <Input
                                    className="text-right ml-0 p-2"
                                    type="text"
                                    placeholder={`${t('add')}...`}
                                    id="swapInput1"
                                    inputMode="decimal"
                                    pattern="^[0-9]*[.,]?[0-9]*$"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    minLength="1"
                                    onInput={(e) => handleTokenInputChange(e)}
                                  />
                                  <InputGroupAddon
                                    addonType="append"
                                    role="button"
                                    tabIndex={-1}
                                    onKeyPress={() => clearInputs(1)}
                                    onClick={() => clearInputs(1)}
                                  >
                                    <i className="icon-search-bar icon-mini icon-close icon-light my-auto" />
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
                          <Row style={{ height: '1px' }}>
                            {activeTab === 'mint' && (
                              <img
                                src={mintIcon}
                                alt="minticon"
                                className="mx-auto z-index position-relative p-2"
                                style={{
                                  backgroundColor: '#A80005',
                                  height: '35px',
                                  width: '35px',
                                  top: '-19px',
                                }}
                              />
                            )}
                            {activeTab === 'burn' && (
                              <img
                                src={fireIcon}
                                alt="plusicon"
                                className="mx-auto z-index position-relative p-2"
                                style={{
                                  backgroundColor: '#A80005',
                                  height: '35px',
                                  width: '35px',
                                  top: '-19px',
                                }}
                              />
                            )}
                          </Row>

                          {activeTab === 'mint' && (
                            <Card
                              style={{ backgroundColor: '#25212D' }}
                              className="card-body mb-1 card-inside"
                            >
                              <Row className="my-2">
                                <Col xs="4" className="">
                                  <div className="text-sm-label">
                                    {' '}
                                    {activeTab === 'mint'
                                      ? t('forge')
                                      : t('receive')}
                                  </div>
                                </Col>
                                <Col xs="8" className="text-right">
                                  <div className="text-sm-label">
                                    {t('balance')}
                                    {': '}
                                    {pool.poolDetails &&
                                      formatFromWei(getBalance(2), 4)}
                                  </div>
                                </Col>
                              </Row>
                              <Row className="">
                                <Col xs="auto" className="ml-1">
                                  <AssetSelect
                                    priority="2"
                                    filter={['synth']}
                                  />
                                </Col>
                                <Col className="text-right">
                                  <InputGroup className="m-0">
                                    <Input
                                      className="text-right ml-0 p-2 text-light"
                                      type="text"
                                      placeholder="0.00"
                                      id="swapInput2"
                                      inputMode="decimal"
                                      pattern="^[0-9]*[.,]?[0-9]*$"
                                      autoComplete="off"
                                      autoCorrect="off"
                                      minLength="1"
                                      onInput={(e) => handleTokenInputChange(e)}
                                    />
                                  </InputGroup>
                                  <div className="text-right text-sm-label">
                                    ~$
                                    {swapInput2?.value
                                      ? formatFromWei(getInput2USD(), 2)
                                      : '0.00'}
                                    {' ('}
                                    {swapInput2?.value
                                      ? formatFromUnits(getRateSlip(), 2)
                                      : '0.00'}
                                    {'%)'}
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          )}

                          {activeTab === 'burn' && (
                            <Card
                              style={{ backgroundColor: '#25212D' }}
                              className="card-body mb-1 card-inside"
                            >
                              <Row className="my-2">
                                <Col xs="4" className="">
                                  <div className="text-sm-label">
                                    {activeTab === 'burn'
                                      ? t('receive')
                                      : t('melt')}
                                  </div>
                                </Col>
                                <Col xs="8" className="text-right">
                                  <div className="text-sm-label">
                                    {t('balance')}
                                    {': '}
                                    {pool.poolDetails &&
                                      formatFromWei(getBalance(2), 4)}
                                  </div>
                                </Col>
                              </Row>

                              <Row className="">
                                <Col xs="auto">
                                  <div className="output-card ml-1">
                                    <AssetSelect
                                      priority="2"
                                      filter={['token']}
                                    />
                                  </div>
                                </Col>
                                <Col className="text-right">
                                  <InputGroup className="m-0">
                                    <Input
                                      className="text-right ml-0 p-2 text-light"
                                      type="text"
                                      placeholder="0.00"
                                      id="swapInput2"
                                      disabled
                                    />
                                  </InputGroup>
                                  <div className="text-right text-sm-label">
                                    ~$
                                    {swapInput2?.value
                                      ? formatFromWei(getInput2USD(), 2)
                                      : '0.00'}
                                    {' ('}
                                    {swapInput2?.value
                                      ? formatFromUnits(getRateSlip(), 2)
                                      : '0.00'}
                                    {'%)'}
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          )}

                          {/* Bottom 'synth' txnDetails row */}
                          <Row className="mb-2 mt-3">
                            <Col xs="auto">
                              <div className="text-card">{t('input')}</div>
                            </Col>
                            <Col className="text-right">
                              <span className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromUnits(swapInput1?.value, 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                                {activeTab === 'burn' && 's'}
                              </span>
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col xs="auto">
                              <div className="text-card">
                                {t('fee')}{' '}
                                <i
                                  className="icon-extra-small icon-info icon-dark ml-2 mt-n1"
                                  id="tooltipSynthFee"
                                />
                                <UncontrolledTooltip
                                  placement="right"
                                  target="tooltipSynthFee"
                                >
                                  {t('slipFeeInfo')}
                                </UncontrolledTooltip>
                              </div>
                            </Col>
                            <Col className="text-right">
                              {activeTab === 'mint' && (
                                <div className="output-card text-light">
                                  {swapInput1?.value
                                    ? formatFromWei(getSynthSwapFee(), 6)
                                    : '0.00'}{' '}
                                  SPARTA
                                </div>
                              )}
                              {activeTab === 'burn' && (
                                <div className="output-card text-light">
                                  {swapInput1?.value
                                    ? formatFromWei(getRemovedBase(true), 6)
                                    : '0.00'}{' '}
                                  SPARTA
                                </div>
                              )}
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col xs="auto">
                              <div className="subtitle-card">{t('output')}</div>
                            </Col>
                            <Col className="text-right">
                              {activeTab === 'mint' && (
                                <span className="subtitle-card">
                                  {swapInput1?.value
                                    ? formatFromWei(getAddedSynths(), 6)
                                    : '0.00'}
                                  <span className="output-card ml-1">
                                    {getToken(assetSwap2.tokenAddress)?.symbol}s
                                  </span>
                                </span>
                              )}

                              {activeTab === 'burn' && (
                                <span className="subtitle-card">
                                  {swapInput1?.value
                                    ? formatFromWei(getRemovedBase(), 6)
                                    : '0.00'}
                                  <span className="output-card ml-1">
                                    {getToken(assetSwap2.tokenAddress)?.symbol}
                                  </span>
                                </span>
                              )}
                            </Col>
                          </Row>

                          {/* 'Approval/Allowance' row */}
                          <Row>
                            {activeTab === 'mint' && (
                              <>
                                {assetSwap1?.tokenAddress !== addr.bnb &&
                                  wallet?.account &&
                                  swapInput1?.value && (
                                    <Approval
                                      tokenAddress={assetSwap1?.tokenAddress}
                                      symbol={
                                        getToken(assetSwap1.tokenAddress)
                                          ?.symbol
                                      }
                                      walletAddress={wallet?.account}
                                      contractAddress={addr.router}
                                      txnAmount={convertToWei(
                                        swapInput1?.value,
                                      )}
                                      assetNumber="1"
                                    />
                                  )}
                                <Col className="hide-if-siblings">
                                  <Button
                                    color="primary"
                                    onClick={() => handleSwapToSynth()}
                                    disabled={
                                      swapInput1?.value <= 0 ||
                                      BN(
                                        convertToWei(swapInput1?.value),
                                      ).isGreaterThan(getBalance(1))
                                    }
                                    block
                                  >
                                    {t('forge')}{' '}
                                    {getToken(assetSwap2.tokenAddress)?.symbol}s
                                  </Button>
                                </Col>
                              </>
                            )}
                            {activeTab === 'burn' && (
                              <>
                                {wallet?.account && swapInput1?.value && (
                                  <Approval
                                    tokenAddress={
                                      getSynth(assetSwap1?.tokenAddress)
                                        ?.address
                                    }
                                    symbol={`${
                                      getToken(assetSwap1.tokenAddress)?.symbol
                                    }s`}
                                    walletAddress={wallet?.account}
                                    contractAddress={addr.router}
                                    txnAmount={convertToWei(swapInput1?.value)}
                                    assetNumber="1"
                                  />
                                )}
                                <Col className="hide-if-siblings">
                                  <Button
                                    color="primary"
                                    onClick={() =>
                                      dispatch(
                                        swapSynthToAsset(
                                          convertToWei(swapInput1?.value),
                                          getSynth(assetSwap1.tokenAddress)
                                            ?.address,
                                          assetSwap2.tokenAddress,
                                          wallet,
                                        ),
                                      )
                                    }
                                    disabled={
                                      swapInput1?.value <= 0 ||
                                      BN(
                                        convertToWei(swapInput1?.value),
                                      ).isGreaterThan(getBalance(1))
                                    }
                                    block
                                  >
                                    {t('melt')}{' '}
                                    {getToken(assetSwap1.tokenAddress)?.symbol}s
                                  </Button>
                                </Col>
                              </>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    {pool.poolDetails &&
                      assetSwap1.tokenAddress !== addr.spartav2 &&
                      assetSwap2.tokenAddress !== assetSwap1.tokenAddress && (
                        <SwapPair assetSwap={assetSwap1} />
                      )}
                    {pool.poolDetails &&
                      assetSwap2.tokenAddress !== addr.spartav2 && (
                        <SwapPair assetSwap={assetSwap2} />
                      )}
                  </Col>
                </Row>
              </>
            )}
            {pool.poolDetails.length <= 0 && (
              <div>
                <HelmetLoading height={300} width={300} />
              </div>
            )}
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
