import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import PaginationItem from 'reactstrap/es/PaginationItem'
import PaginationLink from 'reactstrap/es/PaginationLink'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { CardTitle } from 'reactstrap'
import { ReactComponent as SpartanLogoBlackSmall } from '../../../assets/img/spartan_black_small.svg'

const Samples = () => (
  <>
    <div className="content">
      <Card>
        <Row>
          <Col md="6">
            <Card.Header>
              <h1>Buttons</h1>
              <CardTitle tag="h4">Primary</CardTitle>
            </Card.Header>
            <Card.Body>
              <Button type="Button" className="mx-1 btn btn-primary">
                <div className="d-none d-sm-inline-block ml-1">Primary</div>
              </Button>
              <Button type="Button" className="mx-1 btn btn-warning">
                <div className="d-none d-sm-inline-block ml-1">Pressed</div>
              </Button>
              <Button type="Button" className="mx-1 btn btn-danger">
                <div className="d-none d-sm-inline-block ml-1">Disabled</div>
              </Button>
              <br />
            </Card.Body>
            <Card.Header>
              <CardTitle tag="h4">Secondary</CardTitle>
            </Card.Header>
            <Card.Body>
              <Button type="Button" className="mx-1 btn btn-success">
                <div className="d-none d-sm-inline-block ml-1">Secondary</div>
              </Button>
              <Button type="Button" className="mx-1 btn btn-success">
                <div className="d-none d-sm-inline-block ml-1">Pressed</div>
              </Button>
              <Button type="Button" className="mx-1 btn btn-danger">
                <div className="d-none d-sm-inline-block ml-1">Disabled</div>
              </Button>
              <br />
            </Card.Body>
          </Col>
          <Col md="6">
            <Card.Header>
              <br />
              <br />
              <br />
              <CardTitle tag="h4">Buttons with Label</CardTitle>
            </Card.Header>
            <Card.Body>
              <Button color="default">
                <SpartanLogoBlackSmall /> $1.52
              </Button>

              <Button type="Button" className="mx-1 btn btn-danger">
                Wallet
              </Button>

              <Button color="success">
                <i className="bd-icons icon-check-2" /> Success
              </Button>

              <Button className="btn-round btn-icon" color="primary">
                <i className="bd-icons icon-heart-2" />
              </Button>

              <Button color="default">
                <i className="icon-small icon-lock icon-dark" /> Left
              </Button>
              <Button color="default">
                <i className="bi-lg bi-chevron-compact-left" /> Left
              </Button>
              <Button color="default">
                Right <i className="bi-lg bi-chevron-compact-right" />
              </Button>
              <Button color="info">
                <i className="bi-lg bi-info-circle-fill" /> Info
              </Button>
              <br />
              <Button color="success">
                <i className="bi-lg bi-check" /> Success
              </Button>
              <Button color="warning">
                <i className="bi-lg bi-exclamation" /> Warning
              </Button>
              <Button color="danger">
                <i className="bi-lg bi-exclamation-triangle-fill" /> Danger
              </Button>
            </Card.Body>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card.Header>
              <CardTitle tag="h4">Sizes</CardTitle>
            </Card.Header>
            <Card.Body>
              <Button color="primary" size="sm">
                Small
              </Button>
              <Button color="primary">Regular</Button>
              <Button color="primary" size="lg">
                Large
              </Button>
            </Card.Body>
          </Col>
          <Col md="6">
            <Card.Header>
              <CardTitle tag="h4">Shapes</CardTitle>
            </Card.Header>
            <Card.Body>
              <Button color="primary">Default</Button>
              <Button className="btn-round" color="primary">
                round
              </Button>
              <Button className="btn-round" color="primary">
                <i className="bi-lg bi bi-wallet" /> with icon
              </Button>
              <Button className="btn-round btn-icon" color="primary">
                <i className="bi-lg bi bi-wallet" />
              </Button>
              <Button className="btn-rounded btn-icon" color="primary">
                <i className="icon-small icon-swap icon-light mt-1" />
              </Button>
              <Button className="btn-simple" color="primary">
                simple
              </Button>
              <Button className="btn-link" color="primary">
                link
              </Button>
            </Card.Body>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card.Header>
              <CardTitle tag="h4">Pagination</CardTitle>
            </Card.Header>
            <Card.Body>
              <nav aria-label="Page navigation example">
                <Pagination className="pagination pagination-warning">
                  <PaginationItem className="active">
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      4
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      5
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
                <Pagination>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span aria-hidden>
                        <i aria-hidden className="bi bi-chevron-double-left" />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="active">
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Next"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span aria-hidden>
                        <i aria-hidden className="bi bi-chevron-double-right" />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </nav>
            </Card.Body>
          </Col>
          <Col md="6">
            <Card.Header>
              <CardTitle tag="h4">Button Group</CardTitle>
            </Card.Header>
            <Card.Body>
              <ButtonGroup>
                <Button color="info" type="Button">
                  Left
                </Button>
                <Button color="info" type="Button">
                  Middle
                </Button>
                <Button color="info" type="Button">
                  Right
                </Button>
              </ButtonGroup>
              <br />
              <br />
              <ButtonGroup data-toggle="Buttons">
                <Button className="btn-round" color="info" type="Button">
                  1
                </Button>
                <Button className="btn-round" color="info" type="Button">
                  2
                </Button>
                <Button className="btn-round" color="info" type="Button">
                  3
                </Button>
                <Button className="btn-round" color="info" type="Button">
                  4
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button className="btn-round" color="info" type="Button">
                  5
                </Button>
                <Button className="btn-round" color="info" type="Button">
                  6
                </Button>
                <Button className="btn-round" color="info" type="Button">
                  7
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card.Header>
              <CardTitle tag="h4">Socials</CardTitle>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md="1" sm="1">
                  <p className="category" />
                  <Button className="btn-icon btn-round" color="success">
                    <i className="bi bi-twitter" />
                  </Button>
                </Col>
                <Col md="1" sm="1">
                  <p className="category" />
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="bi bi-github" />
                  </Button>
                </Col>
                <Col md="1" sm="1">
                  <p className="category" />
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="bi bi" />
                  </Button>
                </Col>
                <Col md="1" sm="1">
                  <p className="category" />
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="bi bi-github" />
                  </Button>
                </Col>
                <Col md="1" sm="1">
                  <p className="category" />
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="bi bi-github" />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  </>
)

export default Samples
