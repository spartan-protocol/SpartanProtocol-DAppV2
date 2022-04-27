import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { BN, formatFromWei } from '../../utils/bigNumber'
import spartaIcon from '../../assets/tokens/sparta-lp.svg'
import { Icon } from '../../components/Icons/index'
import { claimBond } from '../../store/bond'
import { calcBondedLP } from '../../utils/math/bondVault'
import {
  formatDate,
  getTimeSince,
  isBonded,
} from '../../utils/math/nonContract'
import { getToken } from '../../utils/math/utils'
import { getAddresses } from '../../utils/web3'
import { useWeb3 } from '../../store/web3'

const BondItem = (props) => {
  const pool = usePool()
  const dispatch = useDispatch()
  const wallet = useWeb3React()
  const web3 = useWeb3()
  const addr = getAddresses()
  const { asset } = props
  const { t } = useTranslation()

  const [txnLoading, setTxnLoading] = useState(false)

  const token = () => getToken(asset.tokenAddress, pool.tokenDetails)

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

  const handleTxn = async () => {
    setTxnLoading(true)
    await dispatch(claimBond(asset.tokenAddress, wallet, web3.rpcs))
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
    if (calcBondedLP(asset) <= 0) {
      return [false, t('noClaim')]
    }
    return [true, t('claim')]
  }

  return (
    <>
      <Col xs="12" sm="6" lg="4" key={asset.address}>
        <Card style={{ minHeight: '230px' }}>
          <Card.Header>
            <Row className="mb-1">
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
                  className="token-badge-pair"
                />
              </Col>
              <Col xs="auto" className="py-auto">
                <h3 className="mb-0">{token().symbol}p</h3>
                <small>Bonded Position</small>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="my-1 mt-2">
              <Col>{t('remaining')}</Col>
              <Col xs="auto" className="text-end">
                {formatFromWei(asset.staked, 4)} {token().symbol}p
              </Col>
            </Row>

            <Row className="my-1">
              <Col>{t('claimable')}</Col>
              <Col xs="auto" className="text-end">
                {formatFromWei(calcBondedLP(asset), 4)} {token().symbol}p
              </Col>
            </Row>

            <Row className="my-1">
              <Col>{t('lastClaim')}</Col>
              <Col xs="auto" className="text-end">
                {isBonded(asset.lastBlockTime) ? (
                  <>
                    {getTimeSince(asset.lastBlockTime, t)[0]}
                    {getTimeSince(asset.lastBlockTime, t)[1]} {t('ago')}
                  </>
                ) : (
                  t('never')
                )}
              </Col>
            </Row>

            <Row className="mt-1">
              <Col>{t('finalDate')}</Col>
              <Col xs="auto" className="text-end">
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
              <Col className="px-2">
                <Button
                  className="w-100 btn-sm"
                  disabled={!checkValid()[0]}
                  onClick={() => handleTxn()}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon
                      fill="white"
                      icon="cycle"
                      size="20"
                      className="anim-spin ms-1"
                    />
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
