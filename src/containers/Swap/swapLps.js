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
import { useWeb3React } from '@web3-react/core'
import AssetSelect from '../../components/AssetSelect/index'
import { formatShortString, oneWeek } from '../../utils/web3'
import { usePool } from '../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../utils/bigNumber'
import { zapLiquidity } from '../../store/router'
import Approval from '../../components/Approval/index'
import { useWeb3 } from '../../store/web3'
import { appAsset, useApp } from '../../store/app'
import { useSparta } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { balanceWidths } from '../Liquidity/Components/Utils'
import {
  calcLiqValue,
  calcSpotValueInBase,
  getPool,
  getToken,
} from '../../utils/math/utils'
import { getTimeUntil, getZapSpot } from '../../utils/math/nonContract'
import { zapLiq } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'

const SwapLps = ({ assetSwap1, assetSwap2 }) => {
  const dispatch = useDispatch()
  const focus = useFocus()
  const location = useLocation()
  const { t } = useTranslation()
  const wallet = useWeb3React()

  const { addresses, asset1, asset2 } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const web3 = useWeb3()

  const [reverseRate, setReverseRate] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [loadedInitial, setloadedInitial] = useState(false)

  const [token1, settoken1] = useState(false)
  const [token2, settoken2] = useState(false)
  const [bnbBalance, setbnbBalance] = useState(false)
  const [getZap, setGetZap] = useState(['0.00', '0.00', false, false, false])

  // Check and set selected assets based on URL params ONLY ONCE
  useEffect(() => {
    if (!loadedInitial && pool.poolDetails.length > 1) {
      const assetParam1 = new URLSearchParams(location.search).get(`asset1`)
      const assetParam2 = new URLSearchParams(location.search).get(`asset2`)
      let _asset1Addr =
        assetParam1 === addresses.wbnb ? addresses.bnb : assetParam1
      let _asset2Addr =
        assetParam2 === addresses.wbnb ? addresses.bnb : assetParam2
      _asset1Addr = getPool(_asset1Addr, pool.poolDetails).tokenAddress ?? false
      _asset2Addr = getPool(_asset2Addr, pool.poolDetails).tokenAddress ?? false

      dispatch(appAsset('1', _asset1Addr, 'pool'))
      dispatch(appAsset('2', _asset2Addr, 'pool'))
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

  // Check selected assets and validate for zap page
  useEffect(() => {
    const getAssetDetails = () => {
      if (loadedInitial && focus) {
        if (pool.poolDetails?.length > 0) {
          let _asset1Addr = asset1.addr
          let _asset2Addr = asset2.addr

          if (
            _asset2Addr === _asset1Addr ||
            _asset2Addr === addresses.spartav2
          ) {
            _asset2Addr =
              _asset1Addr !== pool.poolDetails[0].tokenAddress
                ? pool.poolDetails[0].tokenAddress
                : pool.poolDetails[1].tokenAddress
          }

          if (_asset1Addr === addresses.spartav2) {
            _asset1Addr =
              _asset2Addr !== pool.poolDetails[0].tokenAddress
                ? pool.poolDetails[0].tokenAddress
                : pool.poolDetails[1].tokenAddress
          }

          if (_asset2Addr === '') {
            _asset2Addr = addresses.bnb
          }

          const hide1 = getPool(_asset1Addr, pool.poolDetails).hide
          const hide2 = getPool(_asset2Addr, pool.poolDetails).hide

          if (hide1 || !getPool(_asset1Addr, pool.poolDetails)) {
            _asset1Addr = pool.poolDetails[1].tokenAddress
          }

          if (hide2 || !getPool(_asset2Addr, pool.poolDetails)) {
            _asset2Addr = addresses.bnb
          }

          dispatch(appAsset('1', _asset1Addr, 'pool'))
          dispatch(appAsset('2', _asset2Addr, 'pool'))
        }
      }
    }
    getAssetDetails()
  }, [
    addresses.bnb,
    addresses.spartav2,
    pool.poolDetails,
    focus,
    loadedInitial,
    asset1.addr,
    asset2.addr,
    dispatch,
  ])

  useEffect(() => {
    if (pool.tokenDetails.length > 1) {
      settoken1(getToken(asset1.addr, pool.tokenDetails))
      settoken2(getToken(asset2.addr, pool.tokenDetails))
      setbnbBalance(getToken(addresses.bnb, pool.tokenDetails).balance)
    }
  }, [addresses.bnb, asset1.addr, asset2.addr, pool.tokenDetails])

  useEffect(() => {
    balanceWidths()
  }, [asset1.addr, asset2.addr, loadedInitial, pool.poolDetails])

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const handleConfClear = () => {
    setConfirm(false)
  }

  const getBalance = (asset) => {
    let item = ''
    if (asset === 1) {
      item = assetSwap1
    } else {
      item = assetSwap2
    }
    return item.balance
  }

  const getTimeNew = () => {
    const timeStamp = BN(assetSwap1?.genesis).plus(oneWeek)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Functions to get txn Details

  /**
   * Get zap txn details
   * @returns [unitsLP, swapFee, slipRevert, capRevert, poolFrozen]
   */
  const updateZap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [unitsLP, swapFee, slipRevert, capRevert] = zapLiq(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
      )
      setGetZap([unitsLP, swapFee, slipRevert, capRevert, assetSwap1.frozen])
      swapInput2.value = convertFromWei(unitsLP, 18)
    }
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
    updateZap()
  }

  const handleReverseAssets = () => {
    dispatch(appAsset('1', asset2.addr, 'token'))
    dispatch(appAsset('2', asset1.addr, 'token'))
    clearInputs()
  }

  const getInput = () => {
    const { symbol } = token1
    if (swapInput1) {
      const input = swapInput1.value
      return [input, `${symbol}p`]
    }
    return ['0.00', symbol]
  }

  const getOutput = () => {
    const { symbol } = token2
    return [getZap[0], `${symbol}p`, t('output')]
  }

  const getSpot = () => {
    const spot = convertFromWei(getZapSpot(assetSwap1, assetSwap2))
    return reverseRate ? BN(1).div(spot) : spot
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
    result = BN(getZap[1])
    result = result > 0 ? result : '0.00'
    return result
  }

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addresses.spartav2 && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }

    if (assetSwap1 && swapInput1?.value) {
      const [_sparta, _token] = calcLiqValue(
        convertToWei(swapInput1.value),
        assetSwap1,
      )
      return BN(calcSpotValueInBase(_token, assetSwap1))
        .plus(_sparta)
        .times(web3.spartaPrice)
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
    if (assetSwap2?.tokenAddress === addresses.spartav2 && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (assetSwap2 && swapInput2?.value) {
      const [_sparta, _token] = calcLiqValue(getZap[0], assetSwap2)
      return BN(calcSpotValueInBase(_token, assetSwap2))
        .plus(_sparta)
        .times(web3.spartaPrice)
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
    if (BN(bnbBalance).isLessThan(estMaxGasPool)) {
      return false
    }
    if (
      assetSwap1?.tokenAddress !== addresses.spartav2 &&
      assetSwap2?.tokenAddress !== addresses.spartav2
    ) {
      if (BN(bnbBalance).isLessThan(estMaxGasDoubleSwap)) {
        return false
      }
    }
    if (BN(bnbBalance).isLessThan(estMaxGasSwap)) {
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
    if (getZap[4]) {
      return [false, t('poolFrozen')]
    }
    if (getZap[2]) {
      return [false, t('slipTooHigh')]
    }
    if (getZap[3]) {
      return [false, t('poolAtCapacity')]
    }
    if (assetSwap1.newPool) {
      return [false, `${t('unlocksIn')} ${getTimeNew()[0]}${getTimeNew()[1]}`]
    }
    if (assetSwap2.newPool && !confirm) {
      return [true, t('confirmLockup')]
    }
    return [true, `${t('sell')} ${token1.symbol}p`]
  }

  const handleZap = async () => {
    setTxnLoading(true)
    await dispatch(
      zapLiquidity(
        convertToWei(swapInput1?.value),
        assetSwap1.address,
        assetSwap2.address,
        wallet,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  const checkWallet = () => {
    if (!wallet.account) {
      setShowWalletWarning1(!showWalletWarning1)
    }
  }

  return (
    <>
      {/* Top 'Input' Row */}
      <Row>
        {/* 'From' input box */}
        <Col xs="12">
          <Card className="assetSection">
            <Card.Body>
              <Row>
                <Col>
                  <strong>{t('sell')}</strong>
                </Col>
                <Col
                  xs="auto"
                  className="float-end text-end fw-light"
                  role="button"
                  aria-hidden="true"
                  onClick={() => {
                    swapInput1.focus()
                    swapInput1.value = convertFromWei(getBalance(1))
                    updateZap()
                  }}
                >
                  {t('balance')}
                  {': '}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, formatFromWei(getBalance(1), 18))}
                  >
                    <span role="button">{formatFromWei(getBalance(1))}</span>
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
                        defaultTab="pool"
                        priority="1"
                        filter={['pool']}
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
                          <Popover.Body>{t('connectWalletFirst')}</Popover.Body>
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
                        onChange={() => updateZap()}
                      />
                    </OverlayTrigger>

                    <InputGroup.Text
                      role="button"
                      className="bg-transparent border-0 p-1"
                      tabIndex={-1}
                      onKeyPress={() => clearInputs()}
                      onClick={() => clearInputs()}
                    >
                      <Icon icon="close" size="16" />
                    </InputGroup.Text>
                  </InputGroup>

                  <Row className="pt-1 fw-light">
                    <Col>
                      {formatShortString(assetSwap1?.address)}
                      <ShareLink url={assetSwap1?.address}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap1?.address)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon icon="scan" size="14" className="ms-1 mb-1" />
                      </a>
                    </Col>
                    <Col className="text-end">
                      {web3.spartaPrice > 0
                        ? swapInput1?.value
                          ? `~$${formatFromWei(getInput1USD(), 2)}`
                          : '~$0.00'
                        : ''}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="iconSeparator">
            <Col
              xs="auto"
              className="mx-auto"
              onClick={() => handleReverseAssets()}
              role="button"
            >
              <Icon
                icon="swap"
                size="30"
                stroke="black"
                fill="black"
                className="position-relative bg-white rounded-circle px-2 iconOnTop"
              />
            </Col>
          </Row>

          {/* 'To' input box */}

          <Card className="mb-3 assetSection">
            <Card.Body>
              <Row>
                <Col xs="auto">
                  <strong>{t('buy')}</strong>
                </Col>
                <Col className="float-end text-end fw-light">
                  {t('balance')}
                  {': '}
                  {pool.poolDetails && formatFromWei(getBalance(2), 4)}
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
                        filter={['pool']}
                        blackList={[assetSwap1.tokenAddress]}
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
                    <InputGroup.Text
                      role="button"
                      className="bg-transparent border-0 p-1"
                      tabIndex={-1}
                      onKeyPress={() => clearInputs()}
                      onClick={() => clearInputs()}
                    >
                      <Icon icon="close" size="16" />
                    </InputGroup.Text>
                  </InputGroup>

                  <Row className="pt-1 fw-light">
                    <Col>
                      {formatShortString(assetSwap2?.address)}
                      <ShareLink url={assetSwap2?.address}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap2?.address)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon icon="scan" size="14" className="ms-1 mb-1" />
                      </a>
                    </Col>
                    <Col className="text-end">
                      {web3.spartaPrice > 0
                        ? swapInput2?.value
                          ? `~$${formatFromWei(
                              getInput2USD(),
                              2,
                            )} (${formatFromUnits(getRateSlip(), 2)}%)`
                          : '~$0.00'
                        : ''}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Bottom txnDetails row */}
          <Row className="mb-2">
            <Col xs="auto">{t('rate')}</Col>
            <Col className="text-end">
              1 {reverseRate ? getOutput()[1] : getInput()[1]} ={' '}
              {formatFromUnits(getRate(), 3)}{' '}
              {!reverseRate ? getOutput()[1] : getInput()[1]}{' '}
              <span
                onClick={() => setReverseRate(!reverseRate)}
                role="button"
                aria-hidden="true"
              >
                <Icon icon="arrowLeftRight" className="ms-1 mb-1" size="17" />
              </span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs="auto">{t('slip')}</Col>
            <Col className="text-end">
              {formatFromUnits(getSlip(), 3)}%
              <OverlayTrigger placement="auto" overlay={Tooltip(t, 'slipInfo')}>
                <span role="button">
                  <Icon icon="info" className="ms-1 mb-1" size="17" />
                </span>
              </OverlayTrigger>
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
                  <Icon icon="info" className="ms-1 mb-1" size="17" />
                </span>
              </OverlayTrigger>
            </Col>
          </Row>

          <Row>
            <Col xs="auto">
              <strong>{getOutput()[2]}</strong>
            </Col>
            <Col className="text-end">
              <strong>
                {swapInput1?.value ? formatFromWei(getOutput()[0], 6) : '0.00'}{' '}
                {getOutput()[1]}
              </strong>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 'Approval/Allowance' row */}

      {assetSwap2.newPool && (
        <Row>
          <Col>
            <div className="text-center">{t('newPoolZapConfirm')}</div>
            <Form className="my-2 text-center">
              <span>
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
        <Row className="text-center mt-3">
          {wallet?.account && swapInput1?.value && (
            <Approval
              tokenAddress={assetSwap1?.address}
              symbol={`${token1.symbol}p`}
              walletAddress={wallet?.account}
              contractAddress={addresses.router}
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
                  fill="white"
                  icon="cycle"
                  size="20"
                  className="anim-spin ms-1"
                />
              )}
            </Button>
          </Col>
        </Row>
      ) : (
        <Row className="text-center mt-3">
          <Col xs="12" sm="4" md="12">
            <Button className="w-auto" disabled>
              {checkValid()[1]}
            </Button>
            <OverlayTrigger
              placement="auto"
              overlay={Tooltip(t, 'newPool', `${token1.symbol}p`)}
            >
              <span role="button">
                <Icon icon="info" className="ms-1" size="17" />
              </span>
            </OverlayTrigger>
          </Col>
        </Row>
      )}
    </>
  )
}

export default SwapLps
