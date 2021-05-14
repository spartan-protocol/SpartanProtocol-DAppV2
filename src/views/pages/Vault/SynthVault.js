import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link } from 'react-router-dom'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import {
  getSynthGlobalDetails,
  getSynthMemberDetails,
  synthHarvest,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import SynthVaultItem from './SynthVaultItem'

const SynthVault = () => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const synth = useSynth()
  const dispatch = useDispatch()
  const [trigger0, settrigger0] = useState(0)

  const getData = () => {
    dispatch(getSynthGlobalDetails())
    dispatch(getSynthMemberDetails(wallet.account))
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

  return (
    <>
      <Col xs="auto">
        <Card
          className="card-body card-320 pb-2 pt-3"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>{t('synthVaultDetails')}</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('minTime')}
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.minTime} seconds
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('totalWeight')}
              </Col>
              <Col className="text-right output-card">
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
              <Col className="text-right output-card">
                {synth.globalDetails?.erasToEarn}
              </Col>
            </Row>
            {/* <Row className="my-1">
              <Col xs="auto" className="text-card">
                Block Delay
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.blockDelay}
              </Col>
            </Row> */}
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('vaultClaim')}
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.vaultClaim / 100}%
              </Col>
            </Row>
            <Row className="card-body text-center">
              <Col xs="12" className="p-0 pt-1">
                <Link to="/dapp/synths">
                  <Button className="btn-sm btn-primary p-2" block>
                    {t('mintSynths')}
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card
          className="card-body card-320 pb-2 pt-3"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>{t('memberDetails')}</h3>
            <Row className="my-4 pb-2">
              <Col xs="auto" className="text-card">
                {t('yourWeight')}
              </Col>
              <Col className="text-right output-card">
                {synth.memberDetails?.totalWeight > 0
                  ? `${BN(synth.memberDetails?.totalWeight)
                      .div(synth.globalDetails?.totalWeight)
                      .times(100)
                      .toFixed(4)}%`
                  : t('noWeight')}
              </Col>
            </Row>
            <Row className="card-body text-center">
              <Col xs="12" className="p-0 mt-5">
                <Button
                  className="btn-sm btn-primary p-2"
                  block
                  onClick={() => dispatch(synthHarvest())}
                  disabled={synth.memberDetails?.totalWeight <= 0}
                >
                  {t('harvestAll')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
      {synth?.synthDetails?.length > 0 &&
        synth.synthDetails
          .filter((i) => i.address !== false)
          .map((i) => <SynthVaultItem key={i.address} synthItem={i} />)}
    </>
  )
}

export default SynthVault
