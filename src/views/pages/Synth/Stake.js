import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, CardBody, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_synth.svg'
import { synthDeposit, synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'

const Stake = () => {
  const synth = useSynth()
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getAsset = (tokenAddress) => {
    if (poolFactory.finalLpArray?.length > 0) {
      return poolFactory.finalLpArray.filter(
        (i) => i.tokenAddress === tokenAddress,
      )[0]
    }
    return '0'
  }

  // CREATE FUNCTION TO calcCurrentReward in plain-js
  // MIGHT NEED SOME EXTRA GLOBAL DETAILS / MAPPINGS FIRST!

  return (
    <>
      <Row>
        {!synth.synthDetails && <HelmetLoading height="300px" width="300px" />}
        {synth.synthDetails?.length > 0 &&
          synth.synthDetails
            .filter((i) => i.address !== false)
            .sort(
              (a, b) =>
                BN(b.balance).plus(b.staked) - BN(a.balance).plus(a.staked),
            )
            .map((asset) => (
              <Col xs="12" lg="6" key={asset.address}>
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
                              src={getAsset(asset.tokenAddress).symbolUrl}
                              alt={getAsset(asset.tokenAddress).name}
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
                              {getAsset(asset.tokenAddress).symbol}-SPS
                              <br />
                            </h3>
                            Buy / Swap
                            <Link
                              to="/dapp/pools/swap"
                              onClick={() => {
                                window.localStorage.setItem(
                                  'assetType1',
                                  'synth',
                                )
                                window.localStorage.setItem(
                                  'assetSelected1',
                                  JSON.stringify(getAsset(asset.tokenAddress)),
                                )
                              }}
                            >
                              <i className="icon-extra-small icon-scan ml-2" />
                            </Link>
                          </Col>
                        </Row>
                      </Col>

                      <Col xs="6" sm="3">
                        <div className="card-text">Staked</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatFromWei(asset.staked)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(asset.staked)}
                        </div>
                      </Col>

                      <Col xs="6" sm="3">
                        <div className="card-text">Wallet</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatFromWei(asset.balance)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(asset.balance)}
                        </div>
                      </Col>

                      <Col xs="6" sm="3">
                        <div className="card-text">Harvestable</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          #,###.##
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          #,###.##
                        </div>
                      </Col>

                      <Col xs="6" sm="3">
                        <div className="card-text">Last Harvest</div>
                        <div className="subtitle-amount d-none d-sm-block">
                          {formatDate(asset.lastHarvest)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-sm-none">
                        <div className="subtitle-amount text-right">
                          {formatDate(asset.lastHarvest)}
                        </div>
                      </Col>

                      <Col xs="6" className="mt-2">
                        <Button
                          type="Button"
                          className="btn btn-primary w-100 p-3"
                          onClick={() =>
                            dispatch(synthWithdraw(asset.address, '10000'))
                          }
                        >
                          Unstake
                        </Button>
                      </Col>
                      <Col xs="6" className="mt-2">
                        <Button
                          type="Button"
                          className="btn btn-primary w-100 p-3"
                          onClick={() =>
                            dispatch(synthDeposit(asset.address, asset.balance))
                          }
                        >
                          Stake
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
