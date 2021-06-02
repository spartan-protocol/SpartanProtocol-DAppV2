import React from 'react'
import { Button, Card, Row, Col, Progress } from 'reactstrap'
// import downIcon from '../../../assets/icons/arrow-down-light.svg'
// import upIcon from '../../../assets/icons/arrow-up-light.svg'

const ProposalItem = ({ pid }) => {
  const temp = 'proposalType'
  // const [showDetails, setShowDetails] = useState(false)

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pt-3 pb-2 card-underlay">
          <Row className="mb-2">
            <Col xs="auto" className="pr-0 my-auto">
              <h4 className="my-auto">{pid.id}</h4>
            </Col>
            <Col>
              <h3 className="mb-0">{temp}</h3>
              <p className="text-sm-label-alt">Status ie. Finalise in 32hrs</p>
            </Col>
            {/* <Col xs="auto" className="text-right my-auto">
              <img
                onClick={() => toggleCollapse()}
                src={showDetails ? upIcon : downIcon}
                alt={showDetails ? 'upIcon' : 'downIcon'}
                className="swap-icon-color"
                aria-hidden="true"
                style={{
                  cursor: 'pointer',
                  height: '30px',
                  width: '30px',
                  top: '-15px',
                }}
              />
            </Col> */}
          </Row>
          <Row>
            <Col>
              <div className="output-card mb-2">
                Increase BOND+MINT allocation by 2.5M SPARTA
              </div>
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              Your vote
            </Col>
            <Col className="text-right output-card">Yes</Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              Total votes
            </Col>
            <Col className="text-right output-card">37.14% (Minority)</Col>
          </Row>

          <div className="progress-container progress-primary mb-2">
            <span className="progress-badge" />
            <Progress max="100" value="50" />
          </div>

          <Button color="primary" className="btn-sm w-100">
            Vote
          </Button>
        </Card>
      </Col>
    </>
  )
}

export default ProposalItem
