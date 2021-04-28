import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { formatFromWei } from '../../../utils/bigNumber'
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
      <Row className="row-480">
        <Col xs="auto">
          <Card className="card-480">
            <Col>
              <h4>SynthVault Details</h4>
              <p>Min Time: {synth.globalDetails?.minTime} second</p>
              <p>
                Total Weight: {formatFromWei(synth.globalDetails?.totalWeight)}
              </p>
              <p>Eras to Earn: {synth.globalDetails?.erasToEarn}</p>
              <p>Block Delay: {synth.globalDetails?.blockDelay}</p>
              <p>Vault Claim: {synth.globalDetails?.vaultClaim / 100}%</p>
            </Col>
          </Card>
        </Col>
        <Col xs="auto">
          <Card className="card-480">
            <Col>
              <h4>SynthMember</h4>
              <p>
                Your Weight: {formatFromWei(synth.memberDetails?.totalWeight)}
              </p>
            </Col>
            <Col xs="12" className="text-center">
              <Button
                color="primary"
                type="Button"
                onClick={() => dispatch(synthHarvest())}
              >
                Harvest
              </Button>
            </Col>
          </Card>
        </Col>
        {synth?.synthDetails?.length > 0 &&
          synth.synthDetails
            .filter((i) => i.address !== false)
            .map((i) => <SynthVaultItem key={i.address} synthItem={i} />)}
      </Row>
    </>
  )
}

export default SynthVault
