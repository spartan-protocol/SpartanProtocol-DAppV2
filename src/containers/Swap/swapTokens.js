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
import { useAccount, useWalletClient } from 'wagmi'
import AssetSelect from '../../components/AssetSelect/index'
import { formatShortString } from '../../utils/web3'
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
import { calcSpotValueInBase, getPool, getToken } from '../../utils/math/utils'
import { getSwapSpot } from '../../utils/math/nonContract'
import { swapTo } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract, getPriceByContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'
import { appAsset, useApp } from '../../store/app'

const SwapTokens = ({ assetSwap1, assetSwap2 }) => {
  const dispatch = useDispatch()
  const focus = useFocus()
  const location = useLocation()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { addresses, asset1, asset2, settings } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const web3 = useWeb3()

  const [reverseRate, setReverseRate] = useState(false)
  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [loadedInitial, setloadedInitial] = useState(false)

  const [token1, settoken1] = useState(false)
  const [token2, settoken2] = useState(false)
  const [bnbBalance, setbnbBalance] = useState(false)
  const [asset1USD, setAsset1USD] = useState(false)
  const [asset2USD, setAsset2USD] = useState(false)
  const [getSwap, setGetSwap] = useState(['0.00', '0.00', '0.00', '0.00'])
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPriceInternal])

  // Check and set selected assets based on URL params ONLY ONCE
  useEffect(() => {
    if (!loadedInitial && pool.poolDetails.length > 0) {
      const assetParam1 = new URLSearchParams(location.search).get(`asset1`)
      const assetParam2 = new URLSearchParams(location.search).get(`asset2`)
      let _asset1Addr =
        assetParam1 === addresses.wbnb ? addresses.bnb : assetParam1
      let _asset2Addr =
        assetParam2 === addresses.wbnb ? addresses.bnb : assetParam2
      _asset1Addr = getPool(_asset1Addr, pool.poolDetails).tokenAddress ?? false
      _asset2Addr = getPool(_asset2Addr, pool.poolDetails).tokenAddress ?? false

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

  // Check selected assets and validate for swap page
  useEffect(() => {
    const getAssetDetails = () => {
      if (loadedInitial && focus && pool.poolDetails?.length > 0) {
        let _asset1Addr = asset1.addr
        let _asset2Addr = asset2.addr

        if (_asset2Addr === _asset1Addr) {
          _asset2Addr =
            _asset1Addr !== pool.poolDetails[0].tokenAddress
              ? pool.poolDetails[0].tokenAddress
              : pool.poolDetails[1].tokenAddress
        }

        const hide1 = getPool(_asset1Addr, pool.poolDetails).hide
        const hide2 = getPool(_asset2Addr, pool.poolDetails).hide

        if (hide1 || !getPool(_asset1Addr, pool.poolDetails)) {
          _asset1Addr = addresses.spartav2
        }

        if (hide2 || !getPool(_asset2Addr, pool.poolDetails)) {
          _asset2Addr = addresses.bnb
        }

        dispatch(appAsset('1', _asset1Addr, 'token'))
        dispatch(appAsset('2', _asset2Addr, 'token'))
      }
    }
    getAssetDetails()
  }, [
    addresses.bnb,
    addresses.spartav2,
    addresses.wbnb,
    pool.poolDetails,
    focus,
    asset1.addr,
    asset2.addr,
    dispatch,
    loadedInitial,
  ])

  useEffect(() => {
    if (pool.tokenDetails.length > 0) {
      settoken1(getToken(asset1.addr, pool.tokenDetails))
      settoken2(getToken(asset2.addr, pool.tokenDetails))
      setbnbBalance(getToken(addresses.bnb, pool.tokenDetails).balance)
    }
  }, [addresses.bnb, asset1.addr, asset2.addr, pool.tokenDetails])

  useEffect(() => {
    balanceWidths()
  }, [asset1.addr, asset2.addr, loadedInitial, pool.poolDetails])

  /** Check token1 external price (on asset1 change) */
  useEffect(() => {
    let isCancelled = false
    const getAsset1ExtPrice = async () => {
      if (assetSwap1.tokenAddress) {
        if (assetSwap1.tokenAddress === addresses.spartav2) {
          setAsset1USD(false)
        } else {
          setAsset1USD(false)
          const asset1usd = await getPriceByContract(
            assetSwap1.tokenAddress === addresses.bnb
              ? addresses.wbnb
              : assetSwap1.tokenAddress,
          )
          const isCurrent =
            asset1usd[
              assetSwap1.tokenAddress === addresses.bnb
                ? addresses.wbnb.toLowerCase()
                : assetSwap1.tokenAddress.toLowerCase()
            ]
          if (isCurrent && !isCancelled) {
            setAsset1USD(isCurrent.usd)
          }
        }
      }
    }
    getAsset1ExtPrice()
    return () => {
      isCancelled = true
    }
  }, [
    addresses.bnb,
    addresses.spartav2,
    addresses.wbnb,
    assetSwap1.tokenAddress,
  ])

  /** Check token2 external price (on asset2 change) */
  useEffect(() => {
    let isCancelled = false
    const getAsset2ExtPrice = async () => {
      if (assetSwap2.tokenAddress) {
        if (assetSwap2.tokenAddress === addresses.spartav2) {
          setAsset2USD(false)
        } else {
          setAsset2USD(false)
          const asset2usd = await getPriceByContract(
            assetSwap2.tokenAddress === addresses.bnb
              ? addresses.wbnb
              : assetSwap2.tokenAddress,
          )
          const isCurrent =
            asset2usd[
              assetSwap2.tokenAddress === addresses.bnb
                ? addresses.wbnb.toLowerCase()
                : assetSwap2.tokenAddress.toLowerCase()
            ]
          if (isCurrent && !isCancelled) {
            setAsset2USD(isCurrent.usd)
          }
        }
      }
    }
    getAsset2ExtPrice()
    return () => {
      isCancelled = true
    }
  }, [
    addresses.bnb,
    addresses.spartav2,
    addresses.wbnb,
    assetSwap2.tokenAddress,
  ])

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const getBalance = (asset) => {
    if (asset === 1) {
      return token1.balance
    }
    return token2.balance
  }

  //= =================================================================================//
  // Functions to get txn Details

  /**
   * Get swap txn details
   * @returns [output, swapFee, divi1, divi2]
   */
  const updateSwap = () => {
    if (swapInput1 && assetSwap1 && assetSwap2) {
      const [output, swapFee, divi1, divi2] = swapTo(
        convertToWei(swapInput1.value),
        assetSwap1,
        assetSwap2,
        sparta.globalDetails.feeOnTransfer,
        assetSwap2.tokenAddress === addresses.spartav2,
        assetSwap1.tokenAddress === addresses.spartav2,
      )
      setGetSwap([output, swapFee, divi1, divi2])
      swapInput2.value = convertFromWei(output)
    }
  }

  const clearInputs = () => {
    if (swapInput1) {
      swapInput1.value = ''
      swapInput1.focus()
    }
    if (swapInput2) {
      swapInput2.value = ''
    }
    updateSwap()
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
      return [input, symbol]
    }
    return ['0.00', symbol]
  }

  const getOutput = () => {
    const { symbol } = token2
    return [getSwap[0], symbol, t('output')]
  }

  const getSpot = () => {
    let spot = getSwapSpot(
      assetSwap1,
      assetSwap2,
      assetSwap2.tokenAddress === addresses.spartav2,
      assetSwap1.tokenAddress === addresses.spartav2,
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
    result = BN(getSwap[1])
    result = getSwap[2] ? result.plus(getSwap[2]) : result
    result = getSwap[3] ? result.plus(getSwap[3]) : result
    result = result > 0 ? result : '0.00'
    return result
  }

  //= =================================================================================//
  // Functions for input handling

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1?.tokenAddress === addresses.spartav2 && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(spartaPrice)
    }
    if (swapInput1?.value) {
      if (asset1USD) {
        return BN(convertToWei(swapInput1?.value)).times(asset1USD)
      }
      // If we have no external pricing data, fallback to internal pricing
      return BN(
        calcSpotValueInBase(convertToWei(swapInput1?.value), assetSwap1),
      ).times(spartaPrice)
    }
    return '0'
  }

  // GET USD VALUES
  const getInput2USD = () => {
    if (assetSwap2?.tokenAddress === addresses.spartav2 && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(spartaPrice)
    }
    if (swapInput2?.value) {
      if (asset2USD) {
        return BN(convertToWei(swapInput2?.value)).times(asset2USD)
      }
      // If we have no external pricing data, fallback to internal pricing
      return BN(
        calcSpotValueInBase(convertToWei(swapInput2?.value), assetSwap2),
      ).times(spartaPrice)
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
    const _symbol = token1.symbol
    return [true, `${t('sell')} ${_symbol}`]
  }

  const handleSwapAssets = async () => {
    let gasSafety = '5000000000000000'
    if (
      assetSwap1?.tokenAddress !== addresses.spartav2 &&
      assetSwap2?.tokenAddress !== addresses.spartav2
    ) {
      gasSafety = '10000000000000000'
    }
    if (
      assetSwap1?.tokenAddress === addresses.bnb ||
      assetSwap1?.tokenAddress === addresses.wbnb
    ) {
      if (
        BN(bnbBalance)
          .minus(convertToWei(swapInput1?.value))
          .isLessThan(gasSafety)
      ) {
        swapInput1.value = convertFromWei(BN(bnbBalance).minus(gasSafety))
        updateSwap()
      }
    }
    setTxnLoading(true)
    const minAmountFraction = BN(100).minus(settings.slipTol).div(100)
    await dispatch(
      swap(
        convertToWei(swapInput1?.value),
        assetSwap1.tokenAddress,
        assetSwap2.tokenAddress,
        BN(getSwap[0]).times(minAmountFraction).toFixed(0, 1),
        address,
        walletClient,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  const checkWallet = () => {
    if (!address) {
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
                    updateSwap()
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
                        defaultTab="token"
                        priority="1"
                        filter={['token']}
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
                        onChange={() => updateSwap()}
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
                      {formatShortString(assetSwap1?.tokenAddress)}
                      <ShareLink url={assetSwap1?.tokenAddress}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap1?.tokenAddress)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon icon="scan" size="14" className="ms-1 mb-1" />
                      </a>
                    </Col>
                    <Col className="text-end">
                      {spartaPrice > 0 ? (
                        <OverlayTrigger
                          placement="auto"
                          overlay={Tooltip(
                            t,
                            'pricingData',
                            asset1USD ? 'CoinGecko' : 'internal pool prices',
                          )}
                        >
                          <span role="button">
                            ~$
                            {swapInput1?.value
                              ? formatFromWei(getInput1USD(), 2)
                              : '0.00'}
                            <Icon
                              icon={asset1USD ? 'coinGeckoIcon' : 'usd'}
                              size="14"
                              className="ms-1"
                            />
                          </span>
                        </OverlayTrigger>
                      ) : (
                        ''
                      )}
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
                <Col>
                  <strong>{t('buy')}</strong>
                </Col>
                <Col xs="auto" className="float-end text-end fw-light">
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
                        filter={['token']}
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
                      {formatShortString(assetSwap2?.tokenAddress)}
                      <ShareLink url={assetSwap2?.tokenAddress}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetSwap2?.tokenAddress)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon icon="scan" size="14" className="ms-1 mb-1" />
                      </a>
                    </Col>
                    <Col className="text-end">
                      {spartaPrice > 0 ? (
                        <OverlayTrigger
                          placement="auto"
                          overlay={Tooltip(
                            t,
                            'pricingData',
                            asset2USD ? 'CoinGecko' : 'internal pool prices',
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
                            %)
                            <Icon
                              icon={asset2USD ? 'coinGeckoIcon' : 'usd'}
                              size="14"
                              className="ms-1 mb-1"
                            />
                          </span>
                        </OverlayTrigger>
                      ) : (
                        ''
                      )}
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

      <Row className="text-center mt-3">
        {assetSwap1?.tokenAddress !== addresses.bnb &&
          address &&
          swapInput1?.value && (
            <Approval
              tokenAddress={assetSwap1?.tokenAddress}
              symbol={token1.symbol}
              walletAddress={address}
              contractAddress={addresses.router}
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
