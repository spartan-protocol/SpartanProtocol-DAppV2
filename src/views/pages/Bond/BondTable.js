import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import bnbSparta from '../../../assets/icons/bnb_sparta.png'
import { bondClaim } from '../../../store/bond/actions'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'

const BondTable = () => {
  const dispatch = useDispatch()
  const poolFactory = usePoolFactory()

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getClaimable = (_bondedLP, _lastClaim, _claimRate) => {
    const timeStamp = BN(Date.now()).div(1000)
    const bondedLP = BN(_bondedLP)
    const lastClaim = BN(_lastClaim)
    const claimRate = BN(_claimRate)
    const secondsSince = timeStamp.minus(lastClaim)
    const claimAmount = secondsSince.times(claimRate)
    if (claimAmount.isGreaterThan(bondedLP)) {
      return bondedLP
    }
    return claimAmount
  }

  const getEndDate = (_bondedLP, _lastClaim, _claimRate) => {
    const timeStamp = BN(Date.now()).div(1000)
    const bondedLP = BN(_bondedLP)
    const lastClaim = BN(_lastClaim)
    const claimRate = BN(_claimRate)
    const secondsSince = timeStamp.minus(lastClaim)
    const secondsUntil = bondedLP.div(claimRate)
    const endDate = timeStamp.plus(secondsUntil.minus(secondsSince))
    return endDate.toFixed(0)
  }

  return (
    <>
      <Row>
        {poolFactory.finalLpArray?.length > 0 &&
          poolFactory.finalLpArray
            .filter((asset) => asset.bondLastClaim > 0)
            .sort((a, b) => b.bondedLPs - a.bondedLPs)
            .map((asset) => (
              <Card
                key={asset.tokenAddress}
                className="card-body"
                style={{ backgroundColor: '#1D171F' }}
              >
                <div
                  aria-multiselectable
                  className="card-collapse"
                  id="accordion"
                  role="tablist"
                >
                  <Card className="mt-n2 mb-n2">
                    <CardBody>
                      <Row>
                        <Col xs="9" className="mb-2">
                          <h2 className="m-0">
                            <img
                              className="mr-2"
                              src={bnbSparta}
                              alt="Logo"
                              height="32"
                            />
                            {asset.symbol}-SPP
                          </h2>
                        </Col>
                        <Col
                          xs="3"
                          className="text-center d-none d-sm-block mb-2"
                        >
                          <Button
                            type="Button"
                            className="btn btn-primary"
                            onClick={() =>
                              dispatch(bondClaim(asset.tokenAddress))
                            }
                          >
                            Claim
                          </Button>
                        </Col>
                        <Col xs="6" md="3">
                          <div className="title-card">Remaining</div>
                          <div className="d-none d-md-block">
                            {formatFromWei(asset.bondedLPs)}
                          </div>
                        </Col>
                        <Col xs="6" className="d-md-none">
                          <div className="text-right">
                            {formatFromWei(asset.bondedLPs)}
                          </div>
                        </Col>
                        <Col xs="6" md="3">
                          <div className="title-card">Claimable</div>
                          <div className="d-none d-md-block">
                            {formatFromWei(
                              getClaimable(
                                asset.bondedLPs,
                                asset.bondLastClaim,
                                asset.bondClaimRate,
                              ),
                            )}
                            <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                          </div>
                        </Col>
                        <Col xs="6" className="d-md-none">
                          <div className="text-right">
                            {formatFromWei(
                              getClaimable(
                                asset.bondedLPs,
                                asset.bondLastClaim,
                                asset.bondClaimRate,
                              ),
                            )}
                            <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                          </div>
                        </Col>
                        <Col xs="6" md="3">
                          <div className="title-card">Last Claimed:</div>
                          <div className="d-none d-md-block">
                            {formatDate(asset.bondLastClaim)}
                          </div>
                        </Col>
                        <Col xs="6" className="d-md-none">
                          <div className="text-right">
                            {formatDate(asset.bondLastClaim)}
                          </div>
                        </Col>
                        <Col xs="6" md="3">
                          <div className="title-card">Final Date:</div>
                          <div className="d-none d-md-block">
                            {formatDate(
                              getEndDate(
                                asset.bondedLPs,
                                asset.bondLastClaim,
                                asset.bondClaimRate,
                              ),
                            )}
                          </div>
                        </Col>
                        <Col xs="6" className="d-md-none">
                          <div className="text-right">
                            {formatDate(
                              getEndDate(
                                asset.bondedLPs,
                                asset.bondLastClaim,
                                asset.bondClaimRate,
                              ),
                            )}
                          </div>
                        </Col>
                        <Col xs="12" className="d-sm-none text-center">
                          <Button
                            type="Button"
                            className="btn btn-primary"
                            onClick={() =>
                              dispatch(bondClaim(asset.tokenAddress))
                            }
                          >
                            Claim
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Card>
            ))}
      </Row>
    </>
  )
}

export default BondTable
