import React, { useState, useEffect, useCallback } from 'react'
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
import {
  formatShortString,
  getAddresses,
  getItemFromArray,
  oneWeek,
} from '../../utils/web3'
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
import { useSparta } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { balanceWidths } from '../Liquidity/Components/Utils'
import { calcLiqValue, calcSpotValueInBase } from '../../utils/math/utils'
import { getTimeUntil, getZapSpot } from '../../utils/math/nonContract'
import { zapLiq } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'

const SwapLps = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const location = useLocation()
  const focus = useFocus()

  const [reverseRate, setReverseRate] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [triggerReload, setTriggerReload] = useState(0)
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  useEffect(() => {
    const tryParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (e) {
        return pool.poolDetails[0]
      }
    }
    const getAssetDetails = () => {
      if (focus) {
        if (pool.poolDetails?.length > 0) {
          let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
          let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))

          if (
            assetParam1 !== '' &&
            pool.poolDetails.find((asset) => asset.tokenAddress === assetParam1)
          ) {
            ;[asset1] = pool.poolDetails.filter(
              (asset) => asset.tokenAddress === assetParam1,
            )
            setAssetParam1('')
          }
          if (
            assetParam2 !== '' &&
            pool.poolDetails.find((asset) => asset.tokenAddress === assetParam2)
          ) {
            ;[asset2] = pool.poolDetails.filter(
              (asset) => asset.tokenAddress === assetParam2,
            )
            setAssetParam2('')
          }

          window.localStorage.setItem('assetType1', 'pool')
          window.localStorage.setItem('assetType2', 'pool')

          if (
            asset2?.tokenAddress === asset1?.tokenAddress ||
            asset2?.tokenAddress === addr.spartav2
          ) {
            asset2 =
              asset1?.tokenAddress !== pool.poolDetails[0].tokenAddress
                ? { tokenAddress: pool.poolDetails[0].tokenAddress }
                : { tokenAddress: pool.poolDetails[1].tokenAddress }
          }

          if (asset1?.tokenAddress === addr.spartav2) {
            asset1 =
              asset2?.tokenAddress !== pool.poolDetails[0].tokenAddress
                ? { tokenAddress: pool.poolDetails[0].tokenAddress }
                : { tokenAddress: pool.poolDetails[1].tokenAddress }
          }

          if (asset2?.address === '') {
            asset2 = { tokenAddress: addr.bnb }
          }

          if (
            !asset1 ||
            !pool.poolDetails.find(
              (x) => x.tokenAddress === asset1.tokenAddress,
            )
          ) {
            asset1 = { tokenAddress: pool.poolDetails[1].tokenAddress }
          }

          if (
            !asset2 ||
            !pool.poolDetails.find(
              (x) => x.tokenAddress === asset2.tokenAddress,
            )
          ) {
            asset2 = { tokenAddress: addr.bnb }
          }

          asset1 = getItemFromArray(asset1, pool.poolDetails)
          asset2 = getItemFromArray(asset2, pool.poolDetails)
          asset1 = asset1.hide
            ? getItemFromArray(addr.bnb, pool.poolDetails)
            : asset1
          asset2 = asset2.hide
            ? getItemFromArray(addr.bnb, pool.poolDetails)
            : asset2

          setAssetSwap1(asset1)
          setAssetSwap2(asset2)

          window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
          window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        }
      }
    }
    getAssetDetails()
    balanceWidths()
  }, [
    addr.bnb,
    addr.spartav2,
    assetParam1,
    assetParam2,
    triggerReload,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    focus,
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
    const tryParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (e) {
        return pool.poolDetails[0]
      }
    }
    const asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
    const asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
    window.localStorage.setItem('assetSelected1', JSON.stringify(asset2))
    window.localStorage.setItem('assetSelected2', JSON.stringify(asset1))
    clearInputs()
    setTriggerReload(triggerReload + 1) // This is to make sure the view reloads without delay (useEffect detects a changed localStorage inconsistently)
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
  const getZap = useCallback(() => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [unitsLP, swapFee, slipRevert, capRevert] = zapLiq(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
      )
      return [unitsLP, swapFee, slipRevert, capRevert, assetSwap1.frozen]
    }
    return ['0.00', '0.00', false, false, false]
  }, [assetSwap1, assetSwap2, sparta.globalDetails.feeOnTransfer, swapInput1])

  const getInput = () => {
    const symbol = getToken(assetSwap1.tokenAddress)?.symbol
    if (swapInput1) {
      const input = swapInput1.value
      return [input, `${symbol}p`]
    }
    return ['0.00', symbol]
  }

  const getOutput = () => {
    const symbol = getToken(assetSwap2.tokenAddress)?.symbol
    return [getZap()[0], `${symbol}p`, t('output')]
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
    result = BN(getZap()[1])
    result = result > 0 ? result : '0.00'
    return result
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = useCallback(() => {
    swapInput2.value = convertFromWei(getZap()[0], 18)
  }, [getZap, swapInput2])

  //= =================================================================================//
  // Functions for input handling

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addr.spartav2 && swapInput1?.value) {
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
    if (assetSwap2?.tokenAddress === addr.spartav2 && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (assetSwap2 && swapInput2?.value) {
      const [_sparta, _token] = calcLiqValue(getZap()[0], assetSwap2)
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
    const bal = getToken(addr.bnb).balance
    if (BN(bal).isLessThan(estMaxGasPool)) {
      return false
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

  useEffect(() => {
    if (swapInput1?.value) {
      handleZapInputChange()
    }
  }, [
    swapInput1?.value,
    swapInput2.value,
    assetSwap1,
    assetSwap2,
    handleZapInputChange,
  ])

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
                    swapInput1.value = convertFromWei(getBalance(1))
                    handleZapInputChange(convertFromWei(getBalance(1)), true)
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
              symbol={`${getToken(assetSwap1.tokenAddress)?.symbol}p`}
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
              overlay={Tooltip(
                t,
                'newPool',
                `${getToken(assetSwap1.tokenAddress)?.symbol}p`,
              )}
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
