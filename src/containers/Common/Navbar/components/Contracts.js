import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import Badge from 'react-bootstrap/Badge'
import Overlay from 'react-bootstrap/Overlay'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useDispatch } from 'react-redux'
import { getExplorerContract } from '../../../../utils/extCalls'
import { Icon } from '../../../../components/Icons/index'
import { appChainId, useApp } from '../../../../store/app'
import { useSparta } from '../../../../store/sparta'

const btnClass = 'hide-i5 header-btn ms-1 me-3'

const Contracts = () => {
  const { t } = useTranslation()
  const sparta = useSparta()
  const dispatch = useDispatch()

  const { chainId, addresses } = useApp()

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

  const onChangeNetwork = async () => {
    dispatch(appChainId(chainId === 97 ? 56 : 97))
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
            sparta.globalDetails.globalFreeze ? 'contractRed' : 'contractGreen'
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
                {t('network')}: {chainId === 97 ? ' Testnet' : ' Mainnet'}
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="ms-2 d-inline-flex"
                  checked={chainId === 56}
                  onChange={() => onChangeNetwork()}
                />
              </span>
            </Form>
            <span className="output-card">
              {t('globalFreeze')}:
              <Badge
                pill
                className="ms-1 pt-1"
                bg={sparta.globalDetails.globalFreeze ? 'primary' : 'success'}
              >
                {sparta.globalDetails.globalFreeze ? t('on') : t('off')}
              </Badge>
            </span>
          </Popover.Header>
          <Popover.Body className="pb-0">
            <Row>
              <Col xs="12">
                <Row className="text-center p-2">
                  {addrNames
                    .filter((x) => addresses[x] !== '')
                    .map((c) => (
                      <Col key={c} xs={6} className="mb-1 px-1">
                        <a
                          href={getExplorerContract(addresses[c])}
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
