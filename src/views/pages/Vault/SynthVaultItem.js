import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, OverlayTrigger, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useReserve } from '../../../store/reserve/selector'
import { useSparta } from '../../../store/sparta/selector'
import spartaIconAlt from '../../../assets/tokens/sparta-synth.svg'
import SynthDepositModal from './Components/SynthDepositModal'
import { Icon } from '../../../components/Icons/icons'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { calcAPY, getTimeSince } from '../../../utils/math/nonContract'
import { calcCurrentRewardSynth } from '../../../utils/math/synthVault'

const SynthVaultItem = ({ synthItem }) => {
  const { t } = useTranslation()
  const sparta = useSparta()
  const reserve = useReserve()
  const synth = useSynth()
  const pool = usePool()
  const wallet = useWeb3React()
  const dispatch = useDispatch()
  const [tokenAddress, settokenAddress] = useState('')
  const [showModal, setShowModal] = useState(false)
  const getToken = (_tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddress)[0]

  const APY = () => {
    const _recentRev = BN(synth.globalDetails.recentRevenue)
    const _prevRev = BN(synth.globalDetails.lastMonthRevenue)
    const fees = _recentRev.isGreaterThan(_prevRev) ? _recentRev : _prevRev
    const _object = {
      recentDivis: 0,
      lastMonthDivis: 0,
      fees: fees.toString(),
      genesis: synth.globalDetails.genesis,
      baseAmount: BN(synth.totalWeight).div(2).toString(),
    }
    return formatFromUnits(calcAPY(_object), 2)
  }

  const toggleModal = (_tokenAddr) => {
    settokenAddress(_tokenAddr)
    setShowModal(!showModal)
  }

  // Calculations
  const getClaimable = () => {
    const [synthOut, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      synthItem,
      sparta.globalDetails,
      reserve.globalDetails.spartaBalance,
    )
    return [synthOut, baseCapped, synthCapped]
  }

  const checkValid = () => {
    const reward = formatFromWei(getClaimable()[0], 4)
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled'), '']
    }
    if (getClaimable()[1]) {
      return [false, t('baseCap'), '']
    }
    if (getClaimable()[2]) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${getToken(synthItem.tokenAddress)?.symbol}s`]
  }

  const isLightMode = window.localStorage.getItem('theme')

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
                <p className="output-card">{APY()}%</p>
              </Col>
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
                {checkValid()[1] + checkValid()[2]}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lastHarvest')}
              </Col>
              <Col className="text-end output-card">
                {synthItem.lastHarvest > 0
                  ? `${
                      getTimeSince(synthItem.lastHarvest, t)[0] +
                      getTimeSince(synthItem.lastHarvest, t)[1]
                    } ago`
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
