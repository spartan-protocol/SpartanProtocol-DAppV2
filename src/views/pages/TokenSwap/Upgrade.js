import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useSparta } from '../../../store/sparta/selector'
import { getAddresses, getTokenContract } from '../../../utils/web3'
import {
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../../store/sparta/actions'
import { getSpartaContract } from '../../../utils/web3Contracts'

const Upgrade = () => {
  const addr = getAddresses()
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const [oldSpartaBalance, setoldSpartaBalance] = useState('0')
  const [newSpartaBalance, setnewSpartaBalance] = useState('0')
  const fsGenesis = '1620795586'

  const [trigger0, settrigger0] = useState(0)
  const getData = async () => {
    if (wallet?.status === 'connected') {
      let awaitArray = []
      awaitArray.push(
        getTokenContract(addr.oldSparta).balanceOf(wallet.account),
        getSpartaContract().balanceOf(wallet.account),
      )
      awaitArray = await Promise.all(awaitArray)
      setoldSpartaBalance(awaitArray[0].toString())
      setnewSpartaBalance(awaitArray[1].toString())
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
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

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
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3 className="mb-0">Upgrade / Bridge</h3>
            <h4>SPARTA Tokens</h4>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Input
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Output
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(oldSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-sm btn-primary h-100 w-100"
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
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3 className="mb-0">Claim SPARTA</h3>
            <h4>From Pool Attack</h4>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Claimable
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(sparta.claimCheck)} SPARTAv2
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Expiry
              </Col>
              <Col className="text-right output-card">
                {formatDate(getExpiry())}
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-sm btn-primary h-100 w-100"
                  onClick={() => dispatch(fallenSpartansClaim(wallet.account))}
                  // disabled={sparta?.claimCheck <= 0}
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
          className="card-body card-320"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3 className="mb-0">SPARTA Balances</h3>
            <h4>New & Old</h4>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Balance
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Balance
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(newSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-sm btn-primary h-100 w-100"
                  onClick={() => console.log('hello shazzy')}
                  // disabled={sparta?.claimCheck <= 0}
                >
                  Claim SPARTA
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
