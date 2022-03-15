import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import WrongNetwork from '../../components/WrongNetwork/index'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { getNetwork, tempChains } from '../../utils/web3'
import BondItem from './BondVaultItem'
import { getBondDetails, useBond } from '../../store/bond'
import { Icon } from '../../components/Icons/index'

const BondVault = () => {
  const pool = usePool()
  const bond = useBond()
  const web3 = useWeb3()
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
          dispatch(getBondDetails(listedPools, wallet, web3.rpcs))
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
    <Row>
      {tempChains.includes(network.chainId) && (
        <>
          <Col xs="auto" className="">
            <Card xs="auto" className="card-320" style={{ minHeight: '245' }}>
              <Card.Header>{t('bondVaultDetails')}</Card.Header>
              <Card.Body className="text-card">
                View & claim your Bond positions.
              </Card.Body>
              <Card.Footer>
                <div className="text-card mb-1">
                  Read more about the Bond program:
                </div>
                <a
                  href="https://docs.spartanprotocol.org/#/staking?id=what-is-the-bondvault"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="w-100">
                    {t('viewInDocs')}
                    <Icon icon="scan" size="15" className="ms-2 mb-1" />
                  </Button>
                </a>
              </Card.Footer>
            </Card>
          </Col>

          {!isLoading() &&
          bond.bondDetails.filter((asset) => asset.lastBlockTime > 0).length >
            0 ? (
            bond.bondDetails
              .filter((asset) => asset.lastBlockTime > 0)
              .sort((a, b) => b.staked - a.staked)
              .map((asset) => (
                <BondItem asset={asset} key={asset.tokenAddress} />
              ))
          ) : (
            <Col xs="auto">
              <Card className="card-320" style={{ minHeight: '245' }}>
                <Card.Header>Bond Positions</Card.Header>
                <Card.Body>You have no active Bond positions</Card.Body>
              </Card>
            </Col>
          )}
        </>
      )}
      {!tempChains.includes(network.chainId) && <WrongNetwork />}
    </Row>
  )
}

export default BondVault
