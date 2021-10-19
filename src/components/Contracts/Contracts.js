import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Popover, Badge, Overlay, Button } from 'react-bootstrap'
import { useReserve } from '../../store/reserve/selector'
import { getExplorerContract } from '../../utils/extCalls'
import { getAddresses } from '../../utils/web3'
import { ReactComponent as ContractIconG } from '../../assets/icons/contract-green.svg'
import { ReactComponent as ContractIconR } from '../../assets/icons/contract-red.svg'

import { Icon } from '../Icons/icons'

const Contracts = () => {
  const btnClass =
    'btn-round btn-icon btn-transparent align-self-center mx-0 px-0'

  // const isLightMode = window.localStorage.getItem('theme')
  const { t } = useTranslation()
  const addr = getAddresses()
  const reserve = useReserve()
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
