import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { BN, formatFromUnits, formatFromWei } from '../../utils/bigNumber'
import {
  useSynth,
  getSynthGlobalDetails,
  synthVaultWeight,
} from '../../store/synth'
import SynthVaultItem from './SynthVaultItem'
import { getSynthVaultWeights } from '../../utils/math/nonContract'
import { usePool } from '../../store/pool'
import { Icon } from '../../components/Icons/index'
import HelmetLoading from '../../components/Spinner/index'
import { useWeb3 } from '../../store/web3'

const SynthVault = () => {
  const { t } = useTranslation()
  const synth = useSynth()
  const pool = usePool()
  const web3 = useWeb3()
  const { address } = useAccount()
  const dispatch = useDispatch()

  const [showUsd, setShowUsd] = useState(false)
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPriceInternal])

  useEffect(() => {
    const getGlobals = () => {
      dispatch(getSynthGlobalDetails())
    }
    getGlobals() // Run on load
    const interval = setInterval(() => {
      getGlobals() // Run on interval
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, address])

  useEffect(() => {
    dispatch(synthVaultWeight())
  }, [dispatch, synth.synthDetails])

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
    if (getTotalWeight() > 0) return BN(getTotalWeight()).times(spartaPrice)
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
      return BN(_weight).times(spartaPrice)
    }
    return '0.00'
  }

  const isLoading = () => {
    if (
      synth.synthDetails.length > 0 &&
      synth.globalDetails &&
      pool.tokenDetails.length > 0
    ) {
      return false
    }
    return true
  }

  return (
    <Row>
      <Col className="mb-4" lg="4">
        <Card style={{ minHeight: '265px' }}>
          <Card.Header>
            <Row>
              <Col xs="auto" className="mt-2 h4">
                {t('synthVault')}
              </Col>
            </Row>
          </Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body className="pb-0">
                <Row className="my-1">
                  <Col>{t('minTime')}</Col>
                  <Col xs="auto" className="text-end">
                    {synth.globalDetails?.minTime} seconds
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col>{t('erasToEarn')}</Col>
                  <Col xs="auto" className="text-end">
                    {synth.globalDetails?.erasToEarn}
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col>{t('vaultClaim')}</Col>
                  <Col xs="auto" className="text-end">
                    {formatFromUnits(
                      BN(synth.globalDetails?.vaultClaim).div(100),
                      1,
                    )}
                    %
                  </Col>
                </Row>
                <hr className="my-2" />
                <Row className="my-1">
                  <Col>{t('totalWeight')}</Col>
                  <Col
                    xs="auto"
                    className="text-end"
                    onClick={() => handleChangeShow()}
                    role="button"
                  >
                    {!showUsd
                      ? formatFromWei(getTotalWeight(), 0)
                      : formatFromWei(getUSDFromSparta(), 0)}
                    <Icon
                      icon={showUsd ? 'usd' : 'spartav2'}
                      size="20"
                      className="mb-1 ms-1"
                    />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col>{t('yourWeight')}</Col>
                  <Col
                    xs="auto"
                    className="text-end"
                    onClick={() => handleChangeShow()}
                    role="button"
                  >
                    {!address ? (
                      t('connectWallet')
                    ) : (
                      <>
                        {!showUsd
                          ? formatFromWei(getOwnWeight(), 0)
                          : formatFromWei(getUSDFromSpartaOwnWeight(), 0)}
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
                  <Col>{t('percentWeight')}</Col>
                  <Col xs="auto" className="text-end">
                    {!address
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
            </>
          ) : (
            <HelmetLoading height={150} width={150} />
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
