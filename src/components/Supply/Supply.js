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
} from 'react-bootstrap'
import { useBond } from '../../store/bond'
import { useReserve } from '../../store/reserve/selector'
import { useSparta } from '../../store/sparta/selector'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatFromWei,
} from '../../utils/bigNumber'
import { getExplorerContract } from '../../utils/extCalls'
import { changeNetworkLsOnly, getAddresses, getNetwork } from '../../utils/web3'
import { ReactComponent as FireIcon } from '../../assets/icons/fire.svg'
import { ReactComponent as DownIcon } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as ContractIcon } from '../../assets/icons/icon-contratcs.svg'
import { ReactComponent as OpenIcon } from '../../assets/icons/icon-scan.svg'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const addr = getAddresses()
  const sparta = useSparta()
  const reserve = useReserve()
  const bond = useBond()
  const target = useRef(null)
  const [showDropdown, setshowDropdown] = useState(false)
  const isLightMode = window.localStorage.getItem('theme')
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
        <DownIcon fill={isLightMode ? 'black' : 'white'} className="me-1" />$
        {formatFromUnits(web3.spartaPrice, 2)}
        <FireIcon
          height={feeIconActive ? '16' : '15'}
          width="15"
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
            Tokenomics
            <Form className="mb-0">
              <span className="output-card">
                Network: {network.chainId === 97 ? ' Testnet' : ' Mainnet'}
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
              <Col xs="6" className="popover-text mb-4">
                {t('marketcap')}
              </Col>
              <Col xs="6 mb-2" className="popover-text text-end mb-4">
                ${formatFromWei(getMarketCap(), 0)}
              </Col>

              <Col xs="6" className="popover-text mb-2">
                {t('circulating')}
              </Col>
              <Col xs="6" className="popover-text text-end mb-2">
                {formatFromWei(getCirculatingSupply(), 0)}
              </Col>

              <Col xs="12" className="mb-2">
                <ProgressBar>
                  <ProgressBar
                    id="sparta1supply"
                    variant="warning"
                    key={1}
                    now={formatFromWei(
                      BN(sparta.globalDetails.oldTotalSupply)
                        .div(300000000)
                        .times(100),
                    )}
                  />
                  <ProgressBar
                    id="sparta2supply"
                    variant="primary"
                    key={2}
                    now={formatFromWei(
                      BN(getCirculatingSupply())
                        .minus(sparta.globalDetails.oldTotalSupply)
                        .div(300000000)
                        .times(100),
                    )}
                  />
                </ProgressBar>
              </Col>
              <Col xs="6" className="text-center">
                <Badge bg="warning">SPARTAv1</Badge>
              </Col>
              <Col xs="6" className="text-center">
                <Badge bg="primary">SPARTAv2</Badge>
              </Col>

              <Col xs="6" className="popover-text my-2">
                {t('totalSupply')}
              </Col>
              <Col xs="6" className="popover-text text-end my-2">
                {formatFromWei(getTotalSupply(), 0)}
              </Col>

              <Col xs="12 mb-2">
                <ProgressBar>
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
              <Col xs="4" className="text-center">
                <Badge bg="primary">{t('burn')}</Badge>
              </Col>
              <Col xs="4" className="text-center">
                <Badge bg="info">{t('bond')}</Badge>
              </Col>
              <Col xs="4" className="text-center">
                <Badge bg="danger">{t('emisson')}</Badge>
              </Col>

              <Col xs="6" className="popover-text mt-3">
                {t('totalFeeBurn')}
              </Col>
              <Col xs="6" className="popover-text text-end mt-3">
                {formatFromWei(feeBurn, 2)}
              </Col>
            </Row>

            <br />

            <Row>
              <Col xs="12">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <ContractIcon
                        height="20"
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
                                    <OpenIcon height="12" className="mt-1" />
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
