import { useWallet } from '@binance-chain/bsc-use-wallet'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import { bondClaimAll } from '../../../store/bond/actions'
import BondTable from './BondTable'

const Bond = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="12">
            <h2 className="d-inline text-title mx-1">Bond</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row className="justify-content-center">
              <Col xs="10" sm="6" md="3" className="mb-2">
                <Button
                  className="btn btn-primary align-middle w-100"
                  onClick={() => dispatch(bondClaimAll(wallet.account))}
                >
                  Claim all (#)
                </Button>
              </Col>
              <Col xs={12}>
                <BondTable />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Bond
