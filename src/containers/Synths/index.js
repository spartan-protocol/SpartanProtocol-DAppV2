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
import Popover from 'react-bootstrap/Popover'
import Nav from 'react-bootstrap/Nav'
import { useAccount, useWalletClient } from 'wagmi'
import AssetSelect from '../../components/AssetSelect/index'
import {
  formatShortString,
  // synthHarvestLive,
  tempChains,
} from '../../utils/web3'
import { usePool } from '../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
} from '../../utils/bigNumber'
import { swapSynthToAsset } from '../../store/router'
import HelmetLoading from '../../components/Spinner/index'
import Approval from '../../components/Approval/index'
// import SwapPair from '../Swap/SwapPair'
import Share from '../../components/Share/index'
import WrongNetwork from '../../components/WrongNetwork/index'
import NewSynth from './NewSynth'
import { Icon } from '../../components/Icons/index'
import { useSparta } from '../../store/sparta'
import { balanceWidths } from '../Liquidity/Components/Utils'
import { burnSynth } from '../../utils/math/router'
import {
  useSynth,
  // getSynthGlobalDetails,
  // getSynthMemberDetails,
  // getSynthMinting,
  // synthHarvestSingle,
  // synthVaultWeight,
} from '../../store/synth'
// import { convertTimeUnits, getSecsSince } from '../../utils/math/nonContract'
import { Tooltip } from '../../components/Tooltip/index'
// import { calcCurrentRewardSynth } from '../../utils/math/synthVault'
// import { useReserve } from '../../store/reserve'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'
import { appAsset, useApp } from '../../store/app'
import { getPool, getSynth, getToken } from '../../utils/math/utils'

const Swap = () => {
  const dispatch = useDispatch()
  const focus = useFocus()
  const location = useLocation()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { addresses, asset1, asset2, chainId } = useApp()
  // const dao = useDao()
  const pool = usePool()
  // const reserve = useReserve()
  const sparta = useSparta()
  const synth = useSynth()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  // const [harvestLoading, setHarvestLoading] = useState(false)
  // const [harvestConfirm, setHarvestConfirm] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('burn')
  // const [confirmSynth, setConfirmSynth] = useState(false)
  const [loadedInitial, setloadedInitial] = useState(false)

  const [assetSwap1, setAssetSwap1] = useState(false)
  const [assetSwap2, setAssetSwap2] = useState(false)
  const [token1, settoken1] = useState(false)
  const [token2, settoken2] = useState(false)
  const [synth1, setsynth1] = useState(false)
  const [bnbBalance, setbnbBalance] = useState(false)
  // const [getMint, setGetMint] = useState([
  //   '0.00',
  //   '0.00',
  //   '0.00',
  //   '0.00',
  //   false,
  //   false,
  // ])
  const [getBurn, setGetBurn] = useState(['0.00', '0.00', '0.00', '0.00'])

  useEffect(() => {
    const getGlobals = () => {
      // dispatch(getSynthGlobalDetails())
      // dispatch(getSynthMemberDetails(address))
    }
    getGlobals() // Run on load
    const interval = setInterval(() => {
      getGlobals() // Run on interval
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, address])

  // useEffect(() => {
  //   dispatch(synthVaultWeight())
  // }, [dispatch, synth.synthDetails])

  // useEffect(() => {
  //   const checkDetails = () => {
  //     if (tempChains.includes(chainId)) {
  //       // dispatch(getSynthGlobalDetails())
  //       // dispatch(getSynthMinting())
  //     }
  //   }
  //   checkDetails()
  // }, [dispatch, chainId, pool.poolDetails, wallet])

  // Check and set selected assets based on URL params ONLY ONCE
  useEffect(() => {
    if (!loadedInitial && pool.poolDetails.length > 0) {
      const assetParam1 = new URLSearchParams(location.search).get(`asset1`)
      const assetParam2 = new URLSearchParams(location.search).get(`asset2`)
      const typeParam1 = new URLSearchParams(location.search).get(`type1`)
      let _asset1Addr =
        assetParam1 === addresses.wbnb ? addresses.bnb : assetParam1
      let _asset2Addr =
        assetParam2 === addresses.wbnb ? addresses.bnb : assetParam2
      _asset1Addr = getPool(_asset1Addr, pool.poolDetails).tokenAddress ?? false
      _asset2Addr = getPool(_asset2Addr, pool.poolDetails).tokenAddress ?? false
      if (typeParam1 === 'synth') {
        setActiveTab('burn')
      }
      dispatch(appAsset('1', _asset1Addr, 'token'))
      dispatch(appAsset('2', _asset2Addr, 'token'))
      setloadedInitial(true)
    }
  }, [
    addresses.bnb,
    addresses.wbnb,
    dispatch,
    loadedInitial,
    location.search,
    pool.poolDetails,
  ])

  // Check selected assets and validate for synth page
  useEffect(() => {
    const getAssetDetails = () => {
      if (loadedInitial && focus && pool.poolDetails?.length > 0) {
        let _asset1Addr = asset1.addr
        let _asset2Addr = asset2.addr

        if (activeTab === 'mint') {
          // if (!getPool(_asset1Addr, pool.poolDetails)) {
          //   _asset1Addr = addresses.spartav2
          // }
          // if (!getPool(_asset2Addr, pool.poolDetails)?.curated) {
          //   _asset2Addr = addresses.bnb
          // }
        } else {
          if (!getSynth(_asset1Addr, synth.synthDetails)) {
            _asset1Addr = addresses.bnb
          }
          if (!getPool(_asset2Addr, pool.poolDetails)) {
            _asset2Addr = addresses.spartav2
          }
        }

        dispatch(
          appAsset('1', _asset1Addr, activeTab === 'mint' ? 'token' : 'synth'),
        )
        dispatch(
          appAsset('2', _asset2Addr, activeTab === 'mint' ? 'synth' : 'token'),
        )
      }
    }
    getAssetDetails()
    balanceWidths()
  }, [
    activeTab,
    pool.poolDetails,
    synth.synthDetails,
    focus,
    addresses.bnb,
    addresses.spartav2,
    loadedInitial,
    asset1.addr,
    asset2.addr,
    dispatch,
  ])

  useEffect(() => {
    if (
      pool.tokenDetails.length > 0 &&
      pool.poolDetails.length > 0 &&
      synth.synthDetails.length > 0
    ) {
      const _token1 = getToken(asset1.addr, pool.tokenDetails)
      const _token2 = getToken(asset2.addr, pool.tokenDetails)
      const _pool1 = getPool(asset1.addr, pool.poolDetails)
      const _pool2 = getPool(asset2.addr, pool.poolDetails)
      const _synth1 = getSynth(
        activeTab === 'mint' ? asset2.addr : asset1.addr,
        synth.synthDetails,
      )
      const _bnbBalance = getToken(addresses.bnb, pool.tokenDetails).balance
      if (_token1) {
        settoken1(_token1)
      }
      if (_token2) {
        settoken2(_token2)
      }
      if (_pool1) {
        setAssetSwap1(_pool1)
      }
      if (_pool2) {
        setAssetSwap2(_pool2)
      }
      if (_synth1?.address) {
        setsynth1(_synth1)
      }
      if (_bnbBalance) {
        setbnbBalance(_bnbBalance)
      }
    }
  }, [
    activeTab,
    addresses.bnb,
    asset1.addr,
    asset2.addr,
    pool.poolDetails,
    pool.tokenDetails,
    synth.synthDetails,
  ])

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  // const handleConfClear = () => {
  //   setConfirmSynth(false)
  // }

  // useEffect(() => {
  //   handleConfClear()
  // }, [activeTab])

  // const _convertTimeUnits = () => {
  //   if (synth.globalDetails) {
  //     const [units, timeString] = convertTimeUnits(
  //       synth.globalDetails.minTime,
  //       t,
  //     )
  //     return [units, timeString]
  //   }
  //   return ['1', 'day']
  // }

  //= =================================================================================//
  // Functions SWAP calculations

  const getBalance = (asset) => {
    if (asset === 1) {
      return asset1.type === 'token' ? token1.balance : synth1.balance
    }
    return asset2.type === 'token' ? token2.balance : synth1.balance
  }

  //= =================================================================================//
  // Functions for SWAP input handling
  /**
   * Get synth mint txn details
   * @returns [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
   */
  // const doMint = () => {
  //   if (
  //     activeTab === 'mint' &&
  //     swapInput1 &&
  //     assetSwap1 &&
  //     assetSwap2 &&
  //     synth1
  //   ) {
  //     const [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped] =
  //       mintSynth(
  //         convertToWei(swapInput1.value),
  //         assetSwap1,
  //         assetSwap2,
  //         synth1,
  //         sparta.globalDetails.feeOnTransfer,
  //         assetSwap1.tokenAddress === addresses.spartav2,
  //       )
  //     setGetMint([
  //       synthOut,
  //       slipFee,
  //       diviSynth,
  //       diviSwap,
  //       baseCapped,
  //       synthCapped,
  //     ])
  //     swapInput2.value = convertFromWei(synthOut, 18)
  //   }
  // }

  /**
   * Get synth burn txn details
   * @returns [tokenOut, slipFee, diviSynth, diviSwap]
   */
  const doBurn = () => {
    if (activeTab === 'burn' && swapInput1 && assetSwap1 && assetSwap2) {
      const [tokenOut, slipFee, diviSynth, diviSwap] = burnSynth(
        convertToWei(swapInput1.value),
        assetSwap2,
        assetSwap1,
        sparta.globalDetails.feeOnTransfer,
        assetSwap2.tokenAddress === addresses.spartav2,
      )
      setGetBurn([tokenOut, slipFee, diviSynth, diviSwap])
      swapInput2.value = convertFromWei(tokenOut, 18)
    }
  }

  const updateMintBurn = () => {
    // doMint()
    doBurn()
  }

  const clearInputs = () => {
    // handleConfClear()
    if (swapInput1) {
      swapInput1.value = ''
      swapInput1.focus()
    }
    if (swapInput2) {
      swapInput2.value = ''
    }
    updateMintBurn()
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  const getRevenue = () => {
    let result = '0.00'
    if (activeTab === 'mint') {
      // result = BN(getMint[1]).plus(getMint[2])
    } else {
      result = BN(getBurn[1]).plus(getBurn[2])
    }
    result = result > 0 ? result : '0.00'
    return result
  }

  //= =================================================================================//
  // Functions for input handling

  // GET USD VALUES
  // const getInput1USD = () => {
  //   if (assetSwap1.tokenAddress === addresses.spartav2) {
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
  //   if (assetSwap2.tokenAddress === addresses.spartav2) {
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

  // const estMaxGasSynthOut = '5000000000000000'
  const estMaxGasSynthIn = '5000000000000000'
  const enoughGas = () => {
    if (activeTab === 'mint') {
      // if (BN(bnbBalance).isLessThan(estMaxGasSynthOut)) {
      //   return false
      // }
    }
    if (BN(bnbBalance).isLessThan(estMaxGasSynthIn)) {
      return false
    }
    return true
  }

  // const secsSinceHarvest = () => {
  //   if (dao.member.lastHarvest) { // I think this is meant to be synth.synthDetails[i].lastHarvest
  //     return getSecsSince(dao.member.lastHarvest) // I think this is meant to be synth.synthDetails[i].lastHarvest
  //   } // I think this is meant to be synth.synthDetails[i].lastHarvest
  //   return '0' // I think this is meant to be synth.synthDetails[i].lastHarvest
  // }

  // const getClaimable = () => {
  //   const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
  //     pool.poolDetails,
  //     synth,
  //     synth1,
  //     sparta.globalDetails,
  //     sparta.globalDetails.spartaBalance,
  //   )
  //   return [reward, baseCapped, synthCapped]
  // }

  // const checkValidHarvest = () => {
  //   const reward = formatFromWei(getClaimable()[0], 4)
  //   if (!sparta.globalDetails.emissions) {
  //     return [false, t('incentivesDisabled'), '']
  //   }
  //   if (getClaimable()[1]) {
  //     return [false, t('baseCap'), '']
  //   }
  //   if (getClaimable()[2]) {
  //     return [true, reward, ' SPARTA']
  //   }
  //   return [true, reward, ` ${token2.symbol}s`]
  // }

  const checkValid = () => {
    if (!address) {
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
    const _symbolIn = token1.symbol
    const _symbolOut = token2.symbol
    // if (activeTab === 'mint') {
    //   // if (!synth.synthMinting) {
    //   //   return [false, t('synthsDisabled')]
    //   // }
    //   if (getMint[5]) {
    //     return [false, t('synthAtCapacity')]
    //   }
    //   if (getMint[4]) {
    //     return [false, t('poolAtCapacity')]
    //   }
    //   if (!confirmSynth) {
    //     return [false, t('confirmLockup')]
    //   }
    //   if (synth1.staked > 0 && secsSinceHarvest() > 300) {
    //     if (!harvestConfirm) {
    //       return [false, t('confirmHarvest')]
    //     }
    //   }
    // }
    if (activeTab === 'burn') {
      return [true, `${t('melt')} ${_symbolIn}s`]
    }
    return [true, `${t('forge')} ${_symbolOut}s`]
  }

  const synthCount = () => synth.synthDetails.filter((x) => x.address).length

  // const handleSwapToSynth = async () => {
  //   const gasSafety = '10000000000000000'
  //   if (
  //     assetSwap1?.tokenAddress === addresses.bnb ||
  //     assetSwap1?.tokenAddress === addresses.wbnb
  //   ) {
  //     if (
  //       BN(bnbBalance)
  //         .minus(convertToWei(swapInput1?.value))
  //         .isLessThan(gasSafety)
  //     ) {
  //       swapInput1.value = convertFromWei(BN(bnbBalance).minus(gasSafety))
  //       updateMintBurn()
  //     }
  //   }
  //   setTxnLoading(true)
  //   await dispatch(
  //     swapAssetToSynth(
  //       convertToWei(swapInput1?.value),
  //       assetSwap1.tokenAddress,
  //       synth1.address,
  //       wallet,
  //     ),
  //   )
  //   setTxnLoading(false)
  //   clearInputs()
  // }

  const handleSwapFromSynth = async () => {
    setTxnLoading(true)
    await dispatch(
      swapSynthToAsset(
        convertToWei(swapInput1?.value),
        synth1.address,
        assetSwap2.tokenAddress,
        address,
        walletClient,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  // const handleHarvest = async () => {
  //   setHarvestLoading(true)
  //   await dispatch(synthHarvestSingle(synth1.address, wallet))
  //   setHarvestLoading(false)
  // }

  const isLoading = () => {
    if (
      !pool.poolDetails ||
      !synth.synthDetails ||
      // !synth.globalDetails ||
      synth.synthDetails.length <= 0 ||
      pool.tokenDetails.length <= 0
    ) {
      return true
    }
    // if (address && !synth.member) {
    //   return true
    // }
    return false
  }

  const checkWallet = () => {
    if (!address) {
      setShowWalletWarning1(!showWalletWarning1)
    }
  }

  // const getSynthSupply = () => synth1.totalSupply
  // const getSynthStir = () =>
  //   stirCauldron(assetSwap2, assetSwap2.tokenAmount, synth1)
  // const getSynthCapPC = () =>
  //   BN(getSynthSupply())
  //     .div(BN(getSynthSupply()).plus(getSynthStir()))
  //     .times(100)
  // const getMintedSynthCapPC = () =>
  //   BN(getMint[0]).div(BN(getSynthSupply()).plus(getSynthStir())).times(100)

  return (
    <>
      <div className="content">
        {tempChains.includes(chainId) && (
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
                            {/* <Nav.Item className="me-1">
                              <Nav.Link
                                eventKey="mint"
                                className="btn-sm btn-outline-primary"
                                onClick={() => {
                                  toggle('mint')
                                }}
                              >
                                {t('forge')}
                              </Nav.Link>
                            </Nav.Item> */}
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
                            {/* <Nav.Item className="me-1">
                              <Nav.Link
                                className="btn-sm btn-outline-primary"
                                onClick={() =>
                                  setShowCreateModal(!showCreateModal)
                                }
                              >
                                {t('create')}
                              </Nav.Link>
                            </Nav.Item> */}
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
                                        swapInput1.focus()
                                        swapInput1.value = convertFromWei(
                                          getBalance(1),
                                        )
                                        updateMintBurn()
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
                                            onClick={() => clearInputs()}
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
                                            onChange={() => updateMintBurn()}
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
                                              : synth1.address,
                                          )}
                                          <ShareLink
                                            url={
                                              activeTab === 'mint'
                                                ? assetSwap1?.tokenAddress
                                                : synth1.address
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
                                                : synth1.address,
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

                              {/* {activeTab === 'mint' && (
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
                                              onClick={() => clearInputs()}
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
                                            {formatShortString(synth1.address)}
                                            <ShareLink url={synth1.address}>
                                              <Icon
                                                icon="copy"
                                                size="14"
                                                className="ms-1 mb-1"
                                              />
                                            </ShareLink>
                                            <a
                                              href={getExplorerContract(
                                                synth1.address,
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
                                          </Col> */}
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
                              {/* </Row>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              )} */}

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
                                              onClick={() => clearInputs()}
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
                              {/* {activeTab === 'mint' && (
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
                              )} */}

                              <Row className="mb-2">
                                <Col xs="auto">{t('fee')}</Col>
                                <Col className="text-end">
                                  {/* {activeTab === 'mint' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(getMint[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </>
                                  )} */}
                                  {activeTab === 'burn' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn[1], 6)
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
                                  {/* {activeTab === 'mint' && (
                                    <strong>
                                      {swapInput1?.value
                                        ? formatFromWei(getMint[0], 6)
                                        : '0.00'}{' '}
                                      {token2.symbol}s
                                    </strong>
                                  )} */}

                                  {activeTab === 'burn' && (
                                    <strong>
                                      {swapInput1?.value
                                        ? formatFromWei(getBurn[0], 6)
                                        : '0.00'}{' '}
                                      {token2.symbol}
                                    </strong>
                                  )}
                                </Col>
                              </Row>
                              {/* {activeTab === 'mint' && (
                                <>
                                  {synth1.staked > 0 &&
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
                                              token2.symbol,
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
                              )} */}
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer>
                          {/* 'Approval/Allowance' row */}
                          <Row className="text-center">
                            {/* {activeTab === 'mint' && (
                              <>
                                {assetSwap1?.tokenAddress !== addresses.bnb &&
                                  address &&
                                  swapInput1?.value && (
                                    <Approval
                                      tokenAddress={assetSwap1?.tokenAddress}
                                      symbol={token1.symbol}
                                      walletAddress={address}
                                      contractAddress={addresses.router}
                                      txnAmount={convertToWei(
                                        swapInput1?.value,
                                      )}
                                      assetNumber="1"
                                    />
                                  )}
                                <Col className="hide-if-siblings">
                                  <Row>
                                    {synth1.staked > 0 &&
                                      secsSinceHarvest() > 300 && (
                                        <Col>
                                          <Button
                                            className="w-100"
                                            onClick={() => handleHarvest()}
                                            disabled={
                                              synth1.staked <= 0 ||
                                              !enoughGas() ||
                                              sparta.globalDetails
                                                .globalFreeze ||
                                              !synthHarvestLive
                                            }
                                          >
                                            {synthHarvestLive
                                              ? enoughGas()
                                                ? sparta.globalDetails
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
                            )} */}
                            {activeTab === 'burn' && (
                              <>
                                {address && swapInput1?.value && (
                                  <Approval
                                    tokenAddress={synth1.address}
                                    symbol={`${token1.symbol}s`}
                                    walletAddress={address}
                                    contractAddress={addresses.router}
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
                    {/* {!isLoading() &&
                      synthCount() > 0 &&
                      assetSwap1.tokenAddress !== addresses.spartav2 &&
                      assetSwap2.tokenAddress !== assetSwap1.tokenAddress && (
                        <SwapPair assetSwap={assetSwap1} />
                      )}
                    {!isLoading() &&
                      synthCount() > 0 &&
                      assetSwap2.tokenAddress !== addresses.spartav2 && (
                        <SwapPair assetSwap={assetSwap2} />
                      )} */}
                  </Col>
                </Row>
              </>
            ) : (
              <HelmetLoading height={150} width={150} />
            )}
          </>
        )}
        {!tempChains.includes(chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
