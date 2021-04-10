import React from 'react'
import { Button, Card, Col, Row, Table } from 'reactstrap'
import coinBnb from '../../../assets/icons/coin_bnb.svg'
import coinSparta from '../../../assets/icons/coin_sparta.svg'

const SwapPair = () => (
  <>
    <Card className="card-body">
      <Row>
        <Table borderless className="ml-2 mr-5">
          <tbody>
            <tr>
              <td>
                <div className="output-card">
                  <img className="mr-2" src={coinBnb} alt="Logo" height="32" />
                  BNB
                </div>
              </td>
              <th className="output-card text-right">$260.55</th>
            </tr>
            <tr>
              <td>
                <div className="output-card">
                  <img
                    className="mr-2"
                    src={coinSparta}
                    alt="Logo"
                    height="32"
                  />
                  SPARTA
                </div>
              </td>
              <th className="output-card text-right">$1.30</th>
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row>
        <Col>
          {' '}
          <Button color="primary" size="lg" block>
            View pair info
          </Button>
        </Col>
      </Row>
    </Card>
  </>
)

export default SwapPair
