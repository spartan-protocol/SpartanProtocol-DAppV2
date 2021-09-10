import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import {
  getSynthGlobalDetails,
  getSynthMemberDetails,
  synthHarvest,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import SynthVaultItem from './SynthVaultItem'
import { useReserve } from '../../../store/reserve/selector'
import { getTimeSince } from '../../../utils/math/nonContract'

const SynthVault = () => {
  const { t } = useTranslation()
  const wallet = useWeb3React()
  const reserve = useReserve()
  const synth = useSynth()
  const dispatch = useDispatch()
  const [trigger0, settrigger0] = useState(0)

  const getData = () => {
    dispatch(getSynthGlobalDetails())
    dispatch(getSynthMemberDetails(wallet))
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const [claimArray, setClaimArray] = useState([])
  useEffect(() => {
    if (synth.synthDetails.length > 0) {
      const tempArray = []
      synth.synthDetails
        .filter((x) => x.staked > 0 && getTimeSince(x.lastHarvest, t)[0] > 0)
        .map((x) => tempArray.push(x.address))
      setClaimArray(tempArray)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.synthDetails])

  return (
    <Row>
      <Col xs="auto" className="">
        <Card className="card-320 card-underlay">
          <Card.Header>{t('synthVaultDetails')}</Card.Header>
          <Card.Body>
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
                {t('totalWeight')}
              </Col>
              <Col className="text-end output-card">
                {synth.globalDetails?.totalWeight > 0
                  ? formatFromWei(synth.globalDetails?.totalWeight, 0)
                  : '0.00'}{' '}
                SPARTA
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
          </Card.Body>
          <Card.Footer xs="12">
            <Link to="/synths">
              <Button className="w-100">{t('forgeSynths')}</Button>
            </Link>
          </Card.Footer>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-320 card-underlay">
          <Card.Header>{t('memberDetails')}</Card.Header>
          <Card.Body>
            <Row className="my-4 pb-2">
              <Col xs="auto" className="text-card">
                {t('yourWeight')}
              </Col>
              <Col className="text-end output-card">
                {synth.memberDetails?.totalWeight > 0
                  ? `${BN(synth.memberDetails?.totalWeight)
                      .div(synth.globalDetails?.totalWeight)
                      .times(100)
                      .toFixed(4)}%`
                  : t('noWeight')}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer xs="12">
            {reserve.globalDetails.emissions ? (
              <Button
                className="w-100"
                onClick={() => dispatch(synthHarvest(claimArray))}
                disabled={synth.memberDetails?.totalWeight <= 0}
              >
                {t('harvestAll')}
              </Button>
            ) : (
              <Button className="w-100" disabled>
                {t('incentivesDisabled')}
              </Button>
            )}
          </Card.Footer>
        </Card>
      </Col>
      {synth?.synthDetails?.length > 0 &&
        synth.synthDetails
          .filter((i) => i.address !== false)
          .map((i) => <SynthVaultItem key={i.address} synthItem={i} />)}
    </Row>
  )
}

export default SynthVault
