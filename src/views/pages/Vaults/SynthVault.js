import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Row, Col, OverlayTrigger } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import {
  getSynthGlobalDetails,
  synthVaultWeight,
  getSynthDetails,
  getSynthMemberDetails,
  getSynthMinting,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import SynthVaultItem from './SynthVaultItem'
import { calcAPY, getSynthVaultWeights } from '../../../utils/math/nonContract'
import { usePool } from '../../../store/pool'
import { Icon } from '../../../components/Icons/icons'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SynthHarvestAllModal from './Components/SynthHarvestAllModal'
import { useWeb3 } from '../../../store/web3'
import { synthHarvestLive } from '../../../utils/web3'
import { Tooltip } from '../../../components/Tooltip/tooltip'

const SynthVault = () => {
  const isLightMode = window.localStorage.getItem('theme')
  const { t } = useTranslation()
  const synth = useSynth()
  const pool = usePool()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()

  const [trigger0, settrigger0] = useState(0)
  const [showUsd, setShowUsd] = useState(false)

  const getGlobals = () => {
    dispatch(getSynthGlobalDetails(web3.rpcs))
    dispatch(getSynthMemberDetails(wallet, web3.rpcs))
    dispatch(getSynthMinting(web3.rpcs))
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getGlobals()
    }
    const timer = setTimeout(() => {
      getGlobals()
      settrigger0(trigger0 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    const checkDetails = () => {
      if (synth.synthArray?.length > 1) {
        dispatch(getSynthDetails(synth.synthArray, wallet, web3.rpcs))
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.synthArray])

  useEffect(() => {
    const checkWeight = () => {
      if (synth.synthDetails?.length > 1 && pool.poolDetails?.length > 1) {
        dispatch(
          synthVaultWeight(synth.synthDetails, pool.poolDetails, web3.rpcs),
        )
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.synthDetails])

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
    return formatFromUnits(calcAPY(_object, fees), 2)
  }

  const handleChangeShow = () => {
    setShowUsd(!showUsd)
  }

  const getTotalWeight = () => {
    const _amount = synth.totalWeight ? BN(synth.totalWeight) : 0
    if (_amount > 0) {
      return _amount
    }
    return '0.00'
  }

  const getUSDFromSparta = () => {
    if (getTotalWeight() > 0)
      return BN(getTotalWeight()).times(web3.spartaPrice)
    return '0.00'
  }

  const getOwnWeight = () => {
    const _weight = getSynthVaultWeights(synth.synthDetails, pool.poolDetails)
    if (_weight > 0) {
      return _weight
    }
    return '0.00'
  }

  const getUSDFromSpartaOwnWeight = () => {
    const _weight = getOwnWeight()
    if (_weight > 0) {
      return BN(_weight).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const isLoading = () => {
    if (
      synth.synthDetails.length > 1 &&
      synth.globalDetails &&
      pool.tokenDetails.length > 1
    ) {
      return false
    }
    return true
  }

  return (
    <Row>
      <Col xs="auto" className="">
        <Card className="card-320" style={{ minHeight: '290' }}>
          <Card.Header>
            <Row>
              <Col>{t('synthVault')}</Col>
              <Col xs="auto" className="text-center m-auto">
                {synthHarvestLive && (
                  <>
                    <p className="text-sm-label d-inline-block">APY</p>
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'apySynth')}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1 mt-1"
                          size="17"
                          fill={isLightMode ? 'black' : 'white'}
                        />
                      </span>
                    </OverlayTrigger>
                    <p className="output-card d-inline-block ms-2">{APY()}%</p>
                  </>
                )}
              </Col>
            </Row>
          </Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body className="pb-0">
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('minTime')}
                  </Col>
                  <Col className="text-end output-card">
                    {synth.globalDetails?.minTime} seconds
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('erasToEarn')}
                  </Col>
                  <Col className="text-end output-card">
                    {synth.globalDetails?.erasToEarn}
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('vaultClaim')}
                  </Col>
                  <Col className="text-end output-card">
                    {synth.globalDetails?.vaultClaim / 100}%
                  </Col>
                </Row>
                <hr className="my-2" />
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('totalWeight')}
                  </Col>
                  <Col
                    className="text-end output-card"
                    onClick={() => handleChangeShow()}
                    role="button"
                  >
                    {!showUsd
                      ? formatFromWei(getTotalWeight())
                      : formatFromWei(getUSDFromSparta())}
                    <Icon
                      icon={showUsd ? 'usd' : 'spartav2'}
                      size="20"
                      className="mb-1 ms-1"
                    />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('yourWeight')}
                  </Col>
                  <Col
                    className="text-end output-card"
                    onClick={() => handleChangeShow()}
                    role="button"
                  >
                    {!wallet.account ? (
                      t('connectWallet')
                    ) : (
                      <>
                        {!showUsd
                          ? formatFromWei(getOwnWeight())
                          : formatFromWei(getUSDFromSpartaOwnWeight())}
                        <Icon
                          icon={showUsd ? 'usd' : 'spartav2'}
                          size="20"
                          className="mb-1 ms-1"
                        />
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('percentWeight')}
                  </Col>
                  <Col className="text-end output-card">
                    {!wallet.account
                      ? t('connectWallet')
                      : getTotalWeight() > 0 && getOwnWeight() > 0
                      ? `${BN(getOwnWeight())
                          .div(getTotalWeight())
                          .times(100)
                          .toFixed(4)}%`
                      : t('noWeight')}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer xs="12">
                <SynthHarvestAllModal />
              </Card.Footer>
            </>
          ) : (
            <HelmetLoading />
          )}
        </Card>
      </Col>
      {!isLoading() &&
        synth.synthDetails
          .filter((i) => i.address !== false)
          .map((i) => <SynthVaultItem key={i.address} synthItem={i} />)}
    </Row>
  )
}

export default SynthVault
