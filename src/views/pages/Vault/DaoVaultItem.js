import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { Icon } from '../../../components/Icons/icons'
import { daoWithdraw } from '../../../store/dao/actions'
import { usePool } from '../../../store/pool'
import { getPool } from '../../../utils/math/utils'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { getTimeUntil } from '../../../utils/math/nonContract'
import { useDao } from '../../../store/dao/selector'
import DaoDepositModal from './Components/DaoDepositModal'

const DaoVaultItem = ({ i }) => {
  const { t } = useTranslation()
  const wallet = useWeb3React()
  const pool = usePool()
  const dao = useDao()
  const dispatch = useDispatch()
  const [txnLoading, setTxnLoading] = useState(false)

  const isLightMode = window.localStorage.getItem('theme')

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((x) => x.address === _tokenAddr)[0]

  const handleWithdraw = async () => {
    setTxnLoading(true)
    await dispatch(daoWithdraw(i.address, wallet))
    setTxnLoading(false)
  }

  const getLockedSecs = () => {
    const depositTime = BN(dao.member?.depositTime)
    const lockUpSecs = BN('86400')
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  return (
    <>
      <Col xs="auto" key={i.address}>
        <Card className="card-320">
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
                <img
                  className="mr-3"
                  src={getToken(i.tokenAddress)?.symbolUrl}
                  alt={getToken(i.tokenAddress)?.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="position-absolute"
                  style={{ right: '8px', bottom: '7px' }}
                />
              </Col>
              <Col xs="auto" className="pl-1">
                <h3 className="mb-0">{getToken(i.tokenAddress)?.symbol}p</h3>
                <Link to={`/liquidity?asset1=${i.tokenAddress}`}>
                  <p className="text-sm-label-alt">
                    {t('obtain')} {getToken(i.tokenAddress)?.symbol}p
                    <Icon
                      icon="scan"
                      size="13"
                      fill={isLightMode ? 'black' : 'white'}
                      className="ms-1"
                    />
                  </p>
                </Link>
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('balance')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(
                  getPool(i.tokenAddress, pool.poolDetails).balance,
                )}{' '}
                {getToken(i.tokenAddress)?.symbol}p
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('staked')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(i.staked)} {getToken(i.tokenAddress)?.symbol}p
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col xs="6" className="pe-1">
                <DaoDepositModal
                  tokenAddress={i.tokenAddress}
                  disabled={i.balance <= 0}
                />
              </Col>
              <Col xs="6" className="ps-1">
                <Button
                  className="w-100"
                  onClick={() => handleWithdraw()}
                  disabled={i.staked <= 0 || getLockedSecs()[0] > 0}
                >
                  {t('withdraw')}
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

export default DaoVaultItem
