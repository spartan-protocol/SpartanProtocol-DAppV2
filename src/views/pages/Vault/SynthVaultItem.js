import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Col, ButtonGroup } from 'reactstrap'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { synthDeposit, synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useReserve } from '../../../store/reserve/selector'
import { calcShare } from '../../../utils/web3Utils'
import { useSparta } from '../../../store/sparta/selector'

const SynthVaultItem = ({ synthItem }) => {
  const sparta = useSparta()
  const reserve = useReserve()
  const synth = useSynth()
  const pool = usePool()
  const dispatch = useDispatch()
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getClaimable = () => {
    // get seconds passed since last harvest
    const timeStamp = BN(Date.now()).div(1000)
    const lastHarvest = BN(synthItem.lastHarvest)
    const secondsSince = timeStamp.minus(lastHarvest)
    // get the members share
    const weight = BN(synthItem.weight)
    const reserveShare = BN(reserve.globalDetails.spartaBalance).div(
      synth.globalDetails.erasToEarn,
    )
    const vaultShare = reserveShare
      .times(synth.globalDetails.vaultClaim)
      .div('10000')
    const totalWeight = BN(synth.globalDetails.totalWeight)
    const share = calcShare(weight, totalWeight, vaultShare)
    // get the members claimable amount
    const claimAmount = share
      .times(secondsSince)
      .div(sparta.globalDetails.secondsPerEra)
    return claimAmount
  }

  return (
    <>
      <Col>
        <Card>
          <Col>
            <h4>{getToken(synthItem.tokenAddress)?.symbol}-SPS</h4>
            <p>Balance: {formatFromWei(synthItem.balance)}</p>
            <p>Staked: {formatFromWei(synthItem.staked)}</p>
            <p>Claimable: {formatFromWei(getClaimable())}</p>
            <p>Claimable: {formatDate(synthItem.lastHarvest)}</p>
          </Col>
          <Col xs="12" className="text-center">
            <ButtonGroup>
              <Button
                color="primary"
                type="Button"
                onClick={() =>
                  dispatch(synthDeposit(synthItem.address, synthItem.balance))
                }
              >
                Deposit
              </Button>
              <Button
                color="primary"
                type="Button"
                onClick={() =>
                  dispatch(synthWithdraw(synthItem.address, '10000'))
                }
              >
                Withdraw
              </Button>
            </ButtonGroup>
          </Col>
        </Card>
      </Col>
    </>
  )
}

export default SynthVaultItem
