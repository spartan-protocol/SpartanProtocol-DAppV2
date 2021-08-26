import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Row,
  Col,
  Card,
  Nav,
  InputGroup,
  FormControl,
  Button,
  Badge,
} from 'react-bootstrap'
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
  calcSpotValueInBase,
  minusFeeBurn,
} from '../../../utils/web3Utils'
import {
  swapAssetToSynth,
  swapSynthToAsset,
} from '../../../store/router/actions'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useSynth } from '../../../store/synth/selector'
import Approval from '../../../components/Approval/Approval'
import SwapPair from '../Swap/SwapPair'
import SharePool from '../../../components/Share/SharePool'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { useSparta } from '../../../store/sparta'
import NewSynth from './NewSynth'
import { Icon } from '../../../components/Icons/icons'

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

  const _minusFeeBurn = (_amount) =>
    minusFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)

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
    if (fromBase) {
      if (getFee) {
        return '0'
      }
      return _minusFeeBurn(input)
    }
    const [_baseSwapped, swapFee] = calcSwapOutput(input, assetSwap1, true)
    const baseSwapped = _minusFeeBurn(_baseSwapped)
    if (getFee) {
      return swapFee
    }
    return _minusFeeBurn(baseSwapped)
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
      return calcSpotValueInBase(swapFee, _pool)
    }
    return calcSwapOutput(input, actualToken, actualBase, false)[0]
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
    const [swapped, swapFee1] = calcSwapOutput(
      input,
      tokenAmount,
      baseAmount,
      true,
    )
    let output = _minusFeeBurn(swapped)
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
    output = _minusFeeBurn(output)
    const swapFee2 = calcSwapFee(output, tokenAmount, baseAmount, false)
    if (getFee) {
      return BN(swapFee1).plus(swapFee2)
    }
    return calcSwapOutput(output, tokenAmount, baseAmount, false)[0]
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
        calcSpotValueInBase(convertToWei(swapInput1?.value), assetSwap1),
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
        calcSpotValueInBase(convertToWei(swapInput2?.value), assetSwap2),
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
              <h2 className="text-title-small mb-0 me-3">{t('synths')}</h2>
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
                    <Card xs="auto" className="card-480">
                      <Card.Header className="p-0 border-0 mb-3">
                        <Nav activeKey={activeTab} fill className="rounded-top">
                          <Nav.Item key="mint" className="rounded-top">
                            <Nav.Link
                              className="rounded-top"
                              eventKey="mint"
                              onClick={() => {
                                toggle('mint')
                              }}
                            >
                              {t('forgeSynths')}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item key="burn" className="rounded-top">
                            <Nav.Link
                              className="rounded-top"
                              eventKey="burn"
                              onClick={() => {
                                toggle('burn')
                              }}
                            >
                              {t('meltSynths')}
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
                                  {/* 'From' input box */}
                                  <Col xs="auto" className="text-sm-label">
                                    {' '}
                                    {activeTab === 'mint'
                                      ? t('add')
                                      : t('melt')}
                                  </Col>

                                  <Col
                                    className="text-sm-label float-end text-end"
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
                                    <Badge bg="primary" className="me-1">
                                      MAX
                                    </Badge>
                                    {t('balance')}
                                    {': '}
                                    {formatFromWei(getBalance(1), 4)}
                                  </Col>
                                </Row>

                                <Row className="my-1">
                                  <Col>
                                    <InputGroup className="">
                                      <InputGroup.Text>
                                        <AssetSelect
                                          priority="1"
                                          filter={
                                            activeTab === 'mint'
                                              ? ['token']
                                              : ['synth']
                                          }
                                        />
                                      </InputGroup.Text>
                                      <FormControl
                                        className="text-end ms-0"
                                        type="number"
                                        placeholder={`${t('add')}...`}
                                        id="swapInput1"
                                        autoComplete="off"
                                        autoCorrect="off"
                                        onInput={(e) =>
                                          handleTokenInputChange(e)
                                        }
                                      />
                                      <InputGroup.Text
                                        role="button"
                                        tabIndex={-1}
                                        onKeyPress={() => clearInputs(1)}
                                        onClick={() => clearInputs(1)}
                                      >
                                        <Icon
                                          icon="close"
                                          size="12"
                                          fill="grey"
                                        />
                                      </InputGroup.Text>
                                    </InputGroup>
                                    <div className="text-end text-sm-label pt-1">
                                      ~$
                                      {swapInput1?.value
                                        ? formatFromWei(getInput1USD(), 2)
                                        : '0.00'}
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            <Row style={{ height: '2px' }}>
                              <Col xs="auto" className="mx-auto">
                                {activeTab === 'mint' && (
                                  <Icon
                                    icon="mint"
                                    size="35"
                                    fill="white"
                                    className="position-relative bg-primary rounded-circle px-2"
                                    style={{
                                      top: '-20px',
                                      zIndex: '1000',
                                    }}
                                  />
                                )}
                                {activeTab === 'burn' && (
                                  <Icon
                                    icon="fire"
                                    size="35"
                                    fill="white"
                                    className="position-relative bg-primary rounded-circle px-2"
                                    style={{
                                      top: '-20px',
                                      zIndex: '1000',
                                    }}
                                  />
                                )}
                              </Col>
                            </Row>

                            {activeTab === 'mint' && (
                              <Card className="card-alt">
                                <Card.Body>
                                  <Row>
                                    <Col xs="auto" className="text-sm-label">
                                      {activeTab === 'mint'
                                        ? t('forge')
                                        : t('receive')}
                                    </Col>
                                    <Col className="text-sm-label float-end text-end">
                                      {t('balance')}
                                      {': '}
                                      {pool.poolDetails &&
                                        formatFromWei(getBalance(2), 4)}
                                    </Col>
                                  </Row>

                                  <Row className="my-1">
                                    <Col>
                                      <InputGroup className="m-0">
                                        <InputGroup.Text>
                                          <AssetSelect
                                            priority="2"
                                            filter={['synth']}
                                          />
                                        </InputGroup.Text>
                                        <FormControl
                                          className="text-end ms-0"
                                          type="number"
                                          placeholder="0.00"
                                          id="swapInput2"
                                          autoComplete="off"
                                          autoCorrect="off"
                                          onInput={(e) =>
                                            handleTokenInputChange(e)
                                          }
                                          disabled
                                        />
                                      </InputGroup>
                                      <div className="text-end text-sm-label pt-1">
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
                                </Card.Body>
                              </Card>
                            )}

                            {activeTab === 'burn' && (
                              <Card className="card-alt">
                                <Card.Body>
                                  <Row>
                                    <Col xs="auto" className="text-sm-label">
                                      {activeTab === 'burn'
                                        ? t('receive')
                                        : t('melt')}
                                    </Col>
                                    <Col className="text-sm-label float-end text-end">
                                      {t('balance')}
                                      {': '}
                                      {pool.poolDetails &&
                                        formatFromWei(getBalance(2), 4)}
                                    </Col>
                                  </Row>

                                  <Row className="my-1">
                                    <Col>
                                      <InputGroup className="m-0">
                                        <InputGroup.Text>
                                          <AssetSelect
                                            priority="2"
                                            filter={['token']}
                                          />
                                        </InputGroup.Text>
                                        <FormControl
                                          className="text-end ms-0"
                                          type="number"
                                          placeholder="0.00"
                                          id="swapInput2"
                                          disabled
                                        />
                                      </InputGroup>
                                      <div className="text-end text-sm-label pt-1">
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
                                </Card.Body>
                              </Card>
                            )}

                            {/* Bottom 'synth' txnDetails row */}
                            <Row className="mb-2 mt-3">
                              <Col xs="auto">
                                <div className="text-card">{t('input')}</div>
                              </Col>
                              <Col className="text-end">
                                <div className="text-card">
                                  {swapInput1?.value
                                    ? formatFromUnits(swapInput1?.value, 6)
                                    : '0.00'}{' '}
                                  {getToken(assetSwap1.tokenAddress)?.symbol}
                                  {activeTab === 'burn' && 's'}
                                </div>
                              </Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs="auto">
                                <div className="text-card">{t('fee')} </div>
                              </Col>
                              <Col className="text-end">
                                {activeTab === 'mint' && (
                                  <div className="text-card">
                                    {swapInput1?.value
                                      ? formatFromWei(getSynthSwapFee(), 6)
                                      : '0.00'}{' '}
                                    SPARTA
                                  </div>
                                )}
                                {activeTab === 'burn' && (
                                  <div className="text-card">
                                    {swapInput1?.value
                                      ? formatFromWei(getRemovedBase(true), 6)
                                      : '0.00'}{' '}
                                    SPARTA
                                  </div>
                                )}
                              </Col>
                            </Row>

                            <Row className="">
                              <Col xs="auto" className="title-card">
                                <span className="subtitle-card">
                                  {t('output')}
                                </span>
                              </Col>
                              <Col className="text-end">
                                {activeTab === 'mint' && (
                                  <span className="subtitle-card">
                                    {swapInput1?.value
                                      ? formatFromWei(getAddedSynths(), 6)
                                      : '0.00'}{' '}
                                    {getToken(assetSwap2.tokenAddress)?.symbol}s
                                  </span>
                                )}

                                {activeTab === 'burn' && (
                                  <span className="subtitle-card">
                                    {swapInput1?.value
                                      ? formatFromWei(getRemovedBase(), 6)
                                      : '0.00'}{' '}
                                    {getToken(assetSwap2.tokenAddress)?.symbol}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer>
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
                                      getToken(assetSwap1.tokenAddress)?.symbol
                                    }
                                    walletAddress={wallet?.account}
                                    contractAddress={addr.router}
                                    txnAmount={convertToWei(swapInput1?.value)}
                                    assetNumber="1"
                                  />
                                )}
                              <Col className="hide-if-siblings">
                                <Button
                                  onClick={() => handleSwapToSynth()}
                                  className="w-100"
                                  disabled={
                                    swapInput1?.value <= 0 ||
                                    BN(
                                      convertToWei(swapInput1?.value),
                                    ).isGreaterThan(getBalance(1))
                                  }
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
                                    getSynth(assetSwap1?.tokenAddress)?.address
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
                                  className="w-100"
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
                                >
                                  {t('melt')}{' '}
                                  {getToken(assetSwap1.tokenAddress)?.symbol}s
                                </Button>
                              </Col>
                            </>
                          )}
                        </Row>
                      </Card.Footer>
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
