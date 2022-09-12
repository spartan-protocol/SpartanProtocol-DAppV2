import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Overlay from 'react-bootstrap/Overlay'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useSparta } from '../../../../store/sparta'
import { usePool } from '../../../../store/pool'
import { useWeb3 } from '../../../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatFromWei,
} from '../../../../utils/bigNumber'
import { tempChains } from '../../../../utils/web3'
import { Icon } from '../../../../components/Icons/index'
import { useReserve, getReservePOLDetails } from '../../../../store/reserve'
import { getPOLWeights } from '../../../../utils/math/nonContract'

import styles from './styles.module.scss'
import { Spacer } from '../../../../components/Spacer'
import { appChainId, useApp } from '../../../../store/app'
import { useBreakpoint } from '../../../../providers/Breakpoint'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const pool = usePool()
  const sparta = useSparta()
  const reserve = useReserve()
  const target = useRef(null)
  const dispatch = useDispatch()
  const app = useApp()
  const breakpoint = useBreakpoint()

  // V1 (Protocol) Token Distribution
  // const distroMnBurnV1 = '42414904' // SPARTA minted via BurnForSparta Distro Event (V1 TOKEN)
  // const distroMnBondV1 = '17500000' // SPARTA minted via Bond (V1 TOKEN)
  // // V2 (Protocol) Token Distribution
  // const distroMnBondV2 = '6000000' // SPARTA minted via Bond (V2 TOKEN)
  // // V2 (Protocol) Token Burns
  // const feeBurn = '848530' // SPARTA burned during feeBurn phase

  const [showDropdown, setshowDropdown] = useState(false)
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  useEffect(() => {
    if (showDropdown && tempChains.includes(app.chainId)) {
      dispatch(getReservePOLDetails())
    }
  }, [dispatch, app.chainId, pool.poolDetails, showDropdown])

  const getTVL = () => {
    let tvl = BN(0)
    if (pool.poolDetails) {
      for (let i = 0; i < pool.poolDetails.length; i++) {
        tvl = tvl.plus(pool.poolDetails[i].baseAmount)
      }
      tvl = tvl.times(2).times(spartaPrice)
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
    // const totalBurned = BN(getDeadSupply()).plus(convertToWei(feeBurn))
    const totalBurned = getDeadSupply()
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
      return BN(circSupply).times(spartaPrice)
    }
    return '0.00'
  }

  const onChangeNetwork = async () => {
    dispatch(appChainId(app.chainId === 97 ? 56 : 97))
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
        <Icon icon="spartaNavbar" size="23" className="me-1" />
        {breakpoint.sm && (
          <span className={styles.btnText}>
            {spartaPrice > 0 ? `$${formatFromUnits(spartaPrice, 2)}` : ''}
          </span>
        )}
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
                  {t('network')}: {app.chainId === 97 ? ' Testnet' : ' Mainnet'}
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="ms-2 d-inline-flex"
                    checked={app.chainId === 56}
                    onChange={() => onChangeNetwork()}
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
                      variant="progress"
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
              <Row>
                <Col xs="12">
                  <hr />
                </Col>
                <Col xs="6" className="popover-text mb-2">
                  {t('spartaPrice')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Body className="text-center">
                          {t('spartaPriceCoinGeckoInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="coinGeckoIcon" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end mb-2">
                  {web3.spartaPrice > 0
                    ? `$${formatFromUnits(web3.spartaPrice, 6)}`
                    : 'Loading...'}
                  <Spacer className="ms-1" size="15" />
                </Col>
                <Col xs="6" className="popover-text mb-2">
                  {t('spartaPrice')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Body className="text-center">
                          {t('spartaPriceInternalInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="usd" className="ms-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col xs="6" className="popover-text text-end mb-2">
                  {web3.spartaPriceInternal > 0
                    ? `$${formatFromUnits(web3.spartaPriceInternal, 6)}`
                    : 'Loading...'}
                  <Spacer className="ms-1" size="15" />
                </Col>
              </Row>
              <Row>
                <Link to="/pu" style={{ height: '10px' }} />
              </Row>
            </Popover.Body>
          </Popover>
        </Overlay>
      )}
    </>
  )
}

export default Supply
