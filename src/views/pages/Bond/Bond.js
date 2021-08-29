import { useWallet } from '@binance-chain/bsc-use-wallet'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Col, Card, Button } from 'react-bootstrap'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { claimAllForMember } from '../../../store/bond/actions'
import { usePool } from '../../../store/pool'
import { formatFromWei } from '../../../utils/bigNumber'
import { getNetwork } from '../../../utils/web3'
import BondItem from './BondItem'

const Bond = () => {
  const pool = usePool()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  return (
    <>
      <div className="content">
        {network.chainId === 97 && (
          <Row className="row-480">
            <Col xs="auto">
              <Card xs="auto" className="card-320">
                <Card.Header>{t('bondPositions')}</Card.Header>
                <Card.Body>
                  {pool.poolDetails?.length > 0 &&
                    pool.poolDetails
                      .filter((asset) => asset.bonded > 0)
                      .map((asset) => (
                        <Row key={asset.address} className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('remaining')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(asset.bonded)}{' '}
                            {getToken(asset.tokenAddress)?.symbol}p
                          </Col>
                        </Row>
                      ))}
                  {pool.poolDetails.filter((asset) => asset.bonded > 0)
                    .length <= 0 && (
                    <Row className="my-1">
                      <Col xs="auto" className="text-card">
                        {t('noBondPosition')}
                      </Col>
                    </Row>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    className="w-100"
                    onClick={() => dispatch(claimAllForMember(wallet))}
                  >
                    {t('claimAll')}
                    {' ( '}
                    {pool.poolDetails?.length > 0 &&
                      pool.poolDetails.filter((asset) => asset.bonded > 0)
                        .length}
                    {' )'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            {pool.poolDetails?.length > 0 &&
              pool.poolDetails
                .filter((asset) => asset.bondLastClaim > 0)
                .sort((a, b) => b.bonded - a.bonded)
                .map((asset) => (
                  <BondItem asset={asset} key={asset.tokenAddress} />
                ))}
          </Row>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Bond
