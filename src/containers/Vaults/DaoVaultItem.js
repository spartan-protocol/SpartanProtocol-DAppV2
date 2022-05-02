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
      <Col className="mb-4" xs="12" sm="6" lg="4" key={i.address}>
        <Card style={{ minHeight: '185px' }}>
          <Card.Header>
            <Row className="mb-1">
              <Col className="position-relative pt-1" xs="auto">
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
              <Col>
                <h3 className="mb-0">{getToken(i.tokenAddress)?.symbol}p</h3>
                <Link to={`/liquidity?asset1=${i.tokenAddress}`}>
                  <small>
                    {t('obtain')} {getToken(i.tokenAddress)?.symbol}p
                    <Icon icon="scan" size="11" className="ms-1" />
                  </small>
                </Link>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="my-1">
              <Col>{t('balance')}</Col>
              <Col xs="auto">
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
              <Col>{t('staked')}</Col>
              <Col xs="auto" className="text-end">
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
