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
} from 'reactstrap'
// import IconLogo from '../../assets/icons/coin_sparta_black_bg.svg'
import { usePool } from '../../store/pool/selector'
import { useWeb3 } from '../../store/web3'
import { BN, formatFromUnits, formatFromWei } from '../../utils/bigNumber'
import { getExplorerContract } from '../../utils/extCalls'
import { getAddresses, getNetwork } from '../../utils/web3'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)
  const addrNames = [
    'sparta',
    'bond',
    'bondVault',
    'dao',
    'daoVault',
    'fallenSpartans',
    'migrate',
    'poolFactory',
    'reserve',
    'router',
    'synthFactory',
    'synthVault',
    'utils',
  ]

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

  return (
    <>
      <Button
        id="PopoverClick"
        type="Button"
        className="btn-header px-4"
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
        <PopoverHeader className="mt-2">Tokenomics</PopoverHeader>
        <PopoverBody>
          {network.chainId === 97 && (
            <>
              <Row>
                <Col xs="6" className="popover-text mb-4">
                  {t('marketcap')}
                </Col>
                <Col xs="6 mb-2" className="popover-text mb-4">
                  $
                  {formatFromWei(
                    BN(
                      pool.tokenDetails?.filter(
                        (asset) => asset.address === addr.sparta,
                      )[0]?.totalSupply,
                    ).times(web3.spartaPrice),
                    0,
                  )}
                </Col>

                <Col xs="6 mb-2" className="popover-text">
                  {`${t('circulatingSupply')}`}
                </Col>
                <Col xs="6 mb-2" className="popover-text">
                  {formatFromWei(
                    pool.tokenDetails?.filter(
                      (asset) => asset.address === addr.sparta,
                    )[0]?.totalSupply,
                    0,
                  )}
                </Col>
                <Col xs="12 mb-2">
                  <div className="progress-container progress-info">
                    <span className="progress-badge" />
                    <Progress max="100" value="60" />
                  </div>
                </Col>

                <Col xs="6" className="popover-text mb-2">
                  {t('totalSupply')}
                </Col>
                <Col xs="6" className="popover-text mb-2">
                  {formatFromWei(
                    pool.tokenDetails?.filter(
                      (asset) => asset.address === addr.sparta,
                    )[0]?.totalSupply,
                    0,
                  )}
                </Col>

                <Col xs="12 mb-2">
                  {' '}
                  <Progress multi>
                    <Progress bar color="primary" value="30" />
                    <Progress bar color="black" value="2" />
                    <Progress bar color="yellow" value="6" />
                    <Progress bar color="black" value="2" />
                    <Progress bar color="lightblue" value="10" />
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
            </>
          )}
          <Row>
            <Col md="12" className="ml-auto text-right">
              <Card
                className="card-body card-inside "
                style={{ backgroundColor: '#25212D' }}
              >
                <Row
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
                  <Row className="card-body text-center">
                    {addrNames.map((c) => (
                      <Col key={c} xs={12} className="text-left mb-4">
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
