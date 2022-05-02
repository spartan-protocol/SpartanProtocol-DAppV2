import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import Overlay from 'react-bootstrap/Overlay'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useDispatch } from 'react-redux'
import { useSparta } from '../../../../store/sparta'
import { usePool } from '../../../../store/pool'
import { useWeb3 } from '../../../../store/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../../../utils/bigNumber'
import {
  changeNetworkLsOnly,
  getNetwork,
  tempChains,
} from '../../../../utils/web3'
import { Icon } from '../../../../components/Icons/index'
import { useReserve, getReservePOLDetails } from '../../../../store/reserve'
import { getPOLWeights } from '../../../../utils/math/nonContract'

import styles from './styles.module.scss'
import { Spacer } from '../../../../components/Spacer'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const pool = usePool()
  const sparta = useSparta()
  const reserve = useReserve()
  const target = useRef(null)
  const dispatch = useDispatch()
  const network = getNetwork()

  // V1 (Protocol) Token Distribution
  const distroMnBurnV1 = '42414904' // SPARTA minted via BurnForSparta Distro Event (V1 TOKEN)
  const distroMnBondV1 = '17500000' // SPARTA minted via Bond (V1 TOKEN)
  // V2 (Protocol) Token Distribution
  const distroMnBondV2 = '6000000' // SPARTA minted via Bond (V2 TOKEN)
  // V2 (Protocol) Token Burns
  const feeBurn = '848530' // SPARTA burned during feeBurn phase

  const [showDropdown, setshowDropdown] = useState(false)

  useEffect(() => {
    if (
      showDropdown &&
      tempChains.includes(network.chainId) &&
      pool.curatedPools &&
      pool.poolDetails
    ) {
      dispatch(
        getReservePOLDetails(pool.curatedPools, pool.poolDetails, web3.rpcs),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.curatedPools, pool.poolDetails])

  const getTVL = () => {
    let tvl = BN(0)
    if (pool.poolDetails) {
      for (let i = 0; i < pool.poolDetails.length; i++) {
        tvl = tvl.plus(pool.poolDetails[i].baseAmount)
      }
      tvl = tvl.times(2).times(web3.spartaPrice)
    }
    if (tvl > 0) {
      return tvl
    }
    return '0.00'
  }

  const getDeadSupply = () => {
    const { deadSupply } = sparta.globalDetails
    if (deadSupply > 0) {
      return deadSupply
    }
    return '0.00'
  }

  const getBurnedTotal = () => {
    const totalBurned = BN(getDeadSupply()).plus(convertToWei(feeBurn))
    if (totalBurned > 0) {
      return totalBurned
    }
    return '0.00'
  }

  const getTotalSupply = () => {
    const _totalSupply = sparta.globalDetails.totalSupply
    // const { oldTotalSupply } = sparta.globalDetails
    const deadSupply = getDeadSupply()
    // const totalSupply = BN(_totalSupply).plus(oldTotalSupply).minus(deadSupply)
    const totalSupply = BN(_totalSupply).minus(deadSupply)
    if (totalSupply > 0) {
      return totalSupply
    }
    return '0.00'
  }

  const getCirculatingSupply = () => {
    const totalSupply = BN(getTotalSupply())
    const reserveSparta = BN(reserve.globalDetails.spartaBalance)
    const reservePOLSparta = getPOLWeights(reserve.polDetails)
    const valid = totalSupply > 0 && reserve.globalDetails && reserve.polDetails
    if (valid) {
      return totalSupply.minus(reserveSparta).minus(reservePOLSparta)
    }
    return '0.00'
  }

  const getMarketCap = () => {
    const circSupply = getCirculatingSupply()
    if (circSupply > 0) {
      return BN(circSupply).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      changeNetworkLsOnly(56)
    }
    if (net.target.checked === false) {
      changeNetworkLsOnly(97)
    } else {
      changeNetworkLsOnly(net)
    }
    window.location.reload(true)
  }

  return (
    <>
      <div
        role="button"
        className={styles.headerBtn}
        onClick={() => setshowDropdown(!showDropdown)}
        ref={target}
        aria-hidden="true"
      >
        <Icon icon="spartav2" size="27" className="me-1" />
        <span className={styles.btnText}>
          {`$${formatFromUnits(web3.spartaPrice, 2)}`}
        </span>
      </div>

      {showDropdown && (
        <Overlay
          target={target.current}
          show={showDropdown}
          placement="bottom"
          onHide={() => setshowDropdown(false)}
          rootClose
        >
          <Popover>
            <Popover.Header>
              {t('tokenomics')}
              <a
                href="https://docs.spartanprotocol.org/#/introduction?id=the-sparta-token"
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon="scan" size="15" className="ms-2 mb-2" />
              </a>
              <Form className="mb-0">
                <span className="output-card">
                  {t('network')}:{' '}
                  {network.chainId === 97 ? ' Testnet' : ' Mainnet'}
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="ms-2 d-inline-flex"
                    checked={network?.chainId === 56}
                    onChange={(value) => {
                      onChangeNetwork(value)
                    }}
                  />
                </span>
              </Form>
            </Popover.Header>
            <Popover.Body>
              <Row>
                <Col xs="6" className="popover-text mb-2">
                  {t('tvl')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('totalValueLocked')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('tvlInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end mb-2">
                  {getTVL() > 0
                    ? `$${formatFromWei(getTVL(), 0)}`
                    : 'Loading...'}
                  <Spacer className="ms-1" size="15" />
                </Col>
                <Col xs="6" className="popover-text mb-2">
                  {t('marketcap')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('marketcap')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('marketcapInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6 mb-2" className="popover-text text-end mb-2">
                  {getMarketCap() > 0
                    ? `$${formatFromWei(getMarketCap(), 0)}`
                    : 'Loading...'}
                  <Spacer className="ms-1" size="15" />
                </Col>

                <Col xs="6" className="popover-text mb-2">
                  {t('totalSupply')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('totalSupply')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          <div className="mb-3">{t('totalSupplyInfo')}</div>
                          <Row>
                            <Col xs="4" className="text-center">
                              <Badge bg="primary">{t('burnForSparta')}</Badge>
                            </Col>
                            <Col xs="4" className="text-center">
                              <Badge bg="info">{t('bond')}</Badge>
                            </Col>
                            <Col xs="4" className="text-center">
                              <Badge bg="danger">{t('emission')}</Badge>
                            </Col>
                          </Row>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end mb-2">
                  {getTotalSupply() > 0
                    ? formatFromWei(getTotalSupply(), 0)
                    : 'Loading...'}
                  <Icon icon="spartav2" className="ms-1" size="15" />
                </Col>

                <Col xs="12 mb-2">
                  <ProgressBar height="10">
                    <ProgressBar
                      variant="primary"
                      key={1}
                      now={
                        network.chainId === 56
                          ? formatFromUnits(
                              BN(distroMnBurnV1).div(300000000).times(100),
                              2,
                            )
                          : '1'
                      }
                    />
                    <ProgressBar variant="black" now={0.5} />
                    <ProgressBar
                      variant="info"
                      key={2}
                      now={
                        network.chainId === 56
                          ? formatFromUnits(
                              BN(distroMnBondV1)
                                .plus(distroMnBondV2)
                                .div(300000000)
                                .times(100),
                              2,
                            )
                          : '1'
                      }
                    />
                    <ProgressBar variant="black" now={0.5} />
                    <ProgressBar
                      variant="danger"
                      key={3}
                      now={
                        network.chainId === 56
                          ? formatFromUnits(
                              BN(convertFromWei(getTotalSupply()))
                                .minus(distroMnBurnV1)
                                .minus(distroMnBondV1)
                                .minus(distroMnBondV2)
                                .div(300000000)
                                .times(100),
                              2,
                            )
                          : formatFromUnits(
                              BN(convertFromWei(getTotalSupply()))
                                .div(300000000)
                                .times(100),
                              2,
                            )
                      }
                    />
                  </ProgressBar>
                </Col>

                <Col xs="6" className="popover-text mb-2">
                  {t('circulating')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('circulatingSupply')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('circulatingSupplyInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end mb-2">
                  {getCirculatingSupply() > 0
                    ? formatFromWei(getCirculatingSupply(), 0)
                    : 'Loading...'}
                  <Icon icon="spartav2" className="ms-1" size="15" />
                </Col>

                <Col xs="12" className="mb-2">
                  <ProgressBar>
                    <ProgressBar
                      id="sparta2supply"
                      variant="primary"
                      key={2}
                      now={formatFromWei(
                        BN(getCirculatingSupply())
                          .div(convertFromWei(getTotalSupply()))
                          .times(100),
                      )}
                    />
                  </ProgressBar>
                </Col>

                <Col xs="6" className="popover-text">
                  {t('burned')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">{t('burned')}</Popover.Header>
                        <Popover.Body className="text-center">
                          {t('burnedInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end">
                  {getBurnedTotal() > 0
                    ? `${formatFromWei(getBurnedTotal(), 0)}`
                    : 'Loading...'}
                  <Icon icon="fire" className="ms-1" size="15" />
                </Col>
              </Row>
            </Popover.Body>
          </Popover>
        </Overlay>
      )}
    </>
  )
}

export default Supply
