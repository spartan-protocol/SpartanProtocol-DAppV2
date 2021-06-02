import React, { useState } from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  CardHeader,
  CardTitle,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import { Modal } from 'react-bootstrap'
import { ReactComponent as PlusIcon } from '../../../assets/icons/icon-plus.svg'
import { proposalTypes } from './types'

const NewProposal = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [singleSelect, setsingleSelect] = React.useState(null)

  return (
    <>
      <Button
        className="align-self-center btn-sm btn-secondary"
        onClick={() => setShowModal(true)}
      >
        New Proposal
        <PlusIcon fill="white" className="ml-2 mb-1" />
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Card>
          <CardHeader>
            <CardTitle tag="h2" />
            <Row>
              <Col xs="10">
                <h2>{t('newProposal')}</h2>
              </Col>
              <Col xs="2">
                <Button
                  style={{
                    right: '16px',
                  }}
                  onClick={() => setShowModal(false)}
                  className="btn btn-transparent"
                >
                  <i className="icon-small icon-close" />
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <Row className="card-body">
            <Col xs="12">
              <Card className="card-share mb-1">
                <CardBody className="py-3">
                  <h4 className="card-title">Choose proposal type</h4>
                  <Row>
                    <Col>
                      <Select
                        className="react-select info"
                        classNamePrefix="react-select bg-light"
                        name="singleSelect"
                        value={singleSelect}
                        onChange={(value) => setsingleSelect(value)}
                        options={proposalTypes}
                        placeholder="Single Select"
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="card-body">
            <Col xs="12">
              <Card className="card-share">
                <CardBody className="py-3">
                  <h4 className="card-title">Input Options</h4>
                  <Row>
                    <Col xs="12">
                      {singleSelect?.type === 'Address' && (
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Address</InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="username" />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>Validate</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12" className="text-center">
              <Button
                type="Button"
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                {t('continue')}
              </Button>
              <Button
                type="Button"
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                {t('cancel')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  )
}

export default NewProposal
