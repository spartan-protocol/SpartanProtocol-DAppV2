import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { formatFromWei } from '../../utils/bigNumber'
import { getAddresses } from '../../utils/web3'
import { spartaUpgrade } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { usePool } from '../../store/pool'
import { getToken } from '../../utils/math/utils'
import { useWeb3 } from '../../store/web3'

const Upgrade = () => {
  const addr = getAddresses()
  const pool = usePool()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const { t } = useTranslation()

  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [bnbBalance, setbnbBalance] = useState('0')
  const [loadingBalance, setloadingBalance] = useState(false)

  const getSpartav1 = () => getToken(addr.spartav1, pool.tokenDetails)
  const getSpartav2 = () => getToken(addr.spartav2, pool.tokenDetails)

  const [trigger0, settrigger0] = useState(0)
  const getData = async () => {
    if (
      wallet?.active &&
      loadingBalance === false &&
      ethers.utils.isAddress(wallet.account)
    ) {
      setloadingBalance(true)
      const bnbBal = await wallet.library.getBalance(wallet.account)
      setbnbBalance(bnbBal.toString())
      setloadingBalance(false)
    }
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 5000)
    return () => {
      clearTimeout(timer)
      settrigger0(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0, wallet.account, wallet.balance, wallet.connector])

  useEffect(() => {
    if (wallet.status === 'disconnected') {
      setbnbBalance('0')
    }
  }, [wallet.status])

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    await dispatch(spartaUpgrade(wallet, web3.rpcs))
    setUpgradeLoading(false)
  }

  return (
    <>
      {pool.tokenDetails.length > 0 && (
        <>
          <Col sm={6} lg={4}>
            <Card className="mb-3" style={{ minHeight: '190px' }}>
              <Card.Header>
                <Card.Title>
                  <Col xs="auto" className="mt-2 h4">
                    {t('upgrade')}
                  </Col>
                </Card.Title>
                <Card.Subtitle>{t('upgradeSubtitle')}</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs="auto" className="text-card">
                    {t('input')}
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(getSpartav1().balance)} SPARTAv1
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col xs="auto" className="text-card">
                    {t('output')}
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(getSpartav1().balance)} SPARTAv2
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                {bnbBalance > 2000000000000000 && (
                  <Row>
                    <Col xs="12">
                      <Button
                        className="w-100"
                        onClick={() => handleUpgrade()}
                        disabled={getSpartav1().balance <= 0}
                      >
                        {t('upgrade')} SPARTA
                        {upgradeLoading && (
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
                )}
                {bnbBalance <= 2000000000000000 && (
                  <Row>
                    <Col xs="12">
                      <Button variant="info" className="w-100" disabled>
                        {t('notEnoughBnb')}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Card.Footer>
            </Card>
          </Col>

          <Col sm={6} lg={4}>
            <Card className="mb-3" style={{ minHeight: '190px' }}>
              <Card.Body>
                <Col>
                  <h3 className="mb-0">
                    {t('yourBalance')}
                    <Icon icon="spartav2" className="float-end" size="35" />
                  </h3>

                  <span className="subtitle-label">{t('balanceSubtitle')}</span>
                  <Row className="mb-2 mt-4">
                    <Col xs="auto" className="text-card">
                      {t('balance')}
                    </Col>
                    <Col className="text-end output-card">
                      {formatFromWei(getSpartav1().balance)} SPARTAv1
                    </Col>
                  </Row>
                  <Row className="my-2">
                    <Col xs="auto" className="text-card">
                      {t('balance')}
                    </Col>
                    <Col className="text-end output-card">
                      {formatFromWei(getSpartav2().balance)} SPARTAv2
                    </Col>
                  </Row>
                </Col>
              </Card.Body>
              <Card.Footer>
                <Button
                  className="w-100"
                  onClick={() => settrigger0(trigger0 + 1)}
                  disabled={loadingBalance === true}
                >
                  {t('refreshBalance')}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </>
      )}
    </>
  )
}

export default Upgrade
