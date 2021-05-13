/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { synthDeposit, synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useReserve } from '../../../store/reserve/selector'
import {
  calcLiquidityUnitsAsym,
  calcShare,
  calcSwapOutput,
} from '../../../utils/web3Utils'
import { useSparta } from '../../../store/sparta/selector'
import spartaIconAlt from '../../../assets/img/spartan_synth.svg'

const SynthVaultItem = ({ synthItem }) => {
  const { t } = useTranslation()
  const sparta = useSparta()
  const reserve = useReserve()
  const synth = useSynth()
  const pool = usePool()
  const dispatch = useDispatch()
  // const [showDetails, setShowDetails] = useState(false)
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const getPool = (tokenAddress) =>
    pool.poolDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
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
    return claimAmount
  }

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
    )
    const tokenValue = BN(tokenAmount).plus(baseSwapped)
    return tokenValue
  }

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320">
          <Row className="mb-2">
            <Col xs="auto" className="pr-0">
              <img
                className=""
                src={getToken(synthItem.tokenAddress)?.symbolUrl}
                alt={getToken(synthItem.tokenAddress)?.symbol}
                height="50px"
              />
              <img
                height="25px"
                src={spartaIconAlt}
                alt="Sparta synth token icon"
                className="pr-2 ml-n3 mt-4"
              />
            </Col>
            <Col xs="auto" className="pl-1">
              <h3 className="mb-0">
                {getToken(synthItem.tokenAddress)?.symbol}s
              </h3>
              <Link to={`/dapp/synths?asset2=${synthItem.tokenAddress}`}>
                <p className="text-sm-label-alt">
                  {t('obtain')} {getToken(synthItem.tokenAddress)?.symbol}s
                  <i className="icon-scan icon-mini ml-1" />
                </p>
              </Link>
            </Col>

            {/* <Col className="text-right my-auto">
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
            <Col className="text-right output-card">
              {formatFromWei(synthItem.balance)}{' '}
              {getToken(synthItem.tokenAddress)?.symbol}s
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('staked')}
            </Col>
            <Col className="text-right output-card">
              {formatFromWei(synthItem.staked)}{' '}
              {getToken(synthItem.tokenAddress)?.symbol}s
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('harvestable')}
            </Col>
            <Col className="text-right output-card">
              {synthItem.weight > 0
                ? formatFromWei(getSynthOutputFromBase())
                : '0.00'}{' '}
              {getToken(synthItem.tokenAddress)?.symbol}s
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('lastHarvest')}
            </Col>
            <Col className="text-right output-card">
              {synthItem.lastHarvest > 0
                ? formatDate(synthItem.lastHarvest)
                : t('never')}
            </Col>
          </Row>

          <Row className="card-body py-0 text-center">
            <Col xs="6" className="py-1 pr-1 pl-0">
              <Button
                color="primary"
                className="btn-sm h-100 w-100"
                onClick={() =>
                  dispatch(synthDeposit(synthItem.address, synthItem.balance))
                }
                disabled={synthItem.balance <= 0}
              >
                {t('deposit')}
              </Button>
            </Col>
            <Col xs="6" className="py-1 pl-1 pr-0">
              <Button
                color="primary"
                className="btn-sm h-100 w-100"
                onClick={() =>
                  dispatch(synthWithdraw(synthItem.address, '10000'))
                }
                disabled={synthItem.staked <= 0}
              >
                {t('withdraw')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default SynthVaultItem
