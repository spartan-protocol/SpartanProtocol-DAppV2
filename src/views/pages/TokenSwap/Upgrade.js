import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useSparta } from '../../../store/sparta/selector'
import { getAddresses } from '../../../utils/web3'
import { usePool } from '../../../store/pool'
import {
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../../store/sparta/actions'

const Upgrade = () => {
  const addr = getAddresses()
  const pool = usePool()
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getExpiry = () => {
    const expiry = BN(sparta.fsGenesis).plus(15552000)
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
                {formatFromWei(getToken(addr.oldSparta)?.balance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                Output
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(getToken(addr.oldSparta)?.balance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-sm btn-primary h-100 w-100"
                  onClick={() => dispatch(spartaUpgrade())}
                  disabled={getToken(addr.oldSparta)?.balance <= 0}
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
    </>
  )
}

export default Upgrade
