import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import {
  getSynthGlobalDetails,
  getSynthMemberDetails,
  synthHarvest,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import SynthVaultItem from './SynthVaultItem'

const SynthVault = () => {
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
          className="card-body card-320"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>SynthVault Details</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Min Time
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.minTime} seconds
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Total Weight
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
                Eras to Earn
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.erasToEarn}
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Block Delay
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.blockDelay}
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Vault Claim
              </Col>
              <Col className="text-right output-card">
                {synth.globalDetails?.vaultClaim / 100}%
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card
          className="card-body card-320"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>Member Details</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Your Weight
              </Col>
              <Col className="text-right output-card">
                {synth.memberDetails?.totalWeight > 0
                  ? BN(synth.memberDetails?.totalWeight)
                      .div(synth.globalDetails?.totalWeight)
                      .times(100)
                      .toFixed(4)
                  : '0.00'}
                %
              </Col>
            </Row>
            <Row className="text-center mt-2">
              <Col xs="12" className="p-1">
                <Button
                  className="btn btn-primary align-middle"
                  onClick={() => dispatch(synthHarvest())}
                >
                  Harvest All
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
