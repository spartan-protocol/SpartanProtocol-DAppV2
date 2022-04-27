import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import Badge from 'react-bootstrap/Badge'
import Overlay from 'react-bootstrap/Overlay'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useReserve } from '../../../../store/reserve'
import { getExplorerContract } from '../../../../utils/extCalls'
import {
  changeNetworkLsOnly,
  getAddresses,
  getNetwork,
} from '../../../../utils/web3'
import { Icon } from '../../../../components/Icons/index'

const btnClass = 'hide-i5 header-btn ms-1 me-3'

const Contracts = () => {
  const { t } = useTranslation()
  const reserve = useReserve()
  const target = useRef(null)
  const addr = getAddresses()
  const network = getNetwork()

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
        className={btnClass}
        onClick={() => setshowDropdown(!showDropdown)}
        ref={target}
        aria-hidden="true"
      >
        <Icon
          size="27"
          icon={
            reserve.globalDetails.globalFreeze ? 'contractRed' : 'contractGreen'
          }
        />
      </div>

      <Overlay
        target={target.current}
        show={showDropdown}
        placement="bottom"
        onHide={() => setshowDropdown(false)}
        rootClose
      >
        <Popover>
          <Popover.Header>
            <h3>{t('Contracts')}</h3>
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
          <Popover.Body className="pb-0">
            <Row>
              <Col xs="12">
                <Row className="text-center p-2">
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
                            <Button className="w-100">
                              {t(c)}
                              <br />
                              <Icon icon="scan" size="12" className="mt-1" />
                            </Button>
                          </h6>
                        </a>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

export default Contracts
