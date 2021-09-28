import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap'
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

const DaoVaultItem = ({ i, claimable }) => {
  const { t } = useTranslation()
  const wallet = useWeb3React()
  const pool = usePool()
  const dao = useDao()
  const dispatch = useDispatch()
  const [txnLoading, setTxnLoading] = useState(false)

  const isLightMode = window.localStorage.getItem('theme')

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((x) => x.address === _tokenAddr)[0]

  // eslint-disable-next-line no-unused-vars
  const handleWithdraw = async () => {
    setTxnLoading(true)
    await dispatch(daoWithdraw(i.address, wallet))
    setTxnLoading(false)
  }

  const getLastDeposit = () => {
    if (dao.lastDeposits.length > 0) {
      let lastDeposit = dao.lastDeposits.filter((x) => x.address === i.address)
      lastDeposit = lastDeposit[0].lastDeposit
      return lastDeposit
    }
    return '99999999999999999999999999999'
  }

  const getLockedSecs = () => {
    const depositTime = BN(getLastDeposit())
    const lockUpSecs = BN('86400')
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  const checkValid = () => {
    if (i.staked > 0) {
      if (getLockedSecs()[0] > 0) {
        return [false, `${getLockedSecs()[0]}${getLockedSecs()[1]}`, 'lock']
      }
      return [true, t('withdraw'), false]
    }
    return [false, t('nothingStaked'), false]
  }

  return (
    <>
      <Col xs="auto" key={i.address}>
        <Card className="card-320" style={{ minHeight: '202' }}>
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
                <img
                  src={getToken(i.tokenAddress)?.symbolUrl}
                  alt={getToken(i.tokenAddress)?.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="token-badge-pair"
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
                  claimable={claimable}
                />
              </Col>
              <Col xs="6" className="ps-1">
                {typeof wallet.account === 'undefined' ? (
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header />
                        <Popover.Body>{t('connectWalletFirst')}</Popover.Body>
                      </Popover>
                    }
                  >
                    <Button
                      className="w-100"
                      onClick={() => handleWithdraw()}
                      disabled={!checkValid()[0]}
                    >
                      {checkValid()[2] && (
                        <Icon
                          icon={checkValid()[2]}
                          size="15"
                          className="mb-1"
                        />
                      )}
                      {checkValid()[1]}
                      {txnLoading && (
                        <Icon
                          icon="cycle"
                          size="20"
                          className="anim-spin ms-1"
                        />
                      )}
                    </Button>
                  </OverlayTrigger>
                ) : (
                  <Button
                    className="w-100"
                    onClick={() => handleWithdraw()}
                    disabled={!checkValid()[0]}
                  >
                    {checkValid()[2] && (
                      <Icon icon={checkValid()[2]} size="15" className="mb-1" />
                    )}
                    {checkValid()[1]}
                    {txnLoading && (
                      <Icon icon="cycle" size="20" className="anim-spin ms-1" />
                    )}
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default DaoVaultItem
