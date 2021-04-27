/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_synth.svg'
import { synthDeposit, synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useDao } from '../../../store/dao/selector'
import {
  getDaoGlobalDetails,
  getDaoMemberDetails,
} from '../../../store/daoVault/actions'
import { getDaoMemberLastHarvest } from '../../../store/dao/actions'

const DaoVault = () => {
  const wallet = useWallet()
  const dao = useDao()
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(getDaoGlobalDetails())
    dispatch(getDaoMemberDetails(wallet.account))
    dispatch(getDaoMemberLastHarvest(wallet.account))
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
      <Row>
        <Col xs="12">
          <Card>Global Dao Card</Card>
        </Col>
        <Col xs="12">
          <Card>Dao Member Card</Card>
        </Col>
        <Col xs="12">
          <Card>Map out staking tiles</Card>
        </Col>
      </Row>
    </>
  )
}

export default DaoVault
