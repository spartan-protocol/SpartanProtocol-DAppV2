import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, OverlayTrigger, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { usePool } from '../../../store/pool'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useReserve } from '../../../store/reserve/selector'
import {
  calcAPY,
  calcFeeBurn,
  calcLiquidityUnitsAsym,
  calcShare,
  calcSwapOutput,
} from '../../../utils/web3Utils'
import { useSparta } from '../../../store/sparta/selector'
import spartaIconAlt from '../../../assets/tokens/sparta-synth.svg'
import SynthDepositModal from './Components/SynthDepositModal'
import { Icon } from '../../../components/Icons/icons'
import { Tooltip } from '../../../components/Tooltip/tooltip'

const SynthVaultItem = ({ synthItem }) => {
  const { t } = useTranslation()
  const sparta = useSparta()
  const reserve = useReserve()
  const synth = useSynth()
  const pool = usePool()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const [tokenAddress, settokenAddress] = useState('')
  const [showModal, setShowModal] = useState(false)
  // const [showDetails, setShowDetails] = useState(false)
  const getToken = (_tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddress)[0]
  const getPool = (_tokenAddress) =>
    pool.poolDetails.filter((i) => i.tokenAddress === _tokenAddress)[0]

  const APY = formatFromUnits(
    calcAPY(
      0,
      0,
      synth.globalDetails.recentRevenue,
      synth.globalDetails.lastMonthRevenue,
      synth.globalDetails.genesis,
      BN(synth.globalDetails.totalWeight).div(2),
    ),
    2,
  )

  const toggleModal = (_tokenAddr) => {
    settokenAddress(_tokenAddr)
    setShowModal(!showModal)
  }

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getFeeBurn = (_amount) => {
    const burnFee = calcFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)
    return burnFee
  }

  // Calculations
  const getClaimable = () => {
    // get seconds passed since last harvest
    const timeStamp = BN(Date.now()).div(1000)
    const lastHarvest = BN(synthItem.lastHarvest)
    const secondsSince = timeStamp.minus(lastHarvest)
    // get the members share
    const weight = BN(synthItem.weight)
    const reserveShare = BN(reserve.globalDetails.spartaBalance).div(
      synth.globalDetails.erasToEarn,
    )
    const vaultShare = reserveShare
      .times(synth.globalDetails.vaultClaim)
      .div('10000')
    const totalWeight = BN(synth.globalDetails.totalWeight)
    const share = calcShare(weight, totalWeight, vaultShare)
    // get the members claimable amount
    const claimAmount = share
      .times(secondsSince)
      .div(sparta.globalDetails.secondsPerEra)
    const feeBurn = getFeeBurn(claimAmount)
    return BN(claimAmount).minus(feeBurn)
  }

  const isLightMode = window.localStorage.getItem('theme')

  const getSynthLPsFromBase = () => {
    const temp = calcLiquidityUnitsAsym(
      getClaimable(),
      getPool(synthItem.tokenAddress)?.baseAmount,
      getPool(synthItem.tokenAddress)?.poolUnits,
    )
    return temp
  }

  const getSynthOutputFromBase = () => {
    const lpUnits = getSynthLPsFromBase()
    const baseAmount = calcShare(
      lpUnits,
      BN(getPool(synthItem.tokenAddress)?.poolUnits).plus(lpUnits),
      BN(getPool(synthItem.tokenAddress)?.baseAmount).plus(getClaimable()),
    )
    const tokenAmount = calcShare(
      lpUnits,
      BN(getPool(synthItem.tokenAddress)?.poolUnits).plus(lpUnits),
      getPool(synthItem.tokenAddress)?.tokenAmount,
    )
    const baseSwapped = calcSwapOutput(
      baseAmount,
      getPool(synthItem.tokenAddress)?.tokenAmount,
      BN(getPool(synthItem.tokenAddress)?.baseAmount).plus(getClaimable()),
    )[0]
    const tokenValue = BN(tokenAmount).plus(baseSwapped)
    // console.log(tokenValue)
    if (tokenValue > 0) {
      return tokenValue
    }
    return '0.00'
  }

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  return (
    <>
      <Col xs="auto">
        <Card className="card-320">
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
                <img
                  className="mr-3"
                  src={getToken(synthItem.tokenAddress)?.symbolUrl}
                  alt={getToken(synthItem.tokenAddress)?.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIconAlt}
                  alt="Sparta synth token icon"
                  className="position-absolute"
                  style={{ right: '8px', bottom: '7px' }}
                />
              </Col>
              <Col xs="auto" className="pl-1">
                <h3 className="mb-0">
                  {getToken(synthItem.tokenAddress)?.symbol}s
                </h3>
                <Link to={`/synths?asset2=${synthItem.tokenAddress}`}>
                  <p className="text-sm-label-alt">
                    {t('obtain')} {getToken(synthItem.tokenAddress)?.symbol}s
                    <Icon
                      icon="scan"
                      size="13"
                      fill={isLightMode ? 'black' : 'white'}
                      className="ms-1"
                    />
                  </p>
                </Link>
              </Col>
              <Col className="text-center m-auto">
                <OverlayTrigger
                  placement="auto"
                  overlay={Tooltip(t, 'apySynth')}
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="me-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
                <p className="text-sm-label d-inline-block">APY</p>
                <p className="output-card">{APY}%</p>
              </Col>

              {/* <Col className="text-end my-auto">
              {showDetails && (
                <i
                  role="button"
                  className="icon-small icon-up icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
              {!showDetails && (
                <i
                  role="button"
                  className="icon-small icon-down icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
            </Col> */}
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('balance')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(synthItem.balance)}{' '}
                {getToken(synthItem.tokenAddress)?.symbol}s
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('staked')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(synthItem.staked)}{' '}
                {getToken(synthItem.tokenAddress)?.symbol}s
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('harvestable')}
              </Col>
              <Col className="text-end output-card">
                {reserve.globalDetails.emissions
                  ? synthItem.weight > 0
                    ? `${formatFromWei(getSynthOutputFromBase())} ${
                        getToken(synthItem.tokenAddress)?.symbol
                      }s`
                    : `0.00 ${getToken(synthItem.tokenAddress)?.symbol}s`
                  : t('incentivesDisabled')}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lastHarvest')}
              </Col>
              <Col className="text-end output-card">
                {synthItem.lastHarvest > 0
                  ? formatDate(synthItem.lastHarvest)
                  : t('never')}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="">
            <Row>
              <Col xs="6" className="pe-1">
                <Button
                  className="w-100"
                  onClick={() => toggleModal(synthItem.tokenAddress)}
                  disabled={synthItem.balance <= 0}
                >
                  {t('deposit')}
                </Button>
              </Col>
              <Col xs="6" className="ps-1">
                <Button
                  className="w-100"
                  onClick={() =>
                    dispatch(synthWithdraw(synthItem.address, '10000', wallet))
                  }
                  disabled={synthItem.staked <= 0}
                >
                  {t('withdrawAll')}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
          {showModal && (
            <SynthDepositModal
              showModal={showModal}
              toggleModal={toggleModal}
              tokenAddress={tokenAddress}
            />
          )}
        </Card>
      </Col>
    </>
  )
}

export default SynthVaultItem
