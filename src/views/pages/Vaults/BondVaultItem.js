import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { Icon } from '../../../components/Icons/icons'
import { claimBond, useBond } from '../../../store/bond'
import { calcBondedLP } from '../../../utils/math/bondVault'
import { formatDate, getTimeSince } from '../../../utils/math/nonContract'
import { getToken } from '../../../utils/math/utils'
import { getAddresses } from '../../../utils/web3'

const BondItem = (props) => {
  const pool = usePool()
  const bond = useBond()
  const dispatch = useDispatch()
  const wallet = useWeb3React()
  const addr = getAddresses()
  const { asset } = props
  const { t } = useTranslation()
  const [txnLoading, setTxnLoading] = useState(false)
  // const [showDetails, setShowDetails] = useState(false)
  const token = () => getToken(asset.tokenAddress, pool.tokenDetails)
  const isLightMode = window.localStorage.getItem('theme')

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

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  const handleTxn = async () => {
    setTxnLoading(true)
    await dispatch(claimBond(asset.tokenAddress, wallet))
    setTxnLoading(false)
  }

  const estMaxGas = ''
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    return [true, t('claim')]
  }

  return (
    <>
      <Col xs="auto" key={asset.address}>
        <Card className="card-320" style={{ minHeight: '245' }}>
          <Card.Body>
            <Row className="">
              <Col xs="auto" className="position-relative pt-1">
                <img
                  className="mr-3 rounded-circle"
                  src={token().symbolUrl}
                  alt={token().symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="position-absolute"
                  style={{ right: '10px', bottom: '7px' }}
                />
              </Col>
              <Col xs="auto" className="pl-1">
                <h3 className="mb-0">{token().symbol}p</h3>
                <Link to={`/liquidity?asset1=${token().address}`}>
                  <p className="text-sm-label-alt">
                    {t('obtain')} {token().symbol}p
                    <Icon
                      icon="scan"
                      size="13"
                      fill={isLightMode ? 'black' : 'white'}
                      className="ms-1"
                    />
                  </p>
                </Link>
              </Col>

              <Col className="text-end my-auto">
                {/* {showDetails && (
                  <span
                    aria-hidden="true"
                    role="button"
                    onClick={() => toggleCollapse()}
                  >
                    <Icon
                      icon="arrowUp"
                      size="20"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                )}
                {!showDetails && (
                  <span
                    aria-hidden="true"
                    role="button"
                    onClick={() => toggleCollapse()}
                  >
                    <Icon
                      icon="arrowDown"
                      size="20"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                )} */}
              </Col>
            </Row>
            <Row className="my-1 mt-2">
              <Col xs="auto" className="text-card">
                {t('remaining')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(asset.staked, 4)} {token().symbol}p
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('claimable')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(calcBondedLP(asset), 4)} {token().symbol}p
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lastClaim')}
              </Col>
              <Col className="text-end output-card">
                {getTimeSince(asset.lastBlockTime, t)[0]}
                {getTimeSince(asset.lastBlockTime, t)[1]} ago
              </Col>
            </Row>

            <Row className="mt-1">
              <Col xs="auto" className="text-card">
                {t('finalDate')}
              </Col>
              <Col className="text-end output-card">
                {formatDate(
                  getEndDate(
                    asset.staked,
                    asset.lastBlockTime,
                    asset.claimRate,
                  ),
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row className="text-center">
              {bond.listedAssets.includes(asset.address) && (
                <Col className="px-2">
                  <Button className="w-100">{t('bond')}</Button>
                </Col>
              )}
              <Col className="px-2">
                <Button
                  className="w-100"
                  disabled={!checkValid()[0]}
                  onClick={() => handleTxn()}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon icon="cycle" size="20" className="anim-spin ms-1" />
                  )}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default BondItem
