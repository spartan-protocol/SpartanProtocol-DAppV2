import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useSparta } from '../../../store/sparta/selector'
import {
  getAddresses,
  getTokenContract,
  getWalletProvider,
} from '../../../utils/web3'
import {
  fallenSpartansClaim,
  spartaUpgrade,
} from '../../../store/sparta/actions'
import spartaIcon from '../../../assets/icons/coin_sparta_black_bg.svg'
import { calcBurnFee } from '../../../utils/web3Utils'

const Upgrade = () => {
  const addr = getAddresses()
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const { t } = useTranslation()
  const [oldSpartaBalance, setoldSpartaBalance] = useState('0')
  const [newSpartaBalance, setnewSpartaBalance] = useState('0')
  const [bnbBalance, setbnbBalance] = useState('0')
  const [spartaSupply, setspartaSupply] = useState('0')
  const fsGenesis = '1620795586'
  const [loadingBalance, setloadingBalance] = useState(false)

  const [trigger0, settrigger0] = useState(0)
  const getData = async () => {
    if (
      wallet?.status === 'connected' &&
      loadingBalance === false &&
      ethers.utils.isAddress(wallet.account)
    ) {
      const tempWallet = wallet.account
      setloadingBalance(true)
      let awaitArray = []
      awaitArray.push(
        getTokenContract(addr.spartav1).balanceOf(wallet.account),
        getTokenContract(addr.spartav2).balanceOf(wallet.account),
        getTokenContract(addr.spartav2).totalSupply(),
        getWalletProvider().getBalance(),
      )
      awaitArray = await Promise.all(awaitArray)
      if (tempWallet === wallet.account) {
        setoldSpartaBalance(awaitArray[0].toString())
        setnewSpartaBalance(awaitArray[1].toString())
        setspartaSupply(awaitArray[2].toString())
        setbnbBalance(awaitArray[3].toString())
      }
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
  }, [trigger0, wallet.account])

  useEffect(() => {
    if (wallet.status === 'disconnected') {
      setoldSpartaBalance('0')
      setnewSpartaBalance('0')
      setspartaSupply('0')
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

  const getBurnFee = () => {
    const burnFee = calcBurnFee(spartaSupply, sparta.claimCheck)
    return burnFee
  }

  const getClaimAmount = () => {
    const claimAmount = BN(sparta.claimCheck).minus(getBurnFee())
    return claimAmount
  }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320">
          <Col>
            <h3 className="mb-0">{t('upgrade')}</h3>
            <span className="subtitle-label">{t('upgradeSubtitle')}</span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                {t('input')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('output')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            {bnbBalance > 5000000000000000 && (
              <Row className="card-body py-1 text-center">
                <Col xs="12" className="p-0 py-1">
                  <Button
                    className="btn-primary"
                    block
                    onClick={() => dispatch(spartaUpgrade())}
                    disabled={oldSpartaBalance <= 0}
                  >
                    {t('upgrade')} SPARTA
                  </Button>
                </Col>
              </Row>
            )}
            {bnbBalance <= 5000000000000000 && (
              <Row className="card-body py-1 text-center">
                <Col xs="12" className="p-0 py-1">
                  <Button className="btn-alert" block disabled>
                    Not Enough BNB
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-body card-320">
          <Col>
            <h3 className="mb-0">{t('claim')}</h3>
            <span className="subtitle-label">{t('claimSubtitle')}</span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                {t('claim')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {spartaSupply > 0 ? formatFromWei(getClaimAmount()) : 'Loading'}{' '}
                SPARTAv2
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('expiry')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatDate(getExpiry())}
              </Col>
            </Row>
            {bnbBalance > 5000000000000000 && (
              <Row className="card-body py-1 text-center">
                <Col xs="12" className="p-0 py-1">
                  <Button
                    className="btn-primary"
                    block
                    onClick={() => dispatch(fallenSpartansClaim())}
                    disabled={sparta?.claimCheck <= 0}
                  >
                    {t('claim')} SPARTA
                  </Button>
                </Col>
              </Row>
            )}
            {bnbBalance <= 5000000000000000 && (
              <Row className="card-body py-1 text-center">
                <Col xs="12" className="p-0 py-1">
                  <Button className="btn-alert" block disabled>
                    Not Enough BNB
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-body card-320 card-underlay">
          <Col>
            <h3 className="mb-0">
              {t('yourBalance')}
              <img
                height="35"
                src={spartaIcon}
                alt="sparta icon"
                className="float-right"
              />
            </h3>

            <span className="subtitle-label">{t('balanceSubtitle')}</span>
            <Row className="mb-2 mt-4">
              <Col xs="auto" className="text-card">
                {t('balance')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(oldSpartaBalance)} SPARTAv1
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('balance')}
              </Col>
              <Col className="text-right text-sm-label-wht">
                {formatFromWei(newSpartaBalance)} SPARTAv2
              </Col>
            </Row>
            <Row className="card-body py-1 text-center">
              <Col xs="12" className="p-0 py-1">
                <Button
                  className="btn-info"
                  block
                  onClick={() => settrigger0(trigger0 + 1)}
                  disabled={loadingBalance === true}
                >
                  {t('refreshBalance')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
    </>
  )
}

export default Upgrade
