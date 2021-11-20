import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
  OverlayTrigger,
  Form,
  Popover,
} from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { install } from 'resize-observer'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import {
  getAddresses,
  getItemFromArray,
  getNetwork,
  oneWeek,
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
import Metrics from './Components/Metrics'
import { swap, zapLiquidity } from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SharePool from '../../../components/Share/SharePool'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { useSparta } from '../../../store/sparta'
import NewPool from '../Pools/NewPool'
import { Icon } from '../../../components/Icons/icons'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { balanceWidths } from '../Liquidity/Components/Utils'
import { calcLiqValue, calcSpotValueInBase } from '../../../utils/math/utils'
import {
  getSwapSpot,
  getTimeUntil,
  getZapSpot,
} from '../../../utils/math/nonContract'
import { swapTo, zapLiq } from '../../../utils/math/router'
import Notifications from '../../../components/Notifications/Notifications'

const Swap = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 720) {
      install()
    }
  }
  const isLightMode = window.localStorage.getItem('theme')

  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const location = useLocation()

  const [reverseRate, setReverseRate] = useState(false)
  const [notify, setNotify] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
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

  const getFilter = () => {
    const validModes = ['token']
    if (pool.poolDetails.filter((x) => !x.hide).length > 2) {
      validModes.push('pool')
    }
    return validModes
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
        if (typeParam1 === 'token' || typeParam1 === 'pool') {
          type1 = typeParam1
          setTypeParam1('')
        }
        if (typeParam2 === 'token' || typeParam2 === 'pool') {
          type2 = typeParam2
          setTypeParam2('')
        }

        if (!getFilter().includes(type1)) {
          type1 = 'token'
        }
        if (!getFilter().includes(type2)) {
          type2 = 'token'
        }
        window.localStorage.setItem('assetType1', type1)
        window.localStorage.setItem('assetType2', type2)

        const tempFilter = []
        if (type1 === 'token') {
          tempFilter.push('token')
          if (type2 === 'token') {
            setMode('token')
          } else {
            window.localStorage.setItem('assetType2', 'token')
          }
        } else if (type1 === 'pool') {
          if (getFilter().includes('pool')) tempFilter.push('pool')
          setMode('pool')
          window.localStorage.setItem('assetType2', 'pool')
        }
        setFilter(tempFilter)

        if (type1 !== 'synth' && type2 !== 'synth') {
          if (asset2?.tokenAddress === asset1?.tokenAddress) {
            asset2 =
              asset1?.tokenAddress !== poolDetails[0].tokenAddress
                ? { tokenAddress: poolDetails[0].tokenAddress }
                : { tokenAddress: poolDetails[1].tokenAddress }
          }
        }

        if (type1 === 'pool') {
          if (asset2?.address === '') {
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
        asset1 = asset1.hide
          ? getItemFromArray(addr.spartav2, poolDetails)
          : asset1
        asset2 = asset2.hide
          ? getItemFromArray(addr.spartav2, poolDetails)
          : asset2

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

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const handleConfClear = () => {
    setConfirm(false)
  }

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
    return item.balanceTokens
  }

  const getTimeNew = () => {
    const timeStamp = BN(assetSwap1?.genesis).plus(oneWeek)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Functions to get txn Details

  /**
   * Get swap txn details
   * @returns [output, swapFee, divi1, divi2]
   */
  const getSwap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2 && mode === 'token') {
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
   * @returns [unitsLP, swapFee, slipRevert, capRevert, poolFrozen]
   */
  const getZap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2 && mode === 'pool') {
      const [unitsLP, swapFee, slipRevert, capRevert] = zapLiq(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
      )
      return [unitsLP, swapFee, slipRevert, capRevert, assetSwap1.frozen]
    }
    return ['0.00', '0.00', false, false, false]
  }

  const getInput = () => {
    const symbol = getToken(assetSwap1.tokenAddress)?.symbol
    if (swapInput1) {
      const input = swapInput1.value
      if (mode === 'token') {
        return [input, symbol]
      }
      if (mode === 'pool') {
        return [input, `${symbol}p`]
      }
    }
    return ['0.00', symbol]
  }

  const getOutput = () => {
    const symbol = getToken(assetSwap2.tokenAddress)?.symbol
    if (mode === 'token') {
      return [getSwap()[0], symbol, t('output')]
    }
    if (mode === 'pool') {
      return [getZap()[0], `${symbol}p`, t('output')]
    }
    return ['0.00', symbol, t('output')]
  }

  const getSpot = () => {
    if (['token'].includes(mode)) {
      let spot = getSwapSpot(
        assetSwap1,
        assetSwap2,
        assetSwap2.tokenAddress === addr.spartav2,
        assetSwap1.tokenAddress === addr.spartav2,
      )
      spot = spot > 0 ? spot : '0.00'
      return reverseRate ? BN(1).div(spot) : spot
    }
    if (mode === 'pool') {
      const spot = convertFromWei(getZapSpot(assetSwap1, assetSwap2))
      return reverseRate ? BN(1).div(spot) : spot
    }
    return '0.00'
  }

  const getRate = () => {
    let rate = '0'
    if (!reverseRate) {
      rate = BN(convertFromWei(getOutput()[0])).div(getInput()[0])
    } else {
      rate = BN(getInput()[0]).div(convertFromWei(getOutput()[0]))
    }
    rate = rate > 0 ? rate : getSpot()
    return rate
  }

  const getSlip = () => {
    let larger = getRate()
    let smaller = getSpot()
    if (BN(getSpot()).isGreaterThan(getRate())) {
      larger = getSpot()
      smaller = getRate()
    }
    let slip = BN(larger).div(smaller).minus(1).times(100)
    slip = slip > 0 ? slip : '0.00'
    return slip
  }

  const getRevenue = () => {
    let result = '0.00'
    if (mode === 'token') {
      result = BN(getSwap()[1])
      result = getSwap()[2] ? result.plus(getSwap()[2]) : result
      result = getSwap()[3] ? result.plus(getSwap()[3]) : result
    } else if (mode === 'pool') {
      result = BN(getZap()[1])
    }
    result = result > 0 ? result : '0.00'
    return result
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

  const estMaxGasPool = '2600000000000000'
  const estMaxGasDoubleSwap = '2000000000000000'
  const estMaxGasSwap = '1500000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb).balance
    if (mode === 'pool') {
      if (BN(bal).isLessThan(estMaxGasPool)) {
        return false
      }
    }
    if (
      assetSwap1?.tokenAddress !== addr.spartav2 &&
      assetSwap2?.tokenAddress !== addr.spartav2
    ) {
      if (BN(bal).isLessThan(estMaxGasDoubleSwap)) {
        return false
      }
    }
    if (BN(bal).isLessThan(estMaxGasSwap)) {
      return false
    }
    return true
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
    const _symbol = getToken(assetSwap1.tokenAddress)?.symbol
    if (mode === 'pool') {
      if (getZap()[4]) {
        return [false, t('poolFrozen')]
      }
      if (getZap()[2]) {
        return [false, t('slipTooHigh')]
      }
      if (getZap()[3]) {
        return [false, t('poolAtCapacity')]
      }
      if (assetSwap1.newPool) {
        return [false, `${t('unlocksIn')} ${getTimeNew()[0]}${getTimeNew()[1]}`]
      }
      if (assetSwap2.newPool && !confirm) {
        return [true, t('confirmLockup')]
      }
      return [true, `${t('sell')} ${_symbol}p`]
    }
    return [true, `${t('sell')} ${_symbol}`]
  }

  useEffect(() => {
    if (swapInput1?.value) {
      if (mode === 'token') {
        handleInputChange()
      } else if (mode === 'pool') {
        handleZapInputChange()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2])

  const handleSwapAssets = async () => {
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
    setTxnLoading(true)
    await dispatch(
      swap(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        assetSwap2.tokenAddress,
        BN(getSwap()[0]).times(0.95).toFixed(0, 1),
        wallet,
        web3.rpcs,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  const handleZap = async () => {
    setTxnLoading(true)
    await dispatch(
      zapLiquidity(
        convertToWei(swapInput1?.value),
        assetSwap1.address,
        assetSwap2.address,
        wallet,
        web3.rpcs,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  useEffect(() => {
    if (txnLoading) {
      setNotify(true)
    } else {
      setNotify(false)
    }
  }, [txnLoading])

  const isLoading = () => {
    if (!pool.poolDetails) {
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
                <Notifications show={notify} txnType="approve" />
                <Row className="row-480">
                  <Col xs="auto">
                    <Card xs="auto" className="card-480">
                      <Card.Header>
                        <Row className="px-1">
                          <Col>
                            {t('swap')}
                            {pool.poolDetails.length > 0 && <SharePool />}
                          </Col>
                          <Col className="text-end">
                            <NewPool />
                          </Col>
                        </Row>
                      </Card.Header>
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
                                  </Col>
                                </Row>
                                <Row className="my-1">
                                  <Col>
                                    <InputGroup className="m-0">
                                      <InputGroup.Text id="assetSelect1">
                                        <AssetSelect
                                          priority="1"
                                          filter={getFilter()}
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
                                          className="text-end ms-0"
                                          type="number"
                                          min="0"
                                          placeholder={`${t('sell')}...`}
                                          id="swapInput1"
                                          autoComplete="off"
                                          autoCorrect="off"
                                        />
                                      </OverlayTrigger>

                                      <InputGroup.Text
                                        role="button"
                                        tabIndex={-1}
                                        onKeyPress={() => clearInputs()}
                                        onClick={() => clearInputs()}
                                      >
                                        <Icon
                                          icon="close"
                                          size="10"
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
                                  icon="arrowDownUp"
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
                                      <InputGroup.Text id="assetSelect2">
                                        <AssetSelect
                                          priority="2"
                                          filter={filter}
                                          blackList={
                                            assetSwap1.tokenAddress ===
                                              addr.spartav2 && [addr.spartav2]
                                          }
                                          onClick={handleConfClear}
                                        />
                                      </InputGroup.Text>
                                      <FormControl
                                        className="text-end ms-0"
                                        type="number"
                                        min="0"
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
                                          size="10"
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

                            {/* Bottom txnDetails row */}
                            <Row className="mb-2">
                              <Col xs="auto">
                                <div className="text-card">{t('rate')}</div>
                              </Col>
                              <Col className="text-end">
                                <div className="text-card">
                                  1{' '}
                                  {reverseRate ? getOutput()[1] : getInput()[1]}{' '}
                                  = {formatFromUnits(getRate(), 3)}{' '}
                                  {!reverseRate
                                    ? getOutput()[1]
                                    : getInput()[1]}{' '}
                                  <span
                                    onClick={() => setReverseRate(!reverseRate)}
                                    role="button"
                                    aria-hidden="true"
                                  >
                                    <Icon
                                      icon="arrowLeftRight"
                                      className="ms-1 mb-1"
                                      size="17"
                                      fill={isLightMode ? 'black' : 'white'}
                                    />
                                  </span>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs="auto">
                                <div className="text-card">{t('slip')}</div>
                              </Col>
                              <Col className="text-end">
                                <div className="text-card">
                                  {formatFromUnits(getSlip(), 3)}%
                                  <OverlayTrigger
                                    placement="auto"
                                    overlay={Tooltip(t, 'slipInfo')}
                                  >
                                    <span role="button">
                                      <Icon
                                        icon="info"
                                        className="ms-1 mb-1"
                                        size="17"
                                        fill={isLightMode ? 'black' : 'white'}
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mb-2">
                              <Col xs="auto">
                                <div className="text-card">{t('revenue')}</div>
                              </Col>
                              <Col className="text-end">
                                <div className="text-card">
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
                                        fill={isLightMode ? 'black' : 'white'}
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              </Col>
                            </Row>

                            <Row className="">
                              <Col xs="auto" className="title-card">
                                <span className="subtitle-card">
                                  {getOutput()[2]}
                                </span>
                              </Col>
                              <Col className="text-end">
                                <span className="subtitle-card">
                                  {swapInput1?.value
                                    ? formatFromWei(getOutput()[0], 6)
                                    : '0.00'}{' '}
                                  <span className="output-card">
                                    {getOutput()[1]}
                                  </span>
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Body>

                      {/* 'Approval/Allowance' row */}
                      <Card.Footer>
                        {mode === 'token' && (
                          <Row className="text-center">
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
                          </Row>
                        )}

                        {mode === 'pool' && (
                          <>
                            {assetSwap2.newPool && (
                              <Row>
                                <Col>
                                  <div className="output-card text-center">
                                    {t('newPoolZapConfirm')}
                                  </div>
                                  <Form className="my-2 text-center">
                                    <span className="output-card">
                                      {`Confirm; your liquidity will be locked for ${
                                        getTimeNew()[0]
                                      }${getTimeNew()[1]}`}
                                      <Form.Check
                                        type="switch"
                                        id="confirmLockout"
                                        className="ms-2 d-inline-flex"
                                        checked={confirm}
                                        onChange={() => setConfirm(!confirm)}
                                      />
                                    </span>
                                  </Form>
                                </Col>
                              </Row>
                            )}
                            {!assetSwap1?.newPool ? (
                              <Row className="text-center">
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
                                    onClick={() => handleZap()}
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
                              </Row>
                            ) : (
                              <Row className="text-center">
                                <Col xs="12" sm="4" md="12">
                                  <Button className="w-auto" disabled>
                                    {checkValid()[1]}
                                  </Button>
                                  <OverlayTrigger
                                    placement="auto"
                                    overlay={Tooltip(
                                      t,
                                      'newPool',
                                      `${
                                        getToken(assetSwap1.tokenAddress)
                                          ?.symbol
                                      }p`,
                                    )}
                                  >
                                    <span role="button">
                                      <Icon
                                        icon="info"
                                        className="ms-1"
                                        size="17"
                                        fill={isLightMode ? 'black' : 'white'}
                                      />
                                    </span>
                                  </OverlayTrigger>
                                </Col>
                              </Row>
                            )}
                          </>
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                  <Col xs="auto">
                    {pool.poolDetails &&
                      assetSwap1.tokenAddress !== addr.spartav2 && (
                        <Metrics assetSwap={assetSwap1} />
                      )}
                    {pool.poolDetails &&
                      assetSwap2.tokenAddress !== addr.spartav2 &&
                      assetSwap1.tokenAddress !== assetSwap2.tokenAddress && (
                        <Metrics assetSwap={assetSwap2} />
                      )}
                  </Col>
                </Row>
              </>
            ) : (
              <Row className="row-480">
                <Col className="card-480">
                  <HelmetLoading height={300} width={300} />
                </Col>
              </Row>
            )}
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Swap
