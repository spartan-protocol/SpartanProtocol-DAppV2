import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { BN, formatFromWei } from '../../utils/bigNumber'
import { getAddresses } from '../../utils/web3'
import {
  useSparta,
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { calcFeeBurn } from '../../utils/math/nonContract'
import { usePool } from '../../store/pool'
import { getToken } from '../../utils/math/utils'
import { useWeb3 } from '../../store/web3'

const Upgrade = () => {
  const addr = getAddresses()
  const pool = usePool()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const sparta = useSparta()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const fsGenesis = '1620795586'

  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
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

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const getExpiry = () => {
    const expiry = BN(fsGenesis).plus(15552000)
    return expiry
  }

  const getFeeBurn = () => {
    const burnFee = calcFeeBurn(
      sparta.globalDetails.feeOnTransfer,
      sparta.claimCheck,
    )
    return burnFee
  }

  const getClaimAmount = () => {
    const claimAmount = BN(sparta.claimCheck).minus(getFeeBurn())
    return claimAmount
  }

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    await dispatch(spartaUpgrade(wallet, web3.rpcs))
    setUpgradeLoading(false)
  }

  const handleClaim = async () => {
    setClaimLoading(true)
    await dispatch(fallenSpartansClaim(wallet, web3.rpcs))
    setClaimLoading(false)
  }

  return (
    <>
      {pool.tokenDetails.length > 0 && (
        <>
          <Col xs="auto">
            <Card className="card-320">
              <Card.Header>
                <Card.Title>{t('upgrade')}</Card.Title>
                <Card.Subtitle>{t('upgradeSubtitle')}</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <Row className="">
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
                  <Row className="">
                    <Col xs="12" className="">
                      <Button
                        className="w-100"
                        onClick={() => handleUpgrade()}
                        disabled={getSpartav1().balance <= 0}
                      >
                        {t('upgrade')} SPARTA
                        {upgradeLoading && (
                          <Icon
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
                  <Row className="">
                    <Col xs="12" className="">
                      <Button variant="info" className="w-100" disabled>
                        {t('notEnoughBnb')}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Card.Footer>
            </Card>
          </Col>

          <Col xs="auto">
            <Card className="card-320">
              <Card.Header>
                <Card.Title className="">{t('claim')}</Card.Title>
                <Card.Subtitle className="">{t('claimSubtitle')}</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <Row className="">
                  <Col xs="auto" className="text-card">
                    {t('claim')}
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(getClaimAmount())} SPARTAv2
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col xs="auto" className="text-card">
                    {t('expiry')}
                  </Col>
                  <Col className="text-end output-card">
                    {formatDate(getExpiry())}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                {bnbBalance > 2000000000000000 && (
                  <Row className="">
                    <Col xs="12" className="">
                      <Button
                        className="w-100"
                        onClick={() => handleClaim()}
                        disabled={sparta?.claimCheck <= 0}
                      >
                        {t('claim')} SPARTA
                        {claimLoading && (
                          <Icon
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
                  <Row className="">
                    <Col xs="12" className="">
                      <Button variant="info" className="w-100" disabled>
                        {t('notEnoughBnb')}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Card.Footer>
            </Card>
          </Col>

          <Col xs="auto">
            <Card className="card-320">
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
                  variant="info"
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
