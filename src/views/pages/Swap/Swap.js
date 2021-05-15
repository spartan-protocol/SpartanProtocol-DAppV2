/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  calcDoubleSwapOutput,
  calcSwapOutput,
  calcSwapFee,
  calcDoubleSwapFee,
  calcValueInBase,
  calcLiquidityHoldings,
  calcShare,
  calcLiquidityUnitsAsym,
} from '../../../utils/web3Utils'
import {
  routerSwapAssets,
  swapAssetToSynth,
  swapSynthToAsset,
  routerZapLiquidity,
} from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SwapPair from './SwapPair'
import SharePool from '../../../components/Share/SharePool'
import { useSynth } from '../../../store/synth/selector'
import WrongNetwork from '../../../components/Common/WrongNetwork'

const Swap = () => {
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
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
        const type1 = window.localStorage.getItem('assetType1')
        const type2 = window.localStorage.getItem('assetType2')

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

        if (
          !asset1 ||
          !pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
        ) {
          asset1 = { tokenAddress: addr.spartav1 }
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

  const getSwapOutput = () => {
    if (assetSwap1?.tokenAddress === addr.spartav1) {
      return calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
      )
    }
    if (assetSwap2?.tokenAddress === addr.spartav1) {
      return calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
    }
    return calcDoubleSwapOutput(
      convertToWei(swapInput1?.value),
      assetSwap1?.tokenAmount,
      assetSwap1?.baseAmount,
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
    )
  }

  const getSwapFee = () => {
    // Fee in SPARTA via fee in TOKEN (Swap from SPARTA)
    if (assetSwap1?.tokenAddress === addr.spartav1) {
      return calcValueInBase(
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
        calcSwapFee(
          convertToWei(swapInput1?.value),
          assetSwap2?.tokenAmount,
          assetSwap2?.baseAmount,
        ),
      )
    }
    // Fee in SPARTA (Swap to SPARTA)
    if (assetSwap2?.tokenAddress === addr.spartav1) {
      return calcSwapFee(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
    }
    // Fee in SPARTA via fee in token2 (swap token1 to token2)
    return calcValueInBase(
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
      calcDoubleSwapFee(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
      ),
    )
  }

  //= =================================================================================//
  // Functions for SWAP input handling

  const handleInputChange = () => {
    if (swapInput1?.value) {
      if (assetSwap1?.tokenAddress === addr.spartav1) {
        swapInput2.value = convertFromWei(
          calcSwapOutput(
            convertToWei(swapInput1?.value),
            assetSwap2.tokenAmount,
            assetSwap2.baseAmount,
            false,
          ),
        )
      } else if (assetSwap2?.tokenAddress === addr.spartav1) {
        swapInput2.value = convertFromWei(
          calcSwapOutput(
            convertToWei(swapInput1?.value),
            assetSwap1.tokenAmount,
            assetSwap1.baseAmount,
            true,
          ),
        )
      } else {
        swapInput2.value = convertFromWei(
          calcDoubleSwapOutput(
            convertToWei(swapInput1?.value),
            assetSwap1.tokenAmount,
            assetSwap1.baseAmount,
            assetSwap2.tokenAmount,
            assetSwap2.baseAmount,
          ),
        )
      }
    }
  }

  //= =================================================================================//
  // Functions ZAP calculations

  const getZapRemoveBase = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityHoldings(
        assetSwap1.baseAmount,
        convertToWei(swapInput1.value),
        assetSwap1.poolUnits,
      )
    }
    return '0'
  }

  const getZapRemoveToken = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityHoldings(
        assetSwap1.tokenAmount,
        convertToWei(swapInput1.value),
        assetSwap1.poolUnits,
      )
    }
    return '0'
  }

  const getZapOtherRemoveBase = () => {
    if (assetSwap2 && swapInput2?.value) {
      return calcLiquidityHoldings(
        assetSwap2.baseAmount,
        convertToWei(swapInput2.value),
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  const getZapOtherRemoveToken = () => {
    if (assetSwap2 && swapInput2?.value) {
      return calcLiquidityHoldings(
        assetSwap2.tokenAmount,
        convertToWei(swapInput2.value),
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  const getZapSwap = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcSwapOutput(
        getZapRemoveToken(),
        BN(assetSwap1.tokenAmount).minus(getZapRemoveToken()),
        BN(assetSwap1.baseAmount).minus(getZapRemoveBase()),
        true,
      )
    }
    return '0'
  }

  const getZapSwapFee = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcSwapFee(
        getZapRemoveToken(),
        BN(assetSwap1.tokenAmount).minus(getZapRemoveToken()),
        BN(assetSwap1.baseAmount).minus(getZapRemoveBase()),
        true,
      )
    }
    return '0'
  }

  const getZapOutput = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityUnitsAsym(
        BN(getZapRemoveBase()).plus(getZapSwap()),
        assetSwap2.baseAmount,
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  //= =================================================================================//
  // Functions SYNTHS calculations

  const getSynthLPsFromBase = (baseOuput) => {
    let temp = '0'
    if (baseOuput) {
      if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
        temp = calcLiquidityUnitsAsym(
          baseOuput,
          BN(assetSwap2.baseAmount).minus(baseOuput),
          assetSwap2.poolUnits,
        )
      } else {
        temp = calcLiquidityUnitsAsym(
          baseOuput,
          assetSwap2.baseAmount,
          assetSwap2.poolUnits,
        )
      }
    } else {
      temp = calcLiquidityUnitsAsym(
        convertToWei(swapInput1.value),
        assetSwap2.baseAmount,
        assetSwap2.poolUnits,
      )
    }
    return temp
  }

  const getSynthFeeFromBase = () => {
    let temp = calcSwapFee(
      convertToWei(swapInput1?.value),
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
    )
    temp = calcValueInBase(assetSwap2.tokenAmount, assetSwap2.baseAmount, temp)
    return temp
  }

  const getSynthOutputFromBase = () => {
    let tokenValue = '0'
    if (assetSwap1.tokenAddress === addr.spartav1) {
      const lpUnits = getSynthLPsFromBase()
      const baseAmount = calcShare(
        lpUnits,
        BN(assetSwap2.poolUnits).plus(lpUnits),
        BN(assetSwap2.baseAmount).plus(BN(swapInput1?.value)),
      )
      const tokenAmount = calcShare(
        lpUnits,
        BN(assetSwap2.poolUnits).plus(lpUnits),
        assetSwap2.tokenAmount,
      )
      const baseSwapped = calcSwapOutput(
        baseAmount,
        assetSwap2.tokenAmount,
        BN(assetSwap2.baseAmount).plus(BN(swapInput1?.value)),
      )
      tokenValue = BN(tokenAmount).plus(baseSwapped)
    } else {
      const outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      const lpUnits = getSynthLPsFromBase(outPutBase)
      let baseAmount = '0'
      let tokenAmount = '0'
      let baseSwapped = '0'
      if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
        baseAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.baseAmount),
        )
        tokenAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.tokenAmount).plus(convertToWei(swapInput1?.value)),
        )
        baseSwapped = calcSwapOutput(
          baseAmount,
          BN(assetSwap2.tokenAmount).plus(convertToWei(swapInput1?.value)),
          BN(assetSwap2.baseAmount),
        )
      } else {
        baseAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.baseAmount).plus(BN(outPutBase)),
        )
        tokenAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          assetSwap2.tokenAmount,
        )
        baseSwapped = calcSwapOutput(
          baseAmount,
          assetSwap2.tokenAmount,
          BN(assetSwap2.baseAmount).plus(BN(outPutBase)),
        )
      }
      tokenValue = BN(tokenAmount).plus(baseSwapped)
    }
    return tokenValue
  }

  const getSynthFeeToBase = () => {
    const fee = calcSwapFee(
      convertToWei(swapInput1.value),
      assetSwap1.tokenAmount,
      assetSwap1.baseAmount,
      true,
    )
    return fee
  }

  const getSynthOutputToBase = () => {
    let tokenValue = '0'
    let outPutBase = '0'
    if (assetSwap2.tokenAddress === addr.spartav1) {
      const inputSynth = convertToWei(swapInput1?.value)
      tokenValue = calcSwapOutput(
        inputSynth,
        assetSwap1.tokenAmount,
        assetSwap1.baseAmount,
        true,
      )
    } else if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
      outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      tokenValue = calcSwapOutput(
        outPutBase,
        assetSwap2.tokenAmount,
        BN(assetSwap2.baseAmount).minus(outPutBase),
        false,
      )
    } else {
      outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      tokenValue = calcSwapOutput(
        outPutBase,
        assetSwap2.tokenAmount,
        assetSwap2.baseAmount,
        false,
      )
    }
    return tokenValue
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = () => {
    swapInput2.value = convertFromWei(getZapOutput(), 18)
  }

  const handleSynthInputChange = () => {
    if (mode === 'synthOut') {
      swapInput2.value = convertFromWei(getSynthOutputFromBase(), 18)
    } else if (mode === 'synthIn') {
      swapInput2.value = convertFromWei(getSynthOutputToBase(), 18)
    }
  }

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addr.spartav1 && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (mode === 'pool') {
      if (assetSwap1 && swapInput1?.value) {
        return BN(
          calcValueInBase(
            assetSwap1?.tokenAmount,
            assetSwap1?.baseAmount,
            getZapRemoveToken(),
          ),
        )
          .plus(getZapRemoveBase())
          .times(web3.spartaPrice)
      }
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
    if (assetSwap2?.tokenAddress === addr.spartav1 && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (mode === 'pool') {
      if (assetSwap2 && swapInput2?.value) {
        return BN(
          calcValueInBase(
            assetSwap2?.tokenAmount,
            assetSwap2?.baseAmount,
            getZapOtherRemoveToken(),
          ),
        )
          .plus(getZapOtherRemoveBase())
          .times(web3.spartaPrice)
      }
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

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('swap')}</h2>
              <SharePool />
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            {pool.poolDetails?.length > 0 && (
              <>
                <Row className="row-480">
                  <Col xs="auto">
                    <Card xs="auto" className="card-body card-480">
                      {/* Top 'Input' Row */}
                      <Row>
                        {/* 'From' input box */}
                        <Col xs="12" className="px-1 px-sm-3">
                          <Card
                            style={{ backgroundColor: '#25212D' }}
                            className="card-body mb-1"
                          >
                            <Row>
                              <Col xs="4">
                                <div className="text-sm-label">{t('sell')}</div>
                              </Col>
                              <Col xs="8" className="text-right">
                                <div
                                  className="text-sm-label"
                                  role="button"
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
                                  filter={['token', 'pool', 'synth']}
                                />
                              </Col>
                              <Col className="text-right">
                                <InputGroup className="m-0 mt-n1">
                                  <Input
                                    className="text-right ml-0 p-2"
                                    type="text"
                                    placeholder={`${t('sell')}...`}
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
                                    onKeyPress={() => clearInputs()}
                                    onClick={() => clearInputs()}
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
                        </Col>

                        <Col
                          xs="12"
                          style={{ height: '1px' }}
                          className="text-center z-index my-n4"
                        >
                          <Button
                            className="btn-sm btn-round btn-icon position-relative"
                            color="primary"
                            style={{
                              height: '35px',
                              top: '-19px',
                              width: '35px',
                            }}
                            onClick={() => handleReverseAssets()}
                          >
                            <i className="icon-swap-size icon-swap icon-light" />
                          </Button>
                        </Col>

                        {/* 'To' input box */}

                        <Col xs="12" className="px-1 px-sm-3">
                          <Card
                            style={{ backgroundColor: '#25212D' }}
                            className="card-body mb-1"
                          >
                            <Row className="my-2">
                              <Col xs="4" className="">
                                <div className="text-sm-label">{t('buy')}</div>
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
                            <Row>
                              <Col xs="auto" className="ml-1">
                                <AssetSelect
                                  priority="2"
                                  filter={filter}
                                  blackList={
                                    assetSwap1.tokenAddress ===
                                      addr.spartav1 && [addr.spartav1]
                                  }
                                />
                              </Col>
                              <Col className="text-right">
                                <InputGroup className="m-0">
                                  <Input
                                    className="text-right ml-0 p-2"
                                    type="text"
                                    placeholder={`${t('buy')}...`}
                                    id="swapInput2"
                                    readOnly
                                  />
                                  <InputGroupAddon
                                    addonType="append"
                                    role="button"
                                    tabIndex={-1}
                                    onKeyPress={() => clearInputs()}
                                    onClick={() => clearInputs()}
                                  >
                                    <i className="icon-search-bar icon-mini icon-close icon-light my-auto" />
                                  </InputGroupAddon>
                                </InputGroup>
                                <div className="text-right text-sm-label">
                                  ~$
                                  {swapInput2?.value
                                    ? formatFromWei(getInput2USD(), 2)
                                    : '0.00'}
                                  {' ('}
                                  {swapInput1?.value
                                    ? formatFromUnits(getRateSlip())
                                    : '0.00'}
                                  {'%)'}
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>
                      {/* Bottom 'swap' txnDetails row */}
                      {mode === 'token' && (
                        <Card className="card-body mb-1">
                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">{t('sell')}</div>
                            </Col>
                            <Col className="text-right">
                              <span className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromUnits(swapInput1?.value, 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                              </span>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">
                                {t('fee')}
                                <i
                                  className="icon-extra-small icon-info icon-dark ml-2 mt-n1"
                                  id="tooltipFee"
                                  role="button"
                                />
                                <UncontrolledTooltip
                                  placement="right"
                                  target="tooltipFee"
                                >
                                  {t('slipFeeInfo')}
                                </UncontrolledTooltip>
                              </div>
                            </Col>
                            <Col className="text-right">
                              <div className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromWei(getSwapFee(), 6)
                                  : '0.00'}{' '}
                                SPARTA
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="subtitle-card">
                                {t('receive')}
                              </div>
                            </Col>
                            <Col className="text-right">
                              <div className="subtitle-card">
                                {swapInput1?.value
                                  ? formatFromWei(getSwapOutput(), 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap2.tokenAddress)?.symbol}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      )}

                      {/* Bottom 'zap' txnDetails row */}
                      {mode === 'pool' && (
                        <Card className="card-body mb-1">
                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">{t('input')}</div>
                            </Col>
                            <Col className="text-right">
                              <div className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromUnits(swapInput1?.value, 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}p
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">
                                {t('fee')}
                                <i
                                  className="icon-extra-small icon-info icon-dark ml-2 mt-n1"
                                  id="tooltipZapFee"
                                  role="button"
                                />
                                <UncontrolledTooltip
                                  placement="right"
                                  target="tooltipZapFee"
                                >
                                  {t('slipFeeInfo')}
                                </UncontrolledTooltip>
                              </div>
                            </Col>
                            <Col className="text-right">
                              <div className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromWei(getZapSwapFee(), 6)
                                  : '0.00'}{' '}
                                SPARTA
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="subtitle-card">{t('output')}</div>
                            </Col>
                            <Col className="text-right">
                              <div className="subtitle-card">
                                {swapInput1?.value
                                  ? formatFromWei(getZapOutput(), 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap2.tokenAddress)?.symbol}p
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      )}

                      {/* Bottom 'synth' txnDetails row */}
                      {(mode === 'synthIn' || mode === 'synthOut') && (
                        <Card className="card-body mb-1">
                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">{t('input')}</div>
                            </Col>
                            <Col className="text-right">
                              <div className="output-card text-light">
                                {swapInput1?.value
                                  ? formatFromUnits(swapInput1?.value, 6)
                                  : '0.00'}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                                {mode === 'synthIn' && 's'}
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="text-card">
                                {t('fee')}{' '}
                                <i
                                  className="icon-extra-small icon-info icon-dark ml-2 mt-n1"
                                  id="tooltipSynthFee"
                                  role="button"
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
                              <div className="output-card text-light">
                                {assetSwap1?.tokenAddress === addr.spartav1 && (
                                  <>
                                    {swapInput1?.value
                                      ? formatFromWei(getSynthFeeFromBase(), 6)
                                      : '0.00'}
                                  </>
                                )}
                                {assetSwap1?.tokenAddress !== addr.spartav1 && (
                                  <>
                                    {swapInput1?.value
                                      ? formatFromWei(getSynthFeeToBase(), 6)
                                      : '0.00'}
                                  </>
                                )}{' '}
                                SPARTA
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs="auto">
                              <div className="subtitle-card">{t('output')}</div>
                            </Col>
                            <Col className="text-right">
                              <div className="subtitle-card">
                                {assetSwap1?.tokenAddress === addr.spartav1 && (
                                  <>
                                    {swapInput1?.value
                                      ? formatFromWei(
                                          getSynthOutputFromBase(),
                                          6,
                                        )
                                      : '0.00'}{' '}
                                    {getToken(assetSwap2.tokenAddress)?.symbol}s
                                  </>
                                )}
                                {assetSwap1?.tokenAddress !== addr.spartav1 &&
                                  mode === 'synthOut' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(
                                            getSynthOutputFromBase(),
                                            6,
                                          )
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                      s
                                    </>
                                  )}
                                {assetSwap1?.tokenAddress !== addr.spartav1 &&
                                  mode === 'synthIn' && (
                                    <>
                                      {swapInput1?.value
                                        ? formatFromWei(
                                            getSynthOutputToBase(),
                                            6,
                                          )
                                        : '0.00'}{' '}
                                      {
                                        getToken(assetSwap2.tokenAddress)
                                          ?.symbol
                                      }
                                    </>
                                  )}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      )}
                      {/* 'Approval/Allowance' row */}
                      <Row>
                        {mode === 'token' &&
                          assetSwap1?.tokenAddress !== addr.bnb &&
                          wallet?.account &&
                          swapInput1?.value && (
                            <Approval
                              tokenAddress={assetSwap1?.tokenAddress}
                              symbol={assetSwap1?.symbol}
                              walletAddress={wallet?.account}
                              contractAddress={addr.router}
                              txnAmount={convertToWei(swapInput1?.value)}
                              assetNumber="1"
                            />
                          )}
                        {mode === 'token' && (
                          <Col className="hide-if-siblings">
                            <Button
                              color="primary"
                              onClick={() =>
                                dispatch(
                                  routerSwapAssets(
                                    convertToWei(swapInput1?.value),
                                    assetSwap1.tokenAddress,
                                    assetSwap2.tokenAddress,
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
                              {t('sell')}{' '}
                              {getToken(assetSwap1.tokenAddress)?.symbol}
                            </Button>
                          </Col>
                        )}
                        {mode === 'pool' && (
                          <Col>
                            <Button
                              color="primary"
                              onClick={() =>
                                dispatch(
                                  routerZapLiquidity(
                                    convertToWei(swapInput1?.value),
                                    assetSwap1.tokenAddress,
                                    assetSwap2.tokenAddress,
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
                              {t('sell')}{' '}
                              {getToken(assetSwap1.tokenAddress)?.symbol}p
                            </Button>
                          </Col>
                        )}
                        {window.localStorage.getItem('assetType2') ===
                          'synth' && (
                          <>
                            <Approval
                              tokenAddress={assetSwap1?.tokenAddress}
                              symbol={assetSwap1?.symbol}
                              walletAddress={wallet?.account}
                              contractAddress={addr.router}
                              txnAmount={convertToWei(swapInput1?.value)}
                              assetNumber="1"
                            />
                            <Col className="hide-if-siblings">
                              <Button
                                color="primary"
                                onClick={() =>
                                  dispatch(
                                    swapAssetToSynth(
                                      convertToWei(swapInput1?.value),
                                      assetSwap1.tokenAddress,
                                      getSynth(assetSwap2.tokenAddress)
                                        ?.address,
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
                                {t('sell')}{' '}
                                {getToken(assetSwap1.tokenAddress)?.symbol}
                              </Button>
                            </Col>
                          </>
                        )}

                        {window.localStorage.getItem('assetType1') ===
                          'synth' && (
                          <Col>
                            <Button
                              color="primary"
                              onClick={() =>
                                dispatch(
                                  swapSynthToAsset(
                                    convertToWei(swapInput1?.value),
                                    getSynth(assetSwap1.tokenAddress)?.address,
                                    assetSwap2.tokenAddress,
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
                              {t('sell')}{' '}
                              {getToken(assetSwap1.tokenAddress)?.symbol}s
                            </Button>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    {pool.poolDetails &&
                      assetSwap1.tokenAddress !== addr.spartav1 && (
                        <SwapPair assetSwap={assetSwap1} />
                      )}

                    {pool.poolDetails &&
                      assetSwap2.tokenAddress !== addr.spartav1 &&
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
