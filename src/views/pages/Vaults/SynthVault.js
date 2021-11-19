import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import {
  getSynthGlobalDetails,
  synthVaultWeight,
  getSynthDetails,
  getSynthMemberDetails,
  getSynthMinting,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import SynthVaultItem from './SynthVaultItem'
import { getSynthVaultWeights } from '../../../utils/math/nonContract'
import { usePool } from '../../../store/pool'
import { Icon } from '../../../components/Icons/icons'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SynthHarvestAllModal from './Components/SynthHarvestAllModal'
import { useWeb3 } from '../../../store/web3'

const SynthVault = () => {
  const { t } = useTranslation()
  const synth = useSynth()
  const pool = usePool()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const dispatch = useDispatch()

  const [trigger0, settrigger0] = useState(0)

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
        <Card className="card-320 card-underlay" style={{ minHeight: '290' }}>
          <Card.Header>{t('synthVaultDetails')}</Card.Header>
          {!isLoading() ? (
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
                <Col className="text-end output-card">
                  {synth.totalWeight > 0
                    ? formatFromWei(synth.totalWeight, 2)
                    : '0.00'}{' '}
                  <Icon icon="spartav2" size="20" className="mb-1 ms-1" />
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('yourWeight')}
                </Col>
                <Col className="text-end output-card">
                  {!wallet.account ? (
                    t('connectWallet')
                  ) : (
                    <>
                      {formatFromWei(
                        getSynthVaultWeights(
                          synth.synthDetails,
                          pool.poolDetails,
                        ),
                        2,
                      )}
                      <Icon icon="spartav2" size="20" className="mb-1 ms-1" />
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
                    : synth.totalWeight > 0 &&
                      getSynthVaultWeights(
                        synth.synthDetails,
                        pool.poolDetails,
                      ) > 0
                    ? `${BN(
                        getSynthVaultWeights(
                          synth.synthDetails,
                          pool.poolDetails,
                        ),
                      )
                        .div(synth.totalWeight)
                        .times(100)
                        .toFixed(4)}%`
                    : t('noWeight')}
                </Col>
              </Row>
            </Card.Body>
          ) : (
            <HelmetLoading />
          )}
          <Card.Footer xs="12">
            <SynthHarvestAllModal />
          </Card.Footer>
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
