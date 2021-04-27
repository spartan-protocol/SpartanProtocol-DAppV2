/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, CardBody, Row, Col, ButtonGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_synth.svg'
import {
  getSynthGlobalDetails,
  getSynthMemberDetails,
  synthDeposit,
  synthHarvest,
  synthWithdraw,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'

const SynthVault = () => {
  const wallet = useWallet()
  const synth = useSynth()
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()
  const [trigger0, settrigger0] = useState(0)
  const getToken = (tokenAddress) =>
    poolFactory.tokenDetails.filter((i) => i.address === tokenAddress)[0]

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
      <Row className="justify-contents-center">
        <Col xs="12">
          <Card>
            <Col>
              <h4>Global Details</h4>
              <p>Min Time: {synth.globalDetails?.minTime}</p>
              <p>
                Total Weight: {formatFromWei(synth.globalDetails?.totalWeight)}
              </p>
              <p>Eras to Earn: {synth.globalDetails?.erasToEarn}</p>
              <p>Block Delay: {synth.globalDetails?.blockDelay}</p>
              <p>Vault Claim: {synth.globalDetails?.vaultClaim}</p>
            </Col>
          </Card>
        </Col>
        <Col xs="12">
          <Card>
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
            .map((i) => (
              <Col key={i.address}>
                <Card>
                  <Col>
                    <h4>{getToken(i.tokenAddress)?.symbol}-SPS</h4>
                    <p>Balance: {formatFromWei(i.balance)}</p>
                    <p>Staked: {formatFromWei(i.staked)}</p>
                  </Col>
                  <Col xs="12" className="text-center">
                    <ButtonGroup>
                      <Button
                        color="primary"
                        type="Button"
                        onClick={() =>
                          dispatch(synthDeposit(i.address, i.balance))
                        }
                      >
                        Deposit
                      </Button>
                      <Button
                        color="primary"
                        type="Button"
                        onClick={() =>
                          dispatch(synthWithdraw(i.address, '10000'))
                        }
                      >
                        Withdraw
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Card>
              </Col>
            ))}
      </Row>
    </>
  )
}

export default SynthVault
