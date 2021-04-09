import React from 'react'
// react plugin for creating notifications over the dashboard

// reactstrap components
import { Button, Card, Row, Col, UncontrolledAlert, Progress } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import coinBnb from '../../../assets/icons/coin_bnb.svg'
import coinSparta from '../../../assets/icons/coin_sparta.svg'

const NewBond = () => {
  // eslint-disable-next-line no-unused-vars
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false)

  return (
    <>
      <Row>
        <Col md={8}>
          <Card className="card-body ">
            <Card style={{ backgroundColor: '#25212D' }} className="card-body ">
              <Row>
                <Col>
                  <div className="title-card text-left">Bond Input</div>
                  <div className="output-card text-left">52.23</div>
                </Col>
                <Col>
                  <div className="output-card text-right">Balance 52.23</div>
                  <div className="output-card text-right">
                    BNB
                    <img className="ml-2" src={coinBnb} alt="BNB" />
                  </div>
                </Col>
              </Row>
              <br />
            </Card>

            <br />
            <UncontrolledAlert
              className="alert-with-icon"
              color="danger"
              fade={false}
            >
              <span
                data-notify="icon"
                className="icon-small icon-info icon-dark mb-5"
              />
              <span data-notify="message">
                The equivalent purchasing power in SPARTA is minted with both
                assets added symmetrically to the BNB:SPARTA liquidity pool. LP
                tokens will be issued as usual and vested to you over a 12 month
                period.
              </span>
            </UncontrolledAlert>
            <br />
            <Row>
              <Col>
                <div className="text-card">
                  SPARTA allocation
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
              </Col>
              <Col className="output-card text-right">150.265 Remaining</Col>
            </Row>

            <br />
            <div className="progress-container progress-primary">
              <span className="progress-badge" />
              <Progress max="100" value="60" />
            </div>
            <br />
            <Row>
              <Col>
                <div className="title-card text-left">
                  <div className="text-card">
                    Input
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
                </div>
                <div className="output-card text-left">
                  <div className="text-card">
                    Share
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
                </div>
                <br />
                <div className="amount">
                  Estimated output{' '}
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
              </Col>
              <Col>
                <div className="output-card text-right">52.23 of 52.23 BNB</div>
                <div className="output-card text-right">2.10 %</div>
                <br />
                <br />
                <div className="subtitle-amount text-right">0.00</div>
              </Col>
            </Row>
            <br />
            <Button color="primary" size="lg" block>
              Bond BNB
            </Button>
            <Button color="danger" size="lg" block>
              Return to DAO
            </Button>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-body ">
            <Card style={{ backgroundColor: '#25212D' }} className="card-body ">
              <Row>
                <Col>
                  <div className="title-card text-left">Bond Input</div>
                  <div className="output-card text-left">52.23</div>
                </Col>
                <Col>
                  <br />
                  <div className="output-card text-right">
                    SPARTA
                    <img className="ml-2" src={coinSparta} alt="SPARTA" />
                  </div>
                </Col>
              </Row>
              <br />
            </Card>
            <UncontrolledAlert
              className="alert-with-icon"
              color="danger"
              fade={false}
            >
              <span
                data-notify="icon"
                className="icon-small icon-info icon-dark mb-5"
              />
              <span data-notify="message">
                Bond BNB to get SPARTA LP Tokens. Claim your vested LP
                tokens.Your BNB-SPARTA LP tokens remain in time-locked contract
              </span>
            </UncontrolledAlert>
            <br />

            <br />
            <Row>
              <Col>
                <div className="text-card text-left">
                  Remaining BNB-SPARTA LP
                </div>
                <div className="text-card text-left">Duration</div>
                <div className="text-card text-leftt">Redemption date</div>
                <div className="text-card text-leftt">Redemption date</div>
              </Col>
              <Col>
                <div className="output-card text-right">0.00B</div>
                <div className="output-card text-right">0 days</div>
                <div className="output-card text-right">-</div>
                <div className="output-card text-right">-</div>
              </Col>
            </Row>
            <br />
            <Button color="danger" size="lg" block>
              Claim LP Tokens
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default NewBond
