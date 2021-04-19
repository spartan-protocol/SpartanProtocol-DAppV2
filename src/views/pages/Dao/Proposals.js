import React from 'react'
// react plugin for creating notifications over the dashboard

// reactstrap components
import { Button, Card, Row, Col, Progress, Table } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'

const Proposals = () => (
  <>
    <Row>
      <Col className="text-right">
        <Button color="danger">
          <div>
            <i className="icon-button icon-list icon-dark  mr-2 " /> List
          </div>
        </Button>
        <Button color="danger">
          <i className="icon-button icon-delist icon-dark  mr-2" /> Delist
        </Button>
        <Button color="danger">
          <i className="icon-button icon-allocate icon-dark  mr-2" /> Allocate
        </Button>
      </Col>
    </Row>
    <br />
    <Row>
      <Col md={6}>
        <Card className="card-body ">
          <Row>
            <Col>
              <div className="page-header">Mint</div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <div className="output-card">
                Increase BOND+MINT allocation by 2.500.00 SPARTA
              </div>
            </Col>
          </Row>
          <Row>
            <br />
            <Table borderless className="ml-2 mr-5">
              <tbody>
                <tr>
                  <td className="text-card">Proposal ID</td>
                  <th className="output-card text-right">6</th>
                </tr>
                <tr>
                  <td className="text-card">Votes</td>
                  <th className="output-card text-right">37.14%</th>
                </tr>
                <tr>
                  <td className="text-card">Status</td>
                  <th className="output-card text-right">Pending</th>
                </tr>
                <tr>
                  <td className="text-card">Finalise in</td>
                  <th className="output-card text-right">
                    2021-03-19 13:00:00
                  </th>
                </tr>
                <tr>
                  <td className="text-card">
                    <div className="text-card">
                      Weight{' '}
                      <i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />
                      <UncontrolledTooltip
                        placement="right"
                        target="tooltipAddBase"
                      >
                        The quantity of & SPARTA you are adding to the pool.
                      </UncontrolledTooltip>
                    </div>
                  </td>
                  <th className="output-card text-right">Minority support</th>
                </tr>
                <tr>
                  <td className="text-card">Your weight</td>
                  <th className="output-card text-right">50.00%</th>
                </tr>
              </tbody>
            </Table>
          </Row>
          <div className="progress-container progress-primary">
            <span className="progress-badge" />
            <Progress max="100" value="50" />
          </div>
          <br />
          <Row />
          <br />
          <Button color="primary" size="lg" block>
            Vote
          </Button>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="card-body ">
          <Row>
            <Col>
              <div className="page-header">List bond asset RAVEN</div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <div className="output-card">
                List RAVEN as a bond asset: 0xcD7...308
              </div>
            </Col>
          </Row>
          <Row>
            <br />
            <Table borderless className="ml-2 mr-5">
              <tbody>
                <tr>
                  <td className="text-card">Proposal ID</td>
                  <th className="output-card text-right">6</th>
                </tr>
                <tr>
                  <td className="text-card">Votes</td>
                  <th className="output-card text-right">37.14%</th>
                </tr>
                <tr>
                  <td className="text-card">Status</td>
                  <th className="output-card text-right">Pending</th>
                </tr>
                <tr>
                  <td className="text-card">Finalise in</td>
                  <th className="output-card text-right">
                    2021-03-19 13:00:00
                  </th>
                </tr>
                <tr>
                  <td className="text-card">
                    <div className="text-card">
                      Weight{' '}
                      <i
                        className="icon-small icon-info icon-dark ml-2"
                        id="tooltipAddBase"
                        role="button"
                      />
                      <UncontrolledTooltip
                        placement="right"
                        target="tooltipAddBase"
                      >
                        The quantity of & SPARTA you are adding to the pool.
                      </UncontrolledTooltip>
                    </div>
                  </td>
                  <th className="output-card text-right">Minority support</th>
                </tr>
                <tr>
                  <td className="text-card">Your weight</td>
                  <th className="output-card text-right">50.00%</th>
                </tr>
              </tbody>
            </Table>
          </Row>
          <div className="progress-container progress-primary">
            <span className="progress-badge" />
            <Progress max="100" value="10" />
          </div>
          <br />
          <Row />
          <br />
          <Button color="default" size="lg" block>
            Maxed
          </Button>
        </Card>
      </Col>
    </Row>
  </>
)

export default Proposals
