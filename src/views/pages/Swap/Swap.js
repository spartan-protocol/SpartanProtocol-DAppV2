import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Card,
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
import { calcSpotValueInBase, calcLiqValue } from '../../../utils/web3Utils'
import {
  swap,
  swapAssetToSynth,
  swapSynthToAsset,
  zapLiquidity,
} from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SwapPair from './SwapPair'
import SharePool from '../../../components/Share/SharePool'
import { useSynth } from '../../../store/synth/selector'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { useSparta } from '../../../store/sparta'
import NewPool from '../Home/NewPool'
import { Icon } from '../../../components/Icons/icons'
import { burnSynth, mintSynth, swapTo, zapLiq } from '../../../utils/web3Router'

const Swap = () => {
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const location = useLocation()
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [filter, setFilter] = useState(['token'])
  const [mode, setMode] = useState('token')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )
  const [typeParam1, setTypeParam1] = useState(
    new URLSearchParams(location.search).get(`type1`),
  )
  const [typeParam2, setTypeParam2] = useState(
    new URLSearchParams(location.search).get(`type2`),
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
        let type1 = window.localStorage.getItem('assetType1')
        let type2 = window.localStorage.getItem('assetType2')

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
        if (
          typeParam1 === 'token' ||
          typeParam1 === 'pool' ||
          typeParam1 === 'synth'
        ) {
          type1 = typeParam1
          setTypeParam1('')
        }
        if (
          typeParam2 === 'token' ||
          typeParam2 === 'pool' ||
          typeParam2 === 'synth'
        ) {
          type2 = typeParam2
          setTypeParam2('')
        }

        window.localStorage.setItem('assetType1', type1)
        window.localStorage.setItem('assetType2', type2)

        if (type1 === 'token') {
          setFilter(['token', 'synth'])
          if (type2 === 'token') {
            setMode('token')
          } else if (type2 === 'synth') {
            setMode('synthOut')
          } else {
            window.localStorage.setItem('assetType2', 'token')
          }
        } else if (type1 === 'pool') {
          setFilter(['pool'])
          setMode('pool')
          window.localStorage.setItem('assetType2', 'pool')
        } else if (type1 === 'synth') {
          setFilter(['token'])
          setMode('synthIn')
          window.localStorage.setItem('assetType2', 'token')
        }

        if (type1 !== 'synth' && type2 !== 'synth') {
          if (asset2?.tokenAddress === asset1?.tokenAddress) {
            asset2 =
              asset1?.tokenAddress !== poolDetails[1].tokenAddress
                ? { tokenAddress: poolDetails[1].tokenAddress }
                : { tokenAddress: poolDetails[2].tokenAddress }
          }
        }

        if (type1 === 'pool') {
          if (asset2?.tokenAddress === addr.spartav2) {
            asset2 = { tokenAddress: addr.bnb }
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
    mode,
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

  const handleReverseAssets = () => {
    const asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
    const asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
    const type1 = window.localStorage.getItem('assetType1')
    const type2 = window.localStorage.getItem('assetType2')
    window.localStorage.setItem('assetSelected1', JSON.stringify(asset2))
    window.localStorage.setItem('assetSelected2', JSON.stringify(asset1))
    window.localStorage.setItem('assetType1', type2)
    window.localStorage.setItem('assetType2', type1)
    clearInputs()
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
    if (type === 'pool') {
      return item.balance
    }
    if (type === 'synth') {
      return getSynth(item.tokenAddress)?.balance
    }
    return item.balanceTokens
  }

  //= =================================================================================//
  // Functions to get txn Details

  /**
   * Get swap txn details
   * @returns [output, swapFee, divi1, divi2]
   */
  const getSwap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [output, swapFee, divi1, divi2] = swapTo(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
        assetSwap2.tokenAddress === addr.spartav2,
        assetSwap1.tokenAddress === addr.spartav2,
      )
      return [output, swapFee, divi1, divi2]
    }
    return ['0.00', '0.00', '0.00', '0.00']
  }

  /**
   * Get zap txn details
   * @returns [unitsLP, swapFee]
   */
  const getZap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [unitsLP, swapFee] = zapLiq(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
      )
      return [unitsLP, swapFee]
    }
    return ['0.00', '0.00']
  }

  /**
   * Get synth mint txn details
   * @returns [synthOut, slipFee, diviSynth, diviSwap, baseCapped, synthCapped]
   */
  const getMint = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
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
    return ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00']
  }

  /**
   * Get synth burn txn details
   * @returns [tokenOut, slipFee, diviSynth, diviSwap]
   */
  const getBurn = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [tokenOut, slipFee, diviSynth, diviSwap] = burnSynth(
        convertToWei(swapInput1.value),
        assetSwap2,
        assetSwap1,
        getSynth(assetSwap1.tokenAddress),
        sparta.globalDetails.feeOnTransfer,
        assetSwap2.tokenAddress === addr.spartav2,
      )
      return [tokenOut, slipFee, diviSynth, diviSwap]
    }
    return ['0.00', '0.00', '0.00', '0.00']
  }

  //= =================================================================================//
  // Functions for input handling

  const handleInputChange = () => {
    if (swapInput1?.value) {
      swapInput2.value = convertFromWei(getSwap()[0])
    }
  }

  const handleZapInputChange = () => {
    swapInput2.value = convertFromWei(getZap()[0], 18)
  }

  const handleSynthInputChange = () => {
    if (mode === 'synthOut') {
      swapInput2.value = convertFromWei(getMint()[0], 18)
    } else if (mode === 'synthIn') {
      swapInput2.value = convertFromWei(getBurn()[0], 18)
    }
  }

  //= =================================================================================//
  // Functions for input handling

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addr.spartav2 && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (mode === 'pool') {
      if (assetSwap1 && swapInput1?.value) {
        const [_sparta, _token] = calcLiqValue(
          convertToWei(swapInput1.value),
          assetSwap1,
        )
        return BN(calcSpotValueInBase(_token, assetSwap1))
          .plus(_sparta)
          .times(web3.spartaPrice)
      }
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
    if (assetSwap2?.tokenAddress === addr.spartav2 && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (mode === 'pool') {
      if (assetSwap2 && swapInput2?.value) {
        const [_sparta, _token] = calcLiqValue(getZap()[0], assetSwap2)
        return BN(calcSpotValueInBase(_token, assetSwap2))
          .plus(_sparta)
          .times(web3.spartaPrice)
      }
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
    if (swapInput1?.value) {
      if (mode === 'token') {
        handleInputChange()
      } else if (mode === 'pool') {
        handleZapInputChange()
      } else if (mode === 'synthIn') {
        handleSynthInputChange()
      } else if (mode === 'synthOut') {
        handleSynthInputChange()
      }
    } else {
      clearInputs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2])

  const handleSwapAssets = () => {
    let gasSafety = '5000000000000000'
    if (
      assetSwap1?.tokenAddress !== addr.spartav2 &&
      assetSwap2?.tokenAddress !== addr.spartav2
    ) {
      gasSafety = '10000000000000000'
    }
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
      swap(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        assetSwap2.tokenAddress,
        wallet,
      ),
    )
  }

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
              <h2 className="text-title-small mb-0 me-3">{t('swap')}</h2>
              <NewPool />
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
                      <Card.Body>
                        {/* Top 'Input' Row */}
                        <Row>
                          {/* 'From' input box */}
                          <Col xs="12" className="px-1 px-sm-3">
                            <Card className="card-alt">
                              <Card.Body>
                                <Row>
                                  <Col xs="auto" className="text-sm-label">
                                    {t('sell')}
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
                                    <InputGroup className="m-0">
                                      <InputGroup.Text>
                                        <AssetSelect
                                          priority="1"
                                          filter={['token', 'pool', 'synth']}
                                        />
                                      </InputGroup.Text>
                                      <FormControl
                                        className="text-end ms-0"
                                        type="number"
                                        placeholder={`${t('sell')}...`}
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
                                        onKeyPress={() => clearInputs()}
                                        onClick={() => clearInputs()}
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
                              <Col
                                xs="auto"
                                className="mx-auto"
                                onClick={() => handleReverseAssets()}
                                role="button"
                              >
                                <Icon
                                  icon="swap"
                                  size="35"
                                  stroke="white"
                                  className="position-relative bg-primary rounded-circle px-2"
                                  style={{
                                    top: '-20px',
                                    zIndex: '1000',
                                  }}
                                />
                              </Col>
                            </Row>

                            {/* 'To' input box */}

                            <Card className="card-alt">
                              <Card.Body>
                                <Row>
                                  <Col xs="auto" className="text-sm-label">
                                    {t('buy')}
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
                                          filter={filter}
                                          blackList={
                                            assetSwap1.tokenAddress ===
                                              addr.spartav2 && [addr.spartav2]
                                          }
                                        />
                                      </InputGroup.Text>
                                      <FormControl
                                        className="text-end ms-0"
                                        type="number"
                                        placeholder={`${t('buy')}...`}
                                        id="swapInput2"
                                        disabled
                                      />
                                      <InputGroup.Text
                                        role="button"
                                        tabIndex={-1}
                                        onKeyPress={() => clearInputs()}
                                        onClick={() => clearInputs()}
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
                                      {swapInput2?.value
                                        ? formatFromWei(getInput2USD(), 2)
                                        : '0.00'}
                                      {' ('}
                                      {swapInput1?.value
                                        ? formatFromUnits(getRateSlip(), 2)
                                        : '0.00'}
                                      {'%)'}
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            {/* Bottom 'swap' txnDetails row */}
                            {mode === 'token' && (
                              <>
                                <Row className="mb-2 mt-3">
                                  <Col xs="auto">
                                    <div className="text-card">{t('sell')}</div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromUnits(swapInput1?.value, 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap1.tokenAddress)
                                          ?.symbol
                                      }
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="mb-2">
                                  <Col xs="auto">
                                    <div className="text-card">{t('fee')}</div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getSwap()[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="">
                                  <Col xs="auto" className="title-card">
                                    <span className="subtitle-card">
                                      {t('receive')}
                                    </span>
                                  </Col>
                                  <Col className="text-end">
                                    <span className="subtitle-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getSwap()[0], 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                    </span>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {/* Bottom 'zap' txnDetails row */}
                            {mode === 'pool' && (
                              <>
                                <Row className="mb-2 mt-3">
                                  <Col xs="auto">
                                    <div className="text-card">
                                      {t('input')}
                                    </div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromUnits(swapInput1?.value, 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap1.tokenAddress)
                                          ?.symbol
                                      }
                                      p
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="mb-2">
                                  <Col xs="auto">
                                    <div className="text-card">{t('fee')}</div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getZap()[1], 6)
                                        : '0.00'}{' '}
                                      SPARTA
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="">
                                  <Col xs="auto" className="title-card">
                                    <span className="subtitle-card">
                                      {t('output')}
                                    </span>
                                  </Col>
                                  <Col className="text-end">
                                    <span className="subtitle-card">
                                      {swapInput1?.value
                                        ? formatFromWei(getZap()[0], 6)
                                        : '0.00'}{' '}
                                      <span className="output-card">
                                        {' '}
                                        {
                                          getToken(assetSwap2.tokenAddress)
                                            ?.symbol
                                        }
                                        p
                                      </span>
                                    </span>
                                  </Col>
                                </Row>
                              </>
                            )}

                            {/* Bottom 'synth' txnDetails row */}
                            {(mode === 'synthIn' || mode === 'synthOut') && (
                              <>
                                <Row className="mb-2 mt-3">
                                  <Col xs="auto">
                                    <div className="text-card">
                                      {t('input')}
                                    </div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {swapInput1?.value
                                        ? formatFromUnits(swapInput1?.value, 6)
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap1.tokenAddress)
                                          ?.symbol
                                      }
                                      {mode === 'synthIn' && 's'}
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="mb-2">
                                  <Col xs="auto">
                                    <div className="text-card">{t('fee')} </div>
                                  </Col>
                                  <Col className="text-end">
                                    <div className="text-card">
                                      {mode === 'synthOut' && (
                                        <>
                                          {swapInput1?.value
                                            ? formatFromWei(getMint()[1], 6)
                                            : '0.00'}
                                        </>
                                      )}
                                      {mode === 'synthIn' && (
                                        <>
                                          {swapInput1?.value
                                            ? formatFromWei(getBurn()[1], 6)
                                            : '0.00'}
                                        </>
                                      )}{' '}
                                      <span className="">SPARTA</span>
                                    </div>
                                  </Col>
                                </Row>

                                <Row className="">
                                  <Col xs="auto" className="title-card">
                                    <span className="subtitle-card">
                                      {t('output')}
                                    </span>
                                  </Col>
                                  <Col className="text-end">
                                    <span className="subtitle-card">
                                      {assetSwap1?.tokenAddress ===
                                        addr.spartav2 && (
                                        <>
                                          {swapInput1?.value
                                            ? formatFromWei(getMint()[0], 6)
                                            : '0.00'}{' '}
                                          <span className="output-card">
                                            {
                                              getToken(assetSwap2.tokenAddress)
                                                ?.symbol
                                            }
                                            s
                                          </span>
                                        </>
                                      )}
                                      {assetSwap1?.tokenAddress !==
                                        addr.spartav2 &&
                                        mode === 'synthOut' && (
                                          <>
                                            {swapInput1?.value
                                              ? formatFromWei(getMint()[0], 6)
                                              : '0.00'}{' '}
                                            <span className="output-card">
                                              {
                                                getToken(
                                                  assetSwap2.tokenAddress,
                                                )?.symbol
                                              }
                                              s
                                            </span>
                                          </>
                                        )}
                                      {assetSwap1?.tokenAddress !==
                                        addr.spartav2 &&
                                        mode === 'synthIn' && (
                                          <>
                                            {swapInput1?.value
                                              ? formatFromWei(getBurn()[0], 6)
                                              : '0.00'}{' '}
                                            <span className="output-card">
                                              {
                                                getToken(
                                                  assetSwap2.tokenAddress,
                                                )?.symbol
                                              }
                                            </span>
                                          </>
                                        )}
                                    </span>
                                  </Col>
                                </Row>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>

                      {/* 'Approval/Allowance' row */}
                      <Card.Footer>
                        {mode === 'token' && (
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
                                className="w-100"
                                onClick={() => handleSwapAssets()}
                                disabled={
                                  swapInput1?.value <= 0 ||
                                  BN(
                                    convertToWei(swapInput1?.value),
                                  ).isGreaterThan(getBalance(1))
                                }
                              >
                                {t('sell')}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                              </Button>
                            </Col>
                          </>
                        )}

                        {mode === 'pool' && (
                          <>
                            {wallet?.account && swapInput1?.value && (
                              <Approval
                                tokenAddress={assetSwap1?.address}
                                symbol={`${
                                  getToken(assetSwap1.tokenAddress)?.symbol
                                }p`}
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
                                    zapLiquidity(
                                      convertToWei(swapInput1?.value),
                                      assetSwap1.address,
                                      assetSwap2.address,
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
                                {t('sell')}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}p
                              </Button>
                            </Col>
                          </>
                        )}

                        {window.localStorage.getItem('assetType2') ===
                          'synth' && (
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
                                className="w-100"
                                onClick={() => handleSwapToSynth()}
                                disabled={
                                  swapInput1?.value <= 0 ||
                                  BN(
                                    convertToWei(swapInput1?.value),
                                  ).isGreaterThan(getBalance(1))
                                }
                              >
                                {t('sell')}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                              </Button>
                            </Col>
                          </>
                        )}

                        {window.localStorage.getItem('assetType1') ===
                          'synth' && (
                          <>
                            {wallet?.account && swapInput1?.value && (
                              <Approval
                                tokenAddress={
                                  getSynth(assetSwap1.tokenAddress)?.address
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
                                {t('sell')}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}s
                              </Button>
                            </Col>
                          </>
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    {pool.poolDetails &&
                      assetSwap1.tokenAddress !== addr.spartav2 && (
                        <SwapPair assetSwap={assetSwap1} />
                      )}

                    {pool.poolDetails &&
                      assetSwap2.tokenAddress !== addr.spartav2 &&
                      assetSwap1.tokenAddress !== assetSwap2.tokenAddress && (
                        <SwapPair assetSwap={assetSwap2} />
                      )}
                  </Col>
                </Row>
              </>
            )}
            {pool.poolDetails.length <= 0 && (
              <Row className="row-480">
                <Col className="card-480">
                  <HelmetLoading height={300} width={300} />
                </Col>
              </Row>
            )}
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
