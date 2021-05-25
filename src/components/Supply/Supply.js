import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  Row,
  Col,
  Card,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Progress,
  Collapse,
  UncontrolledTooltip,
} from 'reactstrap'
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
import { getAddresses, getNetwork } from '../../utils/web3'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const addr = getAddresses()
  const sparta = useSparta()
  const reserve = useReserve()
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)
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
  const distroMnBurnV1 = '42414904'
  const distroMnBondV1 = '17500000'

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
    const bondSparta = BN('0') // BN(bond.bondSpartaRemaining) CHANGE THIS FOR V2A #396
    if (totalSupply > 0) {
      return totalSupply.minus(reserveSparta).minus(bondSparta) // CHANGE THIS FOR V2A #396
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

  return (
    <>
      <Button
        id="PopoverClick"
        type="Button"
        className="btn-header px-4 ml-1"
        href="#"
      >
        {/* <img className="mr-1" src={IconLogo} height="25px" alt="share icon" /> */}
        ${formatFromUnits(web3.spartaPrice, 2)}
      </Button>

      <UncontrolledPopover
        trigger="legacy"
        rootclose="true"
        placement="bottom"
        target="PopoverClick"
      >
        <PopoverHeader className="mt-2">
          Tokenomics - {network.chainId === 97 ? 'Testnet' : 'Mainnet'}
        </PopoverHeader>
        <PopoverBody>
          {/* {network.chainId === 97 && (
            <> */}
          <Row>
            <Col xs="6" className="popover-text mb-4">
              {t('marketcap')}
            </Col>
            <Col xs="6 mb-2" className="popover-text mb-4">
              ${formatFromWei(getMarketCap(), 0)}
            </Col>

            <Col xs="6" className="popover-text mb-2">
              {t('circulating')}
            </Col>
            <Col xs="6" className="popover-text mb-2">
              {formatFromWei(getCirculatingSupply(), 0)}
            </Col>

            <Col xs="12" className="mb-4">
              <Progress multi>
                <Progress
                  bar
                  id="sparta1supply"
                  color="light"
                  value={formatFromWei(
                    BN(sparta.globalDetails.oldTotalSupply)
                      .div(300000000)
                      .times(100),
                  )}
                />
                <UncontrolledTooltip target="sparta1supply">
                  SPARTAv1
                </UncontrolledTooltip>
                <Progress bar color="black" value="1" />
                <Progress
                  bar
                  id="sparta2supply"
                  color="gray"
                  value={formatFromWei(
                    BN(getCirculatingSupply())
                      .minus(sparta.globalDetails.oldTotalSupply)
                      .div(300000000)
                      .times(100),
                  )}
                />
                <UncontrolledTooltip target="sparta2supply">
                  SPARTAv2
                </UncontrolledTooltip>
              </Progress>
            </Col>

            <Col xs="6" className="popover-text mb-2">
              {t('totalSupply')}
            </Col>
            <Col xs="6" className="popover-text mb-2">
              {formatFromWei(getTotalSupply(), 0)}
            </Col>

            <Col xs="12 mb-2">
              <Progress multi>
                <Progress
                  bar
                  color="primary"
                  value={formatFromUnits(
                    BN(distroMnBurnV1).div(300000000).times(100),
                  )}
                />
                <Progress bar color="black" value="1" />
                <Progress
                  bar
                  color="yellow"
                  value={formatFromUnits(
                    BN(distroMnBondV1).div(300000000).times(100),
                  )}
                />
                <Progress bar color="black" value="1" />
                <Progress
                  bar
                  color="lightblue"
                  value={formatFromUnits(
                    BN(convertFromWei(getTotalSupply()))
                      .minus(distroMnBurnV1)
                      .minus(distroMnBondV1)
                      .div(300000000)
                      .times(100),
                  )}
                />
              </Progress>
            </Col>
            <Col xs="4">
              <span className="popover-text  dot-burn mr-2" />
              {t('burn')}
            </Col>
            <Col xs="4">
              <span className="popover-text dot-bond mr-1" />
              {t('bond')}
            </Col>
            <Col xs="4">
              <span className="popover-text  dot-emission mr-2" />
              {t('emisson')}
            </Col>
          </Row>
          <br />
          <br />
          {/* </>
          )} */}
          <Row>
            <Col md="12" className="ml-auto text-right">
              <Card
                className="card-body card-inside"
                style={{ backgroundColor: '#25212D' }}
              >
                <Row
                  className="mb-3"
                  onClick={(e) => {
                    e.preventDefault()
                    setopenedCollapseThree(!openedCollapseThree)
                  }}
                  onKeyPress={(e) => {
                    e.preventDefault()
                    setopenedCollapseThree(!openedCollapseThree)
                  }}
                >
                  <Col xs={8} className="ml-n2 ">
                    <div className="text-left text-card">
                      <i className="icon-small icon-contracts icon-light pr-4 mr-1" />{' '}
                      {t('contracts')}
                    </div>
                  </Col>
                  <Col className="ml-auto">
                    <div
                      aria-expanded={openedCollapseThree}
                      role="button"
                      tabIndex={-1}
                      data-parent="#accordion"
                      data-toggle="collapse"
                    >
                      <i
                        className="bd-icons icon-minimal-down mt-1"
                        style={{ color: '#FFF' }}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                  <Row className="card-body text-center p-2">
                    {addrNames
                      .filter((x) => addr[x] !== '')
                      .map((c) => (
                        <Col key={c} xs={6} className="text-left mb-3 px-2">
                          <span>
                            <div className="text-card">{t(c)}</div>{' '}
                            {t('viewBscScan')}
                            <a
                              href={getExplorerContract(addr[c])}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="icon-extra-small icon-scan ml-n2" />
                            </a>
                          </span>
                        </Col>
                      ))}
                  </Row>
                </Collapse>
              </Card>
            </Col>
          </Row>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  )
}

export default Supply
