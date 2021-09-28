import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Card,
  Nav,
  InputGroup,
  FormControl,
  Button,
  Badge,
  Form,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import {
  getAddresses,
  getItemFromArray,
  getNetwork,
  tempChains,
} from '../../../utils/web3'
import { usePool } from '../../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../../utils/bigNumber'
import {
  swapAssetToSynth,
  swapSynthToAsset,
} from '../../../store/router/actions'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useSynth } from '../../../store/synth/selector'
import Approval from '../../../components/Approval/Approval'
import SwapPair from '../Swap/SwapPair'
import Share from '../../../components/Share/SharePool'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import NewSynth from './NewSynth'
import { Icon } from '../../../components/Icons/icons'
import { useSparta } from '../../../store/sparta'
import { balanceWidths } from '../Pools/Components/Utils'
import { burnSynth, mintSynth } from '../../../utils/math/router'
import { calcSpotValueInBase } from '../../../utils/math/utils'
import {
  getSynthDetails,
  getSynthGlobalDetails,
  getSynthMinting,
} from '../../../store/synth'
import { convertTimeUnits } from '../../../utils/math/nonContract'

const Swap = () => {
  const wallet = useWeb3React()
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const location = useLocation()

  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('mint')
  const [confirmSynth, setConfirmSynth] = useState(false)
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
    const { listedPools } = pool
    const { synthArray } = synth
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (synthArray?.length > 0 && listedPools?.length > 0) {
          dispatch(getSynthGlobalDetails())
          dispatch(getSynthDetails(synthArray, wallet))
          dispatch(getSynthMinting())
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

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
          if (asset1.address === '') {
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
    balanceWidths()
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

  const handleConfClear = () => {
    setConfirmSynth(false)
  }

  useEffect(() => {
    handleConfClear()
  }, [activeTab])

  const clearInputs = () => {
    handleConfClear()
    if (swapInput1) {
      swapInput1.value = ''
      swapInput1.focus()
    }
    if (swapInput2) {
      swapInput2.value = ''
    }
  }

  const _convertTimeUnits = () => {
    if (synth.globalDetails) {
      const [units, timeString] = convertTimeUnits(
        synth.globalDetails.minTime,
        t,
      )
      return [units, timeString]
    }
    return ['1', 'day']
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

  /**
   * Get synth mint txn details
   * @returns [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
   */
  const getMint = () => {
    if (
      activeTab === 'mint' &&
      swapInput1 &&
      assetSwap1 &&
      assetSwap2 &&
      getSynth(assetSwap2.tokenAddress)
    ) {
      const [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped] =
        mintSynth(
          convertToWei(swapInput1.value),
          assetSwap1,
          assetSwap2,
          getSynth(assetSwap2.tokenAddress),
          sparta.globalDetails.feeOnTransfer,
          assetSwap1.tokenAddress === addr.spartav2,
        )
      return [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
    }
    return ['0.00', '0.00', '0.00', '0.00', false, false]
  }

  /**
   * Get synth burn txn details
   * @returns [tokenOut, slipFee, diviSynth, diviSwap]
   */
  const getBurn = () => {
    if (activeTab === 'burn' && swapInput1 && assetSwap1 && assetSwap2) {
      const [tokenOut, slipFee, diviSynth, diviSwap] = burnSynth(
        convertToWei(swapInput1.value),
        assetSwap2,
        assetSwap1,
        sparta.globalDetails.feeOnTransfer,
        assetSwap2.tokenAddress === addr.spartav2,
      )
      return [tokenOut, slipFee, diviSynth, diviSwap]
    }
    return ['0.00', '0.00', '0.00', '0.00']
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = () => {
    if (activeTab === 'mint') {
      if (swapInput1?.value) {
        swapInput2.value = convertFromWei(getMint()[0], 18)
      }
    } else if (swapInput1?.value) {
      swapInput2.value = convertFromWei(getBurn()[0], 18)
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

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (swapInput1?.value <= 0) {
      return [false, t('checkInput')]
    }
    if (BN(convertToWei(swapInput1?.value)).isGreaterThan(getBalance(1))) {
      return [false, t('checkBalance')]
    }
    const _symbolIn = getToken(assetSwap1.tokenAddress)?.symbol
    const _symbolOut = getToken(assetSwap2.tokenAddress)?.symbol
    if (activeTab === 'mint') {
      if (!synth.synthMinting) {
        return [false, t('synthsDisabled')]
      }
      if (getMint()[5]) {
        return [false, t('synthAtCapacity')]
      }
      if (getMint()[4]) {
        return [false, t('poolAtCapacity')]
      }
      if (!confirmSynth) {
        return [false, t('confirmLockup')]
      }
    }
    if (activeTab === 'burn') {
      return [true, `${t('melt')} ${_symbolIn}s`]
    }
    return [true, `${t('forge')} ${_symbolOut}s`]
  }

  const synthCount = () => synth.synthDetails.filter((x) => x.address).length

  useEffect(() => {
    handleZapInputChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2, activeTab])

  const handleSwapToSynth = async () => {
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
    setTxnLoading(true)
    await dispatch(
      swapAssetToSynth(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        getSynth(assetSwap2.tokenAddress)?.address,
        wallet,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  const handleSwapFromSynth = async () => {
    setTxnLoading(true)
    await dispatch(
      swapSynthToAsset(
        convertToWei(swapInput1?.value),
        getSynth(assetSwap1.tokenAddress)?.address,
        assetSwap2.tokenAddress,
        wallet,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  const isLoading = () => {
    if (!pool.poolDetails || !synth.synthDetails) {
      return true
    }
    return false
  }

  const checkWallet = () => {
    if (!wallet.account) {
      setShowWalletWarning1(!showWalletWarning1)
    }
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            {!isLoading() ? (
              <>
                <Row className="row-480">
                  <Col xs="auto">
                    {synthCount() > 0 ? (
                      <Card xs="auto" className="card-480">
                        <Card.Header className="p-0 border-0 mb-3">
                          <Row className="px-4 pt-3 pb-1">
                            <Col xs="auto">
                              {t('synths')}
                              {pool.poolDetails.length > 0 && <Share />}
                            </Col>
                            <Col className="text-end">
                              <NewSynth />
                            </Col>
                          </Row>
                          <Nav activeKey={activeTab} fill>
                            <Nav.Item key="mint">
                              <Nav.Link
                                eventKey="mint"
                                onClick={() => {
                                  toggle('mint')
                                }}
                              >
                                {t('forgeSynths')}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item key="burn">
                              <Nav.Link
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
                                      <OverlayTrigger
                                        placement="auto"
                                        onToggle={() => checkWallet()}
                                        show={showWalletWarning1}
                                        trigger={['focus']}
                                        overlay={
                                          <Popover>
                                            <Popover.Header />
                                            <Popover.Body>
                                              {t('connectWalletFirst')}
                                            </Popover.Body>
                                          </Popover>
                                        }
                                      >
                                        <InputGroup className="">
                                          <InputGroup.Text id="assetSelect1">
                                            <AssetSelect
                                              priority="1"
                                              filter={
                                                activeTab === 'mint'
                                                  ? ['token']
                                                  : ['synth']
                                              }
                                              onClick={handleConfClear}
                                            />
                                          </InputGroup.Text>
                                          <FormControl
                                            className="text-end ms-0"
                                            type="number"
                                            placeholder={`${t('add')}...`}
                                            id="swapInput1"
                                            autoComplete="off"
                                            autoCorrect="off"
                                          />
                                          <InputGroup.Text
                                            role="button"
                                            tabIndex={-1}
                                            onKeyPress={() => clearInputs(1)}
                                            onClick={() => clearInputs(1)}
                                          >
                                            <Icon
                                              icon="close"
                                              size="10"
                                              fill="grey"
                                            />
                                          </InputGroup.Text>
                                        </InputGroup>
                                      </OverlayTrigger>

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
                                          <InputGroup.Text id="assetSelect2">
                                            <AssetSelect
                                              priority="2"
                                              filter={['synth']}
                                              onClick={handleConfClear}
                                            />
                                          </InputGroup.Text>
                                          <FormControl
                                            className="text-end ms-0"
                                            type="number"
                                            placeholder="0.00"
                                            id="swapInput2"
                                            autoComplete="off"
                                            autoCorrect="off"
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
                                          <InputGroup.Text id="assetSelect2">
                                            <AssetSelect
                                              priority="2"
                                              filter={['token']}
                                              onClick={handleConfClear}
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
                                        ? formatFromWei(getMint()[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </div>
                                  )}
                                  {activeTab === 'burn' && (
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn()[1], 6)
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
                                        ? formatFromWei(getMint()[0], 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                      s
                                    </span>
                                  )}

                                  {activeTab === 'burn' && (
                                    <span className="subtitle-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn()[0], 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                    </span>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer>
                          {activeTab === 'mint' && (
                            <Row>
                              <Col>
                                <div className="output-card text-center">
                                  The minted SynthYield tokens will be deposited
                                  directly into the SynthVault & locked for{' '}
                                  {_convertTimeUnits()[0]}{' '}
                                  {_convertTimeUnits()[1]}.
                                </div>
                                <Form className="my-2 text-center">
                                  <span className="output-card">
                                    Confirm; your synths will be locked for{' '}
                                    {_convertTimeUnits()[0]}{' '}
                                    {_convertTimeUnits()[1]}
                                    <Form.Check
                                      type="switch"
                                      id="confirmLockout"
                                      className="ms-2 d-inline-flex"
                                      checked={confirmSynth}
                                      onChange={() =>
                                        setConfirmSynth(!confirmSynth)
                                      }
                                    />
                                  </span>
                                </Form>
                              </Col>
                            </Row>
                          )}
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
                                    onClick={() => handleSwapToSynth()}
                                    className="w-100"
                                    disabled={!checkValid()[0]}
                                  >
                                    {checkValid()[1]}
                                    {txnLoading && (
                                      <Icon
                                        icon="cycle"
                                        size="20"
                                        className="anim-spin ms-1"
                                      />
                                    )}
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
                                    className="w-100"
                                    onClick={() => handleSwapFromSynth()}
                                    disabled={!checkValid()[0]}
                                  >
                                    {checkValid()[1]}
                                    {txnLoading && (
                                      <Icon
                                        icon="cycle"
                                        size="20"
                                        className="anim-spin ms-1"
                                      />
                                    )}
                                  </Button>
                                </Col>
                              </>
                            )}
                          </Row>
                          {activeTab === 'mint' && getMint()[2] > 0 && (
                            <div className="text-card text-center mt-2">
                              {`${
                                getToken(
                                  assetSwap1.tokenAddress === addr.spartav2
                                    ? assetSwap2.tokenAddress
                                    : assetSwap1.tokenAddress,
                                )?.symbol
                              }:SPARTA pool will receive a ${formatFromWei(
                                getMint()[2],
                                4,
                              )} SPARTA dividend`}
                            </div>
                          )}
                          {activeTab === 'mint' && getMint()[3] > 0 && (
                            <div className="text-card text-center mt-2">
                              {`${
                                getToken(assetSwap2.tokenAddress)?.symbol
                              }:SPARTA pool will receive a ${formatFromWei(
                                getMint()[3],
                                4,
                              )} SPARTA dividend`}
                            </div>
                          )}
                          {activeTab === 'burn' && getBurn()[2] > 0 && (
                            <div className="text-card text-center mt-2">
                              {`${
                                getToken(
                                  assetSwap1.tokenAddress === addr.spartav2
                                    ? assetSwap2.tokenAddress
                                    : assetSwap1.tokenAddress,
                                )?.symbol
                              }:SPARTA pool will receive a ${formatFromWei(
                                getBurn()[2],
                                4,
                              )} SPARTA dividend`}
                            </div>
                          )}
                          {activeTab === 'burn' && getBurn()[3] > 0 && (
                            <div className="text-card text-center mt-2">
                              {`${
                                getToken(assetSwap2.tokenAddress)?.symbol
                              }:SPARTA pool will receive a ${formatFromWei(
                                getBurn()[3],
                                4,
                              )} SPARTA dividend`}
                            </div>
                          )}
                        </Card.Footer>
                      </Card>
                    ) : (
                      <Card xs="auto" className="card-480">
                        <Card.Header className="p-0 border-0 mb-3">
                          <Row className="px-4 pt-3 pb-1">
                            <Col xs="auto">{t('synths')}</Col>
                            <Col className="text-end">
                              <NewSynth />
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body className="output-card">
                          No synth assets have been deployed yet
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                  <Col xs="auto">
                    {!isLoading() &&
                      synthCount() > 0 &&
                      assetSwap1.tokenAddress !== addr.spartav2 &&
                      assetSwap2.tokenAddress !== assetSwap1.tokenAddress && (
                        <SwapPair assetSwap={assetSwap1} />
                      )}
                    {!isLoading() &&
                      synthCount() > 0 &&
                      assetSwap2.tokenAddress !== addr.spartav2 && (
                        <SwapPair assetSwap={assetSwap2} />
                      )}
                  </Col>
                </Row>
              </>
            ) : (
              <HelmetLoading height={300} width={300} />
            )}
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
