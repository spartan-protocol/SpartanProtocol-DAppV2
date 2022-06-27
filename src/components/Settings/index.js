import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'

import { useDispatch } from 'react-redux'
import { Icon } from '../Icons'
import { Tooltip } from '../Tooltip'
import { gasRatesMN, gasRatesTN, slipTols, defaultSettings } from './options'
import { appSettings, useApp } from '../../store/app'

/** Settings panel to change gas rate & slip tolerance etc */
const Settings = ({ setShowModal, showModal }) => {
  const { t } = useTranslation()
  const app = useApp()
  const dispatch = useDispatch()

  const [gasRate, setGasRate] = useState(
    app.chainId === 56 ? app.settings.gasRateMN : app.settings.gasRateTN,
  )
  const [slipTolerance, setSlipTolerance] = useState(app.settings.slipTol)

  const saveSettings = () => {
    dispatch(appSettings(gasRate, slipTolerance))
    setShowModal(false)
  }

  const resetDefaults = () => {
    const isMN = app.chainId === 56
    if (isMN) {
      setGasRate(defaultSettings.gasRateMN)
    } else {
      setGasRate(defaultSettings.gasRateTN)
    }
    setSlipTolerance(defaultSettings.slipTol)
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
                  {app.chainId === 56
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
            <Button variant="secondary" onClick={() => resetDefaults()}>
              Recommended
            </Button>
            <Button onClick={() => saveSettings()}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default Settings
