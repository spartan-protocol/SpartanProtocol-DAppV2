import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useSparta } from '../../../store/sparta/selector'
import { getAddresses, getTokenContract } from '../../../utils/web3'
import {
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../../store/sparta/actions'
import { getSpartaContract } from '../../../utils/web3Contracts'
import spartaIcon from '../../../assets/icons/coin_sparta_black_bg.svg'

const Upgrade = () => {
  const addr = getAddresses()
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const [oldSpartaBalance, setoldSpartaBalance] = useState('0')
  const [newSpartaBalance, setnewSpartaBalance] = useState('0')
  const fsGenesis = '1620795586'
  const [loadingBalance, setloadingBalance] = useState(false)

  const [trigger0, settrigger0] = useState(0)
  const getData = async () => {
    if (
      wallet?.status === 'connected' &&
      loadingBalance === false &&
      ethers.utils.isAddress(wallet.account)
    ) {
      const tempWallet = wallet.account
      setloadingBalance(true)
      let awaitArray = []
      awaitArray.push(
        getTokenContract(addr.oldSparta).balanceOf(wallet.account),
        getSpartaContract().balanceOf(wallet.account),
      )
      awaitArray = await Promise.all(awaitArray)
      if (tempWallet === wallet.account) {
        setoldSpartaBalance(awaitArray[0].toString())
        setnewSpartaBalance(awaitArray[1].toString())
      }
      setloadingBalance(false)
    }
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 5000)
    return () => {
      clearTimeout(timer)
      settrigger0(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0, wallet.account])

  useEffect(() => {
    if (wallet.status === 'disconnected') {
      setoldSpartaBalance('0')
      setnewSpartaBalance('0')
    }
  }, [wallet.status])

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getExpiry = () => {
    const expiry = BN(fsGenesis).plus(15552000)
    return expiry
  }

  return (
    <>
      <Col xs="auto">
        <Card
          className="card-body card-320"
          style={{ backgroundColor: '#1D171F' }}
        >
          <Col>
            <h3 className="mb-0">Upgrade</h3>
            <span className="subtitle-label">Upgrade your v1 SPARTA to v2</span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                Input
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Output
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-primary"
                  block
                  onClick={() => dispatch(spartaUpgrade())}
                  disabled={oldSpartaBalance <= 0}
                >
                  Upgrade SPARTA
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card
          className="card-body card-320"
          style={{ backgroundColor: '#1D171F' }}
        >
          <Col>
            <h3 className="mb-0">Claim</h3>
            <span className="subtitle-label">
              Claim missing SPARTA from v1 pools
            </span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                Claim
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(sparta.claimCheck)} SPARTAv2
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Expiry
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatDate(getExpiry())}
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-primary"
                  block
                  onClick={() => dispatch(fallenSpartansClaim(wallet.account))}
                  disabled={sparta?.claimCheck <= 0}
                >
                  Claim SPARTA
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card
          className="card-body card-320 card-underlay"
          style={{ backgroundColor: '#1D171F' }}
        >
          <Col>
            <h3 className="mb-0">
              Your Balance
              <img
                height="35"
                src={spartaIcon}
                alt="sparta icon"
                className="float-right"
              />
            </h3>

            <span className="subtitle-label">Overview v1 & v2 balances</span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                Balance
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Balance
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(newSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-info"
                  block
                  onClick={() => settrigger0(trigger0 + 1)}
                  disabled={loadingBalance === true}
                >
                  Refresh Balance
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
    </>
  )
}

export default Upgrade
