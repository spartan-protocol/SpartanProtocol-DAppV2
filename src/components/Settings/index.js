import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'

import { Icon } from '../Icons'
import { Tooltip } from '../Tooltip'
import { getNetwork, getSettings } from '../../utils/web3'
import { gasRatesMN, gasRatesTN, slipTols } from './options'

/**
 * Settings panel to change gas rate & slip tolerance etc
 */
const Settings = ({ setShowModal, showModal }) => {
  const { t } = useTranslation()

  const network = getNetwork()

  const [gasRate, setGasRate] = useState(null)
  const [slipTolerance, setSlipTolerance] = useState(null)

  const setInitials = () => {
    const lsSettings = getSettings()
    const isMN = network.chainId === 56
    setGasRate(isMN ? lsSettings.gasRateMN : lsSettings.gasRateTN)
    setSlipTolerance(lsSettings.slipTol)
  }

  useEffect(() => {
    setInitials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveSettings = () => {
    const lsSettings = getSettings()
    const isMN = network.chainId === 56
    if (isMN) {
      lsSettings.gasRateMN = gasRate
    } else {
      lsSettings.gasRateTN = gasRate
    }
    lsSettings.slipTol = slipTolerance
    window.localStorage.setItem('sp_settings', JSON.stringify(lsSettings))
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>{t('settings')}</Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs="12">
                {t('gasRate')}
                <OverlayTrigger
                  placement="auto"
                  overlay={Tooltip(t, 'gasRate')}
                >
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
                <br />
                <ButtonGroup className="mt-2">
                  {network.chainId === 56
                    ? gasRatesMN.map((i) => (
                        <Button
                          key={i}
                          variant={gasRate === i ? 'primary' : 'secondary'}
                          onClick={() => setGasRate(i)}
                        >
                          {i}
                        </Button>
                      ))
                    : gasRatesTN.map((i) => (
                        <Button
                          key={i}
                          variant={gasRate === i ? 'primary' : 'secondary'}
                        >
                          {i}
                        </Button>
                      ))}
                </ButtonGroup>
              </Col>
              <Col xs="12">
                <br />
                {t('slipTolerance')}
                <OverlayTrigger
                  placement="auto"
                  overlay={Tooltip(t, 'slipTolerance')}
                >
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
                <br />
                <ButtonGroup className="mt-2">
                  {slipTols.map((i) => (
                    <Button
                      key={i}
                      variant={slipTolerance === i ? 'primary' : 'secondary'}
                      onClick={() => setSlipTolerance(i)}
                    >
                      {i}%
                    </Button>
                  ))}
                </ButtonGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => saveSettings()}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default Settings
