import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool'
import { formatFromWei } from '../../../utils/bigNumber'
import { getNetwork, tempChains } from '../../../utils/web3'
import BondItem from './BondVaultItem'
import { getBondDetails, useBond } from '../../../store/bond'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const BondVault = () => {
  const pool = usePool()
  const bond = useBond()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()

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

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork()
    }
  }

  useEffect(() => {
    const { listedPools } = pool
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (listedPools?.length > 0) {
          dispatch(getBondDetails(listedPools, wallet))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  const isLoading = () => {
    if (!bond.bondDetails) {
      return true
    }
    return false
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            <Col xs="auto">
              <Card xs="auto" className="card-320">
                <Card.Header>{t('bondPositions')}</Card.Header>
                <Card.Body>
                  {!isLoading() ? (
                    <>
                      {bond.bondDetails
                        .filter((asset) => asset.staked > 0)
                        .map((asset) => (
                          <Row key={asset.address} className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('remaining')}
                            </Col>
                            <Col className="text-end output-card">
                              {formatFromWei(asset.staked)}{' '}
                              {getToken(asset.tokenAddress)?.symbol}p
                            </Col>
                          </Row>
                        ))}
                    </>
                  ) : (
                    <HelmetLoading height={200} width={200} />
                  )}
                  {!isLoading() &&
                    bond.bondDetails.filter((asset) => asset.staked > 0)
                      .length <= 0 && (
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('noBondPosition')}
                        </Col>
                      </Row>
                    )}
                </Card.Body>
              </Card>
            </Col>
            {!isLoading() &&
              bond.bondDetails
                .filter((asset) => asset.lastBlockTime > 0)
                .sort((a, b) => b.staked - a.staked)
                .map((asset) => (
                  <BondItem asset={asset} key={asset.tokenAddress} />
                ))}
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default BondVault
