import React from 'react'
import { Card, Col, Row, Button } from 'react-bootstrap'
import Immunefi from '../../../assets/brands/immunefi-wht.svg'
import C4 from '../../../assets/brands/C4.png'
import Certik from '../../../assets/brands/certik.svg'
import GitHub from '../../../assets/brands/github-wht.svg'

const Security = () => (
  <>
    <div className="content">
      <Row className="row-480 text-center">
        <Col xs="auto">
          <Card xs="auto" className="card-480">
            <Card.Header className="">Immunefi</Card.Header>
            <Card.Body>Open bug bounty program up to $100k</Card.Body>
            <Card.Footer>
              <a
                href="https://www.immunefi.com/bounty/spartanprotocol"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  <img src={Immunefi} alt="immunefi" />
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-480">
            <Card.Header className="">CodeArena</Card.Header>
            <Card.Body>C4 code contest audit report with $96k bounty</Card.Body>
            <Card.Footer>
              <a
                href="https://code423n4.com/reports/2021-07-spartan/"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  <img
                    src={C4}
                    alt="codearena"
                    height="26px"
                    className="rounded-0"
                  />
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-480">
            <Card.Header className="">Certik</Card.Header>
            <Card.Body>Security Audit</Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/resources/blob/master/certik-audit.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  <img src={Certik} alt="certik" height="26px" />
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-480">
            <Card.Header className="">Smart Contracts</Card.Header>
            <Card.Body>Spartan Protocol V2</Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/spartanswap-contracts"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  <img src={GitHub} alt="github" height="26px" />
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  </>
)

export default Security
