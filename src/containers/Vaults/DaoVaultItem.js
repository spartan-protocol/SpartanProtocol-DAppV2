import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { formatFromWei } from '../../utils/bigNumber'
import { Icon } from '../../components/Icons/index'
import { usePool } from '../../store/pool'
import { getPool } from '../../utils/math/utils'
import spartaIcon from '../../assets/tokens/sparta-lp.svg'
import DaoDepositModal from './Components/DaoDepositModal'
import DaoWithdrawModal from './Components/DaoWithdrawModal'

const DaoVaultItem = ({ i, claimable }) => {
  const { t } = useTranslation()
  const wallet = useWeb3React()
  const pool = usePool()

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((x) => x.address === _tokenAddr)[0]

  return (
    <>
      <Col className="mb-4" lg="4" key={i.address}>
        <Card style={{ minHeight: '202px' }}>
          <Card.Body>
            <Row className="mb-2 d-flex">
              <Col className="position-relative" xs="auto">
                <img
                  src={getToken(i.tokenAddress)?.symbolUrl}
                  alt={getToken(i.tokenAddress)?.symbol}
                  height="50px"
                  className="rounded-circle"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="token-badge-pair"
                />
              </Col>
              <Col className="pl-1">
                <h3 className="mb-0">{getToken(i.tokenAddress)?.symbol}p</h3>
                <Link to={`/liquidity?asset1=${i.tokenAddress}`}>
                  <p className="text-sm-label-alt">
                    {t('obtain')} {getToken(i.tokenAddress)?.symbol}p
                    <Icon icon="scan" size="13" className="ms-1" />
                  </p>
                </Link>
              </Col>
            </Row>

            <Row className="my-1">
              <Col className="text-card">{t('balance')}</Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>
                    {formatFromWei(
                      getPool(i.tokenAddress, pool.poolDetails).balance,
                    )}{' '}
                    {getToken(i.tokenAddress)?.symbol}p
                  </>
                )}
              </Col>
            </Row>

            <Row className="my-1">
              <Col className="text-card">{t('staked')}</Col>
              <Col className="text-end output-card">
                {!wallet.account ? (
                  t('connectWallet')
                ) : (
                  <>
                    {formatFromWei(i.staked)} {getToken(i.tokenAddress)?.symbol}
                    p
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col className="pe-1">
                <DaoDepositModal
                  tokenAddress={i.tokenAddress}
                  disabled={i.balance <= 0}
                  claimable={claimable}
                />
              </Col>
              <Col className="ps-1">
                <DaoWithdrawModal
                  tokenAddress={i.tokenAddress}
                  address={i.address}
                  disabled={i.staked <= 0}
                  claimable={claimable}
                />
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default DaoVaultItem
