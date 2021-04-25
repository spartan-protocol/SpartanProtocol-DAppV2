/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Button, Card, CardBody } from 'reactstrap'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import {
  synthHarvest,
  getSynthGlobalDetails,
  getSynthMemberDetails,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import Stake from './Stake'

const Overview = () => {
  const synth = useSynth()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [trigger, settrigger] = useState(0)

  useEffect(async () => {
    dispatch(getSynthGlobalDetails())
    dispatch(getSynthMemberDetails(wallet.account))
    await pause(7500)
    settrigger(trigger + 1)
  }, [trigger])

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">SynthVault</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col xs="12">
                <Card
                  className="card-body"
                  style={{ backgroundColor: '#1D171F' }}
                >
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="12" lg="2">
                        <h2>Global Details</h2>
                      </Col>

                      <Col xs="6" sm="4" lg="2">
                        <div className="card-text">Lockup Time:</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {synth.globalDetails.minTime} seconds?
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {synth.globalDetails.minTime} seconds?
                        </div>
                      </Col>

                      <Col xs="6" sm="4" lg="2">
                        <div className="card-text">Total Weight:</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatFromWei(synth.globalDetails.totalWeight)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(synth.globalDetails.totalWeight)}
                        </div>
                      </Col>

                      <Col xs="6" sm="4" lg="2">
                        <div className="card-text">Eras to Earn:</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {synth.globalDetails.erasToEarn}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {synth.globalDetails.erasToEarn}
                        </div>
                      </Col>

                      <Col xs="6" sm="4" lg="2">
                        <div className="card-text">Block Delay:</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {synth.globalDetails.blockDelay}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {synth.globalDetails.blockDelay}
                        </div>
                      </Col>

                      <Col xs="6" sm="4" lg="2">
                        <div className="card-text">Vault Claim:</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {synth.globalDetails.vaultClaim / 100}%
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {synth.globalDetails.vaultClaim / 100}%
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12">
                <Card
                  className="card-body"
                  style={{ backgroundColor: '#1D171F' }}
                >
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6">
                        <h2>Member Details</h2>
                      </Col>

                      <Col
                        xs="12"
                        sm="6"
                        lg="6"
                        className="mx-auto mt-n2 p-0 d-none d-sm-block text-right"
                      >
                        <Button
                          className="btn btn-primary align-middle"
                          onClick={() => dispatch(synthHarvest())}
                        >
                          Harvest All
                        </Button>
                      </Col>

                      <Col xs="6" sm="6">
                        <div className="card-text text-sm-center">
                          Your Weight:
                        </div>
                        <div className="subtitle-amount d-none d-sm-block text-center">
                          {formatFromWei(synth.memberDetails.totalWeight)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(synth.memberDetails.totalWeight)}
                        </div>
                      </Col>

                      <Col xs="6" sm="6">
                        <div className="card-text text-sm-center">Your %:</div>
                        <div className="subtitle-amount d-none d-sm-block text-center">
                          {synth.memberDetails.totalWeight > 0 &&
                            `${formatFromUnits(
                              BN(synth.memberDetails.totalWeight)
                                .div(synth.globalDetails.totalWeight)
                                .times(100),
                            )}%`}
                          {synth.memberDetails.totalWeight <= 0 &&
                            'Not a DAO member'}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {' '}
                          {synth.memberDetails.totalWeight > 0 &&
                            `${formatFromUnits(
                              BN(synth.memberDetails.totalWeight)
                                .div(synth.globalDetails.totalWeight)
                                .times(100),
                            )}%`}
                          {synth.memberDetails.totalWeight <= 0 &&
                            'Not a DAO member'}
                        </div>
                      </Col>

                      <Col xs="12" sm="12" className="mt-2">
                        <div className="subtitle-amount d-none d-sm-block text-center">
                          Deposit synthetic assets in the SynthVault. Harvest to
                          compound your position with rewarded synths.
                        </div>
                      </Col>
                      <Col xs="12" className="d-block d-sm-none mt-2">
                        <div className="subtitle-amount">
                          Deposit synthetic assets in the SynthVault. Harvest to
                          compound your position with rewarded synths.
                        </div>
                      </Col>

                      <Col
                        xs="12"
                        sm="4"
                        className="mx-auto my-lg-auto mt-2 p-0 d-block d-sm-none"
                      >
                        <Button
                          className="btn btn-primary align-middle w-100"
                          onClick={() => dispatch(synthHarvest())}
                        >
                          Harvest All
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12">
                <div className="page-header">
                  Stake{' '}
                  <i
                    className="icon-small icon-info icon-dark ml-2"
                    id="ttStakeHeader"
                    role="button"
                  />
                  <UncontrolledTooltip placement="left" target="ttStakeHeader">
                    Stake your synths in the vault to harvest more synths!
                  </UncontrolledTooltip>
                </div>
                <br />
                <Stake />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview