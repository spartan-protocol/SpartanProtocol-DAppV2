import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Row,
  Col,
  Popover,
  ProgressBar,
  Badge,
  Accordion,
  Overlay,
  Form,
  OverlayTrigger,
} from 'react-bootstrap'
import { useBond } from '../../store/bond'
import { useReserve } from '../../store/reserve/selector'
import { useSparta } from '../../store/sparta/selector'
import { usePool } from '../../store/pool/selector'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatFromWei,
} from '../../utils/bigNumber'
import { getExplorerContract } from '../../utils/extCalls'
import { changeNetworkLsOnly, getAddresses, getNetwork } from '../../utils/web3'
import { Icon } from '../Icons/icons'

const Supply = () => {
  const isLightMode = window.localStorage.getItem('theme')
  const { t } = useTranslation()
  const web3 = useWeb3()
  const addr = getAddresses()
  const pool = usePool()
  const sparta = useSparta()
  const reserve = useReserve()
  const bond = useBond()
  const target = useRef(null)
  const [showDropdown, setshowDropdown] = useState(false)

  const addrNames = [
    'spartav1',
    'spartav2',
    'bondVault',
    'dao',
    'daoVault',
    'fallenSpartans',
    'poolFactory',
    'reserve',
    'router',
    'synthFactory',
    'synthVault',
    'utils',
  ]
  // V1 (Protocol) Token Distribution
  const distroMnBurnV1 = '42414904' // SPARTA minted via BurnForSparta Distro Event (V1 TOKEN)
  const distroMnBondV1 = '17500000' // SPARTA minted via Bond (V1 TOKEN)
  // V2 (Protocol) Token Distribution
  const distroMnBondV2 = '0' // SPARTA minted via Bond (V2 TOKEN)

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getNet = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getNet()
    }
    const timer = setTimeout(() => {
      getNet()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

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

  const getTotalSupply = () => {
    const _totalSupply = sparta.globalDetails.totalSupply
    const { oldTotalSupply } = sparta.globalDetails
    const totalSupply = BN(_totalSupply).plus(oldTotalSupply)
    if (totalSupply > 0) {
      return totalSupply
    }
    return '0.00'
  }

  const getCirculatingSupply = () => {
    const totalSupply = BN(getTotalSupply())
    const reserveSparta = BN(reserve.globalDetails.spartaBalance)
    const bondSparta = BN(bond.global.spartaRemaining)
    if (totalSupply > 0) {
      return totalSupply.minus(reserveSparta).minus(bondSparta)
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

  const [feeBurn, setfeeBurn] = useState('0')
  useEffect(() => {
    setfeeBurn(BN(sparta.feeBurnTally).plus(sparta.feeBurnRecent))
  }, [sparta.feeBurnTally, sparta.feeBurnRecent])

  const [feeIconActive, setfeeIconActive] = useState(false)
  useEffect(() => {
    const action = () => {
      setfeeIconActive(true)
    }
    action()
    const timer = setTimeout(() => {
      setfeeIconActive(false)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sparta.feeBurnRecent])

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      setnetwork(changeNetworkLsOnly(56))
    }
    if (net.target.checked === false) {
      setnetwork(changeNetworkLsOnly(97))
    } else {
      setnetwork(changeNetworkLsOnly(net))
    }
    window.location.reload()
  }

  return (
    <>
      <Button
        id="PopoverClick"
        variant={isLightMode ? 'secondary' : 'info'}
        className="px-2 px-sm-4 ms-1 output-card pt-2 rounded-pill"
        onClick={() => setshowDropdown(!showDropdown)}
        ref={target}
      >
        <Icon
          icon="arrowDown"
          fill={isLightMode ? 'black' : 'white'}
          className="me-1"
          size="15"
        />
        ${formatFromUnits(web3.spartaPrice, 2)}
        <Icon
          icon="fire"
          size={feeIconActive ? '16' : '15'}
          fill={feeIconActive ? 'red' : isLightMode ? 'black' : 'white'}
          className="ms-1 mb-1"
        />
      </Button>

      <Overlay
        target={target.current}
        show={showDropdown}
        placement="bottom"
        onHide={() => setshowDropdown(false)}
        rootClose
      >
        <Popover>
          <Popover.Header className="mt-2">
            {t('tokenomics')}
            <a
              href="https://docs.spartanprotocol.org/tokenomics-1/sparta"
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
            <span className="output-card">
              {t('globalFreeze')}:
              <Badge
                pill
                className="ms-1 pt-1"
                bg={reserve.globalDetails.globalFreeze ? 'primary' : 'success'}
              >
                {reserve.globalDetails.globalFreeze ? t('on') : t('off')}
              </Badge>
            </span>
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
                        Total Value Locked (TVL) is derived by multiplying the
                        total SPARTA value of all locked tokens in the pools by
                        the current USD market value of each SPARTA token.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="15"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="6 mb-2" className="popover-text text-end mb-2">
                ${formatFromWei(getTVL(), 0)}
                <Icon icon="usd" className="ms-1" size="15" />
              </Col>
              <Col xs="6" className="popover-text mb-2">
                {t('marketcap')}
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Popover>
                      <Popover.Header as="h3">{t('marketcap')}</Popover.Header>
                      <Popover.Body className="text-center">
                        Marketcap is derived by multiplying the circulating
                        supply of SPARTA by the current USD market value of each
                        SPARTA token.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="15"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="6 mb-2" className="popover-text text-end mb-2">
                ${formatFromWei(getMarketCap(), 0)}
                <Icon icon="usd" className="ms-1" size="15" />
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
                        <div className="mb-3">
                          The max supply of SPARTA is 300M. This has however
                          been programmed to be impossible to reach. Getting
                          close to 300M would take many years even without the
                          deflationary feeBurn.
                        </div>
                        <Row>
                          <Col xs="4" className="text-center">
                            <Badge bg="primary">{t('burn')}</Badge>
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
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="15"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="6" className="popover-text text-end mb-2">
                {formatFromWei(getTotalSupply(), 0)}
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
                        Circulating supply includes only SPARTA tokens that have
                        entered circulation. SPARTA tokens that have not entered
                        circulation include RESERVE contract holdings (released
                        via programmed incentives like dividends, harvest & DAO
                        grants) & DAO contract holdings (released via the Bond
                        program)
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="15"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="6" className="popover-text text-end mb-2">
                {formatFromWei(getCirculatingSupply(), 0)}
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
                {t('burnedSupply')}
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Popover>
                      <Popover.Header as="h3">
                        {t('burnedSupply')}
                      </Popover.Header>
                      <Popover.Body className="text-center">
                        The SPARTAv2 token has a deflationary aspect built into
                        it. Every time SPARTA tokens are transferred; a small
                        percentage is burned out of the supply permanently. This
                        is referred to as the feeBurn.
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="15"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="6" className="popover-text text-end">
                {formatFromWei(feeBurn, 0)}
                <Icon
                  icon="fire"
                  className="ms-1"
                  size="15"
                  fill={isLightMode ? 'black' : 'white'}
                />
              </Col>
            </Row>

            <br />

            <Row>
              <Col xs="12">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <Icon
                        icon="contract"
                        size="20"
                        fill="#fb2715"
                        className="me-2"
                      />
                      {t('contracts')}
                    </Accordion.Header>
                    <Accordion.Body className="p-1">
                      <Row className="card-body text-center p-2">
                        {addrNames
                          .filter((x) => addr[x] !== '')
                          .map((c) => (
                            <Col key={c} xs={6} className="mb-1 px-1">
                              <a
                                href={getExplorerContract(addr[c])}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <h6>
                                  <Badge bg="info" className="w-100">
                                    {t(c)}
                                    <br />
                                    <Icon
                                      icon="scan"
                                      size="12"
                                      className="mt-1"
                                    />
                                  </Badge>
                                </h6>
                              </a>
                            </Col>
                          ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

export default Supply
