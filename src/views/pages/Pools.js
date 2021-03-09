/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
import React from 'react'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col,
} from 'reactstrap'

const Pools = () => (
  <>
    <div className="content">
      <Row>
        <Col md="8">
          <Card>
            <CardHeader>
              <h1 className="title">Pools</h1>
            </CardHeader>
            <CardBody />
            <CardFooter>
              <Button className="btn-fill" color="primary" type="submit">
                Get sparta token details
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="4">
          <Card className="card-user">
            <CardBody>
              <CardText />
              <div className="author">
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
                <div>
                  <img
                    alt="..."
                    className="avatar"
                    src={
                      require('../../../assets/img/spartan_black_small.svg')
                        .default
                    }
                  />
                  <h5 className="title">Title</h5>
                </div>
                <p className="description" />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  </>
)

export default Pools
