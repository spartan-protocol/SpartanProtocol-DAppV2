import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useSparta } from '../../../store/sparta/selector'
import { getAddresses, getWalletProvider } from '../../../utils/web3'
import {
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../../store/sparta/actions'
import spartaIcon from '../../../assets/icons/coin_sparta_black_bg.svg'
import { calcFeeBurn } from '../../../utils/web3Utils'
import { getTokenContract } from '../../../utils/web3Contracts'

const Upgrade = () => {
  const addr = getAddresses()
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const { t } = useTranslation()
  const [oldSpartaBalance, setoldSpartaBalance] = useState('0')
  const [newSpartaBalance, setnewSpartaBalance] = useState('0')
  const [bnbBalance, setbnbBalance] = useState('0')
  const fsGenesis = '1620795586'
  const [loadingBalance, setloadingBalance] = useState(false)

  const [trigger0, settrigger0] = useState(0)
  const getData = async () => {
    if (
      wallet?.status === 'connected' &&
      loadingBalance === false &&
      ethers.utils.isAddress(wallet.account)
    ) {
      setloadingBalance(true)
      let awaitArray = []
      awaitArray.push(
        getTokenContract(addr.spartav1, wallet).balanceOf(wallet.account),
        getTokenContract(addr.spartav2, wallet).balanceOf(wallet.account),
        getWalletProvider(wallet?.ethereum).getBalance(),
      )
      awaitArray = await Promise.all(awaitArray)
      setoldSpartaBalance(awaitArray[0].toString())
      setnewSpartaBalance(awaitArray[1].toString())
      setbnbBalance(awaitArray[2].toString())
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
      setoldSpartaBalance('0')
      setnewSpartaBalance('0')
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

  return (
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
              <Col className="text-end text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('output')}
              </Col>
              <Col className="text-end text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv2
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {bnbBalance > 5000000000000000 && (
              <Row className="">
                <Col xs="12" className="">
                  <Button
                    className="w-100"
                    onClick={() => dispatch(spartaUpgrade(wallet))}
                    disabled={oldSpartaBalance <= 0}
                  >
                    {t('upgrade')} SPARTA
                  </Button>
                </Col>
              </Row>
            )}
            {bnbBalance <= 5000000000000000 && (
              <Row className="">
                <Col xs="12" className="">
                  <Button variant="info" className="w-100" disabled>
                    Not Enough BNB
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
              <Col className="text-end text-sm-label-wht">
                {sparta.globalDetails.feeOnTransfer > 0
                  ? formatFromWei(getClaimAmount())
                  : 'Loading'}{' '}
                SPARTAv2
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('expiry')}
              </Col>
              <Col className="text-end text-sm-label-wht">
                {formatDate(getExpiry())}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {bnbBalance > 5000000000000000 && (
              <Row className="">
                <Col xs="12" className="">
                  <Button
                    className="w-100"
                    onClick={() => dispatch(fallenSpartansClaim(wallet))}
                    disabled={sparta?.claimCheck <= 0}
                  >
                    {t('claim')} SPARTA
                  </Button>
                </Col>
              </Row>
            )}
            {bnbBalance <= 5000000000000000 && (
              <Row className="">
                <Col xs="12" className="">
                  <Button variant="info" className="w-100" disabled>
                    Not Enough BNB
                  </Button>
                </Col>
              </Row>
            )}
          </Card.Footer>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-320 card-underlay">
          <Card.Body>
            <Col>
              <h3 className="mb-0">
                {t('yourBalance')}
                <img
                  height="35"
                  src={spartaIcon}
                  alt="sparta icon"
                  className="float-end"
                />
              </h3>

              <span className="subtitle-label">{t('balanceSubtitle')}</span>
              <Row className="mb-2 mt-4">
                <Col xs="auto" className="text-card">
                  {t('balance')}
                </Col>
                <Col className="text-end text-sm-label-wht">
                  {formatFromWei(oldSpartaBalance)} SPARTAv1
                </Col>
              </Row>
              <Row className="my-2">
                <Col xs="auto" className="text-card">
                  {t('balance')}
                </Col>
                <Col className="text-end text-sm-label-wht">
                  {formatFromWei(newSpartaBalance)} SPARTAv2
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
  )
}

export default Upgrade
