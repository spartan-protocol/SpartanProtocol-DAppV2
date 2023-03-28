import React from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useWeb3 } from '../../store/web3'
import ChartTVL from './Charts/ChartTVL'
import ChartVol from './Charts/ChartVol'
import HelmetLoading from '../../components/Spinner/index'

const SummaryItem = () => {
  const web3 = useWeb3()

  return (
    <>
      {web3.metrics ? (
        <>
          <Col xs="12" md="6">
            Total Value Locked ($USD)
            <Card className="mt-2">
              <Card.Body>
                <ChartTVL />
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" md="6">
            Swap Volume ($USD)
            <Card className="mt-2">
              <Card.Body>
                <ChartVol />
              </Card.Body>
            </Card>
          </Col>
        </>
      ) : (
        <HelmetLoading height={150} width={150} />
      )}
    </>
  )
}

export default SummaryItem
