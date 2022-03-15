import React from 'react'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { formatFromWei, formatFromUnits, BN } from '../../utils/bigNumber'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import { calcAPY } from '../../utils/math/nonContract'

const SwapPair = ({ assetSwap }) => {
  const web3 = useWeb3()
  const pool = usePool()
  const { t } = useTranslation()
  const asset =
    pool.poolDetails && pool.poolDetails.length
      ? pool.poolDetails.find(
          (lp) => lp.tokenAddress === assetSwap.tokenAddress,
        )
      : 0
  const tokenPrice = BN(assetSwap.baseAmount)
    .div(assetSwap.tokenAmount)
    .times(web3.spartaPrice)

  const spotPrice = BN(assetSwap.baseAmount).div(assetSwap.tokenAmount)

  const getFees = () =>
    pool.incentives
      ? pool.incentives.filter((x) => x.address === asset.address)[0].fees
      : 0

  const getDivis = () =>
    asset.curated && pool.incentives
      ? pool.incentives.filter((x) => x.address === asset.address)[0].incentives
      : 0

  const APY = asset
    ? formatFromUnits(calcAPY(assetSwap, getFees(), getDivis()), 2)
    : 0

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const isLoading = () => {
    if (!pool.poolDetails || !pool.tokenDetails || !assetSwap.tokenAddress) {
      return true
    }
    return false
  }

  return (
    <>
      {!isLoading() && (
        <Card className="card-320 mb-2">
          <Card.Header className="border-0">
            <Row className="mt-2">
              <Col xs="auto" className="mt-1 pe-2 position-relative">
                <img
                  src={getToken(assetSwap.tokenAddress).symbolUrl}
                  alt="Token logo"
                  height="50"
                  className="rounded-circle"
                />
                {/* <Icon icon="spartav2" size="25" className="token-badge-pair" /> */}
              </Col>
              <Col xs="auto">
                <h5 className="mb-1">
                  {getToken(assetSwap.tokenAddress).symbol}
                  <span className="output-card ms-2">
                    ${formatFromUnits(tokenPrice, 4)}
                  </span>
                </h5>
                <h5 className="mb-0">
                  SPARTA
                  <span className="output-card ms-2">
                    ${formatFromUnits(web3.spartaPrice, 4)}
                  </span>
                </h5>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="text-card">
                {t('spotPrice')}
              </Col>
              <Col className="output-card text-end">
                {formatFromUnits(spotPrice, 4)} SPARTA
              </Col>
            </Row>

            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('recentFees')}
              </Col>
              <Col className="output-card text-end">
                {formatFromWei(getFees(), 0)} SPARTA
              </Col>
            </Row>

            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('recentDivis')}
              </Col>
              <Col className="output-card text-end">
                {assetSwap.curated === true
                  ? `${formatFromWei(getDivis(), 0)} SPARTA`
                  : t('notCurated')}
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card mt-2">
                {t('depth')}
              </Col>
              <Col className="output-card text-end">
                {formatFromWei(assetSwap.tokenAmount, 4)}{' '}
                {getToken(assetSwap.tokenAddress).symbol} <br />
                {formatFromWei(assetSwap.baseAmount, 4)} SPARTA
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                APY{' '}
                <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="output-card text-end">{APY}%</Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </>
  )
}

export default SwapPair
