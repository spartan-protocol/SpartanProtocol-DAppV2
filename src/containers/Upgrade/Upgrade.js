import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { useAccount, useBalance, useWalletClient } from 'wagmi'
import { formatFromWei } from '../../utils/bigNumber'
import { spartaUpgrade } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { usePool } from '../../store/pool'
import { getToken } from '../../utils/math/utils'
import { useApp } from '../../store/app'

const Upgrade = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { data: bnbBalance } = useBalance({ address }) // TODO: Note this returns bigint now instead of BigNumber

  const { addresses } = useApp()
  const pool = usePool()

  const [upgradeLoading, setUpgradeLoading] = useState(false)
  // const [bnbBalance, setbnbBalance] = useState('0')
  // const [trigger0, settrigger0] = useState(0)

  const getSpartav1 = () => getToken(addresses.spartav1, pool.tokenDetails)
  const getSpartav2 = () => getToken(addresses.spartav2, pool.tokenDetails)

  // useEffect(() => {
  //   const getData = async () => {
  //     if (address) {
  //       const bnbBal = await signer.getBalance(address)
  //       setbnbBalance(bnbBal.toString())
  //     }
  //   }
  //   getData() // Run on load
  // }, [trigger0, wallet])

  // useEffect(() => {
  //   if (!address) {
  //     setbnbBalance('0')
  //   }
  // }, [address])

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    await dispatch(spartaUpgrade(address, walletClient))
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
                {bnbBalance?.value > 2000000000000000 && (
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
                {bnbBalance?.value <= 2000000000000000 && (
                  <Row>
                    <Col xs="12">
                      <Button variant="info" className="w-100" disabled>
                        {t('notEnoughBnb')}
                      </Button>
                    </Col>
                  </Row>
                )}
                {!address && (
                  <Row>
                    <Col xs="12">
                      <Button variant="info" className="w-100" disabled>
                        {t('connectWallet')}
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
                {/* <Button
                  className="w-100"
                  onClick={() => settrigger0((prev) => prev + 1)}
                >
                  {t('refreshBalance')}
                </Button> */}
              </Card.Footer>
            </Card>
          </Col>
        </>
      )}
    </>
  )
}

export default Upgrade
