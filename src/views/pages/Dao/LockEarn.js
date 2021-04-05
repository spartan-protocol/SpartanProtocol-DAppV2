import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import bnbSparta from '../../../assets/icons/bnb_sparta.png'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { daoDeposit, daoWithdraw } from '../../../store/dao/actions'
import { usePoolFactory } from '../../../store/poolFactory'
import { formatFromWei } from '../../../utils/bigNumber'

const LockEarn = () => {
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()

  return (
    <>
      {!poolFactory.finalLpArray && (
        <HelmetLoading height="300px" width="300px" />
      )}
      {poolFactory.finalLpArray &&
        poolFactory.finalLpArray.map((asset) => (
          <Card
            className="card-body"
            style={{ backgroundColor: '#1D171F' }}
            key={asset.tokenAddress}
          >
            <CardBody>
              <Row>
                <Col md={3} xs={12} className="mb-n4">
                  <h2 className="mt-3">
                    <img
                      className="mr-2"
                      src={bnbSparta}
                      alt="Logo"
                      height="32"
                    />
                    SP-p{asset.symbol}
                  </h2>
                </Col>
                <Col md={2} />
                <Col md={2}>
                  <div className="card-text">Locked</div>
                </Col>
                <Col md={2}>
                  <div className="card-text">Unlocked</div>
                </Col>
                <Col md={2} className="ml-auto mr-2 mt-2">
                  <Button
                    type="Button"
                    className="btn btn-primary"
                    onClick={() =>
                      dispatch(daoDeposit(asset.poolAddress, asset.balanceLPs))
                    }
                  >
                    Lock
                  </Button>
                  <Button
                    type="Button"
                    className="btn btn-primary"
                    onClick={() =>
                      dispatch(daoWithdraw(asset.poolAddress, asset.balanceLPs))
                    }
                  >
                    Unlock
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={3} />
                <Col md={2} />
                <Col md={2}>
                  <div className="title-card mt-n4">
                    {formatFromWei(asset.lockedLPs)}
                  </div>
                </Col>
                <Col md={2}>
                  <div className="title-card mt-n4">
                    {formatFromWei(asset.balanceLPs)}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ))}
    </>
  )
}

export default LockEarn
