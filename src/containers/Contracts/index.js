import React from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { getExplorerContract } from '../../utils/extCalls'
import { ContractsInfo } from './ContractsInfo'
import { getAddresses } from '../../utils/web3'

const Contracts = () => {
  const addr = getAddresses()
  const { t } = useTranslation()
  return (
    <>
      <Row>
        {ContractsInfo.filter((contract) => addr[contract] !== '').map(
          (contract) => (
            <Col className="my-2" lg="4" md="6" sm="12">
              <Card>
                <Card.Header className="text-center h4">
                  {contract.name}
                </Card.Header>
                <Card.Body style={{ minHeight: '84px' }}>
                  {t(`${contract.addrName}ContractDescription`)}
                </Card.Body>
                <Card.Footer>
                  <a
                    href={getExplorerContract(addr[contract.addrName])}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="w-100">View</Button>
                  </a>
                </Card.Footer>
              </Card>
            </Col>
          ),
        )}
      </Row>
    </>
  )
}

export default Contracts
