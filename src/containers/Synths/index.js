import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Form from 'react-bootstrap/Form'
import Popover from 'react-bootstrap/Popover'
import Nav from 'react-bootstrap/Nav'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useWeb3React } from '@web3-react/core'
import AssetSelect from '../../components/AssetSelect/index'
import {
  formatShortString,
  getAddresses,
  getItemFromArray,
  getNetwork,
  synthHarvestLive,
  tempChains,
} from '../../utils/web3'
import { usePool } from '../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
} from '../../utils/bigNumber'
import { swapAssetToSynth, swapSynthToAsset } from '../../store/router'
import HelmetLoading from '../../components/Spinner/index'
import Approval from '../../components/Approval/index'
import SwapPair from '../Swap/SwapPair'
import Share from '../../components/Share/index'
import WrongNetwork from '../../components/WrongNetwork/index'
import NewSynth from './NewSynth'
import { Icon } from '../../components/Icons/index'
import { useSparta } from '../../store/sparta'
import { balanceWidths } from '../Liquidity/Components/Utils'
import { burnSynth, mintSynth, stirCauldron } from '../../utils/math/router'
import {
  useSynth,
  getSynthDetails,
  getSynthGlobalDetails,
  getSynthMemberDetails,
  getSynthMinting,
  synthHarvestSingle,
  synthVaultWeight,
} from '../../store/synth'
import { convertTimeUnits, getSecsSince } from '../../utils/math/nonContract'
import { Tooltip } from '../../components/Tooltip/index'
import { calcCurrentRewardSynth } from '../../utils/math/synthVault'
import { useReserve } from '../../store/reserve'
import { useDao, daoMemberDetails } from '../../store/dao'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'

const Swap = () => {
  const wallet = useWeb3React()
  const synth = useSynth()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const dao = useDao()
  const pool = usePool()
  const reserve = useReserve()
  const sparta = useSparta()
  const location = useLocation()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)
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

  const [hasFocus, setHasFocus] = useState(true)

  window.addEventListener('focus', () => {
    setHasFocus(true)
  })

  window.addEventListener('blur', () => {
    setHasFocus(false)
  })

  useEffect(() => {
    const getGlobals = () => {
      dispatch(getSynthGlobalDetails())
      dispatch(getSynthMemberDetails(wallet.account))
      dispatch(daoMemberDetails(wallet.account))
    }
    getGlobals() // Run on load
    const interval = setInterval(() => {
      getGlobals() // Run on interval
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, wallet.account])

  useEffect(() => {
    dispatch(getSynthDetails(wallet))
  }, [dispatch, synth.synthArray, wallet])

  useEffect(() => {
    dispatch(synthVaultWeight())
  }, [dispatch, synth.synthDetails])

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    const checkDetails = () => {
      if (tempChains.includes(getNetwork().chainId)) {
        dispatch(getSynthGlobalDetails())
        dispatch(getSynthDetails(wallet))
        dispatch(getSynthMinting())
      }
    }
    checkDetails()
  }, [dispatch, pool.listedPools, wallet])

  useEffect(() => {
    const { poolDetails } = pool

    const getAssetDetails = () => {
      if (hasFocus) {
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
            !pool.poolDetails.find(
              (x) => x.tokenAddress === asset1.tokenAddress,
            )
          ) {
            asset1 = { tokenAddress: addr.spartav2 }
          }

          if (
            !asset2 ||
            !pool.poolDetails.find(
              (x) => x.tokenAddress === asset2.tokenAddress,
            )
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
    hasFocus,
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

  const getRevenue = () => {
    let result = '0.00'
    if (activeTab === 'mint') {
      result = BN(getMint()[1]).plus(getMint()[2])
    } else {
      result = BN(getBurn()[1]).plus(getBurn()[2])
    }
    result = result > 0 ? result : '0.00'
    return result
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
  // const getInput1USD = () => {
  //   if (assetSwap1.tokenAddress === addr.spartav2) {
  //     return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
  //   }
  //   if (swapInput1?.value) {
  //     return BN(
  //       calcSpotValueInBase(convertToWei(swapInput1?.value), assetSwap1),
  //     ).times(web3.spartaPrice)
  //   }
  //   return '0'
  // }

  // GET USD VALUES
  // const getInput2USD = () => {
  //   if (assetSwap2.tokenAddress === addr.spartav2) {
  //     return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
  //   }
  //   if (swapInput2?.value) {
  //     return BN(
  //       calcSpotValueInBase(convertToWei(swapInput2?.value), assetSwap2),
  //     ).times(web3.spartaPrice)
  //   }
  //   return '0'
  // }

  // const getRateSlip = () => {
  //   if (assetSwap1 && swapInput1?.value > 0 && swapInput2?.value > 0) {
  //     return BN(getInput2USD()).div(getInput1USD()).minus('1').times('100')
  //   }
  //   return '0'
  // }

  const estMaxGasSynthOut = '5000000000000000'
  const estMaxGasSynthIn = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb).balance
    if (activeTab === 'mint') {
      if (BN(bal).isLessThan(estMaxGasSynthOut)) {
        return false
      }
    }
    if (BN(bal).isLessThan(estMaxGasSynthIn)) {
      return false
    }
    return true
  }

  const secsSinceHarvest = () => {
    if (dao.member.lastHarvest) {
      return getSecsSince(dao.member.lastHarvest)
    }
    return '0'
  }

  const getClaimable = () => {
    const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      getSynth(assetSwap2.tokenAddress),
      sparta.globalDetails,
      reserve.globalDetails.spartaBalance,
    )
    return [reward, baseCapped, synthCapped]
  }

  const checkValidHarvest = () => {
    const reward = formatFromWei(getClaimable()[0], 4)
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled'), '']
    }
    if (getClaimable()[1]) {
      return [false, t('baseCap'), '']
    }
    if (getClaimable()[2]) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${getToken(assetSwap2.tokenAddress)?.symbol}s`]
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (swapInput1?.value <= 0) {
      return [false, t('checkInput')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (BN(convertToWei(swapInput1?.value)).isGreaterThan(getBalance(1))) {
      return [false, t('checkBalance')]
    }
    const _symbolIn = getToken(assetSwap1.tokenAddress)?.symbol
    const _symbolOut = getToken(assetSwap2.tokenAddress)?.symbol
    if (activeTab === 'mint') {
      // if (!synth.synthMinting) {
      //   return [false, t('synthsDisabled')]
      // }
      if (getMint()[5]) {
        return [false, t('synthAtCapacity')]
      }
      if (getMint()[4]) {
        return [false, t('poolAtCapacity')]
      }
      if (!confirmSynth) {
        return [false, t('confirmLockup')]
      }
      if (
        getSynth(assetSwap2.tokenAddress)?.staked > 0 &&
        secsSinceHarvest() > 300
      ) {
        if (!harvestConfirm) {
          return [false, t('confirmHarvest')]
        }
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

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(
      synthHarvestSingle(getSynth(assetSwap2.tokenAddress)?.address, wallet),
    )
    setHarvestLoading(false)
    if (synth.synthArray?.length > 1) {
      dispatch(getSynthDetails(wallet))
    }
  }

  const isLoading = () => {
    if (
      !pool.poolDetails ||
      !synth.synthDetails ||
      !synth.globalDetails ||
      synth.synthDetails.length <= 0 ||
      pool.tokenDetails.length <= 0 ||
      !assetSwap1 ||
      !assetSwap2
    ) {
      return true
    }
    if (wallet.account && !synth.member) {
      return true
    }
    return false
  }

  const checkWallet = () => {
    if (!wallet.account) {
      setShowWalletWarning1(!showWalletWarning1)
    }
  }

  const getSynthSupply = () => getSynth(assetSwap2.tokenAddress)?.totalSupply
  const getSynthStir = () =>
    stirCauldron(
      assetSwap2,
      assetSwap2.tokenAmount,
      getSynth(assetSwap2.tokenAddress),
    )
  const getSynthCapPC = () =>
    BN(getSynthSupply())
      .div(BN(getSynthSupply()).plus(getSynthStir()))
      .times(100)
  const getMintedSynthCapPC = () =>
    BN(getMint()[0]).div(BN(getSynthSupply()).plus(getSynthStir())).times(100)

  return (
    <>
      <div className="content">
        {tempChains.includes(getNetwork().chainId) && (
          <>
            {/* MODALS */}
            {showCreateModal && (
              <NewSynth
                setShowModal={setShowCreateModal}
                showModal={showCreateModal}
              />
            )}

            {showShareModal && (
              <Share
                setShowShare={setShowShareModal}
                showShare={showShareModal}
              />
            )}
            {!isLoading() ? (
              <>
                <Row>
                  <Col>
                    {synthCount() > 0 ? (
                      <Card className="mb-2" style={{ minWidth: '300px' }}>
                        <Card.Header>
                          <Nav variant="pills" activeKey={activeTab} fill>
                            <Nav.Item className="me-1">
                              <Nav.Link
                                eventKey="mint"
                                className="btn-sm btn-outline-primary"
                                onClick={() => {
                                  toggle('mint')
                                }}
                              >
                                {t('forge')}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="me-1">
                              <Nav.Link
                                eventKey="burn"
                                className="btn-sm btn-outline-primary"
                                onClick={() => {
                                  toggle('burn')
                                }}
                              >
                                {t('melt')}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="me-1">
                              <Nav.Link
                                className="btn-sm btn-outline-primary"
                                onClick={() =>
                                  setShowCreateModal(!showCreateModal)
                                }
                              >
                                {t('create')}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                className="btn-sm btn-outline-primary"
                                onClick={() =>
                                  setShowShareModal(!showShareModal)
                                }
                              >
                                <Icon icon="share" size="15" />
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Card.Header>

                        <Card.Body>
                          <Row>
                            <Col xs="12">
                              <Card className="assetSection">
                                <Card.Body>
                                  <Row>
                                    {/* 'From' input box */}
                                    <Col>
                                      <strong>
                                        {' '}
                                        {activeTab === 'mint'
                                          ? t('add')
                                          : t('melt')}
                                      </strong>
                                    </Col>

                                    <Col
                                      xs="auto"
                                      className="float-end text-end fw-light"
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
                                      <OverlayTrigger
                                        placement="auto"
                                        overlay={Tooltip(
                                          t,
                                          formatFromWei(getBalance(1), 18),
                                        )}
                                      >
                                        <span role="button">
                                          {formatFromWei(getBalance(1))}
                                        </span>
                                      </OverlayTrigger>
                                      <Badge bg="primary" className="ms-1 mb-1">
                                        MAX
                                      </Badge>
                                    </Col>
                                  </Row>

                                  <Row className="my-1">
                                    <Col>
                                      <InputGroup className="m-0 py-3">
                                        <InputGroup.Text
                                          id="assetSelect1"
                                          className="bg-transparent border-0"
                                        >
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
                                          <FormControl
                                            className="text-end ms-0 bg-transparent border-0 text-lg"
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="0"
                                            id="swapInput1"
                                            autoComplete="off"
                                            autoCorrect="off"
                                          />
                                        </OverlayTrigger>

                                        <InputGroup.Text
                                          role="button"
                                          className="bg-transparent border-0 p-1"
                                          tabIndex={-1}
                                          onKeyPress={() => clearInputs(1)}
                                          onClick={() => clearInputs(1)}
                                        >
                                          <Icon icon="close" size="16" />
                                        </InputGroup.Text>
                                      </InputGroup>

                                      <Row className="pt-1 fw-light">
                                        <Col>
                                          {formatShortString(
                                            activeTab === 'mint'
                                              ? assetSwap1?.tokenAddress
                                              : getSynth(
                                                  assetSwap1?.tokenAddress,
                                                )?.address,
                                          )}
                                          <ShareLink
                                            url={
                                              activeTab === 'mint'
                                                ? assetSwap1?.tokenAddress
                                                : getSynth(
                                                    assetSwap1?.tokenAddress,
                                                  )?.address
                                            }
                                          >
                                            <Icon
                                              icon="copy"
                                              size="14"
                                              className="ms-1 mb-1"
                                            />
                                          </ShareLink>
                                          <a
                                            href={getExplorerContract(
                                              activeTab === 'mint'
                                                ? assetSwap1?.tokenAddress
                                                : getSynth(
                                                    assetSwap1?.tokenAddress,
                                                  )?.address,
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <Icon
                                              icon="scan"
                                              size="14"
                                              className="ms-1 mb-1"
                                            />
                                          </a>
                                        </Col>
                                        {/* <Col className="text-end">
                                          ~$
                                          {swapInput1?.value
                                            ? formatFromWei(getInput1USD(), 2)
                                            : '0.00'}
                                        </Col> */}
                                      </Row>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>

                              <Row className="iconSeparator">
                                <Col xs="auto" className="mx-auto">
                                  <Icon
                                    icon={
                                      activeTab === 'mint' ? 'mint' : 'fire'
                                    }
                                    size="30"
                                    stroke="black"
                                    fill="black"
                                    className="position-relative bg-white rounded-circle px-2 iconOnTop"
                                  />
                                </Col>
                              </Row>

                              {activeTab === 'mint' && (
                                <Card className="assetSection">
                                  <Card.Body>
                                    <Row>
                                      <Col>
                                        <strong>
                                          {activeTab === 'mint'
                                            ? t('forge')
                                            : t('receive')}
                                        </strong>
                                      </Col>
                                      <Col
                                        xs="auto"
                                        className="float-end text-end fw-light"
                                      >
                                        {t('balance')}
                                        {': '}
                                        {pool.poolDetails &&
                                          formatFromWei(getBalance(2), 4)}
                                      </Col>
                                    </Row>

                                    <Row className="my-1">
                                      <Col>
                                        <InputGroup className="m-0 py-3">
                                          <InputGroup.Text
                                            id="assetSelect2"
                                            className="bg-transparent border-0"
                                          >
                                            <AssetSelect
                                              priority="2"
                                              filter={['synth']}
                                              onClick={handleConfClear}
                                            />
                                          </InputGroup.Text>
                                          <FormControl
                                            className="text-end ms-0 bg-transparent border-0 text-lg"
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="0"
                                            id="swapInput2"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            disabled
                                          />
                                        </InputGroup>

                                        <Row className="pt-1 fw-light">
                                          <Col>
                                            {formatShortString(
                                              getSynth(assetSwap2?.tokenAddress)
                                                ?.address,
                                            )}
                                            <ShareLink
                                              url={
                                                getSynth(
                                                  assetSwap2?.tokenAddress,
                                                )?.address
                                              }
                                            >
                                              <Icon
                                                icon="copy"
                                                size="14"
                                                className="ms-1 mb-1"
                                              />
                                            </ShareLink>
                                            <a
                                              href={getExplorerContract(
                                                getSynth(
                                                  assetSwap2?.tokenAddress,
                                                )?.address,
                                              )}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <Icon
                                                icon="scan"
                                                size="14"
                                                className="ms-1 mb-1"
                                              />
                                            </a>
                                          </Col>
                                          {/* <Col className="text-end">
                                            ~$
                                            {swapInput2?.value
                                              ? formatFromWei(getInput2USD(), 2)
                                              : '0.00'}
                                            {' ('}
                                            {swapInput2?.value
                                              ? formatFromUnits(
                                                  getRateSlip(),
                                                  2,
                                                )
                                              : '0.00'}
                                            {'%)'}
                                          </Col> */}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              )}

                              {activeTab === 'burn' && (
                                <Card className="assetSection mb-3">
                                  <Card.Body>
                                    <Row>
                                      <Col>
                                        <strong>
                                          {activeTab === 'burn'
                                            ? t('receive')
                                            : t('melt')}
                                        </strong>
                                      </Col>
                                      <Col
                                        xs="auto"
                                        className="float-end text-end fw-light"
                                      >
                                        {t('balance')}
                                        {': '}
                                        {pool.poolDetails &&
                                          formatFromWei(getBalance(2), 4)}
                                      </Col>
                                    </Row>

                                    <Row className="my-1">
                                      <Col>
                                        <InputGroup className="m-0 py-3">
                                          <InputGroup.Text
                                            id="assetSelect2"
                                            className="bg-transparent border-0"
                                          >
                                            <AssetSelect
                                              priority="2"
                                              filter={['token']}
                                              onClick={handleConfClear}
                                            />
                                          </InputGroup.Text>
                                          <FormControl
                                            className="text-end ms-0 bg-transparent border-0 text-lg"
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="0"
                                            id="swapInput2"
                                            disabled
                                          />
                                        </InputGroup>

                                        <Row className="pt-1 fw-light">
                                          <Col>
                                            {formatShortString(
                                              assetSwap2?.tokenAddress,
                                            )}
                                            <ShareLink
                                              url={assetSwap2?.tokenAddress}
                                            >
                                              <Icon
                                                icon="copy"
                                                size="14"
                                                className="ms-1 mb-1"
                                              />
                                            </ShareLink>
                                            <a
                                              href={getExplorerContract(
                                                assetSwap2?.tokenAddress,
                                              )}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <Icon
                                                icon="scan"
                                                size="14"
                                                className="ms-1 mb-1"
                                              />
                                            </a>
                                          </Col>
                                          {/* <Col className="text-end">
                                            ~$
                                            {swapInput2?.value
                                              ? formatFromWei(getInput2USD(), 2)
                                              : '0.00'}
                                            {' ('}
                                            {swapInput2?.value
                                              ? formatFromUnits(
                                                  getRateSlip(),
                                                  2,
                                                )
                                              : '0.00'}
                                            {'%)'}
                                          </Col> */}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              )}

                              {/* Bottom 'synth' txnDetails row */}
                              {activeTab === 'mint' && (
                                <Row className="mb-2 mt-3">
                                  <Col xs="auto">
                                    {t('synthCap')}
                                    <OverlayTrigger
                                      placement="auto"
                                      overlay={Tooltip(t, 'synthCap')}
                                    >
                                      <span role="button">
                                        <Icon
                                          icon="info"
                                          className="ms-1"
                                          size="17"
                                        />
                                      </span>
                                    </OverlayTrigger>
                                  </Col>
                                  <Col className="text-end">
                                    {getSynthSupply() > 0 && (
                                      <ProgressBar
                                        style={{ height: '15px' }}
                                        className="mt-1"
                                      >
                                        <ProgressBar
                                          variant={
                                            getMintedSynthCapPC() > 100
                                              ? 'danger'
                                              : 'success'
                                          }
                                          key={1}
                                          now={getSynthCapPC()}
                                        />
                                        <ProgressBar
                                          variant="black"
                                          key={2}
                                          now={0.5}
                                        />
                                        <ProgressBar
                                          variant={
                                            BN(getMintedSynthCapPC()).plus(
                                              getSynthCapPC(),
                                            ) > 100
                                              ? 'primary'
                                              : 'info'
                                          }
                                          key={3}
                                          now={getMintedSynthCapPC()}
                                          label={
                                            <OverlayTrigger
                                              placement="auto"
                                              overlay={Tooltip(t, 'yourForge')}
                                            >
                                              <span role="button">
                                                <Icon
                                                  icon="info"
                                                  className="ms-1"
                                                  size="17"
                                                />
                                              </span>
                                            </OverlayTrigger>
                                          }
                                        />
                                      </ProgressBar>
                                    )}
                                  </Col>
                                </Row>
                              )}

                              <Row className="mb-2">
                                <Col xs="auto">{t('fee')}</Col>
                                <Col className="text-end">
                                  {activeTab === 'mint' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(getMint()[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </>
                                  )}
                                  {activeTab === 'burn' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn()[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </>
                                  )}
                                </Col>
                              </Row>

                              <Row className="mb-2">
                                <Col xs="auto">{t('revenue')}</Col>
                                <Col className="text-end">
                                  {formatFromWei(getRevenue(), 6)} SPARTA
                                  <OverlayTrigger
                                    placement="auto"
                                    overlay={Tooltip(t, 'swapRevInfo')}
                                  >
                                    <span role="button">
                                      <Icon
                                        icon="info"
                                        className="ms-1 mb-1"
                                        size="17"
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs="auto">
                                  <strong>{t('output')}</strong>
                                </Col>
                                <Col className="text-end">
                                  {activeTab === 'mint' && (
                                    <strong>
                                      {swapInput1?.value
                                        ? formatFromWei(getMint()[0], 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                      s
                                    </strong>
                                  )}

                                  {activeTab === 'burn' && (
                                    <strong>
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn()[0], 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                    </strong>
                                  )}
                                </Col>
                              </Row>
                              {activeTab === 'mint' && (
                                <>
                                  {getSynth(assetSwap2.tokenAddress)?.staked >
                                    0 &&
                                    secsSinceHarvest() > 300 && (
                                      <>
                                        <br />
                                        <Row xs="12" className="my-2">
                                          <Col xs="auto">
                                            Harvest Available:
                                          </Col>
                                          <Col className="text-end">
                                            {checkValidHarvest()[1]}{' '}
                                            {checkValidHarvest()[2]}
                                          </Col>
                                        </Row>
                                        <Form className="my-2 text-center">
                                          <OverlayTrigger
                                            placement="auto"
                                            overlay={Tooltip(
                                              t,
                                              'mintHarvestConfirm',
                                              getToken(assetSwap2.tokenAddress)
                                                ?.symbol,
                                            )}
                                          >
                                            <span role="button">
                                              <Icon
                                                icon="info"
                                                className="me-1 mb-1"
                                                size="17"
                                              />
                                            </span>
                                          </OverlayTrigger>
                                          {t('mintHarvestConfirmShort')}
                                          <Form.Check
                                            type="switch"
                                            id="confirmHarvest"
                                            className="ms-2 d-inline-flex"
                                            checked={harvestConfirm}
                                            onChange={() =>
                                              setHarvestConfirm(!harvestConfirm)
                                            }
                                          />
                                        </Form>
                                      </>
                                    )}
                                  <Row>
                                    <Col>
                                      <Form className="my-1 text-center">
                                        <OverlayTrigger
                                          placement="auto"
                                          overlay={Tooltip(
                                            t,
                                            'mintSynthConfirm',
                                          )}
                                        >
                                          <span role="button">
                                            <Icon
                                              icon="info"
                                              className="me-1 mb-1"
                                              size="17"
                                            />
                                          </span>
                                        </OverlayTrigger>
                                        {t('mintSynthConfirmShort')} (
                                        {_convertTimeUnits()[0]}{' '}
                                        {_convertTimeUnits()[1]})
                                        <Form.Check
                                          type="switch"
                                          id="confirmLockout"
                                          className="ms-2 d-inline-flex"
                                          checked={confirmSynth}
                                          onChange={() =>
                                            setConfirmSynth(!confirmSynth)
                                          }
                                        />
                                      </Form>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer>
                          {/* 'Approval/Allowance' row */}
                          <Row className="text-center">
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
                                  <Row>
                                    {getSynth(assetSwap2.tokenAddress)?.staked >
                                      0 &&
                                      secsSinceHarvest() > 300 && (
                                        <Col>
                                          <Button
                                            className="w-100"
                                            onClick={() => handleHarvest()}
                                            disabled={
                                              getSynth(assetSwap2.tokenAddress)
                                                .staked <= 0 ||
                                              !enoughGas() ||
                                              reserve.globalDetails
                                                .globalFreeze ||
                                              !synthHarvestLive
                                            }
                                          >
                                            {synthHarvestLive
                                              ? enoughGas()
                                                ? reserve.globalDetails
                                                    .globalFreeze
                                                  ? t('globalFreeze')
                                                  : t('harvest')
                                                : t('checkBnbGas')
                                              : t('harvestDisabled')}
                                            {harvestLoading && (
                                              <Icon
                                                fill="white"
                                                icon="cycle"
                                                size="20"
                                                className="anim-spin ms-1"
                                              />
                                            )}
                                          </Button>
                                        </Col>
                                      )}
                                    <Col>
                                      <Button
                                        onClick={() => handleSwapToSynth()}
                                        className="w-100"
                                        disabled={!checkValid()[0]}
                                      >
                                        {checkValid()[1]}
                                        {txnLoading && (
                                          <Icon
                                            fill="white"
                                            icon="cycle"
                                            size="20"
                                            className="anim-spin ms-1"
                                          />
                                        )}
                                      </Button>
                                    </Col>
                                  </Row>
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
                                        fill="white"
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
                        </Card.Footer>
                      </Card>
                    ) : (
                      <Card xs="auto">
                        <Card.Body>
                          No synth assets have been deployed yet
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                  <Col>
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
              <HelmetLoading height={150} width={150} />
            )}
          </>
        )}
        {!tempChains.includes(getNetwork().chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
