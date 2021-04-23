import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { daoDeposit, daoWithdraw } from '../../../store/dao/actions'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_lp.svg'

const Stake = () => {
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()

  return (
    <>
      <Row>
        {!poolFactory.finalLpArray && (
          <HelmetLoading height="300px" width="300px" />
        )}
        {poolFactory.finalLpArray &&
          poolFactory.finalLpArray
            .filter((i) => i.curated === true)
            .sort(
              (a, b) =>
                BN(b.balanceLPs).plus(b.stakedLPs) -
                BN(a.balanceLPs).plus(a.stakedLPs),
            )
            .map((asset) => (
              <Col xs="12" lg="6" key={asset.tokenAddress}>
                <Card
                  className="card-body"
                  style={{ backgroundColor: '#1D171F' }}
                >
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6">
                        <Row>
                          <Col xs="auto" className="pr-0">
                            <img
                              height="45px"
                              src={asset.symbolUrl}
                              alt={asset.name}
                              className="mr-n3"
                            />
                            <img
                              height="25px"
                              src={spartaIcon}
                              alt="SPARTA"
                              className="mr-2 mt-4"
                            />
                          </Col>
                          <Col>
                            <h3 className="d-inline">
                              {asset.symbol}-SPP
                              <br />
                            </h3>
                            Buy / Swap
                            <Link
                              to="/dapp/pools/swap"
                              onClick={() =>
                                window.localStorage.setItem(
                                  'assetSelected1',
                                  JSON.stringify(asset),
                                )
                              }
                            >
                              <i className="icon-extra-small icon-scan ml-2" />
                            </Link>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="6" sm="3">
                        <div className="card-text">Staked</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatFromWei(asset.stakedLPs)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(asset.stakedLPs)}
                        </div>
                      </Col>
                      <Col xs="6" sm="3">
                        <div className="card-text">Wallet</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatFromWei(asset.balanceLPs)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(asset.balanceLPs)}
                        </div>
                      </Col>
                      <Col xs="6" className="mt-2">
                        <Button
                          type="Button"
                          className="btn btn-primary w-100 p-3"
                          onClick={() =>
                            dispatch(daoWithdraw(asset.poolAddress))
                          }
                        >
                          Unlock
                        </Button>
                      </Col>
                      <Col xs="6" className="mt-2">
                        <Button
                          type="Button"
                          className="btn btn-primary w-100 p-3"
                          onClick={() =>
                            dispatch(
                              daoDeposit(asset.poolAddress, asset.balanceLPs),
                            )
                          }
                        >
                          Lock
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
      </Row>
    </>
  )
}

export default Stake
