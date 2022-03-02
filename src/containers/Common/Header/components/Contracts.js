import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Popover,
  Badge,
  Overlay,
  Button,
  Form,
} from 'react-bootstrap'
import { useReserve } from '../../../../store/reserve'
import { getExplorerContract } from '../../../../utils/extCalls'
import {
  changeNetworkLsOnly,
  getAddresses,
  getNetwork,
} from '../../../../utils/web3'
import { ReactComponent as ContractIconG } from '../../../../assets/icons/contract-green.svg'
import { ReactComponent as ContractIconR } from '../../../../assets/icons/contract-red.svg'
import { Icon } from '../../../../components/Icons/index'

const btnClass = 'btn-round btn-icon btn-transparent align-self-center me-1'

const Contracts = () => {
  const { t } = useTranslation()
  const reserve = useReserve()
  const target = useRef(null)
  const addr = getAddresses()

  const [showDropdown, setshowDropdown] = useState(false)
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
      setnetwork(changeNetworkLsOnly(56))
    }
    if (net.target.checked === false) {
      setnetwork(changeNetworkLsOnly(97))
    } else {
      setnetwork(changeNetworkLsOnly(net))
    }
    window.location.reload(true)
  }

  return (
    <>
      <Button
        type="button"
        className={btnClass}
        onClick={() => setshowDropdown(!showDropdown)}
        ref={target}
      >
        {reserve.globalDetails.globalFreeze ? (
          <ContractIconR fill="#aacdff" />
        ) : (
          <ContractIconG fill="#aacdff" />
        )}
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
            {t('Contracts')}
            <br />
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
                              <Icon icon="scan" size="12" className="mt-1" />
                            </Badge>
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
