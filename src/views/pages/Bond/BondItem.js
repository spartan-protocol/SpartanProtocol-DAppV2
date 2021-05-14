/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { bondClaim } from '../../../store/bond/actions'
import { usePool } from '../../../store/pool'
// import { useWeb3 } from '../../../store/web3'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_lp.svg'

const BondItem = ({ asset }) => {
  const pool = usePool()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  // const web3 = useWeb3()
  const [showDetails, setShowDetails] = useState(false)
  const { tokenAddress } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

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

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  return (
    <>
      <Col xs="auto" key={asset.address}>
        <Card className="card-body card-320 pt-3 pb-2">
          <Row className="mt-n3">
            <Col xs="auto" className="">
              <h3 className="mt-2">
                <img
                  className=""
                  src={token.symbolUrl}
                  alt={token.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="pr-2 ml-n3 mt-4"
                />
                {token.symbol}p
              </h3>
            </Col>

            <Col className="text-right my-auto">
              {showDetails && (
                <i
                  role="button"
                  className="icon-small icon-up icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
              {!showDetails && (
                <i
                  role="button"
                  className="icon-small icon-down icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('remaining')}
            </Col>
            <Col className="text-right output-card">
              {formatFromWei(asset.bonded)} {token.symbol}p
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('claimable')}
              <i className="icon-extra-small icon-spinner icon-dark ml-1" />
            </Col>
            <Col className="text-right output-card">
              {formatFromWei(
                getClaimable(
                  asset.bonded,
                  asset.bondLastClaim,
                  asset.bondClaimRate,
                ),
              )}{' '}
              {token.symbol}p
            </Col>
          </Row>
          {showDetails === true && (
            <>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('lastClaim')}
                </Col>
                <Col className="text-right output-card">
                  {formatDate(asset.bondLastClaim)}
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('finalDate')}
                </Col>
                <Col className="text-right output-card">
                  {formatDate(
                    getEndDate(
                      asset.bonded,
                      asset.bondLastClaim,
                      asset.bondClaimRate,
                    ),
                  )}
                </Col>
              </Row>
            </>
          )}
          <Row className="text-center mt-2">
            <Col xs="6" className="p-1">
              <Button color="primary" className="btn w-100" disabled>
                {t('bond')}
              </Button>
            </Col>
            <Col xs="6" className="p-1">
              <Button
                color="primary"
                className="btn w-100"
                onClick={() => dispatch(bondClaim(asset.tokenAddress))}
              >
                {t('claim')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default BondItem
