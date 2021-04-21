import React from 'react'
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
import IconLogo from '../../assets/icons/coin_sparta_black_bg.svg'
import { usePoolFactory } from '../../store/poolFactory/selector'
import { useWeb3 } from '../../store/web3'
import { BN, formatFromUnits, formatFromWei } from '../../utils/bigNumber'
import { getExplorerContract } from '../../utils/extCalls'
import { getAddresses } from '../../utils/web3'

const Supply = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)

  return (
    <>
      <Button
        id="PopoverClick"
        type="Button"
        className="mx-2 btn btn-default px-4 py-2"
        href="#"
      >
        <img className="mr-1" src={IconLogo} height="25px" alt="share icon" /> $
        {formatFromUnits(web3.spartaPrice, 2)}
      </Button>

      <UncontrolledPopover
        trigger="click"
        placement="bottom"
        target="PopoverClick"
      >
        <PopoverHeader className="mt-2">Tokenomics</PopoverHeader>
        <PopoverBody>
          <Row>
            <Col xs="6" className="popover-text mb-4">
              {t('Marketcap')}
            </Col>
            <Col xs="6 mb-2" className="popover-text mb-4">
              $
              {formatFromWei(
                BN(
                  poolFactory.detailedArray?.filter(
                    (asset) => asset.symbol === 'SPARTA',
                  )[0]?.totalSupply,
                ).times(web3.spartaPrice),
                0,
              )}
            </Col>

            <Col xs="6 mb-2" className="popover-text">
              {t('Circulating supply')}
            </Col>
            <Col xs="6 mb-2" className="popover-text">
              {formatFromWei(
                poolFactory.detailedArray.filter(
                  (asset) => asset.symbol === 'SPARTA',
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
              {t('Total supply')}
            </Col>
            <Col xs="6" className="popover-text mb-2">
              {formatFromWei(
                poolFactory.detailedArray.filter(
                  (asset) => asset.symbol === 'SPARTA',
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
              <span className="dot-burn mr-2" />
              Burn
            </Col>
            <Col xs="4">
              <span className="dot-bond mr-1" />
              Bond
            </Col>
            <Col xs="4">
              <span className="dot-emission mr-2" />
              Emisson
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col md="12" className="ml-auto text-right">
              <Card
                className="card-body"
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
                      <i className="icon-small icon-contracts icon-light mr-1" />{' '}
                      {t('Contracts')}
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
                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">SPARTA</div> View on BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.sparta)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Pool Factory</div> View on
                        BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.poolFactory)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Synth Factory</div> View on
                        BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.synthFactory)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Bond</div> View on BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.bond)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Bond Vault</div> View on BSC
                        Scan{' '}
                        <a
                          href={getExplorerContract(addr.bondVault)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">DAO</div> View on BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.dao)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">DAO Vault</div> View on BSC
                        Scan{' '}
                        <a
                          href={getExplorerContract(addr.daoVault)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Router</div> View on BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.router)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Utils</div> View on BSC Scan{' '}
                        <a
                          href={getExplorerContract(addr.utils)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>

                    <Col xs={12} className="text-left mb-4">
                      <span>
                        <div className="text-card">Migrate</div> View on BSC
                        Scan{' '}
                        <a
                          href={getExplorerContract(addr.migrate)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-extra-small icon-scan ml-n2" />
                        </a>
                      </span>
                    </Col>
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
