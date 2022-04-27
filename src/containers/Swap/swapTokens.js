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
import { useWeb3React } from '@web3-react/core'
import AssetSelect from '../../components/AssetSelect/index'
import {
  formatShortString,
  getAddresses,
  getItemFromArray,
  getSettings,
} from '../../utils/web3'
import { usePool } from '../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../utils/bigNumber'
import { swap } from '../../store/router'
import Approval from '../../components/Approval/index'
import { useWeb3 } from '../../store/web3'
import { useSparta } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { balanceWidths } from '../Liquidity/Components/Utils'
import { calcSpotValueInBase } from '../../utils/math/utils'
import { getSwapSpot } from '../../utils/math/nonContract'
import { swapTo } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract, getPriceByContract } from '../../utils/extCalls'

const SwapTokens = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const location = useLocation()

  const [reverseRate, setReverseRate] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [asset1USD, setAsset1USD] = useState(false)
  const [asset2USD, setAsset2USD] = useState(false)
  const [triggerReload, setTriggerReload] = useState(0)
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  const [hasFocus, setHasFocus] = useState(true)

  window.addEventListener('focus', () => {
    setHasFocus(true)
  })

  window.addEventListener('blur', () => {
    setHasFocus(false)
  })

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

          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'token')

          if (asset2?.tokenAddress === asset1?.tokenAddress) {
            asset2 =
              asset1?.tokenAddress !== poolDetails[0].tokenAddress
                ? { tokenAddress: poolDetails[0].tokenAddress }
                : { tokenAddress: poolDetails[1].tokenAddress }
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
    }

    getAssetDetails()
    balanceWidths()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    triggerReload,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    hasFocus,
  ])

  const getAsset1ExtPrice = async () => {
    if (assetSwap1 !== '...') {
      if (assetSwap1.tokenAddress === addr.spartav2) {
        setAsset1USD(false)
      } else {
        setAsset1USD(false)
        const asset1usd = await getPriceByContract(assetSwap1.tokenAddress)
        const isCurrent =
          asset1usd[
            assetSwap1.tokenAddress === addr.bnb
              ? addr.wbnb.toLowerCase()
              : assetSwap1.tokenAddress.toLowerCase()
          ]
        if (isCurrent) {
          setAsset1USD(isCurrent.usd)
        }
      }
    }
  }

  const getAsset2ExtPrice = async () => {
    if (assetSwap2 !== '...') {
      if (assetSwap2.tokenAddress === addr.spartav2) {
        setAsset2USD(false)
      } else {
        setAsset2USD(false)
        const asset2usd = await getPriceByContract(assetSwap2.tokenAddress)
        const isCurrent =
          asset2usd[
            assetSwap2.tokenAddress === addr.bnb
              ? addr.wbnb.toLowerCase()
              : assetSwap2.tokenAddress.toLowerCase()
          ]
        if (isCurrent) {
          setAsset2USD(isCurrent.usd)
        }
      }
    }
  }

  /** Check token1 external price (on asset1 change) */
  useEffect(() => {
    getAsset1ExtPrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSwap1.tokenAddress])

  /** Check token2 external price (on asset2 change) */
  useEffect(() => {
    getAsset2ExtPrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSwap2.tokenAddress])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

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
    return getToken(item.tokenAddress)?.balance
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

  const getInput = () => {
    const symbol = getToken(assetSwap1.tokenAddress)?.symbol
    if (swapInput1) {
      const input = swapInput1.value
      return [input, symbol]
    }
    return ['0.00', symbol]
  }

  const getOutput = () => {
    const symbol = getToken(assetSwap2.tokenAddress)?.symbol
    return [getSwap()[0], symbol, t('output')]
  }

  const getSpot = () => {
    let spot = getSwapSpot(
      assetSwap1,
      assetSwap2,
      assetSwap2.tokenAddress === addr.spartav2,
      assetSwap1.tokenAddress === addr.spartav2,
    )
    spot = spot > 0 ? spot : '0.00'
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
    result = BN(getSwap()[1])
    result = getSwap()[2] ? result.plus(getSwap()[2]) : result
    result = getSwap()[3] ? result.plus(getSwap()[3]) : result
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

  //= =================================================================================//
  // Functions for input handling

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addr.spartav2 && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (swapInput1?.value) {
      if (asset1USD) {
        return BN(convertToWei(swapInput1?.value)).times(asset1USD)
      }
      // If we have no external pricing data, fallback to internal pricing
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
    if (swapInput2?.value) {
      if (asset2USD) {
        return BN(convertToWei(swapInput2?.value)).times(asset2USD)
      }
      // If we have no external pricing data, fallback to internal pricing
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

  const estMaxGasDoubleSwap = '2000000000000000'
  const estMaxGasSwap = '1500000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb).balance
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
    return [true, `${t('sell')} ${_symbol}`]
  }

  useEffect(() => {
    if (swapInput1?.value) {
      handleInputChange()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2])

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
    const minAmountFraction = BN(100).minus(getSettings().slipTol).div(100)
    await dispatch(
      swap(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        assetSwap2.tokenAddress,
        BN(getSwap()[0]).times(minAmountFraction).toFixed(0, 1),
        wallet,
        web3.rpcs,
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
                <Col xs="auto">
                  <strong>{t('sell')}</strong>
                </Col>
                <Col
                  className="float-end text-end"
                  role="button"
                  aria-hidden="true"
                  onClick={() => {
                    swapInput1.value = convertFromWei(getBalance(1))
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
                  <InputGroup className="m-0">
                    <InputGroup.Text id="assetSelect1">
                      <AssetSelect
                        defaultTab="token"
                        priority="1"
                        filter={['token']}
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
                      <Icon icon="close" size="10" fill="grey" />
                    </InputGroup.Text>
                  </InputGroup>

                  <Row className="pt-1">
                    <Col>
                      {formatShortString(assetSwap1?.tokenAddress)}
                      <ShareLink url={assetSwap1?.tokenAddress}>
                        <Icon icon="copy" size="16" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap1?.tokenAddress)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon
                          icon="scan"
                          size="12"
                          className="ms-1 mb-1"
                          fill="rgb(170, 205, 255)"
                        />
                      </a>
                    </Col>
                    <Col className="text-end">
                      <OverlayTrigger
                        placement="auto"
                        overlay={Tooltip(
                          t,
                          'pricingData',
                          asset1USD ||
                            assetSwap1?.tokenAddress === addr.spartav2
                            ? 'CoinGecko'
                            : 'internal pool prices',
                        )}
                      >
                        <span role="button">
                          ~$
                          {swapInput1?.value
                            ? formatFromWei(getInput1USD(), 2)
                            : '0.00'}
                          <Icon
                            icon={
                              asset1USD ||
                              assetSwap1?.tokenAddress === addr.spartav2
                                ? 'coinGeckoIcon'
                                : 'usd'
                            }
                            size="14"
                            className="ms-1"
                          />
                        </span>
                      </OverlayTrigger>
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
                stroke="white"
                fill="white"
                className="position-relative bg-primary rounded-circle px-2 iconOnTop"
              />
            </Col>
          </Row>

          {/* 'To' input box */}

          <Card className="mb-3 assetSection">
            <Card.Body>
              <Row>
                <Col xs="auto" className="">
                  <strong>{t('buy')}</strong>
                </Col>
                <Col className="float-end text-end">
                  {t('balance')}
                  {': '}
                  {pool.poolDetails && formatFromWei(getBalance(2), 4)}
                </Col>
              </Row>

              <Row className="my-1">
                <Col>
                  <InputGroup className="m-0">
                    <InputGroup.Text id="assetSelect2">
                      <AssetSelect
                        priority="2"
                        filter={['token']}
                        blackList={[assetSwap1.tokenAddress]}
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
                      <Icon icon="close" size="10" fill="grey" />
                    </InputGroup.Text>
                  </InputGroup>

                  <Row className="pt-1">
                    <Col>
                      {formatShortString(assetSwap2?.tokenAddress)}
                      <ShareLink url={assetSwap2?.tokenAddress}>
                        <Icon icon="copy" size="16" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap2?.tokenAddress)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon
                          icon="scan"
                          size="12"
                          className="ms-1 mb-1"
                          fill="rgb(170, 205, 255)"
                        />
                      </a>
                    </Col>
                    <Col className="text-end">
                      <OverlayTrigger
                        placement="auto"
                        overlay={Tooltip(
                          t,
                          'pricingData',
                          asset2USD ||
                            assetSwap2?.tokenAddress === addr.spartav2
                            ? 'CoinGecko'
                            : 'internal pool prices',
                        )}
                      >
                        <span role="button">
                          ~$
                          {swapInput2?.value
                            ? formatFromWei(getInput2USD(), 2)
                            : '0.00'}
                          {' ('}
                          {swapInput1?.value
                            ? formatFromUnits(getRateSlip(), 2)
                            : '0.00'}
                          {'%)'}
                          <Icon
                            icon={
                              asset2USD ||
                              assetSwap2?.tokenAddress === addr.spartav2
                                ? 'coinGeckoIcon'
                                : 'usd'
                            }
                            size="14"
                            className="ms-1 mb-1"
                          />
                        </span>
                      </OverlayTrigger>
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

          <Row className="">
            <Col xs="auto" className="">
              <strong className="">{getOutput()[2]}</strong>
            </Col>
            <Col className="text-end">
              <strong className="">
                {swapInput1?.value ? formatFromWei(getOutput()[0], 6) : '0.00'}{' '}
                {getOutput()[1]}
              </strong>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 'Approval/Allowance' row */}

      <Row className="text-center mt-3">
        {assetSwap1?.tokenAddress !== addr.bnb &&
          wallet?.account &&
          swapInput1?.value && (
            <Approval
              tokenAddress={assetSwap1?.tokenAddress}
              symbol={getToken(assetSwap1.tokenAddress)?.symbol}
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
                fill="white"
                icon="cycle"
                size="20"
                className="anim-spin ms-1"
              />
            )}
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default SwapTokens
